import React, { useContext, useState } from "react";
import Link from "next/link";
import PageWrapper from "../components/PageWrapper";
import { Select } from "../components/Core";
import GlobalContext from "../context/GlobalContext";

import imgP1 from "../assets/image/table-one-profile-image-1.png";
import moment from "moment";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WORKFLOW_STATUSES_enum } from "../utils/web3/struct_decoders/jobsonchain_constants_enum";
import { BN } from "bn.js";
import Loader from "../components/Loader";

export default function DashboardApplicants() {
  const router = useRouter();
  const gContext = useContext(GlobalContext);

  const [appliedCandidates, setAppliedCandidates] = useState([]);

  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const { allAppliedApplicants, loading } = gContext;

  useEffect(() => {
    if (
      !gContext.user ||
      gContext.user?.isProfileComplete === false ||
      !gContext.user?.userType === "recruiter" ||
      !publicKey
    ) {
      router.push("/");
      toast("⚠️ Not allowed to view this page");
      return;
    }
  }, [publicKey]);

  useEffect(() => {
    if (allAppliedApplicants) {
      setAppliedCandidates(
        allAppliedApplicants[WORKFLOW_STATUSES_enum.APPLIED]
      );
    }
  }, [allAppliedApplicants]);

  const jobTitles = gContext.companyPostedJobs?.map((job) => {
    return {
      value: job?.pubkey.toString(),
      label: job?.parsedInfo?.job_title,
    };
  });

  const handleRejectApplicant = async (job_number, companyInfoAccount) => {
    try {
      const jobWorkflowInfo = {
        status: WORKFLOW_STATUSES_enum.REJECTED, //16 => 'saved' or 'applied' or 'in_progress' or 'accepted' or 'rejected' or 'withdraw'
        job_applied_at: new BN(new Date().getTime()), //8 => timestamp in unix format
        last_updated_at: new BN(new Date().getTime()), //8 => timestamp in unix format
      };
      await gContext.updateJobApplication(
        publicKey,
        connection,
        signTransaction,
        jobWorkflowInfo,
        job_number,
        companyInfoAccount
      );
    } catch (err) {
      console.log(err);
    }
  };

  const viewCandidateProfile = (workflow) => {
    if (!workflow) return;
    gContext.fetchAndSetWorkflowInfo(workflow.pubkey, connection);
    router.push(`/candidate/${workflow.pubkey}`);
  };

  return (
    <>
      <PageWrapper
        headerConfig={{
          button: "profile",
          isFluid: true,
          bgClass: "bg-default",
          reveal: false,
        }}
      >
        <div className="dashboard-main-container mt-25 mt-lg-31">
          <div className="container">
            <div className="mb-14">
              <div className="row mb-11 align-items-center">
                <div className="col-lg-6 mb-lg-0 mb-4">
                  <h3 className="font-size-6 mb-0">
                    Applicants List ({appliedCandidates?.length})
                  </h3>
                </div>
                <div className="col-lg-6">
                  <div className="d-flex flex-wrap align-items-center justify-content-lg-end">
                    <p className="font-size-4 mb-0 mr-6 py-2">Filter by Job:</p>
                    <div className="h-px-48">
                      <Select
                        options={jobTitles}
                        className="pl-0 h-100 arrow-3 arrow-3-black min-width-px-273  text-black-2 d-flex align-items-center w-100"
                        border={false}
                        // onClick={handleSelectJob}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white shadow-8 pt-7 rounded pb-8 px-11">
                <div className="table-responsive">
                  {loading ? (
                    <Loader />
                  ) : (
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="pl-0  border-0 font-size-4 font-weight-normal"
                          >
                            Name
                          </th>
                          <th
                            scope="col"
                            className="border-0 font-size-4 font-weight-normal"
                          >
                            Job Title
                          </th>
                          <th
                            scope="col"
                            className="border-0 font-size-4 font-weight-normal"
                          >
                            Applied On
                          </th>
                          <th
                            scope="col"
                            className="border-0 font-size-4 font-weight-normal"
                          ></th>
                          <th
                            scope="col"
                            className="border-0 font-size-4 font-weight-normal"
                          ></th>
                          <th
                            scope="col"
                            className="border-0 font-size-4 font-weight-normal"
                          ></th>
                        </tr>
                      </thead>
                      <tbody>
                        {appliedCandidates?.length > 0 ? (
                          appliedCandidates?.map((item, index) => (
                            <tr className="border border-color-2" key={index}>
                              <th
                                scope="row"
                                className="pl-6 border-0 py-7 pr-0"
                              >
                                <a
                                  className="media min-width-px-235 align-items-center"
                                  onClick={() => viewCandidateProfile(item)}
                                >
                                  <div className="circle-36 mr-6">
                                    <img
                                      src={imgP1.src}
                                      alt=""
                                      className="w-100"
                                    />
                                  </div>
                                  <h4 className="font-size-4 mb-0 font-weight-semibold text-black-2">
                                    {item?.applicantInfo?.name}
                                  </h4>
                                </a>
                              </th>
                              <td className="table-y-middle py-7 min-width-px-235 pr-0">
                                <h3 className="font-size-4 font-weight-normal text-black-2 mb-0">
                                  {item?.jobInfo?.job_title}
                                </h3>
                              </td>
                              <td className="table-y-middle py-7 min-width-px-170 pr-0">
                                <h3 className="font-size-4 font-weight-normal text-black-2 mb-0">
                                  {moment(
                                    new Date(Number(item?.job_applied_at))
                                  ).format("DD MMM YYYY")}
                                </h3>
                              </td>
                              <td className="table-y-middle py-7 min-width-px-170 pr-0">
                                <div className="">
                                  <a
                                    className="font-size-3 font-weight-bold text-black-2 text-uppercase"
                                    onClick={() => viewCandidateProfile(item)}
                                  >
                                    View Applicant
                                  </a>
                                </div>
                              </td>
                              <td className="table-y-middle py-7 min-width-px-110 pr-0">
                                <div className="">
                                  <Link
                                    href={`/job-details/${item?.job_pubkey.toString()}`}
                                  >
                                    <a className="font-size-3 font-weight-bold text-green text-uppercase">
                                      View Job Post
                                    </a>
                                  </Link>
                                </div>
                              </td>
                              <td className="table-y-middle py-7 min-width-px-100 pr-0">
                                <div className="">
                                  {/* <Link href="/#"> */}
                                  <a
                                    className="font-size-3 font-weight-bold text-red-2 text-uppercase"
                                    onClick={() => {
                                      handleRejectApplicant(
                                        item?.jobInfo?.job_number,
                                        item?.company_pubkey
                                      );
                                    }}
                                    style={{ cursor: "pointer" }}
                                  >
                                    Reject
                                  </a>
                                  {/* </Link> */}
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          // <tr className="border border-color-2">
                          //   <td className="table-y-middle py-7 min-width-px-235 pr-0">
                          //     <h3 className="font-size-4 font-weight-normal text-black-2 mb-0"></h3>
                          //   </td>
                          //   <td className="table-y-full py-7 pr-0">
                          //     <h3 className="font-size-4 font-weight-normal text-black-2 mb-0">
                          //       No Applicants yet
                          //     </h3>
                          //   </td>
                          //   <td className="table-y-middle py-7 pr-0">
                          //     <h3 className="font-size-4 font-weight-normal text-black-2 mb-0"></h3>
                          //   </td>
                          //   <td className="table-y-middle py-7 pr-0">
                          //     <h3 className="font-size-4 font-weight-normal text-black-2 mb-0"></h3>
                          //   </td>
                          //   <td className="table-y-middle py-7 pr-0">
                          //     <h3 className="font-size-4 font-weight-normal text-black-2 mb-0"></h3>
                          //   </td>
                          //   <td className="table-y-middle py-7 pr-0">
                          //     <h3 className="font-size-4 font-weight-normal text-black-2 mb-0"></h3>
                          //   </td>
                          // </tr>
                          <div style={{
                            textAlign: "center",
                            padding: "50px 20px",
                            fontSize: "20px",
                            fontWeight: "normal",
                            width:"225%",
                            background:"#eee"
                          }}>
                            No Applicants yet
                          </div>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
                {appliedCandidates && appliedCandidates?.length > 0 && <div className="pt-2">
                  <nav aria-label="Page navigation example">
                    <ul className="pagination pagination-hover-primary rounded-0 ml-n2">
                      <li className="page-item rounded-0 flex-all-center">
                        <Link href="/#">
                          <a
                            className="page-link rounded-0 border-0 px-3active"
                            aria-label="Previous"
                          >
                            <i className="fas fa-chevron-left"></i>
                          </a>
                        </Link>
                      </li>
                      <li className="page-item">
                        <Link href="/#">
                          <a className="page-link border-0 font-size-4 font-weight-semibold px-3">
                            1
                          </a>
                        </Link>
                      </li>
                      <li className="page-item">
                        <Link href="/#">
                          <a className="page-link border-0 font-size-4 font-weight-semibold px-3">
                            2
                          </a>
                        </Link>
                      </li>
                      <li className="page-item">
                        <Link href="/#">
                          <a className="page-link border-0 font-size-4 font-weight-semibold px-3">
                            3
                          </a>
                        </Link>
                      </li>
                      <li className="page-item disabled">
                        <Link href="/#">
                          <a className="page-link border-0 font-size-4 font-weight-semibold px-3">
                            ...
                          </a>
                        </Link>
                      </li>
                      <li className="page-item ">
                        <Link href="/#">
                          <a className="page-link border-0 font-size-4 font-weight-semibold px-3">
                            7
                          </a>
                        </Link>
                      </li>
                      <li className="page-item rounded-0 flex-all-center">
                        <Link href="/#">
                          <a
                            className="page-link rounded-0 border-0 px-3"
                            aria-label="Next"
                          >
                            <i className="fas fa-chevron-right"></i>
                          </a>
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>
            }
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
