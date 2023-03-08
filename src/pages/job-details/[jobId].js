import React, { useState } from "react";
import Link from "next/link";
import PageWrapper from "../../components/PageWrapper";

import imgF1 from "../../assets/image/l2/png/featured-job-logo-1.png";
import copyIcon from "../../assets/image/copy.png";
import imgF from "../../assets/image/svg/icon-fire-rounded.svg";

import iconB from "../../assets/image/svg/icon-briefcase.svg";
import iconL from "../../assets/image/svg/icon-location.svg";
import iconS from "../../assets/image/svg/icon-suitecase.svg";
import iconC from "../../assets/image/svg/icon-clock.svg";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useContext } from "react";
import GlobalContext from "../../context/GlobalContext";
import moment from "moment";
import { toast } from "react-toastify";
import { PublicKey } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  findAllWorkflowOfJobPost,
  getWorkflowInfo,
  getWorkflowInfoByUser,
} from "../../utils/web3/web3_functions";
import { BN } from "bn.js";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { WORKFLOW_STATUSES_enum } from "../../utils/web3/struct_decoders/jobsonchain_constants_enum";
import { Nav, Tab } from "react-bootstrap";
import { filter } from "lodash";
import Loader from "../../components/Loader";
import { userTypeEnum } from "../../utils/constants";
import {CopyToClipboard} from 'react-copy-to-clipboard';

