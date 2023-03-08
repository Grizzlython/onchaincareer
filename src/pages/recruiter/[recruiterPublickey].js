import React from "react";
import { Nav, Tab } from "react-bootstrap";
import Link from "next/link";
import PageWrapper from "../../components/PageWrapper";
import RecruiterSidebar from "../../components/ProfileSidebar/RecruiterProfileSidebar";

import imgF from "../../assets/image/svg/icon-fire-rounded.svg";
import iconL from "../../assets/image/svg/icon-loaction-pin-black.svg";
import iconS from "../../assets/image/svg/icon-suitecase.svg";
import iconC from "../../assets/image/svg/icon-clock.svg";
import imgL from "../../assets/image/svg/icon-loaction-pin-black.svg";
import { useContext } from "react";
import GlobalContext from "../../context/GlobalContext";
import { useEffect } from "react";
import { useRouter } from "next/router";
import moment from "moment";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { check_if_user_exists } from "../../utils/web3/web3_functions";
import { userTypeEnum } from "../../utils/constants";
import { toast } from "react-toastify";
import SearchCompanyTab from "../../sections/search/SearchCompanyTab";
import Loader from "../../components/Loader";

export default function FullProfile() {
  const router = useRouter();
  const { recruiterPublickey } = router.query;
  const gContext = useContext(GlobalContext);
  const [candidateProfile, setCandidateProfile] = React.useState(null);

  const { loading } = gContext;

  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const { allListedCompaniesByUser } = gContext;

  useEffect(() => {
    if (!recruiterPublickey) {
      router.push("/");
      return;
    }

    (async () => {
      const userExistsRes = await check_if_user_exists(
        recruiterPublickey,
        connection
      );

      if (userExistsRes.data) {
        setCandidateProfile(userExistsRes.data);
      }
    })();
  }, [recruiterPublickey]);

  const updateCandidateBasicInfo = () => {
    gContext.setCandidateInfoAction("edit");
    gContext.toggleRecruiterProfileModal();
  };

  useEffect(() => {
    if (!publicKey) return;
    (async () => {
      await gContext.fetchAndSetAllListedCompaniesByUser(connection, publicKey);
    })();
  }, [publicKey]);
  return (
    <>
      <PageWrapper headerConfig={{ button: "profile" }}>
        <div className="bg-default-2 pt-22 pt-lg-25 pb-13 pb-xxl-32">
          {loading ? (
            <Loader />
          ) : (
            <div className="container">
              {/* <!-- back Button --> */}
              <div className="row">
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
                  <RecruiterSidebar recruiterInfo={candidateProfile} />
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
                            Recruiter companies
                          </Nav.Link>
                        </li>
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
                              {candidateProfile?.skills?.map((skill, index) => (
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
                            {allListedCompaniesByUser?.map((company, index) => (
                              <>
                                <div
                                  className="pt-9 px-xl-9 px-lg-7 px-7 pb-7 light-mode-texts bg-white rounded hover-shadow-3 hover-border-green mt-4"
                                  style={{
                                    cursor: "pointer",
                                    border: "1px solid #e5e5e5",
                                  }}
                                >
                                  <div className="row">
                                    <div className="col-md-6">
                                      <div className="media align-items-center">
                                        <div className="square-72 d-block mr-8">
                                          <img
                                            src={company?.logo_uri}
                                            alt=""
                                            style={{
                                              width: "75px",
                                              height: "75px",
                                              objectFit: "cover",
                                              borderRadius: "50%",
                                            }}
                                          />
                                        </div>
                                        <div>
                                          <h3 className="mb-0 font-size-6 heading-default-color">
                                            {company?.name?.toUpperCase()}
                                          </h3>
                                          <span className="font-size-3 text-default-color line-height-2 d-block">
                                            Company domain:
                                            {company?.domain?.toUpperCase()}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-6 text-right pt-7 pt-md-5">
                                      <div className="media justify-content-md-end">
                                        <div className="image mr-5 mt-2">
                                          <img src={imgF.src} alt="" />
                                        </div>
                                        <div>
                                          <p className="font-weight-bold font-size-7 text-hit-gray mb-0">
                                            <span className="text-black-2">
                                              Employee size:{" "}
                                              {company?.employee_size}
                                            </span>
                                          </p>
                                        </div>
                                        <br />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="row ">
                                    {/* <div className="col-md-7">
                                <ul className="d-flex list-unstyled mr-n3 flex-wrap">
                                  {job?.parsedInfo?.skills.map(
                                    (skill, index) => (
                                      <li key={index}>
                                        <span className="bg-regent-opacity-15 min-width-px-96 mr-3 text-center rounded-3 px-6 py-1 font-size-3 text-black-2 mt-2 d-inline-block">
                                          {skill}
                                        </span>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div> */}
                                    <div className="col-md-12">
                                      <ul className="d-flex list-unstyled mr-n3 flex-wrap mr-n8 justify-content-md-end">
                                        <li className="mt-2 mr-8 font-size-small text-black-2 d-flex">
                                          <span
                                            className="mr-4"
                                            css={`
                                              margin-top: -2px;
                                            `}
                                          >
                                            <img src={iconL.src} alt="" />
                                          </span>
                                          <span className="font-weight-semibold">
                                            {company?.address}
                                          </span>
                                        </li>
                                        <li className="mt-2 mr-8 font-size-small text-black-2 d-flex">
                                          <span
                                            className="mr-4"
                                            css={`
                                              margin-top: -2px;
                                            `}
                                          >
                                            <img src={iconS.src} alt="" />
                                          </span>
                                          <span className="font-weight-semibold">
                                            {company?.company_type}
                                          </span>
                                        </li>
                                        <br />
                                      </ul>
                                      <ul className="d-flex list-unstyled mr-n3 flex-wrap mr-n8 justify-content-md-end">
                                        <li className="mt-2 mr-8 font-size-small text-black-2 d-flex">
                                          <span
                                            className="mr-4"
                                            css={`
                                              margin-top: -1px;
                                            `}
                                          >
                                            <img src={iconC.src} alt="" />
                                          </span>
                                          <span className="font-weight-semibold">
                                            Created at:
                                            {moment(
                                              new Date(
                                                company?.created_at.toNumber()
                                              )
                                            ).fromNow()}
                                          </span>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>

                                  <div
                                    className="card-btn-group mt-3"
                                    style={{
                                      display: "flex",
                                    }}
                                  >
                                    <Link
                                      href={`/company/${company?.company_info_account?.toString()}`}
                                    >
                                      <a className="btn btn-green text-uppercase btn-medium rounded-3">
                                        View Company
                                      </a>
                                    </Link>
                                    <a
                                      className="btn btn-outline-gray text-black text-uppercase btn-medium rounded-3 ml-3"
                                      href={`https://explorer.solana.com/address/${company?.company_info_account?.toString()}?cluster=devnet`}
                                      target="_blank"
                                    >
                                      <i className="fa fa-globe mr-3"></i>
                                      View on chain
                                    </a>
                                  </div>
                                </div>
                              </>
                            ))}
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
          )}
        </div>
      </PageWrapper>
    </>
  );
}
