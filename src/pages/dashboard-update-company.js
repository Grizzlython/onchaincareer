import React, { useContext, useEffect, useState } from "react";

import PageWrapper from "../components/PageWrapper";
import { Select } from "../components/Core";
import GlobalContext from "../context/GlobalContext";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";
import SEO from "@bradgarropy/next-seo";
import {
  checkForBalance,
  initiateBundlr,
  uploadViaBundlr,
} from "../utils/bundlr-uploader";
import fileReaderStream from "filereader-stream";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { currencies } from "../staticData";

const defaultTypes = [
  { value: "Product-based", label: "Product based" },
  { value: "Service-based", label: "Service based" },
];

const defaultEmployees = [
  { value: "10-50", label: "10-50" },
  { value: "50-100", label: "50-100" },
  { value: "100-500", label: "100-500" },
  { value: "500+", label: "500+" },
];

export default function UpdateCompany() {
  const [updatedLogo, setUpdatedLogo] = useState("");
  const [updatedCover, setUpdatedCover] = useState("");
  const [name, setName] = useState("");
  const [logoUri, setLogoUri] = useState("");
  const [domain, setDomain] = useState("");
  const [companyType, setCompanyType] = useState(null);
  const [companySize, setCompanySize] = useState(""); //"small, medium, large"
  const [companyStage, setCompanyStage] = useState("");
  const [fundingAmount, setFundingAmount] = useState("");
  const [fundingCurrency, setFundingCurrency] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [coverImageUri, setCoverImageUri] = useState("");
  const [foundedIn, setFoundedIn] = useState("");
  const [employeeSize, setEmployeeSize] = useState(null);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [linkedinHandle, setLinkedinHandle] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [youtubeHandle, setYoutubeHandle] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [archived, setArchived] = useState(false);
  const handleChange = (e) => {
    setArchived(!archived);
  };

  const gContext = useContext(GlobalContext);

  const { publicKey, signTransaction, connected, wallet } = useWallet();
  const { connection } = useConnection();

  const router = useRouter();

  const { selectedCompanyInfo, loading } = gContext;

  useEffect(() => {
    if (!selectedCompanyInfo) {
      return;
    }

    const company = selectedCompanyInfo;

    setName(company.name);
    setLogoUri(company.logo_uri);
    setCompanyType({
      value: company.company_type,
      label: company.company_type,
    });
    setCompanySize(company.company_size);
    setCompanyStage(company.company_stage);
    setFundingAmount(company.funding_amount);
    setFundingCurrency(company.funding_currency);
    setImageUri(company.image_uri);
    setCoverImageUri(company.cover_image_uri);
    setFoundedIn(company.founded_in);
    setEmployeeSize({
      value: company.employee_size,
      label: company.employee_size,
    });
    setLocation(company.address);
    setDescription(company.description);
    setWebsite(company.website);
    setLinkedinHandle(company.linkedin);
    setTwitterHandle(company.twitter);
    setYoutubeHandle(company.youtube);
    setInstagramHandle(company.instagram);
    setArchived(company.archived);
    setDomain(company.domain);
    setFundingCurrency(company.funding_currency);
    setFundingAmount(company.funding_amount);
  }, [selectedCompanyInfo]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = (e) => {
    try {
      e.preventDefault();
      const file = e.target.files[0];

      const formData = new FormData();

      formData.append("file", file);

      // const payload = {
      //   imageType: type,
      //   image: formData,
      // };

      console.log(file, "logo imagefile");
      setUpdatedLogo(file);
      onSelectFile(e);

      return;
    } catch (error) {
      console.log(error, "image upload error");
    }
  };

  const handleCoverUpload = (e) => {
    try {
      e.preventDefault();
      const file = e.target.files[0];

      const formData = new FormData();

      formData.append("file", file);

      // const payload = {
      //   imageType: type,
      //   image: formData,
      // };

      console.log(file, "cover imagefile");
      setUpdatedCover(file);
      onSelectFile(e);
      return;
    } catch (error) {
      console.log(error, "image upload error");
    }
  };

  const handleUpdateCompany = async () => {
    try {
      if (!publicKey) {
        toast.error("Please login to add company profile");
        return;
      }

      if (!selectedCompanyInfo) {
        toast.error("Please select a company to update");
        return;
      }

      const companyInfo = {
        archived: archived,
        name: name, //64
        logo_uri: logoUri, //128
        domain: domain, //64
        company_type: companyType
          ? companyType.value.length > 0
            ? companyType.value
            : ""
          : "", //8 "product, service, both"
        company_stage: companyStage, //32
        funding_amount: fundingAmount, //8
        funding_currency: fundingCurrency, //8
        cover_image_uri: coverImageUri, //128
        founded_in: foundedIn, //8
        employee_size:
          employeeSize && employeeSize.value.length > 0
            ? employeeSize.value
            : "", //8
        address: location, //512
        description: description, // 1024
        website: website, //128
        linkedin: linkedinHandle, //128
        twitter: twitterHandle, //128
        youtube: youtubeHandle, //128
        instagram: instagramHandle, //128
        company_seq_number: selectedCompanyInfo?.company_seq_number,
      };

      console.log(companyInfo, "companyInfo in react");

      const adapter = wallet?.adapter;
      const { bundlr } = await initiateBundlr(adapter);

      if (!bundlr) {
        toast.error("Please connect your wallet or try refreshing the page");
        return;
      }

      let uploadedImageUri = "";
      // const symbol = "WEB3JOBS";

      if (updatedLogo && updatedLogo.name) {
        const fileType = updatedLogo.type;
        const imageBuffer = fileReaderStream(updatedLogo);
        const result = await checkForBalance(bundlr, updatedLogo.size);
        if (!result.status) {
          toast.error(result.error);
          return;
        }
        let uploadResult = await uploadViaBundlr(bundlr, imageBuffer, fileType);
        if (!uploadResult.status) {
          console.log(uploadResult.error, "uploadResult.error");
          toast.error(uploadResult.error);
          return;
        }
        uploadedImageUri = uploadResult.asset_address;
        console.log(uploadedImageUri, "uploadedImageUri in update job post");
        companyInfo.logo_uri = uploadedImageUri;
        companyInfo.image_uri = uploadedImageUri;
      }

      if (updatedCover && updatedCover.name) {
        const fileType = updatedCover.type;
        const imageBuffer = fileReaderStream(updatedCover);
        const result = await checkForBalance(bundlr, updatedCover.size);
        if (!result.status) {
          toast.error(result.error);
          return;
        }
        let uploadResult = await uploadViaBundlr(bundlr, imageBuffer, fileType);
        if (!uploadResult.status) {
          console.log(uploadResult.error, "uploadResult.error");
          toast.error(uploadResult.error);
          return;
        }
        let uploadedCoverUri = uploadResult.asset_address;
        console.log(uploadedCoverUri, "updatedCover in update job post");
        companyInfo.cover_image_uri = uploadedCoverUri;
      }

      console.log(companyInfo, "updateCompanyInfo");

      await gContext.updateCompanyProfile(
        publicKey,
        companyInfo,
        connection,
        signTransaction
      );
      router.push("/dashboard-main");
    } catch (error) {
      console.log(error);
      toast.error((error && error.message) || "Something went wrong");
    }
  };

  const [editLogo, setEditLogo] = useState(false);
  const [editCover, setEditCover] = useState(false);
  return (
    <>
      <SEO
        description="Search for your dream job on OnChainCareer's secure and decentralized job marketplace. Our cutting-edge blockchain technology ensures reliable and transparent job solutions for job seekers, employers, and stakeholders. Find your next career opportunity today!"
        keywords={[
          "OnChainCareer",
          "blockchain",
          "decentralized",
          "job marketplace",
          "job platform",
          "job search",
          "job listings",
          "job opportunities",
          "job seekers",
          "employers",
          "secure",
          "reliable",
          "transparent",
          "job solutions",
        ]}
      />
      <PageWrapper
        headerConfig={{
          button: "profile",
          isFluid: true,
          bgClass: "bg-default",
          reveal: false,
        }}
      >
        <div
          className="dashboard-main-container mt-24 mt-lg-31"
          id="dashboard-body"
        >
          <div className="mt-12" id="dashboard-body">
            {loading ? (
              <Loader />
            ) : (
              <div className="container">
                <div className="mb-12 mb-lg-23">
                  <div className="row">
                    <div className="col-xxxl-9 px-lg-13 px-6">
                      <h5 className="font-size-6 font-weight-semibold mb-11">
                        Update Company Profile
                      </h5>
                      <div
                        className="contact-form bg-white shadow-8 rounded-4 pl-sm-10 pl-4 pr-sm-11 pr-4 pt-15 pb-13"
                        style={{
                          border: "1px solid #e5e5e5",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <div className="upload-file mb-16 text-center">
                            {selectedCompanyInfo?.logo_uri && !editLogo ? (
                              <>
                                <img
                                  src={selectedCompanyInfo?.logo_uri}
                                  alt=""
                                  className="img-fluid rounded-circle"
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover",
                                    borderRadius: "50%",
                                  }}
                                />
                                <br />
                                <button
                                  onClick={() => setEditLogo(true)}
                                  className="mt-4"
                                >
                                  Edit logo
                                </button>
                              </>
                            ) : (
                              <>
                                <div
                                  style={{
                                    display: "flex",
                                    // alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <div>
                                    <div
                                      id="userActions"
                                      className="square-144 m-auto px-6 mb-7"
                                    >
                                      <label
                                        htmlFor="fileUpload"
                                        className="mb-0 font-size-4 text-smoke"
                                      >
                                        Browse or Drag and Drop
                                      </label>

                                      <input
                                        type="file"
                                        id="fileUpload"
                                        className="sr-only"
                                        // value={}
                                        onChange={(e) => handleUpload(e)}
                                        accept="image/*"
                                      />
                                    </div>
                                    <button
                                      onClick={() => setEditLogo(false)}
                                      className="mt-4"
                                    >
                                      Cancel edit
                                    </button>
                                  </div>
                                  {preview && (
                                    <div className="ml-10">
                                      <p>Image preview</p>
                                      <img
                                        src={preview}
                                        alt=""
                                        style={{
                                          width: "100px",
                                          height: "100px",
                                          objectFit: "cover",
                                          borderRadius: "50%",
                                        }}
                                      />
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                          <div className="upload-file mb-16 text-center ml-4">
                            {selectedCompanyInfo?.cover_image_uri &&
                            !editCover ? (
                              <>
                                <img
                                  src={selectedCompanyInfo?.cover_image_uri}
                                  alt=""
                                  className="img-fluid rounded-circle"
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover",
                                    borderRadius: "50%",
                                  }}
                                />
                                <br />
                                <button
                                  onClick={() => setEditCover(true)}
                                  className="mt-4"
                                >
                                  Edit cover image
                                </button>
                              </>
                            ) : (
                              <>
                                <div
                                  style={{
                                    display: "flex",
                                    // alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <div>
                                    <div
                                      id="userActions"
                                      className="square-144 m-auto px-6 mb-7"
                                    >
                                      <label
                                        htmlFor="fileUpload"
                                        className="mb-0 font-size-4 text-smoke"
                                      >
                                        Browse or Drag and Drop
                                      </label>

                                      <input
                                        type="file"
                                        id="fileUpload"
                                        className="sr-only"
                                        // value={}
                                        onChange={(e) => handleCoverUpload(e)}
                                        accept="image/*"
                                      />
                                    </div>
                                    <button
                                      onClick={() => setEditCover(false)}
                                      className="mt-4"
                                    >
                                      Cancel edit
                                    </button>
                                  </div>
                                  {preview && (
                                    <div className="ml-10">
                                      <p>Image preview</p>
                                      <img
                                        src={preview}
                                        alt=""
                                        style={{
                                          width: "100px",
                                          height: "100px",
                                          objectFit: "cover",
                                          borderRadius: "10px",
                                        }}
                                      />
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <form action="/">
                          <fieldset>
                            <div className="row mb-xl-1 mb-9">
                              <div className="col-lg-6">
                                <div className="form-group">
                                  <label
                                    htmlFor="namedash"
                                    className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                  >
                                    Company Name
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control h-px-48"
                                    id="namedash"
                                    placeholder="eg. Apple"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    maxLength={64}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="form-group">
                                  <label
                                    htmlFor="domain"
                                    className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                  >
                                    Company Domain
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control h-px-48"
                                    id="domain"
                                    placeholder="eg. Social Media, E-commerce"
                                    value={domain}
                                    onChange={(e) => setDomain(e.target.value)}
                                    maxLength={64}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="form-group">
                                  <label
                                    htmlFor="type"
                                    className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                  >
                                    Company type
                                  </label>

                                  <Select
                                    options={defaultTypes}
                                    className="basic-multi-select"
                                    border={true}
                                    value={companyType}
                                    onChange={setCompanyType}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="form-group">
                                  <label
                                    htmlFor="foundedIn"
                                    className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                  >
                                    Company Founded in
                                  </label>

                                  <input
                                    type="text"
                                    className="form-control h-px-48"
                                    id="foundedIn"
                                    placeholder="eg. 2019"
                                    value={foundedIn}
                                    onChange={(e) =>
                                      setFoundedIn(e.target.value)
                                    }
                                    maxLength={4}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="row mb-8">
                              <div className="col-lg-6 mb-xl-0 mb-7">
                                <div className="form-group position-relative">
                                  <label
                                    htmlFor="select3"
                                    className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                  >
                                    Employee Size{" "}
                                  </label>
                                  <Select
                                    options={defaultEmployees}
                                    className="basic-multi-select"
                                    border={true}
                                    value={employeeSize}
                                    onChange={setEmployeeSize}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="form-group position-relative">
                                  <label
                                    htmlFor="address"
                                    className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                  >
                                    Location or (Remote)
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control h-px-48"
                                    id="address"
                                    placeholder="eg. London, UK"
                                    value={location}
                                    onChange={(e) =>
                                      setLocation(e.target.value)
                                    }
                                    maxLength={64}
                                  />
                                  <span className="h-100 w-px-50 pos-abs-tl d-flex align-items-center justify-content-center font-size-6"></span>
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="form-group position-relative">
                                  <label
                                    htmlFor="address"
                                    className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                  >
                                    Funding Currency
                                  </label>
                                  <Select
                                    options={currencies}
                                    className="basic-multi-select"
                                    border={true}
                                    value={{
                                      value: fundingCurrency,
                                      label: fundingCurrency,
                                    }}
                                    onChange={(e) =>
                                      setFundingCurrency(e.value)
                                    }
                                  />
                                  <span className="h-100 w-px-50 pos-abs-tl d-flex align-items-center justify-content-center font-size-6"></span>
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="form-group position-relative">
                                  <label
                                    htmlFor="address"
                                    className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                  >
                                    Funding Amount
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control h-px-48"
                                    id="address"
                                    placeholder="eg. London, UK"
                                    value={fundingAmount}
                                    onChange={(e) =>
                                      setFundingAmount(e.target.value)
                                    }
                                    maxLength={8}
                                  />
                                  <span className="h-100 w-px-50 pos-abs-tl d-flex align-items-center justify-content-center font-size-6"></span>
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="form-group">
                                  <label
                                    htmlFor="linkedin"
                                    className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                  >
                                    Linkedin handle
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control h-px-48"
                                    id="linkedin"
                                    placeholder="eg. https://www.linkedin.com/company/solgames-fun/"
                                    value={linkedinHandle}
                                    onChange={(e) =>
                                      setLinkedinHandle(e.target.value)
                                    }
                                    maxLength={64}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="form-group">
                                  <label
                                    htmlFor="twitter"
                                    className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                  >
                                    Twitter handle
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control h-px-48"
                                    id="twitter"
                                    placeholder="eg. https://twitter.com/solgames_fun"
                                    value={twitterHandle}
                                    onChange={(e) =>
                                      setTwitterHandle(e.target.value)
                                    }
                                    maxLength={64}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="form-group">
                                  <label
                                    htmlFor="twitter"
                                    className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                  >
                                    Youtube handle
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control h-px-48"
                                    id="twitter"
                                    placeholder="company link"
                                    value={youtubeHandle}
                                    onChange={(e) =>
                                      setYoutubeHandle(e.target.value)
                                    }
                                    maxLength={64}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="form-group">
                                  <label
                                    htmlFor="twitter"
                                    className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                  >
                                    Instagram handle
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control h-px-48"
                                    id="twitter"
                                    placeholder="company link"
                                    value={instagramHandle}
                                    onChange={(e) =>
                                      setInstagramHandle(e.target.value)
                                    }
                                    maxLength={64}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-12">
                                <div className="form-group">
                                  <label
                                    htmlFor="aboutTextarea"
                                    className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                  >
                                    About Comapny
                                  </label>
                                  <div
                                    style={{
                                      position: "absolute",
                                      right: "20px",
                                      top: "0",
                                      color: "#000",
                                    }}
                                  >
                                    <span>{description?.length}</span>/
                                    <span>356</span>{" "}
                                  </div>
                                  <textarea
                                    name="textarea"
                                    id="aboutTextarea"
                                    cols="30"
                                    rows="7"
                                    className="border border-mercury text-gray w-100 pt-4 pl-6"
                                    placeholder="Describe about the company what make it unique"
                                    value={description}
                                    onChange={(e) =>
                                      setDescription(e.target.value)
                                    }
                                    maxLength={356}
                                  ></textarea>
                                </div>
                              </div>
                              <div className="col-md-12">
                                <div className="form-group mb-11">
                                  <label
                                    htmlFor="formGroupExampleInput"
                                    className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                  >
                                    Company Website Link
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="formGroupExampleInput"
                                    placeholder="https://www.example.com"
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                    maxLength={64}
                                  />
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: "20px",
                                  }}
                                >
                                  <h5 className="text-black-2 font-size-4 font-weight-semibold mb-4">
                                    Archive ?
                                  </h5>
                                  <label
                                    class="switch"
                                    style={{
                                      marginLeft: "10px",
                                      marginTop: "10px",
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      id="switchArchive"
                                      onChange={handleChange}
                                    />
                                    <span class="slider round"></span>
                                  </label>
                                </div>
                                <input
                                  type="button"
                                  value="Update Company"
                                  className="btn btn-green btn-h-60 text-white min-width-px-210 rounded-5 text-uppercase"
                                  onClick={handleUpdateCompany}
                                />
                              </div>
                            </div>
                          </fieldset>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
