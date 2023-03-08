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
import {
  skillsJson,
  currentEmploymentStatusOptions,
  canJoinInOptions,
} from "../../staticData";
import Loader from "../Loader";

const ModalStyled = styled(Modal)`
  /* &.modal {
    z-index: 10050;
  } */
`;

const ModalCandidateProfile = (props) => {
  const gContext = useContext(GlobalContext);
  const userInfo = gContext.user;

  const defaultEmpStatus = currentEmploymentStatusOptions[0];
  const defaultCanJoinIn = canJoinInOptions[0];

  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState([]);
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

  const resetForm = () => {
    setName("");
    setDesignation("");
    setLocation("");
    setSkills([]);
    setCurrentEmploymentStatusState(defaultEmpStatus);
    setCanJoinInState(defaultCanJoinIn);
    setAbout("");
    setImage(null);
    setEditImage(false);
  };

  const updateApplicantInfo = async (e) => {
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
      if (!currentEmploymentStatusState) {
        notFilledFields += "Current Employment Status,";
      }
      if (!canJoinInState) {
        notFilledFields += "Can Join In";
      }

      if (notFilledFields && notFilledFields.length > 0) {
        toast.error(`Please fill ${notFilledFields}`, {
          autoClose: 10000,
        });
        return;
      }

      const applicantInfo = {
        username: publicKey.toString(),
        name: name,
        address: location,
        image_uri: "",
        bio: about,
        skills: skills && skills.length > 0 ? skills : [],
        designation: designation,
        current_employment_status:
          currentEmploymentStatusState &&
          currentEmploymentStatusState.value.length > 0
            ? currentEmploymentStatusState.value
            : "",
        can_join_in:
          canJoinInState && canJoinInState.value.length > 0
            ? canJoinInState.value
            : "",
        user_type: "applicant",
        is_company_profile_complete: false,
        is_overview_complete: true,
        is_projects_complete: false,
        is_contact_info_complete: false,
        is_education_complete: false,
        is_work_experience_complete: false,
      };

      console.log(applicantInfo, "applicantInfo");

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
        applicantInfo.image_uri = uploadedImageUri;
      }

      const updateApplicantInfo = await update_applicant_info(
        publicKey,
        applicantInfo,
        connection,
        signTransaction
      );

      if (updateApplicantInfo) {
        toast.success("Applicant info updated Successfully");
        const userExistsRes = await check_if_user_exists(publicKey, connection);

        if (userExistsRes && userExistsRes.data) {
          gContext.setUserFromChain(userExistsRes.data);
        }
        resetForm();
        gContext.toggleCandidateProfileModal();
      } else {
        toast.error("Applicant info not updated");
        gContext.toggleCandidateProfileModal();
      }
    } catch (err) {
      console.log(err, "err in updateApplicantInfo");
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setDesignation(userInfo.designation);
      setLocation(userInfo.address);
      setSkills(userInfo.skills ? userInfo.skills : []);
      setAbout(userInfo.bio);
      setCurrentEmploymentStatusState(
        currentEmploymentStatusOptions.filter(
          (option) => option.value === userInfo.current_employment_status
        )[0]
      );
      setCanJoinInState(
        canJoinInOptions.filter(
          (option) => option.value === userInfo.can_join_in
        )[0]
      );
      setImage(userInfo.image_uri);
    }
  }, [userInfo]);

  console.log(userInfo, "userInfo-inj");

  const handleClose = () => {
    gContext.toggleCandidateProfileModal();
  };

  const handleSkills = (e) => {
    console.log(e, "value");
    // map throough e and get the values and set it to skills
    const selectedSkills = [];
    e.map((item) => {
      console.log(item.value, "value");
      selectedSkills.push(item.value);
    });
    console.log(selectedSkills, "selectedSkills");
    setSkills(selectedSkills);
  };

  const handleSetSkills = (e) => {
    // limit to 10
    if (e.length > 10) {
      toast.error("You can select maximum 10 skills");
      return;
    }
    handleSkills(e);
  };

  const { loading } = gContext;

  return (
    <ModalStyled
      {...props}
      size="xl"
      centered
      show={gContext.candidateProfileModalVisible}
      onHide={gContext.toggleCandidateProfileModal}
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
                      Complete Candidate Profile
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
                                  Skills (Max 10)
                                </label>
                                <Select
                                  isMulti
                                  onChange={handleSetSkills}
                                  options={skillsJson}
                                  value={skills.map((skill) => {
                                    return { value: skill, label: skill };
                                  })}
                                  placeholder="eg. Html, css, js"
                                  className="basic-multi-select"
                                  border={true}
                                />
                                <span className="h-100 w-px-50 pos-abs-tl d-flex align-items-center justify-content-center font-size-6"></span>
                              </div>
                            </div>
                          </div>
                          <div className="row mb-4">
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label
                                  htmlFor="status"
                                  className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                >
                                  Current employment status ?
                                </label>
                                <Select
                                  options={currentEmploymentStatusOptions}
                                  className="basic-multi-select"
                                  border={true}
                                  value={currentEmploymentStatusState}
                                  onChange={setCurrentEmploymentStatusState}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label
                                  htmlFor="behance"
                                  className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                >
                                  Can join a company in ?
                                </label>
                                <Select
                                  options={canJoinInOptions}
                                  className="basic-multi-select"
                                  border={true}
                                  value={canJoinInState}
                                  onChange={setCanJoinInState}
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
                                onClick={updateApplicantInfo}
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

export default ModalCandidateProfile;
