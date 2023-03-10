import React, { useContext, useState } from "react";
import Link from "next/link";
import PageWrapper from "../../components/PageWrapper";
import { Select } from "../../components/Core";
import GlobalContext from "../../context/GlobalContext";

import imgP1 from "../../assets/image/table-one-profile-image-1.png";
import inProgress from "../../assets/image/svg/in-progress.svg";
import accept from "../../assets/image/svg/accept.svg";
import reject from "../../assets/image/svg/reject.svg";
import moment from "moment";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WORKFLOW_STATUSES_enum } from "../../utils/web3/struct_decoders/jobsonchain_constants_enum";
import { BN } from "bn.js";
import Tippy from "@tippyjs/react";
import Loader from "../../components/Loader";
import { PublicKey } from "@solana/web3.js";

export default function DashboardApplicants() {
  const router = useRouter();
  const gContext = useContext(GlobalContext);

  const { applicantStatusParam } = router.query;

  const [appliedCandidates, setAppliedCandidates] = useState([]);
  const [filter, setFilter] = useState("");
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [applicantStatus, setApplicantStatus] = useState([
    {
      value: WORKFLOW_STATUSES_enum.APPLIED,
      label: "Applied",
    },
    {
      value: WORKFLOW_STATUSES_enum.IN_PROGRESS,
      label: "In Progress",
    },
    {
      value: WORKFLOW_STATUSES_enum.REJECTED,
      label: "Rejected",
    },
    {
      value: WORKFLOW_STATUSES_enum.ACCEPTED,
      label: "Accepted",
    },
  ]);

  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);

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
      toast("?????? Not allowed to view this page");
      return;
    }
  }, [publicKey]);

  useEffect(() => {
    if (allAppliedApplicants) {
      if (applicantStatusParam === "applied") {
        setAppliedCandidates(
          allAppliedApplicants[WORKFLOW_STATUSES_enum.APPLIED]
        );
      } else if (applicantStatusParam === "in-progress") {
        setAppliedCandidates(
          allAppliedApplicants[WORKFLOW_STATUSES_enum.IN_PROGRESS]
        );
      } else if (applicantStatusParam === "accepted") {
        setAppliedCandidates(
          allAppliedApplicants[WORKFLOW_STATUSES_enum.ACCEPTED]
        );
      } else if (applicantStatusParam === "rejected") {
        setAppliedCandidates(
          allAppliedApplicants[WORKFLOW_STATUSES_enum.REJECTED]
        );
      }
    }
  }, [allAppliedApplicants, applicantStatusParam]);
  console.log("allAppliedApplicants", appliedCandidates);

  const jobTitles = gContext.companyPostedJobs?.map((job) => {
    return {
      value: job?.pubkey.toString(),
      label: job?.parsedInfo?.job_title,
    };
  });

  const handleChangeApplicantStatus = async (
    jobInfoAccount,
    companyInfoAccount,
    event
  ) => {
    try {
      const statusSelected = event.value;
      console.log("job_number", jobInfoAccount);
      console.log("companyInfoAccount", companyInfoAccount);
      console.log("statusSelected", statusSelected);
      const companyStateAccount = new PublicKey(companyInfoAccount);

      const jobWorkflowInfo = {
        status: statusSelected, //16 => 'saved' or 'applied' or 'in_progress' or 'accepted' or 'rejected' or 'withdraw'
        // job_applied_at: new BN(new Date().getTime()), //8 => timestamp in unix format
        // last_updated_at: new BN(new Date().getTime()), //8 => timestamp in unix format
      };
      await gContext.updateJobApplication(
        publicKey,
        connection,
        signTransaction,
        jobWorkflowInfo,
        jobInfoAccount,
        companyStateAccount
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

  useEffect(() => {
    if (filter && filter.length > 0) {
      const filterRegex = new RegExp(filter, "i");
      const filteredApplicants = appliedCandidates.filter((applicant) => {
        console.log("applicant_in_regex", applicant);
        return (
          filterRegex.test(applicant?.applicantInfo?.name) ||
          filterRegex.test(applicant?.jobInfo?.job_title)
        );
      });
      console.log("filteredApplicants", filteredApplicants);
      setFilteredApplicants(filteredApplicants);
    } else {
      setFilteredApplicants(appliedCandidates);
    }
  }, [filter]);

  const [pages, setPages] = useState(0);
  useEffect(() => {
    if (appliedCandidates) {
      setPages(Math.ceil(appliedCandidates.length / 10));
    }
  }, [appliedCandidates]);

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
                      {/* <Select
                        options={jobTitles}
                        className="pl-0 h-100 arrow-3 arrow-3-black min-width-px-273  text-black-2 d-flex align-items-center w-100"
                        border={false}
                        // onClick={handleSelectJob}
                      /> */}
                      <input
                        type="text"
                        className="form-control h-px-48"
                        id="namedash"
                        placeholder="eg. Frontend Developer"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
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
                          >
                            Change applicant Status
                          </th>
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
                        {filteredApplicants?.length > 0 ? (
                          filteredApplicants
                            ?.slice(offset, limit)
                            ?.map((item, index) => (
                              <tr
                                className="border border-color-2"
                                key={index}
                                style={{
                                  minHeight: "1000px",
                                }}
                              >
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
                                <td className="table-y-middle py-5 min-width-px-100 pr-0">
                                  {/* <div
                                  style={{
                                    display: "flex",
                                  }}
                                >
                                  <Tippy content="In Progress">
                                    <i
                                      className="fa fa-spinner"
                                      aria-hidden="true"
                                      style={{
                                        color: "blue",
                                        cursor: "pointer",
                                        marginRight: "10px",
                                        fontSize: "32px",
                                      }}
                                      onClick={() =>
                                        handleChangeApplicantStatus(
                                          item?.jobInfo?.job_number,
                                          item?.company_pubkey,
                                          WORKFLOW_STATUSES_enum.IN_PROGRESS
                                        )
                                      }
                                    />
                                  </Tippy>
                                  <Tippy content="Accept">
                                    <i
                                      className="fa fa-check-circle"
                                      aria-hidden="true"
                                      style={{
                                        color: "green",
                                        cursor: "pointer",
                                        marginRight: "10px",
                                        fontSize: "32px",
                                      }}
                                      onClick={() => alert("accept")}
                                    />
                                  </Tippy>
                                  <Tippy content="Reject">
                                    <i
                                      className="fa fa-times-circle"
                                      aria-hidden="true"
                                      style={{
                                        color: "red",
                                        cursor: "pointer",
                                        fontSize: "32px",
                                      }}
                                      onClick={() => alert("reject")}
                                    />
                                  </Tippy>
                                  
                                </div> */}
                                  <Select
                                    options={[
                                      {
                                        value: WORKFLOW_STATUSES_enum.APPLIED,
                                        label: "APPLIED",
                                      },
                                      {
                                        value:
                                          WORKFLOW_STATUSES_enum.IN_PROGRESS,
                                        label: "IN PROGRESS",
                                      },
                                      {
                                        value: WORKFLOW_STATUSES_enum.ACCEPTED,
                                        label: "ACCEPTED",
                                      },
                                      {
                                        value: WORKFLOW_STATUSES_enum.REJECTED,
                                        label: "REJECTED",
                                      },
                                    ]}
                                    value={{
                                      value: item?.status,
                                      label: item?.status?.toUpperCase(),
                                    }}
                                    onChange={(e) =>
                                      handleChangeApplicantStatus(
                                        item?.job_pubkey,
                                        item?.company_pubkey,
                                        e
                                      )
                                    }
                                  />
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
                          <div
                            style={{
                              textAlign: "center",
                              padding: "50px 20px",
                              fontSize: "20px",
                              fontWeight: "normal",
                              width: "225%",
                              background: "#eee",
                            }}
                          >
                            No Applicants yet
                          </div>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
                {appliedCandidates &&
                  appliedCandidates?.length > 10 &&
                  pages.map((page, index) => (
                    <div className="pt-2">
                      <nav aria-label="Page navigation example">
                        <ul className="pagination pagination-hover-primary rounded-0 ml-n2">
                          <li className="page-item rounded-0 flex-all-center">
                            <a
                              className="page-link rounded-0 border-0 px-3active"
                              aria-label="Previous"
                            >
                              <i className="fas fa-chevron-left"></i>
                            </a>
                          </li>

                          <li className="page-item" key={index}>
                            <a
                              className="page-link border-0 font-size-4 font-weight-semibold px-3"
                              onClick={() =>
                                setOffset(page * 10, (page + 1) * 10)
                              }
                            >
                              {page + 1}
                            </a>
                          </li>

                          <li className="page-item rounded-0 flex-all-center">
                            <a
                              className="page-link rounded-0 border-0 px-3"
                              aria-label="Next"
                            >
                              <i className="fas fa-chevron-right"></i>
                            </a>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
