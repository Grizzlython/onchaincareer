import React, { useContext, useState } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import GlobalContext from "../../context/GlobalContext";
import { Select } from "../Core";

import { useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  check_if_user_exists,
  update_applicant_info,
} from "../../utils/web3/web3_functions";
import {
  checkForBalance,
  initiateBundlr,
  uploadViaBundlr,
} from "../../utils/bundlr-uploader";
import filereaderStream from "filereader-stream";
import { userTypeEnum } from "../../utils/constants";
import Loader from "../Loader";

const currentEmploymentStatusOptions = [
  { value: "employed", label: "Employed" },
  { value: "unemployed", label: "Unemployed" },
  { value: "self-Employed", label: "Self-Employed" },
  { value: "student", label: "Student" },
];

const canJoinInOptions = [
  { value: "immediately", label: "Immediately" },
  { value: "within 1 month", label: "1 Month" },
  { value: "within 2 months", label: "2 Months" },
  { value: "within 3 months", label: "3 Months" },
  { value: "later", label: "More than 3 months" },
];

const ModalStyled = styled(Modal)`
  /* &.modal {
    z-index: 10050;
  } */
`;

const ModalRecruiterProfile = (props) => {
  const gContext = useContext(GlobalContext);
  const userInfo = gContext.user;
  const { loading } = gContext;

  const defaultEmpStatus = currentEmploymentStatusOptions[0];
  const defaultCanJoinIn = canJoinInOptions[0];

  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [currentEmploymentStatusState, setCurrentEmploymentStatusState] =
    useState(defaultEmpStatus);
  const [canJoinInState, setCanJoinInState] = useState(0);
  const [about, setAbout] = useState("");
  const [image, setImage] = useState(null);
  const [editImage, setEditImage] = useState(false);

  const { publicKey, signTransaction, wallet } = useWallet();
  const { connection } = useConnection();

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

      console.log(file, "imagefile");
      setImage(file);

      onSelectFile(e);

      return;
    } catch (error) {
      console.log(error, "image upload error");
    }
  };

  const updateRecruiterInfo = async (e) => {
    try {
      if (!publicKey) {
        toast.error("Please connect your wallet");
        return;
      }
      e.preventDefault();

      console.log(currentEmploymentStatusState, "currentEmploymentStatusState");
      console.log(canJoinInState, "canJoinInState");

      let notFilledFields = "";
      if (!name) {
        notFilledFields = "Name,";
      }
      if (!designation) {
        notFilledFields += "Designation,";
      }
      if (!location) {
        notFilledFields += "Location,";
      }
      if (!skills) {
        notFilledFields += "Skills,";
      }
      if (!about) {
        notFilledFields += "About,";
      }

      if (notFilledFields && notFilledFields.length > 0) {
        toast.error(`Please fill ${notFilledFields}`, {
          autoClose: 10000,
        });
        return;
      }

      const recruiterInfo = {
        username: publicKey.toString(),
        name: name,
        address: location,
        image_uri: image && image.length > 0 ? image : "",
        bio: about,
        skills: skills && skills.length > 0 ? skills.split(",") : [],
        designation: designation,
        current_employment_status: "",
        can_join_in: "",
        user_type: userTypeEnum.RECRUITER,
        is_company_profile_complete: true,
        is_overview_complete: false,
        is_projects_complete: false,
        is_contact_info_complete: false,
        is_education_complete: false,
        is_work_experience_complete: false,
      };

      console.log(recruiterInfo, "recruiterInfo");

      const adapter = wallet?.adapter;
      const { bundlr } = await initiateBundlr(adapter);

      console.log(bundlr, "bundlr");
      console.log(image, "image");
      if (!bundlr) {
        return;
      }

      let uploadedImageUri = "";
      // const symbol = "WEB3JOBS";

      if (image && image.name) {
        console.log("in here");
        const fileType = image.type;
        const imageBuffer = filereaderStream(image);

        await checkForBalance(bundlr, image.size);
        let uploadResult = await uploadViaBundlr(bundlr, imageBuffer, fileType);
        if (!uploadResult.status) {
          return {
            success: false,
            error: uploadResult.error,
          };
        }
        uploadedImageUri = uploadResult.asset_address;
        console.log(uploadedImageUri, "uploadedImageUri");
        recruiterInfo.image_uri = uploadedImageUri;
      }

      const updateApplicantInfo = await update_applicant_info(
        publicKey,
        recruiterInfo,
        connection,
        signTransaction
      );

      if (updateApplicantInfo) {
        toast.success("Applicant info updated Successfully");
        const userExistsRes = await check_if_user_exists(publicKey, connection);

        if (userExistsRes && userExistsRes.data) {
          gContext.setRecruiterUser(userExistsRes.data);
        }
        gContext.toggleRecruiterProfileModal();
      } else {
        toast.error("Applicant info not updated");
        gContext.toggleRecruiterProfileModal();
      }
    } catch (err) {
      console.log(err, "err in updateApplicantInfo");
      toast.error(err.message);
    }
  };

  const handleSkills = (e) => {
    setSkills(e.target.value);
  };

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setDesignation(userInfo.designation);
      setLocation(userInfo.address);
      setSkills(userInfo.skills ? userInfo.skills.join(",") : "");
      setAbout(userInfo.bio);

      setImage(userInfo.image_uri);
    }
  }, [userInfo]);

  console.log(userInfo, "userInfo-inj");

  const handleClose = () => {
    gContext.toggleRecruiterProfileModal();
  };

  return (
    <ModalStyled
      {...props}
      size="xl"
      centered
      show={gContext.recruiterProfileModal}
      onHide={gContext.toggleRecruiterProfileModal}
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
        <div className="mt-12" id="dashboard-body">
          {loading ? (
            <Loader />
          ) : (
            <div className="container">
              <div className="mb-12 mb-lg-23">
                <div className="row">
                  <div className="col-xxxl-9 px-lg-13 px-6">
                    <h5 className="font-size-6 font-weight-semibold mb-11">
                      Complete recruiter profile
                    </h5>
                    <div
                      className="contact-form bg-white shadow-8 rounded-4 pl-sm-10 pl-4 pr-sm-11 pr-4 pt-15 pb-13"
                      style={{
                        border: "1px solid #e5e5e5",
                      }}
                    >
                      {image && image.length > 0 && !editImage ? (
                        <>
                          <div className="upload-file mb-16 text-center">
                            <img
                              src={image}
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
                              onClick={() => setEditImage(true)}
                              className="mt-4"
                            >
                              Edit image
                            </button>
                          </div>
                        </>
                      ) : (
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
                                Browse or Drag and Drop your image
                              </label>
                              <input
                                type="file"
                                id="fileUpload"
                                className="sr-only"
                                onChange={(e) => handleUpload(e)}
                                accept="image/*"
                              />
                            </div>
                            {editImage && (
                              <button
                                onClick={() => setEditImage(false)}
                                className="mt-4"
                              >
                                Cancel edit
                              </button>
                            )}
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
                      )}

                      <form action="/">
                        <fieldset>
                          <div className="row mb-xl-1 mb-9">
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label
                                  htmlFor="namedash"
                                  className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                >
                                  Name
                                </label>
                                <input
                                  type="text"
                                  className="form-control h-px-48"
                                  id="namedash"
                                  placeholder="eg. John Doe"
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  maxLength="32"
                                />
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label
                                  htmlFor="domain"
                                  className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                >
                                  Designation
                                </label>
                                <input
                                  type="text"
                                  className="form-control h-px-48"
                                  id="domain"
                                  placeholder="eg. Product Manager"
                                  value={designation}
                                  onChange={(e) =>
                                    setDesignation(e.target.value)
                                  }
                                  maxLength="32"
                                />
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label
                                  htmlFor="location"
                                  className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                >
                                  Address
                                </label>

                                <input
                                  type="text"
                                  className="form-control h-px-48"
                                  id="location"
                                  placeholder="eg. New York, USA"
                                  value={location}
                                  onChange={(e) => setLocation(e.target.value)}
                                  maxLength="32"
                                />
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="form-group position-relative">
                                <label
                                  htmlFor="address"
                                  className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                >
                                  Skills (Min 3 Skills, Comma separated)
                                </label>
                                <input
                                  type="text"
                                  className="form-control h-px-48"
                                  id="address"
                                  placeholder="eg. HTML, CSS, Javascript"
                                  value={skills}
                                  onChange={(e) => handleSkills(e)}
                                  maxLength="32"
                                />
                                <span className="h-100 w-px-50 pos-abs-tl d-flex align-items-center justify-content-center font-size-6"></span>
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
                                  About me
                                </label>
                                <textarea
                                  name="textarea"
                                  id="aboutTextarea"
                                  cols="30"
                                  rows="7"
                                  className="border border-mercury text-gray w-100 pt-4 pl-6"
                                  placeholder="Describe about the company what make it unique"
                                  value={about}
                                  onChange={(e) => setAbout(e.target.value)}
                                  maxLength="512"
                                ></textarea>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <input
                                type="button"
                                value={`Submit info`}
                                className="btn btn-green btn-h-60 text-white min-width-px-210 rounded-5 text-uppercase"
                                onClick={updateRecruiterInfo}
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

export default ModalRecruiterProfile;
