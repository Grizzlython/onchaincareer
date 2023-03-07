import React from "react";
import Link from "next/link";
import PageWrapper from "../../components/PageWrapper";

import imgF1 from "../../assets/image/l2/png/featured-job-logo-1.png";
import iconD from "../../assets/image/svg/icon-dolor.svg";
import iconB from "../../assets/image/svg/icon-briefcase.svg";
import iconL from "../../assets/image/svg/icon-location.svg";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useContext } from "react";
import GlobalContext from "../../context/GlobalContext";
import moment from "moment";
import { toast } from "react-toastify";
import { PublicKey } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getCompanyInfo } from "../../utils/web3/web3_functions";
import { BN } from "bn.js";

export default function JobDetails() {
  const router = useRouter();
  const { jobId } = router.query;

  const gContext = useContext(GlobalContext);

  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    if (!publicKey) {
      router.push("/");
      toast("⚠️ Please connect your wallet");
    }
  }, [publicKey]);

  useEffect(() => {
    const jobPubKey = new PublicKey(jobId);
    gContext.getJobDetails(jobPubKey, connection);
    // console.log(gContext.candidateProfile[0]?.id, "candidateProfile");

    // if (gContext.user && gContext.jobDetails) {
    //   // gContext.getIfCandidateHasAppliedForJob(gContext.user?.username, jobId);
    //   // gContext.getIfCandidateHasSavedJob(gContext.user?.username, jobId);
    // }
  }, [jobId]);

  const applyForJob = async (job_number, companyPubKey) => {
    if (!publicKey) {
      toast("⚠️ Please connect your wallet");
      return;
    }

    const applyJobWorkflowInfo = {
      status: "applied", //16 => 'saved' or 'applied' or 'in_progress' or 'accepted' or 'rejected' or 'withdraw'
      job_applied_at: new BN(new Date().getTime()), //8 => timestamp in unix format
      last_updated_at: new BN(new Date().getTime()), //8 => timestamp in unix format
    };

    console.log("In here");

    const companyInfo = await getCompanyInfo(companyPubKey, connection);
    const company_seq_number = companyInfo.company_seq_number;

    console.log(companyInfo, "companyInfo");

    await gContext.addJobApplication(
      publicKey,
      connection,
      signTransaction,
      applyJobWorkflowInfo,
      company_seq_number,
      job_number
    );
    // const payload = {
    //   username: gContext.user?.username,
    //   candidateId: gContext.candidateProfile[0]?.id,
    //   jobListingId: jobListingId,
    //   companyName: companyName,
    //   status: "PENDING",
    // };
    // if (!gContext.user) {
    //   gContext.toggleSignInModal();
    //   toast.error("⚠️ Please sign in to apply for a job");
    // } else {
    //   if (gContext.user && gContext.user?.isOverviewComplete === true) {
    //     gContext.addJobApplication(payload);
    //   } else {
    //     toast.error("⚠️ Please complete your profile to apply for a job");
    //     //TODO: navigate to user profile page
    //   }
    // }
  };

  const saveThisJob = (jobListingId, companyName) => {
    // const payload = {
    //   username: gContext.user?.username,
    //   jobListingId: jobListingId,
    //   companyName: companyName,
    // };
    // if (!gContext.user) {
    //   gContext.toggleSignInModal();
    //   toast.error("⚠️ Please sign in to save this job");
    // }
    // if (gContext.user && gContext.user?.isOverviewComplete === true) {
    //   gContext.saveJob(payload);
    // } else {
    //   toast.error("⚠️ Please complete your profile to save this job");
    // }
  };

  return (
    <>
      <PageWrapper headerConfig={{ button: "profile" }}>
        <div className="jobDetails-section bg-default-1 pt-28 pt-lg-27 pb-xl-25 pb-12">
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
                  <div className="pt-9 pl-sm-9 pl-5 pr-sm-9 pr-5 pb-8 border-bottom border-width-1 border-default-color light-mode-texts">
                    <div className="row">
                      <div className="col-md-6">
                        {/* <!-- media start --> */}
                        <div className="media align-items-center">
                          {/* <!-- media logo start --> */}
                          <div className="square-72 d-block mr-8">
                            <img
                              src={imgF1.src}
                              alt=""
                              style={{
                                width: "75px",
                                height: "75px",
                              }}
                            />
                          </div>
                          {/* <!-- media logo end --> */}
                          {/* <!-- media texts start --> */}
                          <div>
                            <h3 className="font-size-6 mb-0">
                              {gContext.jobDetails?.job_title}
                            </h3>
                            <span className="font-size-3 text-gray line-height-2">
                              {gContext.jobDetails?.companyName?.toUpperCase()}
                            </span>
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
                            {moment(gContext.jobDetails?.createdAt).format(
                              "DD MMM YYYY"
                            )}
                          </p>
                        </div>
                        {/* <!-- media date end --> */}
                      </div>
                    </div>
                    <div className="row pt-9">
                      <div className="col-12">
                        {/* <!-- card-btn-group start --> */}
                        <div className="card-btn-group">
                          <a
                            className="btn btn-green text-uppercase btn-medium rounded-3 w-180 mr-4 mb-5"
                            onClick={() =>
                              // !gContext.hasCandidateAppliedForJob &&
                              applyForJob(
                                gContext.jobDetails?.job_number,
                                gContext.jobDetails?.company_pubkey
                              )
                            }
                          >
                            {gContext.hasCandidateAppliedForJob
                              ? "Applied"
                              : "Apply to this job"}
                          </a>

                          <a
                            className="btn btn-outline-mercury text-black-2 text-uppercase h-px-48 rounded-3 mb-5 px-5"
                            onClick={() =>
                              !gContext.hasCandidateSavedJob &&
                              saveThisJob(
                                jobId,
                                gContext.jobDetails?.companyName
                              )
                            }
                          >
                            {gContext.hasCandidateSavedJob ? (
                              <a className="bookmark-button toggle-item font-size-6 line-height-reset px-0 mr-3  text-default-color  clicked"></a>
                            ) : (
                              <i className="icon icon-bookmark-2 font-weight-bold mr-4 font-size-4"></i>
                            )}

                            {gContext.hasCandidateSavedJob
                              ? "Saved"
                              : "Save job"}
                          </a>
                        </div>
                        {/* <!-- card-btn-group end --> */}
                      </div>
                    </div>
                  </div>
                  {/* <!-- End Single Featured Job --> */}
                  <div className="job-details-content pt-8 pl-sm-9 pl-6 pr-sm-9 pr-6 pb-10 border-bottom border-width-1 border-default-color light-mode-texts">
                    <div className="row mb-7">
                      <div className="col-md-4 mb-md-0 mb-6">
                        <div className="media justify-content-md-start">
                          <div className="image mr-5">
                            <img src={iconD.src} alt="" />
                          </div>
                          <p className="font-weight-semibold font-size-5 text-black-2 mb-0">
                            {Number(gContext.jobDetails?.min_salary) +
                              "-" +
                              Number(gContext.jobDetails?.max_salary)}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-4 pr-lg-0 pl-lg-10 mb-md-0 mb-6">
                        <div className="media justify-content-md-start">
                          <div className="image mr-5">
                            <img src={iconB.src} alt="" />
                          </div>
                          <p className="font-weight-semibold font-size-5 text-black-2 mb-0">
                            {gContext.jobDetails?.job_type}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-4 pl-lg-0">
                        <div className="media justify-content-md-start">
                          <div className="image mr-5">
                            <img src={iconL.src} alt="" />
                          </div>
                          <p className="font-size-5 text-gray mb-0">
                            {gContext.jobDetails?.jobLocationType === "remote"
                              ? "Remote"
                              : `${gContext.jobDetails?.city} , ${gContext.jobDetails?.country}`}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-4 mb-lg-0 mb-10">
                        <div className="">
                          <span className="font-size-4 d-block mb-4 text-gray">
                            Career Level
                          </span>
                          <h6 className="font-size-5 text-black-2 font-weight-semibold mb-9">
                            {gContext.jobDetails?.category}
                          </h6>
                        </div>
                        <div className="tags">
                          <p className="font-size-4 text-gray mb-0">
                            Soft Skill
                          </p>
                          <ul className="list-unstyled mr-n3 mb-0">
                            <li className="d-block font-size-4 text-black-2 mt-2">
                              <span className="d-inline-block mr-2">•</span>
                              Slack
                            </li>
                            <li className="d-block font-size-4 text-black-2 mt-2">
                              <span className="d-inline-block mr-2">•</span>
                              Basic English
                            </li>
                            <li className="d-block font-size-4 text-black-2 mt-2">
                              <span className="d-inline-block mr-2">•</span>Well
                              Organized
                            </li>
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
                          <span className="font-size-4 d-block mb-4 text-gray">
                            Required experience
                          </span>
                          <h6 className="font-size-5 text-black-2 font-weight-semibold mb-9">
                            {Number(gContext.jobDetails?.experience_in_months) /
                              12 +
                              " Years"}
                          </h6>
                        </div>
                        <div className="tags">
                          <p className="font-size-4 text-gray mb-3">
                            Technical Skill
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
                          <span className="font-size-4 d-block mb-4 text-gray">
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
                          <p className="mb-4 font-size-4 text-gray">
                            Job intro
                          </p>
                          <p className="font-size-4 text-black-2 mb-7">
                            {gContext.jobDetails?.short_description}
                          </p>
                        </div>
                        <div className="">
                          <span className="font-size-4 font-weight-semibold text-black-2 mb-7">
                            Job Description:
                          </span>
                          <p className="font-size-4 text-black-2 mb-7">
                            {gContext.jobDetails?.long_description}
                          </p>

                          <a
                            className="btn btn-green text-uppercase btn-medium w-180 h-px-48 rounded-3 mr-4 mt-6"
                            onClick={() =>
                              !gContext.hasCandidateAppliedForJob &&
                              applyForJob(
                                jobId,
                                gContext.jobDetails?.companyName
                              )
                            }
                          >
                            {gContext.hasCandidateAppliedForJob
                              ? "Applied"
                              : "Apply to this job"}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