import {
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

export default function JobDetails() {
  const router = useRouter();
  const { jobId } = router.query;
  const gContext = useContext(GlobalContext);
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [withdraw, setWithdraw] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const {
    user,
    userStateAccount,
    isUserApplicant,
    jobDetails,
    companyPostedJobs,
    getJobDetails,
    fetchAndSetCompanyPostedJobs,
    addJobApplication,
    updateJobApplication,
    toggleJobPostModal,
    loading,
  } = gContext;

  useEffect(() => {
    if (!jobId) return;
    const jobPubKey = new PublicKey(jobId);

    (async () => {
      // await gContext.getUserAppliedJobs(publicKey, connection);
      await getJobDetails(jobPubKey, connection);
      console.log(user, "user jobid");
      if (user?.user_type === userTypeEnum.APPLICANT && publicKey) {
        const res = await findAllWorkflowOfJobPost(
          connection,
          jobPubKey,
          userStateAccount
        );
        console.log(res.data, "res.data");
        if (res.data[0]?.is_saved) {
          setSaved(true);
        }
        if (res.data[0]?.status === WORKFLOW_STATUSES_enum.APPLIED) {
          setApplied(true);
        }
        if (res.data[0]?.status === WORKFLOW_STATUSES_enum.WITHDRAW) {
          setWithdraw(true);
        }
      }
    })();
  }, [jobId, user]);

  useEffect(() => {
    if (!jobDetails || !user || !userStateAccount) return;


    (async () => {
      if (
        user?.user_type === userTypeEnum.RECRUITER &&
        publicKey &&
        jobDetails.companyInfo &&
        jobDetails.companyInfo?.user_info_state_account_pubkey?.toBase58() ===
          userStateAccount.toBase58()
      ) {
        setCanEdit(true);
      }

      await fetchAndSetCompanyPostedJobs(
        jobDetails?.company_pubkey,
        connection
      );
    })();
  }, [jobDetails, user]);

  const handleEditJobPost = async (jobpost_info_account) => {
    try {
      await getJobDetails(jobpost_info_account, connection);
      toggleJobPostModal();
    } catch (error) {
      console.log(error);
    }
  };

  const applyForJob = async (jobInfoAccount, companyInfoAccount) => {
    if (!publicKey) {
      toast("⚠️ Please connect your wallet");
      return;
    }
    if (applied) {
      toast.error("⚠️ You have already applied for this job");
      return;
    }

    const workflow = await getWorkflowInfoByUser(
      jobInfoAccount,
      publicKey,
      connection
    );
    const jobWorkflowInfo = {
      status: WORKFLOW_STATUSES_enum.APPLIED, //10 => 'applied' or 'in_progress' or 'accepted' or 'rejected' or 'withdraw'
    };
    if (!workflow) {
      await addJobApplication(
        publicKey,
        connection,
        signTransaction,
        jobWorkflowInfo,
        jobInfoAccount,
        companyInfoAccount
      );
      setApplied(true);
    }else{
      
      jobWorkflowInfo.is_saved = workflow.is_saved,
      await updateJobApplication(
        publicKey,
        connection,
        signTransaction,
        jobWorkflowInfo,
        jobInfoAccount,
        companyInfoAccount
      );
      setApplied(true);
    }
    
  };

  const saveThisJob = async (jobInfoAccount, companyInfoAccount) => {
    try {
      if (!publicKey) {
        toast("⚠️ Please connect your wallet");
        return;
      }

      const workflow = await getWorkflowInfoByUser(
        jobInfoAccount,
        publicKey,
        connection
      );
      if (!workflow) {
        console.log("Workflow not found, creating new workflow with status saved");
        const jobWorkflowInfo = {
          is_saved: true, 
        };
    
        console.log(jobWorkflowInfo, "jobWorkflowInfo");
    
        await addJobApplication(
          publicKey,
          connection,
          signTransaction,
          jobWorkflowInfo,
          jobInfoAccount,
          companyInfoAccount
        );
        setSaved(true);
      }else{
        const jobWorkflowInfo = {
          archived: false, //1 => true or false
          is_saved: !workflow.is_saved, //1 => true or false
          status: workflow.status, //16 => 'saved' or 'applied' or 'in_progress' or 'accepted' or 'rejected' or 'withdraw'
          // last_updated_at: new BN(new Date().getTime()), //8 => timestamp in unix format
        };
  
        await updateJobApplication(
          publicKey,
          connection,
          signTransaction,
          jobWorkflowInfo,
          jobInfoAccount,
          companyInfoAccount
        );
        setSaved(jobWorkflowInfo.is_saved);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };
  const withdrawThisJob = async (jobInfoAccount, companyInfoAccount) => {
    try {
      if (!publicKey) {
        toast("⚠️ Please connect your wallet");
        return;
      }

      const workflow = await getWorkflowInfoByUser(
        jobInfoAccount,
        publicKey,
        connection
      );
      if (!workflow) {
        toast.error("Workflow not found");
        return;
      }
      const jobWorkflowInfo = {
        archived: false, //1 => true or false
        is_saved: workflow.is_saved, //1 => true or false
        status: WORKFLOW_STATUSES_enum.WITHDRAW, //16 => 'saved' or 'applied' or 'in_progress' or 'accepted' or 'rejected' or 'withdraw'
        // last_updated_at: new BN(new Date().getTime()), //8 => timestamp in unix format
      };

      await updateJobApplication(
        publicKey,
        connection,
        signTransaction,
        jobWorkflowInfo,
        jobInfoAccount,
        companyInfoAccount
      );
      setWithdraw(true);
      setApplied(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <PageWrapper headerConfig={{ button: "profile" }}>
        <div className="jobDetails-section bg-default-1 pt-28 pt-lg-27 pb-xl-25 pb-12">
          {loading ? (
            <Loader />
          ) : (
            <div className="container">
              <div className="row justify-content-center">
                {/* <!-- back Button --> */}
                <div className="col-xl-10 col-lg-11 mt-4 ml-xxl-32 ml-xl-15 dark-mode-texts">
                  <div className="mb-9">
                    {/* <Link href="/"> */}
                    <a
                      className="d-flex align-items-center ml-4"
                      onClick={() => router.back()}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="icon icon-small-left bg-white circle-40 mr-5 font-size-7 text-black font-weight-bold shadow-8"></i>
                      <span className="text-uppercase font-size-3 font-weight-bold text-gray">
                        Back
                      </span>
                    </a>
                    {/* </Link> */}
                  </div>
                </div>
                {/* <!-- back Button End --> */}
                <div className="col-xl-9 col-lg-11 mb-8 px-xxl-15 px-xl-0">
                  <div className="bg-white rounded-4 border border-mercury shadow-9">
                    {/* <!-- Single Featured Job --> */}
                    <div className="pt-9 pl-sm-9 pl-5 pr-sm-9 pr-5 pb-8  light-mode-texts">
                      <div className="row">
                        <div className="col-md-6">
                          {/* <!-- media start --> */}
                          <div className="media align-items-center">
                            {/* <!-- media logo start --> */}
                            <div className="square-72 d-block mr-8">
                              <img
                                src={
                                  jobDetails?.companyInfo?.logo_uri || imgF1.src
                                }
                                alt=""
                                style={{
                                  width: "75px",
                                  height: "75px",
                                  objectFit: "cover",
                                  borderRadius: "50%",
                                }}
                              />
                            </div>
                            {/* <!-- media logo end --> */}
                            {/* <!-- media texts start --> */}
                            <div>
                              <h3 className="font-size-6 mb-0">
                                {jobDetails?.job_title}
                              </h3>
                              <Link
                                href={`/company/${jobDetails?.company_pubkey?.toString()}`}
                              >
                                <span
                                  className="font-size-3 text-gray line-height-2"
                                  style={{
                                    cursor: "pointer",
                                  }}
                                >
                                  {jobDetails?.companyInfo?.name?.toUpperCase()}
                                </span>
                              </Link>
                            </div>
                            {/* <!-- media texts end --> */}
                          </div>
                          {/* <!-- media end --> */}
                        </div>
                        <div className="col-md-6 text-right pt-7 pt-md-0 mt-md-n1">
                          {/* <!-- media date start --> */}
                          <div className="media justify-content-md-end">
                            <p className="font-size-4 text-gray mb-0">
                              Posted on:{" "}
                              {moment(jobDetails?.createdAt).format(
                                "DD MMM YYYY"
                              )}
                            </p>
                          </div>
                          <Link
                            href={`/company/${jobDetails?.company_pubkey?.toString()}`}
                          >
                            <a
                              className="btn btn-outline-green text-uppercase btn-medium rounded-3 w-180 mt-2 mb-5"
                              style={{
                                cursor: "pointer",
                              }}
                            >
                              {"View Company"}
                            </a>
                          </Link>
                          

                          {/* <!-- media date end --> */}
                        </div>
                      </div>
                      <div className="row pt-9">
                        <div className="col-12">
                          {/* <!-- card-btn-group start --> */}
                          {canEdit && !isUserApplicant ? (
                            <div className="card-btn-group" style={{
                              float: "left"
                            }}>
                              <a
                                className="btn btn-green text-uppercase btn-medium rounded-3 w-180 mr-4 mb-5"
                                onClick={() =>
                                  handleEditJobPost(new PublicKey(jobId))
                                }
                              >
                                {"Edit Job"}
                              </a>
                            </div>
                          ) : isUserApplicant ? (
                            <div className="card-btn-group" style={{
                              float: "left"
                            }}>
                              <a
                                className="btn btn-green text-uppercase btn-medium rounded-3 w-180 mr-4 mb-5"
                                onClick={() =>
                                  // !gContext.hasCandidateAppliedForJob &&
                                  applyForJob(
                                    jobDetails?.pubkey,
                                    jobDetails?.company_pubkey
                                  )
                                }
                              >
                                {applied ? "Applied" : "Apply to this job"}
                              </a>
                              <OverlayTrigger
                                placement="top"
                                delay={{ show: 250, hide: 400 }}
                                overlay={
                                  <Tooltip id="button-tooltip">
                                    {saved
                                      ? "Unsave this job"
                                      : "Save this job"}
                                  </Tooltip>
                                }
                              >
                                <a
                                  className="btn btn-outline-mercury text-black-2 text-uppercase h-px-48 rounded-3 mb-5 px-5"
                                  onClick={() =>
                                    // !gContext.hasCandidateSavedJob &&
                                    saveThisJob(
                                      jobDetails?.pubkey,
                                      jobDetails?.company_pubkey
                                    )
                                  }
                                >
                                  {saved ? (
                                    <i className="bookmark-button toggle-item font-size-6 line-height-reset px-0 mr-3  text-default-color  clicked"></i>
                                  ) : (
                                    <i className="icon icon-bookmark-2 font-weight-bold mr-4 font-size-4"></i>
                                  )}

                                  {saved ? "Saved" : "Save job"}
                                </a>
                              </OverlayTrigger>

                              {applied && (
                                <a
                                  className="btn btn-outline-danger text-uppercase h-px-48 rounded-3 mb-5 px-5 ml-4"
                                  onClick={() =>
                                    // !gContext.hasCandidateSavedJob &&
                                    withdrawThisJob(
                                      jobDetails?.pubkey,
                                      jobDetails?.company_pubkey
                                    )
                                  }
                                >
                                  <i
                                    className="fas fa-trash"
                                    style={{
                                      // color: "red",
                                      marginRight: "5px",
                                    }}
                                  ></i>

                                  {"withdraw"}
                                </a>
                              )}
                            </div>
                          ) : (
                            <></>
                          )}
      <div style={{
        float: "right",
        textAlign: "center"
      }}>
                            <p style={{
                              marginTop: "-10px",
                              marginBottom: "5px",
                              fontSize: "16px",
                            }}>Share on: </p>
                            <CopyToClipboard text={`https://onchaincareer.io/job/${jobId}`}
                              onCopy={() => {
                                toast.success("Link copied to clipboard")
                              }}
                              style={{
                                marginRight: "5px",
                                cursor: "pointer",
                                width: "26px",
                                marginTop: "5px"
                              }}>
                                <img src={copyIcon.src} alt="" />
                            </CopyToClipboard>
                            <TwitterShareButton
                              title="Onchaincareer Job post"
                              via="https://onchaincareer.io"
                              hashtags={[
                                "onchaincareer",
                                "job",
                                "blockchain",
                                "crypto",
                                "solana",
                                "solana job",
                                "job post",
                                "hiring",
                                "career"
                              ]}
                              related={[
                                "https://onchaincareer.io",
                                "https://twitter.com/onchaincareer",
                                "https://www.linkedin.com/company/onchaincareer",
                                "https://www.facebook.com/onchaincareer",
                                "https://www.instagram.com/onchaincareer",
                              ]}
                              url={`https://onchaincareer.io/job/${jobId}`}
                              style={{
                                marginRight: "5px",
                              }}
                            >
                              <TwitterIcon size={32} round />
                            </TwitterShareButton>
                            <LinkedinShareButton
                              title="onchaincareer Job post"
                              summary="Hi, I found this job on Onchaincareer. Check it out!"
                              source="https://onchaincareer.io"
                              url={`https://onchaincareer.io/job/${jobId}`}
                              style={{
                                marginRight: "5px",
                              }}
                            >
                              <LinkedinIcon size={32} round />
                            </LinkedinShareButton>
                            <TelegramShareButton
                              title="onchaincareer Job post"
                              url={`https://onchaincareer.io/job/${jobId}`}
                              style={{
                                marginRight: "5px",
                              }}
                            >
                              <TelegramIcon size={32} round />
                            </TelegramShareButton>
                            <WhatsappShareButton
                              title="onchaincareer Job post"
                              url={`https://onchaincareer.io/job/${jobId}`}
                              style={{
                                marginRight: "5px",
                              }}
                            >
                              <WhatsappIcon size={32} round />
                            </WhatsappShareButton>
                          </div>
                          {/* <!-- card-btn-group end --> */}
                        </div>
                      </div>
                    </div>
                    <Tab.Container
                      id="left-tabs-example"
                      defaultActiveKey="details"
                    >
                      <Nav
                        className="nav border-bottom border-mercury pl-12"
                        role="tablist"
                      >
                        <li className="tab-menu-items nav-item pr-12">
                          <Nav.Link
                            eventKey="details"
                            className="text-uppercase font-size-3 font-weight-bold text-default-color py-3 px-0"
                          >
                            Job details
                          </Nav.Link>
                        </li>
                        <li className="tab-menu-items nav-item pr-12">
                          <Nav.Link
                            eventKey="jobs"
                            className="text-uppercase font-size-3 font-weight-bold text-default-color py-3 px-0"
                          >
                            More jobs from this company
                          </Nav.Link>
                        </li>
                      </Nav>

                      <Tab.Content className="pl-6">
                        <Tab.Pane eventKey="details">
                          <>
                            <div className="job-details-content pt-8 pl-sm-9 pl-6 pr-sm-9 pr-6 pb-10 border-bottom border-width-1 border-default-color light-mode-texts">
                              <div className="row mb-7">
                                <div className="col-md-4 mb-md-0 mb-6">
                                  <div className="media justify-content-md-start">
                                    {/* <div className="image mr-5">
                                      <img src={imgF.src} alt="" />
                                    </div> */}
                                    <p className="font-weight-semibold font-size-5 text-black-2 mb-0">
                                      <span className="text-primary mr-2">
                                        {jobDetails?.currency}{" "}
                                      </span>
                                      <span className="text-black-2">
                                        {` ${Number(jobDetails?.min_salary)} -
                                    ${Number(jobDetails?.max_salary)}`}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                                <div className="col-md-4 pr-lg-0 pl-lg-10 mb-md-0 mb-6">
                                  <div className="media justify-content-md-start">
                                    <div className="image mr-5">
                                      <img src={iconB.src} alt="" />
                                    </div>
                                    <p className="font-weight-semibold font-size-5 text-black-2 mb-0">
                                      {jobDetails?.job_type}
                                    </p>
                                  </div>
                                </div>
                                <div className="col-md-4 pl-lg-0">
                                  <div className="media justify-content-md-start">
                                    <div className="image mr-5">
                                      <img src={iconL.src} alt="" />
                                    </div>
                                    <p className="font-size-5 text-gray mb-0">
                                      {jobDetails?.jobLocationType === "remote"
                                        ? "Remote"
                                        : `${
                                            jobDetails?.city.length > 0
                                              ? jobDetails?.city + ","
                                              : ""
                                          }  ${jobDetails?.country}`}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="row mt-2">
                                <div className="col-md-4 mb-lg-0 mb-10">
                                  <div className="">
                                    <span className="font-size-4 d-block mb-2 text-gray">
                                      Career Level
                                    </span>
                                    <h6 className="font-size-5 text-black-2 font-weight-semibold mb-9">
                                      {jobDetails?.category}
                                    </h6>
                                  </div>
                                  {/* <div className="tags">
                                    <p className="font-size-4 text-gray mb-0">
                                      Soft Skill
                                    </p>
                                    <ul className="list-unstyled mr-n3 mb-0">
                                      <li className="d-block font-size-4 text-black-2 mt-2">
                                        <span className="d-inline-block mr-2">
                                          •
                                        </span>
                                        Slack
                                      </li>
                                      <li className="d-block font-size-4 text-black-2 mt-2">
                                        <span className="d-inline-block mr-2">
                                          •
                                        </span>
                                        Basic English
                                      </li>
                                      <li className="d-block font-size-4 text-black-2 mt-2">
                                        <span className="d-inline-block mr-2">
                                          •
                                        </span>
                                        Well Organized
                                      </li>
                                    </ul>
                                  </div> */}
                                  <div className="tags">
                                    <p className="font-size-4 text-gray mb-2">
                                      Required Skills
                                    </p>
                                    <ul className="d-flex list-unstyled flex-wrap pr-sm-25 pr-md-0">
                                      {gContext.jobDetails?.skills?.map(
                                        (skill, index) => (
                                          <li className="bg-regent-opacity-15 mr-3 h-px-33 text-center flex-all-center rounded-3 px-5 font-size-3 text-black-2 mt-2">
                                            {skill}
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                </div>
                                <div className="col-md-4 pr-lg-0 pl-lg-10 mb-lg-0 mb-8">
                                  {/* <div className="">
                          <span className="font-size-4 d-block mb-4 text-gray">
                            Type of corporation
                          </span>
                          <h6 className="font-size-5 text-black-2 font-weight-semibold mb-9">
                            {gContext.jobDetails?.companytype}
                          </h6>
                        </div> */}
                                  <div className="">
                                    <span className="font-size-4 d-block mb-2 text-gray">
                                      Required experience
                                    </span>
                                    <h6 className="font-size-5 text-black-2 font-weight-semibold mb-9">
                                      {Math.floor(
                                        Number(
                                          gContext.jobDetails
                                            ?.experience_in_months
                                        ) / 12
                                      ) + "+ Years"}
                                    </h6>
                                  </div>
                                </div>
                                {/* <div className="col-md-4 pl-lg-0">
                        <div className="">
                          <span className="font-size-4 d-block mb-4 text-gray">
                            Company size
                          </span>
                          <h6 className="font-size-5 text-black-2 font-weight-semibold mb-0">
                            {gContext.jobDetails?.companysize}
                          </h6>
                        </div>
                      </div> */}
                                <div className="col-md-4 pl-lg-0">
                                  <div className="">
                                    <span className="font-size-4 d-block mb-2 text-gray">
                                      Qualification
                                    </span>
                                    <h6 className="font-size-5 text-black-2 font-weight-semibold mb-0">
                                      {gContext.jobDetails?.qualification}
                                    </h6>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="job-details-content pt-8 pl-sm-9 pl-6 pr-sm-9 pr-6 pb-10 light-mode-texts">
                              <div className="row">
                                <div className="col-xl-11 col-md-12 pr-xxl-9 pr-xl-10 pr-lg-20">
                                  <div className="">
                                    <span className="font-weight-semibold font-size-4 text-black-2 mb-2">
                                      Job intro
                                    </span>
                                    <p className="font-size-4 text-black-2 mb-10">
                                      {gContext.jobDetails?.short_description}
                                    </p>
                                  </div>
                                  <div className="">
                                    <span className="font-size-4 font-weight-semibold text-black-2 mb-2">
                                      Job Description:
                                    </span>
                                    <p className="font-size-4 text-black-2 mb-7">
                                      {gContext.jobDetails?.long_description}
                                    </p>
                                    {canEdit && !isUserApplicant ? (
                                      <div className="card-btn-group">
                                        <a
                                          className="btn btn-green text-uppercase btn-medium rounded-3 w-180 mr-4 mb-5"
                                          onClick={() =>
                                            handleEditJobPost(
                                              new PublicKey(jobId)
                                            )
                                          }
                                        >
                                          {"Edit Job"}
                                        </a>
                                      </div>
                                    ) : isUserApplicant ? (
                                      <a
                                        className="btn btn-green text-uppercase btn-medium w-180 h-px-48 rounded-3 mr-4 mt-6"
                                        onClick={() =>
                                          // !gContext.hasCandidateAppliedForJob &&
                                          applyForJob(
                                            jobDetails?.pubkey,
                                            jobDetails?.company_pubkey
                                          )
                                        }
                                      >
                                        {applied
                                          ? "Applied"
                                          : "Apply to this job"}
                                      </a>
                                    ) : (
                                      <></>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        </Tab.Pane>
                        <Tab.Pane eventKey={"jobs"} className="py-8 pr-4">
                          {companyPostedJobs &&
                          companyPostedJobs.filter(
                            (job) => job.pubkey.toString() !== jobId
                          ).length > 0 ? (
                            companyPostedJobs
                              .filter((job) => job.pubkey.toString() !== jobId)
                              ?.map((job, index) => (
                                <div
                                  className="pt-9 px-xl-9 px-lg-7 px-7 pb-7 light-mode-texts bg-white rounded hover-shadow-3 hover-border-green mt-4"
                                  style={{
                                    border: "1px solid #e5e5e5",
                                  }}
                                >
                                  <div className="row">
                                    <div className="col-md-6">
                                      <div className="media align-items-center">
                                        <div className="square-72 d-block mr-8">
                                          <img
                                            src={
                                              job?.parsedInfo?.company_info
                                                ?.logo_uri
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
                                            {job?.jobTitle}
                                          </h3>
                                          <span className="font-size-3 text-default-color line-height-2 d-block">
                                            {job?.parsedInfo?.company_info?.name?.toUpperCase()}
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
                                          <span className="text-primary mr-2">
                                            {job?.parsedInfo?.currency}{" "}
                                          </span>
                                          <span className="text-black-2">
                                            {` ${Number(
                                              job?.parsedInfo?.min_salary
                                            )} -
                                    ${Number(job?.parsedInfo?.max_salary)}`}
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="row pt-8">
                                    <div className="col-md-7">
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
                                            {job?.parsedInfo
                                              ?.job_location_type === "remote"
                                              ? "Remote"
                                              : `${job?.parsedInfo?.city}, ${job?.parsedInfo?.country}`}
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
                                            {job?.parsedInfo?.job_type}
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
                                              moment(new Date()).fromNow()
                                            }
                                          </span>
                                        </li>
                                      </ul>
                                      <ul className="d-flex list-unstyled mr-n3 flex-wrap mr-n8 justify-content-md-end">
                                        <li className="mt-2 mr-8 font-size-small text-black-2 d-flex">
                                          <span className="mr-4">
                                            Categories:
                                          </span>
                                          <span className="font-weight-semibold">
                                            {job?.parsedInfo?.category.join(
                                              ","
                                            )}
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
                                      href={`/job-details/${job?.pubkey?.toString()}`}
                                    >
                                      <a className="btn btn-green text-uppercase btn-medium rounded-3">
                                        View Job
                                      </a>
                                    </Link>
                                    <a
                                      className="btn btn-outline-green text-uppercase btn-medium rounded-3 ml-3"
                                      href={`https://explorer.solana.com/address/${job?.pubkey?.toString()}?cluster=devnet`}
                                      target="_blank"
                                    >
                                      <i className="fa fa-globe mr-3"></i>
                                      View on chain
                                    </a>
                                  </div>
                                </div>
                              ))
                          ) : (
                            <h5
                              className="pl-9"
                              style={{
                                color: "#808080",
                                fontWeight: "normal",
                                justifyContent: "center",
                                display: "flex",
                                alignItems: "center",
                                height: "300px",
                                textTransform: "uppercase",
                              }}
                            >
                              No other jobs
                            </h5>
                          )}

                          {!companyPostedJobs && <h5>No jobs found</h5>}
                        </Tab.Pane>
                      </Tab.Content>
                    </Tab.Container>
                    {/* <!-- End Single Featured Job --> */}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </PageWrapper>
    </>
  );
}
