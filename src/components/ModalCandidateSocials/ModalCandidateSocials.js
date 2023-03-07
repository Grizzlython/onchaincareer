import React, { useContext, useState } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import GlobalContext from "../../context/GlobalContext";
import { Select } from "../Core";

import { useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const currentEmploymentStatus = [
  { value: "employed", label: "Employed" },
  { value: "unemployed", label: "Unemployed" },
  { value: "self-Employed", label: "Self-Employed" },
  { value: "student", label: "Student" },
];

const canJoinIn = [
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

const ModalCandidateSocials = (props) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [resume, setResume] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [dribble, setDribble] = useState("");
  const [behance, setBehance] = useState("");
  const [website, setWebsite] = useState("");

  const router = useRouter();

  const gContext = useContext(GlobalContext);

  const handleClose = () => {
    gContext.toggleCandidateSocialsModal();
  };

  const handleAddCandidateSocials = async () => {
    const payload = {
      username: gContext.user?.username,
      email,
      phone,
      resume,
      github,
      linkedin,
      twitter,
      dribble,
      behance,
      website,
    };

    await gContext.addCandidateSocials(payload);
    handleClose();
  };
  return (
    <ModalStyled
      {...props}
      size="xl"
      centered
      show={gContext.candidateSocialsModalVisible}
      onHide={gContext.toggleCandidateSocialsModal}
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
          <div className="container">
            <div className="mb-12 mb-lg-23">
              <div className="row">
                <div className="col-xxxl-9 px-lg-13 px-6">
                  <h5 className="font-size-6 font-weight-semibold mb-11">
                    Add candidate socials
                  </h5>
                  <div
                    className="contact-form bg-white shadow-8 rounded-4 pl-sm-10 pl-4 pr-sm-11 pr-4 pt-15 pb-13"
                    style={{
                      border: "1px solid #e5e5e5",
                    }}
                  >
                    <form action="/">
                      <fieldset>
                        <div className="row mb-xl-1 mb-9">
                          <div className="col-lg-6">
                            <div className="form-group">
                              <label
                                htmlFor="email"
                                className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                              >
                                Email
                              </label>

                              <input
                                type="email"
                                className="form-control h-px-48"
                                id="email"
                                placeholder="eg. johndoe@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6 mb-xl-0 mb-7">
                            <div className="form-group position-relative">
                              <label
                                htmlFor="phone"
                                className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                              >
                                Phone
                              </label>
                              <input
                                type="text"
                                className="form-control h-px-48"
                                id="phone"
                                placeholder="eg. +91 9882762345"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row mb-4">
                          <div className="col-lg-6">
                            <div className="form-group">
                              <label
                                htmlFor="resume"
                                className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                              >
                                Resume link
                              </label>
                              <input
                                type="text"
                                className="form-control h-px-48"
                                id="resume"
                                placeholder="eg. https://dive.google.com/resume.pdf"
                                value={resume}
                                onChange={(e) => setResume(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="form-group">
                              <label
                                htmlFor="github"
                                className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                              >
                                Github handle
                              </label>
                              <input
                                type="text"
                                className="form-control h-px-48"
                                id="github"
                                placeholder="eg. https://github.com/nithin0111"
                                value={github}
                                onChange={(e) => setGithub(e.target.value)}
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
                                placeholder="eg. https://www.linkedin.com/in/nithin0111/"
                                value={linkedin}
                                onChange={(e) => setLinkedin(e.target.value)}
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
                                placeholder="eg. https://twitter.com/nithin0111"
                                value={twitter}
                                onChange={(e) => setTwitter(e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="col-lg-6">
                            <div className="form-group">
                              <label
                                htmlFor="dribble"
                                className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                              >
                                Dribble handle (For designers)
                              </label>
                              <input
                                type="text"
                                className="form-control h-px-48"
                                id="dribble"
                                placeholder="eg. https://twitter.com/nithin0111"
                                value={dribble}
                                onChange={(e) => setDribble(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="form-group">
                              <label
                                htmlFor="behance"
                                className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                              >
                                Behance handle (For designers)
                              </label>
                              <input
                                type="text"
                                className="form-control h-px-48"
                                id="behance"
                                placeholder="eg. https://twitter.com/nithin0111"
                                value={behance}
                                onChange={(e) => setBehance(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group mb-11">
                              <label
                                htmlFor="formGroupExampleInput"
                                className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                              >
                                Website Link (if any)
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="formGroupExampleInput"
                                placeholder="https://www.example.com"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                              />
                            </div>
                            <input
                              type="button"
                              value="Submit"
                              className="btn btn-green btn-h-60 text-white min-width-px-210 rounded-5 text-uppercase"
                              onClick={handleAddCandidateSocials}
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

export default ModalCandidateSocials;
