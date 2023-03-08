import React from "react";
import Link from "next/link";
import PageWrapper from "../components/PageWrapper";
import { Select } from "../components/Core";
import { useContext } from "react";
import GlobalContext from "../context/GlobalContext";
import moment from "moment";
import { useEffect } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import Loader from "../components/Loader";

const defaultJobs = [
  { value: "pd", label: "Product Designer" },
  { value: "gd", label: "Graphics Designer" },
  { value: "fd", label: "Frontend Developer" },
  { value: "bd", label: "Backend Developer" },
  { value: "cw", label: "Content Writer" },
];

export default function DashboardJobs() {
  const gContext = useContext(GlobalContext);
  const { connection } = useConnection();
  const {
    companyPostedJobs,
    companySelectedByUser,
    selectedCompanyInfo: selectedCompanyInfoContext,
    loading,
  } = gContext;

  // const [postedJobs, setPostedJobs] = useState([]);

  // useEffect(() => {
  //   if (!companySelectedByUser && !companyPostedJobs) return;
  //   setPostedJobs(companyPostedJobs);
  // }, [companySelectedByUser, companyPostedJobs]);

  const getAllJobWorkflows = async (jobpost_info_account) => {
    const jobWorkflows = await gContext.getAllWorkflowsOfJob(
      jobpost_info_account,
      connection
    );
    // return jobWorkflows;
  };

  const handleEditJobPost = async (jobpost_info_account) => {
    try {
      await gContext.getJobDetails(jobpost_info_account, connection);
      gContext.toggleJobPostModal();
    } catch (error) {
      console.log(error);
    }
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
            <div className="mb-18">
              <div className="row mb-11 align-items-center">
                <div className="col-lg-6 mb-lg-0 mb-4">
                  <h3 className="font-size-6 mb-0">
                    Posted Jobs (
                    {companyPostedJobs && companyPostedJobs?.length})
                  </h3>
                </div>
                <div className="col-lg-6">
                  <div className="d-flex flex-wrap align-items-center justify-content-lg-end">
                    <p className="font-size-4 mb-0 mr-6 py-2">Filter by Job:</p>
                    <div className="h-px-48">
                      <Select
                        options={defaultJobs}
                        className="pl-0 h-100 arrow-3 arrow-3-black min-width-px-273  text-black-2 d-flex align-items-center w-100"
                        border={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white shadow-8 pt-7 rounded pb-9 px-11">
                <div className="table-responsive ">
                  {loading ? (
                    <Loader />
                  ) : (
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="pl-0 border-0 font-size-4 font-weight-normal"
                          >
                            Job Title
                          </th>
                          <th
                            scope="col"
                            className="pl-4 border-0 font-size-4 font-weight-normal"
                          >
                            Job Type
                          </th>
                          <th
                            scope="col"
                            className="pl-4 border-0 font-size-4 font-weight-normal"
                          >
                            City
                          </th>
                          <th
                            scope="col"
                            className="pl-4 border-0 font-size-4 font-weight-normal"
                          >
                            Created on
                          </th>
                          <th
                            scope="col"
                            className="pl-4 border-0 font-size-4 font-weight-normal"
                          >
                            Is Archived
                          </th>
                          <th
                            scope="col"
                            className="pl-4 border-0 font-size-4 font-weight-normal"
                          >
                            Total Applicants
                          </th>
                          <th
                            scope="col"
                            className="pl-4 border-0 font-size-4 font-weight-normal"
                          ></th>
                          <th
                            scope="col"
                            className="pl-4 border-0 font-size-4 font-weight-normal"
                          ></th>
                        </tr>
                      </thead>
                      <tbody>
                        {companyPostedJobs && companyPostedJobs.length > 0 ? (
                          companyPostedJobs?.map((job, index) => (
                            <tr className="border border-color-2" key={index}>
                                <td className="table-y-middle py-7 min-width-px-235">
                                  <Link
                                    href={`
                                   /job-details/${job?.pubkey.toString()}
                                  `}
                                  >
                                    <a className="font-size-4 mb-0 font-weight-semibold text-black-2">
                                      {job?.parsedInfo?.job_title}
                                    </a>
                                  </Link>
                                  </td>
                              <td className="table-y-middle py-7 min-width-px-135">
                                <h3 className="font-size-4 font-weight-normal text-black-2 mb-0">
                                  {job?.parsedInfo?.job_type}
                                </h3>
                              </td>
                              <td className="table-y-middle py-7 min-width-px-125">
                                <h3 className="font-size-4 font-weight-normal text-black-2 mb-0">
                                  {job?.parsedInfo?.jobLocationType === "remote"
                                    ? "Remote"
                                    : `${job?.parsedInfo?.city} , ${job?.parsedInfo?.country}`}
                                </h3>
                              </td>
                              <td className="table-y-middle py-7 min-width-px-155">
                                <h3 className="font-size-4 font-weight-normal text-black-2 mb-0">
                                  {moment(new Date()).format("DD MMM YYYY")}
                                </h3>
                              </td>
                              <td className="table-y-middle py-7 min-width-px-125">
                                <h3 className="font-size-4 font-weight-normal text-black-2 mb-0">
                                  {job?.archived ? "True" : "False"}
                                </h3>
                              </td>
                              <td className="table-y-middle py-7 min-width-px-155">
                                {/* <h3 className="font-size-4 font-weight-normal text-black-2 mb-0">
                              {job.totalApplicants}
                            </h3> */}
                                {gContext.allWorkflowsOfJob ? (
                                  gContext.allWorkflowsOfJob
                                ) : (
                                  <Link
                                    href={`/dashboard-applicants?job=${job?.pubkey.toString()}`}
                                  >
                                    <a
                                      className=" py-1 my-5 font-size-4 font-weight-semibold flex-y-center"
                                      style={{
                                        cursor: "pointer",
                                      }}
                                      // onClick={() =>
                                      //   getAllJobWorkflows(job?.pubkey)
                                      // }
                                    >
                                      <i className="fas fa-eye mr-2"></i>View
                                    </a>
                                  </Link>
                                )}
                              </td>

                              <td className="table-y-middle py-7 min-width-px-80">
                                <a
                                  className="font-size-3 font-weight-bold text-green text-uppercase"
                                  onClick={() => {
                                    handleEditJobPost(job?.pubkey);
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  <i className="fas fa-pen mr-2"></i>
                                  Edit Job
                                </a>
                              </td>
                              <td className="table-y-middle py-7 min-width-px-10">
                                
                              </td>
                            </tr>
                          ))
                        ) : (
                          <div
                            style={{
                              marginTop: "50px",
                            }}
                          >
                            <p>
                              No <strong>posted</strong> jobs
                            </p>
                          </div>
                        )}
                      </tbody>
                    </table>
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
