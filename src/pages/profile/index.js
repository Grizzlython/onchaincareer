import React from "react";
import { Nav, Tab } from "react-bootstrap";
import Link from "next/link";
import PageWrapper from "../../components/PageWrapper";
import ProfileSidebar from "../../components/ProfileSidebar";

import imgL from "../../assets/image/svg/icon-loaction-pin-black.svg";
import { useContext } from "react";
import GlobalContext from "../../context/GlobalContext";
import { useEffect } from "react";
import { useRouter } from "next/router";
import moment from "moment";
import { useConnection } from "@solana/wallet-adapter-react";

export default function FullProfile() {
  const router = useRouter();

  const gContext = useContext(GlobalContext);
  const userName = gContext.user?.username;

  const applicant_info_state_account = gContext.userStateAccount;

  const { connection } = useConnection();

  const applicantWorkExperiences = gContext.workExperience;
  const applicantProjects = gContext.projects;
  const applicantEducation = gContext.education;

  useEffect(() => {
    // gContext.getCandidateProfileByUsername(userName);
    // gContext.getWorkExperience(userName);
    // gContext.getProjects(userName);
    if (applicant_info_state_account) {
      (async () => {
        await gContext.fetchAndSetWorkExperience(
          applicant_info_state_account,
          connection
        );
        await gContext.fetchAndSetProjects(
          applicant_info_state_account,
          connection
        );
        await gContext.fetchAndSetEducation(
          applicant_info_state_account,
          connection
        );
      })();
    }
    if (!gContext.workExperienceModalVisible) {
      (async () => {
        await gContext.fetchAndSetWorkExperience(
          applicant_info_state_account,
          connection
        );
      })();
    }
    if (!gContext.projectsModalVisible) {
      (async () => {
        await gContext.fetchAndSetProjects(
          applicant_info_state_account,
          connection
        );
      })();
    }
    if (!gContext.educationModalVisible) {
      (async () => {
        await gContext.fetchAndSetEducation(
          applicant_info_state_account,
          connection
        );
      })();
    }
  }, [
    gContext.workExperienceModalVisible,
    gContext.projectsModalVisible,
    gContext.educationModalVisible,
  ]);

  const setWorkflowSequenceNumberAndToggleModal = (sequenceNumber) => {
    gContext.setWorkflowSequenceNumber(sequenceNumber);
    gContext.toggleWorkExperienceModal();
  };

  const setProjectNumberAndToggleModal = (projectNumber) => {
    gContext.setProjectNumber(projectNumber);
    gContext.toggleProjectsModal();
  };

  const setEducationNumberAndToggleModal = (educationNumber) => {
    gContext.setEducationNumber(educationNumber);
    gContext.toggleEducationModal();
  };

  const updateCandidateBasicInfo = () => {
    gContext.setCandidateInfoAction("edit");
    gContext.toggleCandidateProfileModal();
  };

  return (
    <>
      <PageWrapper headerConfig={{ button: "profile" }}>
        <div className="bg-default-2 pt-22 pt-lg-25 pb-13 pb-xxl-32">
          <div className="container">
            {/* <!-- back Button --> */}
            <div className="row justify-content-center">
              <div className="col-12 dark-mode-texts">
                <div className="mb-9">
                  {/* <Link href="/#"> */}
                  <a
                    className="d-flex align-items-center ml-4"
                    onClick={() => router.back()}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <i className="icon icon-small-left bg-white circle-40 mr-5 font-size-7 text-black font-weight-bold shadow-8"></i>
                    <span className="text-uppercase font-size-3 font-weight-bold text-gray">
                      Back
                    </span>
                  </a>
                  {/* </Link> */}
                </div>
              </div>
            </div>
            {/* <!-- back Button End --> */}
            <div className="row">
              {/* <!-- Left Sidebar Start --> */}
              <div className="col-12 col-xxl-3 col-lg-4 col-md-5 mb-11 mb-lg-0">
                <ProfileSidebar />
              </div>
              {/* <!-- Left Sidebar End --> */}
              {/* <!-- Middle Content --> */}
              <div
                className=""
                style={{
                  width: "900px",
                }}
              >
                <Tab.Container id="left-tabs-example" defaultActiveKey="one">
                  <div className="bg-white rounded-4 shadow-9">
                    {/* <!-- Tab Section Start --> */}
                    <Nav
                      className="nav border-bottom border-mercury pl-12"
                      role="tablist"
                    >
                      <li className="tab-menu-items nav-item pr-12">
                        <Nav.Link
                          eventKey="one"
                          className="text-uppercase font-size-3 font-weight-bold text-default-color py-3 px-0"
                        >
                          Overview
                        </Nav.Link>
                      </li>
                      <li className="tab-menu-items nav-item pr-12">
                        <Nav.Link
                          eventKey="two"
                          className="text-uppercase font-size-3 font-weight-bold text-default-color py-3 px-0"
                        >
                          Work experience
                        </Nav.Link>
                      </li>
                      <li className="tab-menu-items nav-item pr-12">
                        <Nav.Link
                          eventKey="three"
                          className="text-uppercase font-size-3 font-weight-bold text-default-color py-3 px-0"
                        >
                          Projects
                        </Nav.Link>
                      </li>
                      <li className="tab-menu-items nav-item pr-12">
                        <Nav.Link
                          eventKey="four"
                          className="text-uppercase font-size-3 font-weight-bold text-default-color py-3 px-0"
                        >
                          Education
                        </Nav.Link>
                      </li>
                      {/* <li className="tab-menu-items nav-item pr-12">
                        <Nav.Link
                          eventKey="four"
                          className="text-uppercase font-size-3 font-weight-bold text-default-color py-3 px-0"
                          onClick={handleSocials}
                        >
                          Candidate socials
                        </Nav.Link>
                      </li> */}
                      {/* <li className="tab-menu-items nav-item pr-12">
                        <Nav.Link
                          eventKey="five"
                          className="text-uppercase font-size-3 font-weight-bold text-default-color py-3 px-0"
                        >
                          Contact
                        </Nav.Link>
                      </li> */}
                    </Nav>
                    {/* <!-- Tab Content --> */}
                    <Tab.Content>
                      <Tab.Pane eventKey="one">
                        {/* <!-- Excerpt Start --> */}
                        <div className="pr-xl-0 pr-xxl-14 p-5 px-xs-12 pt-7 pb-5">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <h4 className="font-size-6 mb-7 mt-5 text-black-2 font-weight-semibold">
                              About
                            </h4>
                            <p
                              className="btn btn-green text-uppercase w-180 h-px-48 rounded-5 mr-7 mb-7"
                              style={{
                                cursor: "pointer",
                              }}
                              onClick={updateCandidateBasicInfo}
                            >
                              <i className="fa fa-pen mr-2"></i>
                              Update Info
                            </p>
                            {/* <input
                              type="button"
                              value="Update Details"
                              className="btn btn-green btn-h-60 text-white min-width-px-210 rounded-5 text-uppercase"
                              onClick={updateApplicantInfo}
                            /> */}
                          </div>
                          <p className="font-size-4 mb-8">
                            {gContext.user?.bio}
                          </p>
                        </div>
                        {/* <!-- Excerpt End --> */}
                        {/* <!-- Skills --> */}
                        <div className="border-top pr-xl-0 pr-xxl-14 p-5 pl-xs-12 pt-7 pb-5">
                          <h4 className="font-size-6 mb-7 mt-5 text-black-2 font-weight-semibold">
                            Skills
                          </h4>
                          <ul className="list-unstyled d-flex align-items-center flex-wrap">
                            {gContext.user?.skills?.map((skill, index) => (
                              <li key={index}>
                                <a className="bg-polar text-black-2  mr-6 px-7 mt-2 mb-2 font-size-3 rounded-3 min-height-32 d-flex align-items-center">
                                  {skill}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                        {/* <!-- Skills End --> */}
                        {/* <!-- Card Section Start --> */}

                        {/* <!-- Card Section End --> */}
                        {/* <!-- Card Section Start --> */}

                        {/* <!-- Card Section End --> */}
                      </Tab.Pane>
                      <Tab.Pane eventKey="two">
                        <div className="border-top p-5 pl-xs-12 pt-7 pb-5">
                          {!applicantWorkExperiences ||
                          applicantWorkExperiences?.length === 0 ? (
                            <>
                              <p>No workexperience found</p>
                            </>
                          ) : (
                            applicantWorkExperiences.map((workExp, index) => (
                              <div className="w-100" key={index}>
                                <div className="d-flex align-items-center pr-11 mb-9 flex-wrap flex-sm-nowrap">
                                  {/* <div className="square-72 d-block mr-8 mb-7 mb-sm-0">
                                <img src={imgB1.src} alt="" />
                              </div> */}
                                  <div className="w-100 mt-n2">
                                    <h3 className="mb-0">
                                      <a className="font-size-6 text-black-2 font-weight-semibold">
                                        {workExp.designation}
                                      </a>
                                    </h3>

                                    <a className="font-size-4 text-default-color line-height-2">
                                      {workExp.company_name}
                                    </a>

                                    <div className="d-flex align-items-center justify-content-md-between flex-wrap">
                                      <>
                                        <a className="font-size-4 text-gray mr-5">
                                          {`${
                                            workExp.start_date &&
                                            workExp.start_date !== "NaN"
                                              ? moment(
                                                  +workExp.start_date
                                                ).format("DD MMM YYYY")
                                              : "Present"
                                          } - ${
                                            workExp.end_date &&
                                            workExp.end_date !== "NaN"
                                              ? moment(
                                                  +workExp.end_date
                                                ).format("DD MMM YYYY")
                                              : "Present"
                                          }`}
                                        </a>

                                        <a className="font-size-3 text-gray">
                                          <span
                                            className="mr-4"
                                            css={`
                                              margin-top: -2px;
                                            `}
                                          >
                                            <img src={imgL.src} alt="" />
                                          </span>
                                          {workExp.location}
                                        </a>
                                      </>
                                    </div>
                                    <a
                                      className="btn btn-outline-green text-uppercase w-150 h-px-32 rounded-5 mr-7 mb-7 mt-7"
                                      onClick={() => {
                                        setWorkflowSequenceNumberAndToggleModal(
                                          workExp.work_experience_number
                                        );
                                      }}
                                    >
                                      <i className="fa fa-pen mr-2"></i>
                                      Update
                                    </a>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                          <a
                            className="btn btn-green text-uppercase w-180 h-px-48 rounded-5 mr-7 mb-7"
                            onClick={() => {
                              setWorkflowSequenceNumberAndToggleModal(0);
                            }}
                          >
                            <i className="fa fa-plus mr-2"></i>
                            Add Experience
                          </a>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="three">
                        <div className="border-top p-5 pl-xs-12 pt-7 pb-5">
                          {applicantProjects?.length === 0 ? (
                            <>
                              <p>No projects found</p>
                              {/* <Button
                                onClick={() => {
                                  gContext.toggleProjectsModal();
                                }}
                                width="80px"
                                height="50px"
                              >
                                Add project
                              </Button> */}
                            </>
                          ) : (
                            applicantProjects.map((project, index) => (
                              <div
                                className="w-100"
                                key={index}
                                style={{ borderBottom: "0.5px solid #dddddd" }}
                              >
                                <div className="d-flex align-items-center pr-11 mb-9 flex-wrap flex-sm-nowrap">
                                  {/* <div className="square-72 d-block mr-8 mb-7 mb-sm-0">
                                <img src={imgB1.src} alt="" />
                              </div> */}
                                  <div className="w-100 mt-n2">
                                    <h3 className="mb-0">
                                      <a className="font-size-6 text-black-2 font-weight-semibold">
                                        {project.project_name}
                                      </a>
                                    </h3>
                                    <Link href={"#"}>
                                      <a className="font-size-3 text-blue">
                                        <i className="fa fa-link mr-2"></i>
                                        {project.project_link}
                                      </a>
                                    </Link>
                                    <br />

                                    <a className="font-size-4 text-default-color line-height-2">
                                      {project.project_description}
                                    </a>

                                    <div className="d-flex align-items-center justify-content-md-between flex-wrap">
                                      <a className="font-size-4 text-gray mr-5">
                                        {`${
                                          project.project_start_date
                                            ? moment(
                                                +project.project_start_date
                                              ).format("DD MMM YYYY")
                                            : "Present"
                                        } - ${
                                          project.project_end_date
                                            ? moment(
                                                +project.project_end_date
                                              ).format("DD MMM YYYY")
                                            : "Present"
                                        }`}
                                      </a>
                                    </div>
                                  </div>
                                  <a
                                    className="btn btn-outline-green text-uppercase h-px-48 rounded-5 mr-7 mb-7"
                                    onClick={() => {
                                      setProjectNumberAndToggleModal(
                                        project.project_number
                                      );
                                    }}
                                  >
                                    <i className="fa fa-pen mr-2"></i>
                                    Update
                                  </a>
                                </div>
                              </div>
                            ))
                          )}
                          <br></br>
                          <a
                            className="btn btn-outline-green text-uppercase w-180 h-px-48 rounded-5 mr-7 mb-7"
                            onClick={() => {
                              setProjectNumberAndToggleModal(0);
                            }}
                          >
                            <i className="fa fa-plus mr-2"></i>
                            Add
                          </a>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="four">
                        <div className="border-top p-5 pl-xs-12 pt-7 pb-5">
                          {applicantEducation?.length === 0 ? (
                            <>
                              <p>No Education found</p>
                              {/* <Button
                                onClick={() => {
                                  gContext.toggleProjectsModal();
                                }}
                                width="80px"
                                height="50px"
                              >
                                Add project
                              </Button> */}
                            </>
                          ) : (
                            applicantEducation.map((education, index) => (
                              <div
                                className="w-100"
                                key={index}
                                style={{ borderBottom: "0.5px solid #dddddd" }}
                              >
                                <div className="d-flex align-items-center pr-11 mb-9 flex-wrap flex-sm-nowrap">
                                  {/* <div className="square-72 d-block mr-8 mb-7 mb-sm-0">
                                <img src={imgB1.src} alt="" />
                              </div> */}
                                  <div className="w-100 mt-n2">
                                    <h3 className="mb-0">
                                      <a className="font-size-6 text-black-2 font-weight-semibold">
                                        {education.school_name}
                                      </a>
                                    </h3>
                                    <Link href={"#"}>
                                      <a className="font-size-3 text-blue">
                                        Certificates:
                                        {education.certificate_uris &&
                                          education.certificate_uris.length >
                                            0 &&
                                          education.certificate_uris.map(
                                            (certificate_uri, index) => (
                                              <a
                                                href={
                                                  certificate_uri
                                                    ? certificate_uri
                                                    : "#"
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-size-3 text-blue"
                                              >
                                                {" "}
                                                <i className="fa fa-link mr-2"></i>
                                                {certificate_uri}
                                              </a>
                                            )
                                          )}
                                      </a>
                                    </Link>
                                    <br />
                                    {/* <a className="font-size-4 text-default-color line-height-2">
                                      {education.activities.join(", ")}
                                    </a> */}
                                    <a className="font-size-4 text-default-color line-height-2">
                                      {education.description}
                                    </a>

                                    <div className="d-flex align-items-center justify-content-md-between flex-wrap">
                                      <a className="font-size-4 text-gray mr-5">
                                        {`${
                                          education.start_date
                                            ? moment(
                                                +education.start_date
                                              ).format("DD MMM YYYY")
                                            : "Present"
                                        } - ${
                                          education.end_date
                                            ? moment(
                                                +education.end_date
                                              ).format("DD MMM YYYY")
                                            : "Present"
                                        }`}
                                      </a>
                                    </div>
                                  </div>
                                  <a
                                    className="btn btn-outline-green text-uppercase h-px-48 rounded-5 mr-7 mb-7"
                                    onClick={() => {
                                      setEducationNumberAndToggleModal(
                                        education.education_number
                                      );
                                    }}
                                  >
                                    <i className="fa fa-pen mr-2"></i>
                                    Update
                                  </a>
                                </div>
                              </div>
                            ))
                          )}
                          <br></br>
                          <a
                            className="btn btn-outline-green text-uppercase w-180 h-px-48 rounded-5 mr-7 mb-7"
                            onClick={() => {
                              setEducationNumberAndToggleModal(0);
                            }}
                          >
                            <i className="fa fa-plus mr-2"></i>
                            Add
                          </a>
                        </div>
                      </Tab.Pane>

                      {/* <Tab.Pane eventKey="four">
                        
                        <div className="pr-xl-11 p-5 pl-xs-12 pt-9 pb-11">
                          <form action="/">
                            <div className="row">
                              <div className="col-12 mb-7">
                                <label
                                  htmlFor="name3"
                                  className="font-size-4 font-weight-semibold text-black-2 mb-5 line-height-reset"
                                >
                                  Your Name
                                </label>
                                <input
                                  id="name3"
                                  type="text"
                                  className="form-control"
                                  placeholder="Jhon Doe"
                                />
                              </div>
                              <div className="col-lg-6 mb-7">
                                <label
                                  htmlFor="email3"
                                  className="font-size-4 font-weight-semibold text-black-2 mb-5 line-height-reset"
                                >
                                  E-mail
                                </label>
                                <input
                                  id="email3"
                                  type="email"
                                  className="form-control"
                                  placeholder="example@gmail.com"
                                />
                              </div>
                              <div className="col-lg-6 mb-7">
                                <label
                                  htmlFor="subject3"
                                  className="font-size-4 font-weight-semibold text-black-2 mb-5 line-height-reset"
                                >
                                  Subject
                                </label>
                                <input
                                  id="subject3"
                                  type="text"
                                  className="form-control"
                                  placeholder="Special contract"
                                />
                              </div>
                              <div className="col-lg-12 mb-7">
                                <label
                                  htmlFor="message3"
                                  className="font-size-4 font-weight-semibold text-black-2 mb-5 line-height-reset"
                                >
                                  Message
                                </label>
                                <textarea
                                  name="message"
                                  id="message3"
                                  placeholder="Type your message"
                                  className="form-control h-px-144"
                                ></textarea>
                              </div>
                              <div className="col-lg-12 pt-4">
                                <button className="btn btn-primary text-uppercase w-100 h-px-48">
                                  Send Now
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                        
                      </Tab.Pane> */}
                    </Tab.Content>
                    {/* <!-- Tab Content End --> */}
                    {/* <!-- Tab Section End --> */}
                  </div>
                </Tab.Container>
              </div>
              {/* <!-- Middle Content --> */}
              {/* <!-- Right Sidebar Start --> */}

              {/* <!-- Right Sidebar End --> */}
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
