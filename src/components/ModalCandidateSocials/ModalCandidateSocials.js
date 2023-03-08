import React, { useContext, useState } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import GlobalContext from "../../context/GlobalContext";
import { Select } from "../Core";

import { useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getContactInfoByUserAccount } from "../../utils/web3/web3_functions";
import { userTypeEnum } from "../../utils/constants";

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
  const gContext = useContext(GlobalContext);
  const isCandidate = gContext.user && gContext.user.user_type === userTypeEnum.APPLICANT;
  const candidateSocialsContext = gContext.candidateSocials;
  const showUpdateButton = candidateSocialsContext && candidateSocialsContext.is_initialized
  console.log(candidateSocialsContext, "---candidateSocialsContext---",isCandidate);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [resume, setResume] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [dribble, setDribble] = useState("");
  const [behance, setBehance] = useState("");
  const [website, setWebsite] = useState("");
  const [facebook, setFacebook] = useState("");
  const [solgames, setSolgames] = useState("");
  const [twitch, setTwitch] = useState("");
  const [instagram, setInstagram] = useState("");


  const handleClose = () => {
    gContext.toggleCandidateSocialsModal();
  };

  useEffect(()=>{
    if(candidateSocialsContext){
      setEmail(candidateSocialsContext.email||"");
      setPhone(candidateSocialsContext.phone||"");
      setResume(candidateSocialsContext.resume_uri||"");
      setGithub(candidateSocialsContext.github||"");
      setLinkedin(candidateSocialsContext.linkedin||"");
      setTwitter(candidateSocialsContext.twitter||"");
      setDribble(candidateSocialsContext.dribble||"");
      setBehance(candidateSocialsContext.behance||"");
      setWebsite(candidateSocialsContext.website||"");
      setFacebook(candidateSocialsContext.facebook||"");
      setSolgames(candidateSocialsContext.solgames||"");
      setTwitch(candidateSocialsContext.twitch||"");
      setInstagram(candidateSocialsContext.instagram||"");
    }
  },[candidateSocialsContext])

  const { publicKey, connected, signTransaction } = useWallet();
  const { connection } = useConnection();

  const handleAddorUpdateCandidateSocials = async () => {
    try{
      const contactInfo = {
        email: email, //64
        phone: phone, //16
        resume_uri: resume, //128
        github: github, //128
        linkedin: linkedin, //128
        twitter: twitter, //128
        dribble: dribble, //128
        behance: behance, //128
        twitch: facebook, //128
        solgames: solgames, //128
        facebook: twitch, //128
        instagram: instagram, //128
        website: website, //128
      };

      if(showUpdateButton){
        await gContext.updateCandidateSocials(
          publicKey,
          contactInfo,
          connection,
          signTransaction
        );
      }else{
        await gContext.addCandidateSocials(
          publicKey,
          contactInfo,
          connection,
          signTransaction
        );
      }
      
      toast.success(`Candidate socials ${showUpdateButton? "updated":"added" } successfully`);
  
      handleClose();
    }catch(err){
      toast.error(err.message);
      handleClose();
    }
    
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
                    {showUpdateButton ? "Update ": "Add "} {isCandidate ? "candidate":"recruiter"} socials
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
                                placeholder="eg. https://github.com"
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
                                placeholder="eg. https://www.linkedin.com/in/"
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
                                placeholder="eg. https://twitter.com"
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
                                Dribble handle
                              </label>
                              <input
                                type="text"
                                className="form-control h-px-48"
                                id="dribble"
                                placeholder="eg. https://twitter.com"
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
                                Behance handle
                              </label>
                              <input
                                type="text"
                                className="form-control h-px-48"
                                id="behance"
                                placeholder="eg. https://twitter.com"
                                value={behance}
                                onChange={(e) => setBehance(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="form-group">
                              <label
                                htmlFor="behance"
                                className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                              >
                                Facebook handle
                              </label>
                              <input
                                type="text"
                                className="form-control h-px-48"
                                id="behance"
                                placeholder="eg. https://facebook.com"
                                value={behance}
                                onChange={(e) => setFacebook(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="form-group">
                              <label
                                htmlFor="behance"
                                className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                              >
                                Twitch 
                              </label>
                              <input
                                type="text"
                                className="form-control h-px-48"
                                id="behance"
                                placeholder="eg. https://www.twitch.tv/"
                                value={behance}
                                onChange={(e) => setTwitch(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="form-group">
                              <label
                                htmlFor="behance"
                                className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                              >
                                Solgames handle
                              </label>
                              <input
                                type="text"
                                className="form-control h-px-48"
                                id="behance"
                                placeholder="eg. https://solgames.fun"
                                value={behance}
                                onChange={(e) => setSolgames(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="form-group">
                              <label
                                htmlFor="behance"
                                className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                              >
                                Instagram 
                              </label>
                              <input
                                type="text"
                                className="form-control h-px-48"
                                id="behance"
                                placeholder="eg. https://www.instagram.com/"
                                value={behance}
                                onChange={(e) => setInstagram(e.target.value)}
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
                              onClick={handleAddorUpdateCandidateSocials}
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
