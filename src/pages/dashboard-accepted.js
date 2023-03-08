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
import { changeStasusOptions, WORKFLOW_STATUSES_enum } from "../utils/web3/struct_decoders/jobsonchain_constants_enum";
import Loader from "../components/Loader";
import { PublicKey } from "@solana/web3.js";

export default function DashboardApplicants() {
  const router = useRouter();
  const gContext = useContext(GlobalContext);

  const [filter, setFilter] = useState("");
  const [filteredApplicants, setFilteredApplicants] = useState([]);

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
    setFilteredApplicants([])
    if (allAppliedApplicants) {
      setFilteredApplicants(
        allAppliedApplicants[WORKFLOW_STATUSES_enum.ACCEPTED]
      );
    }
  }, [allAppliedApplicants]);

  const handleChangeApplicantStatus = async (
    applicantInfoAccount,
    jobInfoAccount,
    companyInfoAccount,
    event
  ) => {
    try {
      const statusSelected = event.value;
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
        companyStateAccount,
        applicantInfoAccount
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
      const filteredApplicants = allAppliedApplicants[
        WORKFLOW_STATUSES_enum.ACCEPTED
      ].filter((applicant) => {
        return (
          filterRegex.test(applicant?.applicantInfo?.name) ||
          filterRegex.test(applicant?.jobInfo?.job_title)
        );
      });
      setFilteredApplicants(filteredApplicants);
    } else {
      setFilteredApplicants(
        allAppliedApplicants[WORKFLOW_STATUSES_enum.ACCEPTED]
      );
    }
  }, [filter]);

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
                    Accepted applicants list ({filteredApplicants?.length})
                  </h3>
                </div>
                <div className="col-lg-6">
                  <div className="d-flex flex-wrap align-items-center justify-content-lg-end">
                    <p className="font-size-4 mb-0 mr-6 py-2">
                      Filter by name and title:
                    </p>
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
              <div
                className="bg-white shadow-8 pt-7 rounded pb-8"
                style={{
                  padding: "25px !important",
                }}
              >
                <div
                  className="table-responsive"
                  style={{
                    padding: "20px",
                    paddingBottom: "160px",
                  }}
                >
                  {loading ? (
                    <Loader />
                  ) : (filteredApplicants?.length > 0 ? (
                    <table className="table table-striped">
                      <thead>
                        <tr
                          style={{
                            backgroundColor: "#000000b8",
                          }}
                        >
                          <th
                            scope="col"
                            className="pl-0  border-0 font-size-4 font-weight-normal pl-6 text-white"
                          >
                            Candidate Name
                          </th>
                          <th
                            scope="col"
                            className="border-0 font-size-4 font-weight-normal text-white"
                          >
                            Job Title
                          </th>
                          <th
                            scope="col"
                            className="border-0 font-size-4 font-weight-normal text-white"
                          >
                            Applied On
                          </th>
                          <th
                            scope="col"
                            className="border-0 font-size-4 font-weight-normal text-white"
                          >
                            Change Applicant Status
                          </th>
                          <th
                            scope="col"
                            className="border-0 font-size-4 font-weight-normal text-white"
                          ></th>
                          <th
                            scope="col"
                            className="border-0 font-size-4 font-weight-normal text-white"
                          ></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredApplicants
                            ?.map((item, index) => (
                              <tr
                                className="border-bottom"
                                key={index}
                                style={{
                                  border: "0px !important",
                                }}
                              >
                                <th
                                  scope="row"
                                  className="pl-6 border-0 py-7 pr-0 border-0 selectedTableRow"
                                >
                                  <a
                                    className="media min-width-px-235 align-items-center"
                                    onClick={() => viewCandidateProfile(item)}
                                  >
                                    <div className="circle-36 mr-6">
                                      <img
                                        src={
                                          item?.applicantInfo?.image_uri &&
                                          item?.applicantInfo?.image_uri
                                            ?.length > 0
                                            ? item?.applicantInfo?.image_uri
                                            : imgP1.src
                                        }
                                        alt=""
                                        style={{
                                          height: "40px",
                                          width: "40px",
                                          objectFit: "cover",
                                          borderRadius: "50%",
                                        }}
                                      />
                                    </div>
                                    <h4 className="font-size-4 mb-0 font-weight-semibold text-black-2">
                                      {item?.applicantInfo?.name}
                                    </h4>
                                  </a>
                                </th>
                                <td className="table-y-middle py-7 min-width-px-235 pr-0 border-0">
                                  <h3 className="font-size-4 font-weight-normal text-black-2 mb-0">
                                    {item?.jobInfo?.job_title}
                                  </h3>
                                </td>
                                <td className="table-y-middle py-7 min-width-px-170 pr-0 border-0">
                                  <h3 className="font-size-4 font-weight-normal text-black-2 mb-0">
                                    {moment(
                                      new Date(Number(item?.job_applied_at))
                                    ).format("DD MMM YYYY")}
                                  </h3>
                                </td>
                                <td className="table-y-middle py-5 min-width-px-100 pr-0 border-0">
                                  <Select
                                    options={changeStasusOptions}
                                    value={{
                                      value: item?.status,
                                      label: item?.status?.toUpperCase(),
                                    }}
                                    onChange={(e) =>
                                      handleChangeApplicantStatus(
                                        item.user_pubkey,
                                        item?.job_pubkey,
                                        item?.company_pubkey,
                                        e
                                      )
                                    }
                                  />
                                </td>
                                <td
                                  className="table-y-middle py-7 min-width-px-170 pl-10 border-0 selectedTableRow"
                                  style={{
                                    paddingLeft: "20px !important",
                                    cursor: "pointer",
                                  }}
                                >
                                  <div className="">
                                    <a
                                      className="font-size-4 font-weight-semi-bold text-black-2 text-capitalize"
                                      onClick={() => viewCandidateProfile(item)}
                                    >
                                      View Applicant
                                    </a>
                                  </div>
                                </td>
                                <td
                                  className="table-y-middle py-7 min-width-px-110 border-0 selectedTableRow"
                                  style={{
                                    paddingRight: "10px !important",
                                    cursor: "pointer",
                                    minWidth: "140px !important",
                                  }}
                                >
                                  <div>
                                    <Link
                                      href={`/job-details/${item?.job_pubkey.toString()}`}
                                    >
                                      <a className="font-size-4 font-weight-semi-bold text-green text-capitalize">
                                        View Job Post
                                      </a>
                                    </Link>
                                  </div>
                                </td>
                              </tr>
                            ))
                        }
                      </tbody>
                    </table>):(
                      <div
                      style={{
                        textAlign: "center",
                        padding: "50px 20px",
                        fontSize: "20px",
                        fontWeight: "normal",
                        width: "100%",
                        background: "#eee",
                      }}
                    >
                      No Applicants found
                    </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
