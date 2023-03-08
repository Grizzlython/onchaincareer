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

const ModalCandidateProfile = (props) => {
  const gContext = useContext(GlobalContext);
  const userInfo = gContext.user;
  console.log("userInfo gContext =>", userInfo);
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [currentEmploymentStatusState, setCurrentEmploymentStatusState] =
    useState(currentEmploymentStatusOptions[0]);
  const [canJoinInState, setCanJoinInState] = useState(canJoinInOptions[0]);
  const [about, setAbout] = useState("");

  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();

  const updateApplicantInfo = async (e) => {
    try {
      if (!publicKey) {
        toast.error("Please connect your wallet");
        return;
      }
      e.preventDefault();
      const applicantInfo = {
        username: publicKey.toString(),
        name: name,
        address: location,
        image_uri: "https://dummy.org/",
        bio: about,
        skills: skills.split(","),
        designation: designation,
        current_employment_status: currentEmploymentStatusState.value,
        can_join_in: canJoinInState.value,
        user_type: "applicant",
        is_company_profile_complete: false,
        is_overview_complete: true,
        is_projects_complete: false,
        is_contact_info_complete: false,
        is_education_complete: false,
        is_work_experience_complete: false,
      };
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
    }
  }, [userInfo]);

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
                    Complete Candidate Profile
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
                          Browse or Drag and Drop your image
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
                                onChange={(e) => setDesignation(e.target.value)}
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
                                className="form-control pl-0 arrow-3 w-100 font-size-4 d-flex align-items-center w-100 "
                                border={false}
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
                                className="form-control pl-0 arrow-3 w-100 font-size-4 d-flex align-items-center w-100 "
                                border={false}
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
                              value="Update Details"
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
        </div>
      </Modal.Body>
    </ModalStyled>
  );
};

export default ModalCandidateProfile;
