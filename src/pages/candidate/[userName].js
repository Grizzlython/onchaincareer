import React from "react";
import { Nav, Tab } from "react-bootstrap";
import Link from "next/link";
import PageWrapper from "../../components/PageWrapper";
import ProfileSidebar from "../../components/ProfileSidebar";

import imgB1 from "../../assets/image/l2/png/featured-job-logo-1.png";
import imgB2 from "../../assets/image/l1/png/feature-brand-1.png";
import imgB3 from "../../assets/image/svg/harvard.svg";
import imgB4 from "../../assets/image/svg/mit.svg";

import imgT1 from "../../assets/image/l3/png/team-member-1.png";
import imgT2 from "../../assets/image/l3/png/team-member-2.png";
import imgT3 from "../../assets/image/l3/png/team-member-3.png";
import imgT4 from "../../assets/image/l3/png/team-member-4.png";
import imgT5 from "../../assets/image/l3/png/team-member-5.png";

import imgL from "../../assets/image/svg/icon-loaction-pin-black.svg";
import { useContext } from "react";
import GlobalContext from "../../context/GlobalContext";
import { useEffect } from "react";
import { useRouter } from "next/router";
import moment from "moment";
import { Button } from "../../components/Core";

export default function CandidateProfile() {
  const router = useRouter();
  const { userName } = router.query;

  const gContext = useContext(GlobalContext);

  useEffect(() => {
    gContext.getCandidateProfileByUsername(userName);
    gContext.getWorkExperience(userName);
    gContext.getProjects(userName);
  }, [userName]);

  const handleSocials = () => {
    gContext.setCandidateInfoAction("edit");
    gContext.toggleCandidateSocialsModal();
  };

  return (
    <>
      <PageWrapper headerConfig={{ button: "profile" }}>
        <div className="bg-default-2 pt-22 pt-lg-25 pb-13 pb-xxl-32">
          <div className="container">
            {/* <!-- back Button --> */}
            {/* <div className="row justify-content-center">
              <div className="col-12 dark-mode-texts">
                <div className="mb-9">
                  <Link href="/#">
                    <a className="d-flex align-items-center ml-4">
                      <i className="icon icon-small-left bg-white circle-40 mr-5 font-size-7 text-black font-weight-bold shadow-8"></i>
                      <span className="text-uppercase font-size-3 font-weight-bold text-gray">
                        Back
                      </span>
                    </a>
                  </Link>
                </div>
              </div>
            </div> */}
            {/* <!-- back Button End --> */}
            <div className="row">
              {/* <!-- Left Sidebar Start --> */}
              <div className="col-12 col-xxl-3 col-lg-4 col-md-5 mb-11 mb-lg-0">
                <ProfileSidebar userName={userName} openView={true} />
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
                          <h4 className="font-size-6 mb-7 mt-5 text-black-2 font-weight-semibold">
                            About
                          </h4>
                          <p className="font-size-4 mb-8">
                            {gContext.candidateProfile[0]?.bio}
                          </p>
                        </div>
                        {/* <!-- Excerpt End --> */}
                        {/* <!-- Skills --> */}
                        <div className="border-top pr-xl-0 pr-xxl-14 p-5 pl-xs-12 pt-7 pb-5">
                          <h4 className="font-size-6 mb-7 mt-5 text-black-2 font-weight-semibold">
                            Skills
                          </h4>
                          <ul className="list-unstyled d-flex align-items-center flex-wrap">
                            {gContext.candidateProfile[0]?.skills
                              .split(",")
                              .map((skill, index) => (
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
                          {gContext.workExperience?.length === 0 ? (
                            <>
                              <p>No workexperience found</p>
                              <Button
                                onClick={() => {
                                  gContext.toggleWorkExperienceModal();
                                }}
                              >
                                Add experience
                              </Button>
                            </>
                          ) : (
                            gContext.workExperience.map((workExp, index) => (
                              <div className="w-100" key={index}>
                                <div className="d-flex align-items-center pr-11 mb-9 flex-wrap flex-sm-nowrap">
                                  {/* <div className="square-72 d-block mr-8 mb-7 mb-sm-0">
                                <img src={imgB1.src} alt="" />
                              </div> */}
                                  <div className="w-100 mt-n2">
                                    <h3 className="mb-0">
                                      <Link href="/#">
                                        <a className="font-size-6 text-black-2 font-weight-semibold">
                                          {workExp.designation}
                                        </a>
                                      </Link>
                                    </h3>
                                    <Link href="/#">
                                      <a className="font-size-4 text-default-color line-height-2">
                                        {workExp.companyName}
                                      </a>
                                    </Link>
                                    <div className="d-flex align-items-center justify-content-md-between flex-wrap">
                                      <Link href="/#">
                                        <a className="font-size-4 text-gray mr-5">
                                          {`${moment(workExp.startDate).format(
                                            "DD MMM YYYY"
                                          )} - ${moment(workExp.endDate).format(
                                            "DD MMM YYYY"
                                          )}`}
                                        </a>
                                      </Link>
                                      <Link href="/#">
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
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="three">
                        <div className="border-top p-5 pl-xs-12 pt-7 pb-5">
                          {gContext.projects?.length === 0 ? (
                            <>
                              <p>No projects found</p>
                              <Button
                                onClick={() => {
                                  gContext.toggleProjectsModal();
                                }}
                                width="80px"
                                height="50px"
                              >
                                Add project
                              </Button>
                            </>
                          ) : (
                            gContext.projects.map((project, index) => (
                              <div className="w-100" key={index}>
                                <div className="d-flex align-items-center pr-11 mb-9 flex-wrap flex-sm-nowrap">
                                  {/* <div className="square-72 d-block mr-8 mb-7 mb-sm-0">
                                <img src={imgB1.src} alt="" />
                              </div> */}
                                  <div className="w-100 mt-n2">
                                    <h3 className="mb-0">
                                      <Link href="/#">
                                        <a className="font-size-6 text-black-2 font-weight-semibold">
                                          {project.projectName}
                                        </a>
                                      </Link>
                                    </h3>
                                    <Link href={project.projectLink}>
                                      <a className="font-size-3 text-blue">
                                        <i className="fa fa-link mr-2"></i>
                                        {project.projectLink}
                                      </a>
                                    </Link>
                                    <br />

                                    <a className="font-size-4 text-default-color line-height-2">
                                      {project.description}
                                    </a>

                                    <div className="d-flex align-items-center justify-content-md-between flex-wrap">
                                      <Link href="/#">
                                        <a className="font-size-4 text-gray mr-5">
                                          {`${moment(project.startDate).format(
                                            "DD MMM YYYY"
                                          )} - ${moment(project.endDate).format(
                                            "DD MMM YYYY"
                                          )}`}
                                        </a>
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
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
