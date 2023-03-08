import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import GlobalContext from "../../context/GlobalContext";
import { Select } from "../Core";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";
import { currencies, defaultCompanyTypeOptions } from "../../staticData";
import { toast } from "react-toastify";
import {
  checkForBalance,
  initiateBundlr,
  uploadViaBundlr,
} from "../../utils/bundlr-uploader";
import filereaderStream from "filereader-stream";
import Loader from "../Loader";

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
const ModalStyled = styled(Modal)`
  /* &.modal {
    z-index: 10050;
  } */
`;

const ModalCompanyProfile = (props) => {
  const [updatedLogo, setUpdatedLogo] = useState("");
  const [updatedCover, setUpdatedCover] = useState("");
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [companyType, setCompanyType] = useState(defaultCompanyTypeOptions[0]);
  const [companySize, setCompanySize] = useState(""); //"small, medium, large"
  const [companyStage, setCompanyStage] = useState("");
  const [fundingAmount, setFundingAmount] = useState("");
  const [fundingCurrency, setFundingCurrency] = useState(currencies[0]);
  const [imageUri, setImageUri] = useState("");
  const [coverImageUri, setCoverImageUri] = useState("");
  const [foundedIn, setFoundedIn] = useState("");
  const [employeeSize, setEmployeeSize] = useState(defaultEmployees[0]);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [linkedinHandle, setLinkedinHandle] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [facebookHandle, setFacebookHandle] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");

  const gContext = useContext(GlobalContext);

  const { publicKey, signTransaction, connected, wallet } = useWallet();
  const { connection } = useConnection();

  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCover, setSelectedCover] = useState(null);
  const [preview, setPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

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

  useEffect(() => {
    if (!selectedCover) {
      setCoverPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedCover);
    setCoverPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedCover]);

  // useEffect(() => {
  //   if (!setUpdatedCover) {
  //     setCoverPreview(undefined);
  //     return;
  //   }

  //   const objectUrl = URL.createObjectURL(selectedFile);
  //   setCoverPreview(objectUrl);

  //   // free memory when ever this component is unmounted
  //   return () => URL.revokeObjectURL(objectUrl);
  // }, [setUpdatedCover]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    setSelectedFile(e.target.files[0]);
  };

  const onSelectCover = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedCover(undefined);
      return;
    }

    setSelectedCover(e.target.files[0]);
  };

  const handleUpload = (e) => {
    try {
      e.preventDefault();
      const file = e.target.files[0];

      // if file size greater than 512kb

      if (file.size > 512000) {
        toast.error("File size should be less than 512kb");
        return;
      }

      // const formData = new FormData();

      // formData.append("file", file);

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
      console.log(e, "e");
      const file = e.target.files[0];
      console.log(file.size, "file");

      // convert file.size to mb
      const fileSize = file.size / 1000000;
      console.log(fileSize, "fileSize");

      // if file size greater than 1mb
      if (file.size > 1000000) {
        toast.error("File size should be less than 1mb");
        return;
      }

      // const formData = new FormData();

      // formData.append("file", file);

      // const payload = {
      //   imageType: type,
      //   image: formData,
      // };

      console.log(file, "cover imagefile");
      setUpdatedCover(file);
      onSelectCover(e);
      return;
    } catch (error) {
      console.log(error, "image upload error");
    }
  };

  const handleAddCompany = async () => {
    try {
      if (!publicKey) {
        toast.error("Please login to add company profile");
        return;
      }

      let notFilledFields = "";
      if (!name) {
        notFilledFields += "Company name, \n";
      }
      if (!domain) {
        notFilledFields += "Domain, \n";
      }
      if (!companyType) {
        notFilledFields += "Company type, \n";
      }
      if (!foundedIn) {
        notFilledFields += "Founded in, \n";
      }
      if (!employeeSize) {
        notFilledFields += "Employee size, \n";
      }
      if (!location) {
        notFilledFields += "Location, \n";
      }
      if (!description) {
        notFilledFields += "Description, \n";
      }
      if (!website) {
        notFilledFields += "Website";
      }

      const websiteRegex = new RegExp(
        "^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$",
        "i"
      );

      if (!websiteRegex.test(website)) {
        toast.error("Please enter a valid website url");
      }

      if (notFilledFields && notFilledFields.length > 0) {
        toast.error(
          `Please fill the following fields: ${notFilledFields} before adding company profile`,
          {
            autoClose: 20000,
          }
        );
        return;
      }

      const companyInfo = {
        username: publicKey.toString(), //32
        name: name, //64
        logo_uri: updatedLogo, //128
        domain: domain, //64
        company_type:
          companyType && companyType.value.length > 0 ? companyType.value : "", //8 "product, service, both"
        company_size: companyStage, //8 "small, medium, large"
        company_stage: companyStage, //32
        funding_amount: fundingAmount, //8
        funding_currency:
          fundingCurrency && fundingCurrency.label.length > 0
            ? fundingCurrency.label
            : "", //8
        image_uri: imageUri, //128
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
        facebook: facebookHandle, //128
        instagram: instagramHandle, //128
      };

      console.log(companyInfo, "companyInfo");

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
        const imageBuffer = filereaderStream(updatedLogo);

        const result = await checkForBalance(bundlr, updatedLogo.size);
        if (!result.status) {
          toast.error(result.error);
          return;
        }
        let uploadResult = await uploadViaBundlr(bundlr, imageBuffer, fileType);
        if (!uploadResult.status) {
          toast.error(uploadResult.error);
          return;
        }
        uploadedImageUri = uploadResult.asset_address;
        console.log(uploadedImageUri, "uploadedImageUri in add job post");
        companyInfo.logo_uri = uploadedImageUri;
        companyInfo.image_uri = uploadedImageUri;
      }

      if (updatedCover && updatedCover.name) {
        const fileType = updatedCover.type;
        const imageBuffer = filereaderStream(updatedCover);
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
        console.log(uploadedCoverUri, "updatedCover in add job post");
        companyInfo.cover_image_uri = uploadedCoverUri;
      }

      console.log(companyInfo, "addCompanyInfo");

      await gContext.addCompanyProfile(
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

  const handleClose = () => {
    gContext.toggleCompanyProfileModal();
  };

  return (
    <ModalStyled
      {...props}
      size="xl"
      centered
      show={gContext.companyProfileModalVisible}
      onHide={gContext.toggleCompanyProfileModal}
      backdrop="static"
    >
      <Modal.Body
        className="p-0"
        // style={{
        //   backgroundColor: "#e5e5e5",
        // }}
      >
        <button
          type="button"
          className="circle-32 btn-reset bg-white pos-abs-tr mt-md-n6 mr-lg-n6 focus-reset z-index-supper"
          onClick={handleClose}
        >
          <i className="fas fa-times"></i>
        </button>
        <div
          className="mt-12"
          id="dashboard-body"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          {gContext.loading ? (
            <Loader />
          ) : (
            <div className="container">
              <div className="mb-12 mb-lg-23">
                <div className="row">
                  <div className="col-xxxl-9 px-lg-13 px-6">
                    <h5 className="font-size-6 font-weight-semibold mb-11">
                      Add Company
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
                        }}
                      >
                        <div className="upload-file mb-16 text-center">
                          <div
                            id="userActions"
                            className="square-144 m-auto px-6 mb-7"
                          >
                            <label
                              htmlFor="fileUpload"
                              className="mb-0 font-size-4 text-smoke"
                            >
                              {updatedLogo
                                ? updatedLogo.name
                                : "Browse or Drag and Drop your logo here"}
                            </label>
                            <input
                              type="file"
                              id="fileUpload"
                              className="sr-only"
                              onChange={(e) => handleUpload(e)}
                              accept="image/*"
                            />
                          </div>
                          <p>Upload logo</p>
                        </div>
                        <div
                          className="upload-
                        file mb-16 text-center ml-4"
                        >
                          <div
                            id="userActions"
                            className="square-144 m-auto px-6 mb-7"
                          >
                            <label
                              htmlFor="coverUpload"
                              className="mb-0 font-size-4 text-smoke"
                            >
                              {updatedCover
                                ? updatedCover.name
                                : "Browse or Drag and Drop your cover image here"}
                            </label>
                            <input
                              type="file"
                              id="coverUpload"
                              className="sr-only"
                              onChange={(e) => handleCoverUpload(e)}
                              accept="image/*"
                            />
                          </div>
                          <p>Upload cover</p>
                        </div>
                        {preview && (
                          <div className="ml-10">
                            <p>Logo preview</p>
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
                        {coverPreview && (
                          <div className="ml-10">
                            <p>Cover preview</p>
                            <img
                              src={coverPreview}
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
                                  options={defaultCompanyTypeOptions}
                                  className="form-control pl-0 arrow-3 w-100 font-size-4 d-flex align-items-center w-100 "
                                  border={false}
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
                                  onChange={(e) => setFoundedIn(e.target.value)}
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
                                  className="form-control pl-0 arrow-3 w-100 font-size-4 d-flex align-items-center w-100 "
                                  border={false}
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
                                  onChange={(e) => setLocation(e.target.value)}
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
                                  value={fundingCurrency}
                                  onChange={(e) => setFundingCurrency(e.value)}
                                />
                                <span className="h-100 w-px-50 pos-abs-tl d-flex align-items-center justify-content-center font-size-6"></span>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label
                                  htmlFor="fundingAmount"
                                  className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                >
                                  Funding Amount
                                </label>
                                <input
                                  type="text"
                                  className="form-control h-px-48"
                                  id="fundingAmount"
                                  placeholder="Funding Amount"
                                  value={fundingAmount}
                                  onChange={(e) =>
                                    setFundingAmount(e.target.value)
                                  }
                                  maxLength={32}
                                />
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
                                  placeholder="LinkedIn handle"
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
                                  placeholder="Twitter handle"
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
                                  Facebook handle
                                </label>
                                <input
                                  type="text"
                                  className="form-control h-px-48"
                                  id="twitter"
                                  placeholder="Facebook handle"
                                  value={facebookHandle}
                                  onChange={(e) =>
                                    setFacebookHandle(e.target.value)
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
                                  placeholder="Instagram handle"
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
                                  <span>256</span>{" "}
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
                                  maxLength={256}
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
                              <input
                                type="button"
                                value="Add Company"
                                className="btn btn-green btn-h-60 text-white min-width-px-210 rounded-5 text-uppercase"
                                onClick={handleAddCompany}
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
      </Modal.Body>
    </ModalStyled>
  );
};

export default ModalCompanyProfile;
