import React from "react";
import Link from "next/link";
import { Nav, Tab } from "react-bootstrap";
import PageWrapper from "../components/PageWrapper";
import ProfileSidebar from "../components/ProfileSidebar";

import img1 from "../assets/image/l3/png/fimize.png";
import img2 from "../assets/image/svg/icon-shark-2.svg";

import imgF from "../assets/image/svg/icon-fire-rounded.svg";
import iconL from "../assets/image/svg/icon-loaction-pin-black.svg";
import iconS from "../assets/image/svg/icon-suitecase.svg";
import iconC from "../assets/image/svg/icon-clock.svg";

import { useContext } from "react";
import GlobalContext from "../context/GlobalContext";
import { useEffect } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";
import { WORKFLOW_STATUSES } from "../utils/web3/struct_decoders/jobsonchain_constants_enum";
import { check_if_user_exists } from "../utils/web3/web3_functions";
import { userTypeEnum } from "../utils/constants";

export default function CandidateProfileTwo() {
  const gContext = useContext(GlobalContext);
  const allInteractedJobsByUser = gContext.allInteractedJobsByUser;
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [candidateInfo, setCandidateInfo] = React.useState(null);
  const router = useRouter();

  const { loading } = gContext;
  useEffect(() => {
    if (!publicKey) {
      router.push("/");
      return;
    }

    (async () => {
      const userExistsRes = await check_if_user_exists(publicKey, connection);
      if (userExistsRes.data.user_type !== userTypeEnum.RECRUITER) {
        await gContext.fetchAndSetAllInteractedJobsByUser(
          publicKey,
          connection
        );
      } else {
        toast.info(
          "⚠️ You are a recruiter, you can't access the candidate dashboard"
        );
        router.push("/dashboard-main");
      }

      if (userExistsRes.data) {
        setCandidateInfo(userExistsRes.data);
      }
    })();
  }, [publicKey]);

  return (
    <>
      <PageWrapper headerConfig={{ button: "profile" }}>
        <div className="bg-default-2 pt-19 pt-lg-22 pb-7 pb-lg-23">
          <div className="container">
            <div className="row">
              <div className="col-12 mt-13 dark-mode-texts">
                <div className="mb-9">
                  <Link href={`/profile`}>
                    <a className="d-flex align-items-center ml-4">
                      <i className="fa fa-user bg-white circle-30 mr-5 font-size-2 text-primary font-weight-bold shadow-8"></i>
                      <span className="text-uppercase font-size-3 font-weight-bold text-primary">
                        View Full Profile
                      </span>
                    </a>
                  </Link>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-xl-4 col-lg-4 col-md-12 col-xs-10 mb-11 mb-lg-0">
                <ProfileSidebar candidateInfo={candidateInfo} />
              </div>
              <div
                className=""
                style={{
                  width: "850px",
                }}
              >
                <Tab.Container
                  id="left-tabs-example"
                  defaultActiveKey={WORKFLOW_STATUSES[0]}
                >
                  <div className="bg-white rounded-4 shadow-9">
                    {/* <!-- Tab Section Start --> */}
                    <Nav
                      className="nav border-bottom border-mercury pl-12"
                      role="tablist"
                    >
                      {WORKFLOW_STATUSES &&
                        WORKFLOW_STATUSES.map((workflow_name, index) => (
                          <li className="tab-menu-items nav-item pr-12">
                            <Nav.Link
                              eventKey={workflow_name}
                              className="text-uppercase font-size-3 font-weight-bold text-default-color py-3 px-0"
                            >
                              {workflow_name}
                            </Nav.Link>
                          </li>
                        ))}
                    </Nav>

                    <Tab.Content>
                      {WORKFLOW_STATUSES &&
                        WORKFLOW_STATUSES.map((workflow_name) => (
                          <Tab.Pane eventKey={workflow_name}>
                            <div className="row justify-content-center mt-8 position-static">
                              <div className="col-12 col-xxl-11 col-xl-7 col-lg-10 pb-10">
                                {/* <!-- Single Featured Job --> */}
                                {allInteractedJobsByUser &&
                                  allInteractedJobsByUser[workflow_name] &&
                                  allInteractedJobsByUser[workflow_name]
                                    .length > 0 &&
                                  allInteractedJobsByUser[workflow_name].map(
                                    (job) => (
                                      <div
                                        className="pt-9 px-xl-9 px-lg-7 px-7 pb-7 light-mode-texts bg-white rounded hover-shadow-3 hover-border-green"
                                        style={{
                                          border: "1px solid #e9ecef",
                                        }}
                                      >
                                        <div className="row">
                                          <div className="col-md-6">
                                            <div className="media align-items-center">
                                              <div className="square-72 d-block mr-8">
                                                <img
                                                  src={
                                                    job?.companyInfo?.logo_uri
                                                  }
                                                  alt=""
                                                  style={{
                                                    width: "75px",
                                                    height: "75px",
                                                  }}
                                                />
                                              </div>
                                              <div>
                                                <h3 className="mb-0 font-size-6 heading-default-color">
                                                  {job.jobInfo?.job_title}
                                                </h3>
                                                <span className="font-size-3 text-default-color line-height-2 d-block">
                                                  {job.companyInfo.name?.toUpperCase()}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="col-md-6 text-right pt-7 pt-md-5">
                                            <div className="media justify-content-md-end">
                                              <div className="image mr-5 mt-2">
                                                <img src={imgF.src} alt="" />
                                              </div>
                                              <p className="font-weight-bold font-size-7 text-hit-gray mb-0">
                                                <span className="text-black-2">
                                                  {Number(
                                                    job.jobInfo?.min_salary
                                                  ) +
                                                    "-" +
                                                    Number(
                                                      job.jobInfo?.max_salary
                                                    )}
                                                </span>
                                              </p>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="row pt-8">
                                          <div className="col-md-7">
                                            <ul className="d-flex list-unstyled mr-n3 flex-wrap">
                                              {job.jobInfo?.skills.map(
                                                (skill, index) => (
                                                  <li key={index}>
                                                    <span className="bg-regent-opacity-15 min-width-px-96 mr-3 text-center rounded-3 px-6 py-1 font-size-3 text-black-2 mt-2 d-inline-block">
                                                      {skill}
                                                    </span>
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                          </div>
                                          <div className="col-md-5">
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
                                                  {job.jobInfo
                                                    ?.job_location_type ===
                                                  "remote"
                                                    ? "Remote"
                                                    : `${job.jobInfo?.city}, ${job.jobInfo?.country}`}
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
                                                  {job.jobInfo?.job_type}
                                                </span>
                                              </li>
                                              <li className="mt-2 mr-8 font-size-small text-black-2 d-flex">
                                                <span
                                                  className="mr-4"
                                                  css={`
                                                    margin-top: -2px;
                                                  `}
                                                >
                                                  <img src={iconC.src} alt="" />
                                                </span>
                                                <span className="font-weight-semibold">
                                                  {
                                                    // convert created at date to days ago
                                                    moment(
                                                      new Date(
                                                        Number(
                                                          job.job_applied_at
                                                        )
                                                      )
                                                    ).fromNow()
                                                  }
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
                                            href={`/job-details/${
                                              job.job_pubkey
                                                ? job.job_pubkey.toString()
                                                : ""
                                            }`}
                                          >
                                            <a className="btn btn-green text-uppercase btn-medium rounded-3">
                                              View Job
                                            </a>
                                          </Link>
                                          <a
                                            className="btn btn-outline-gray text-black text-uppercase btn-medium rounded-3 ml-3"
                                            href={`https://explorer.solana.com/address/${job?.job_pubkey?.toString()}?cluster=devnet`}
                                            target="_blank"
                                          >
                                            <i className="fa fa-globe mr-3"></i>
                                            View on chain
                                          </a>
                                        </div>
                                      </div>
                                    )
                                  )}
                                {!allInteractedJobsByUser ||
                                  !allInteractedJobsByUser[workflow_name] ||
                                  (!allInteractedJobsByUser[workflow_name]
                                    .length && (
                                    <div className="row justify-content-center">
                                      No &nbsp; <b>{workflow_name}</b> &nbsp;
                                      jobs found
                                    </div>
                                  ))}
                                {/* <!-- End Single Featured Job --> */}
                              </div>
                            </div>
                          </Tab.Pane>
                        ))}
                    </Tab.Content>
                  </div>
                </Tab.Container>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
