import React, { useContext, useState } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import GlobalContext from "../../context/GlobalContext";
import { Select } from "../Core";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";

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

const defaultLocations = [
  { value: "bd", label: "Bangladesh" },
  { value: "sp", label: "Singapore" },
  { value: "tl", label: "Thailand" },
  { value: "de", label: "Germany" },
];

const ModalStyled = styled(Modal)`
  /* &.modal {
    z-index: 10050;
  } */
`;

const ModalCompanyProfile = (props) => {
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("https://www.solgames.fun/logo.png");
  const [domain, setDomain] = useState("");
  const [type, setType] = useState(defaultTypes[0]);
  const [foundedIn, setFoundedIn] = useState("");
  const [employeeSize, setEmployeeSize] = useState(defaultEmployees[0]);
  const [location, setLocation] = useState("");
  const [linkedinHandle, setLinkedinHandle] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");

  const gContext = useContext(GlobalContext);

  const { publicKey, signTransaction, connected } = useWallet();
  const { connection } = useConnection();

  const router = useRouter();

  const handleAddCompany = async () => {
    try {
      if (!publicKey) {
        alert("Please login to add company profile");
        return;
      }

      let notFilledFields;
      if (!name) {
        notFilledFields = "Company name,";
      } else if (!domain) {
        notFilledFields = "Domain,";
      } else if (!type) {
        notFilledFields = "Company type,";
      } else if (!foundedIn) {
        notFilledFields = "Founded in,";
      } else if (!employeeSize) {
        notFilledFields = "Employee size,";
      } else if (!location) {
        notFilledFields = "Location,";
      } else if (!description) {
        notFilledFields = "Description,";
      } else if (!website) {
        notFilledFields = "Website,";
      }

      if (notFilledFields && notFilledFields.length > 0) {
        toast.error(
          `Please fill the following fields: ${notFilledFields} before adding company profile`,
          {
            duration: 20000,
          }
        );
        return;
      }

      const companyInfo = {
        username: publicKey.toString(), //32
        name: name, //64
        logo_uri: logo, //128
        domain: domain, //64
        company_type: type && type.value.length > 0 ? type.value : "", //8 "product, service, both"
        company_size:
          employeeSize && employeeSize.value.length > 0
            ? employeeSize.value
            : "", //8 "small, medium, large"
        company_stage: "company_stage", //32
        funding_amount: "10000", //8
        funding_currency: "SOLG", //8
        image_uri: "image_uri", //128
        cover_image_uri: "cover_image_uri", //128
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
        facebook: "facebook", //128
        instagram: "instagram", //128
      };

      await gContext.addCompanyProfile(
        publicKey,
        companyInfo,
        connection,
        signTransaction
      );
      router.push("/dashboard-main");
      await gContext.toggleCompanyProfileModal();
    } catch (error) {
      console.log(error);
      await gContext.toggleCompanyProfileModal();
    }
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
        {/* <button
          type="button"
          className="circle-32 btn-reset bg-white pos-abs-tr mt-md-n6 mr-lg-n6 focus-reset z-index-supper"
          onClick={handleClose}
        >
          <i className="fas fa-times"></i>
        </button> */}
        <div className="mt-12" id="dashboard-body">
          <div className="container">
            <div className="mb-12 mb-lg-23">
              <div className="row">
                <div className="col-xxxl-9 px-lg-13 px-6">
                  <h5 className="font-size-6 font-weight-semibold mb-11">
                    Add Company Profile
                  </h5>
                  <div
                    className="contact-form bg-white shadow-8 rounded-4 pl-sm-10 pl-4 pr-sm-11 pr-4 pt-15 pb-13"
                    style={{
                      border: "1px solid #e5e5e5",
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
                          Browse or Drag and Drop
                        </label>
                        <input
                          type="file"
                          id="fileUpload"
                          className="sr-only"
                        />
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
                                maxLength={32}
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
                                maxLength={32}
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
                                className="form-control pl-0 arrow-3 w-100 font-size-4 d-flex align-items-center w-100 "
                                border={false}
                                value={type}
                                onChange={setType}
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
                                maxLength={32}
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
                                maxLength={32}
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
                                maxLength={32}
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
                              <textarea
                                name="textarea"
                                id="aboutTextarea"
                                cols="30"
                                rows="7"
                                className="border border-mercury text-gray w-100 pt-4 pl-6"
                                placeholder="Describe about the company what make it unique"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                maxLength={512}
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
                                maxLength={32}
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
        </div>
      </Modal.Body>
    </ModalStyled>
  );
};

export default ModalCompanyProfile;
