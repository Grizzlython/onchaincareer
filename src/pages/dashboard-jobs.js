import React from "react";
import Link from "next/link";
import PageWrapper from "../components/PageWrapper";
import { Select } from "../components/Core";
import { useContext } from "react";
import GlobalContext from "../context/GlobalContext";
import moment from "moment";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const defaultJobs = [
  { value: "pd", label: "Product Designer" },
  { value: "gd", label: "Graphics Designer" },
  { value: "fd", label: "Frontend Developer" },
  { value: "bd", label: "Backend Developer" },
  { value: "cw", label: "Content Writer" },
];

export default function DashboardJobs() {
  const router = useRouter();
  const gContext = useContext(GlobalContext);

  useEffect(() => {
    if (
      !gContext.user ||
      gContext.user?.isProfileComplete === false ||
      !gContext.user?.userType === "recruiter"
    ) {
      router.push("/");
      toast("⚠️ Not allowed to view this page");
    }
  }, []);
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
                    Posted Jobs ({gContext.companyPostedJobs?.length})
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
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="pl-0 border-0 font-size-4 font-weight-normal"
                        >
                          Name
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
                      {gContext.companyPostedJobs?.map((job, index) => (
                        <tr className="border border-color-2" key={index}>
                          <th
                            scope="row"
                            className="pl-6 border-0 py-7 min-width-px-235"
                          >
                            <div className="">
                              <Link href={`/job-details/${job.id}`}>
                                <a className="font-size-4 mb-0 font-weight-semibold text-black-2">
                                  {job.title}
                                </a>
                              </Link>
                            </div>
                          </th>
                          <td className="table-y-middle py-7 min-width-px-135">
                            <h3 className="font-size-4 font-weight-normal text-black-2 mb-0">
                              {job.jobType}
                            </h3>
                          </td>
                          <td className="table-y-middle py-7 min-width-px-125">
                            <h3 className="font-size-4 font-weight-normal text-black-2 mb-0">
                              {job.jobLocationType === "remote"
                                ? "Remote"
                                : `${job.city} , ${job.country}`}
                            </h3>
                          </td>
                          <td className="table-y-middle py-7 min-width-px-155">
                            <h3 className="font-size-4 font-weight-normal text-black-2 mb-0">
                              {moment(job.createdAt).format("DD MMM YYYY")}
                            </h3>
                          </td>
                          <td className="table-y-middle py-7 min-width-px-155">
                            <h3 className="font-size-4 font-weight-normal text-black-2 mb-0">
                              {job.totalApplicants}
                            </h3>
                          </td>

                          <td className="table-y-middle py-7 min-width-px-80">
                            <a
                              href="/#"
                              className="font-size-3 font-weight-bold text-green text-uppercase"
                            >
                              Edit
                            </a>
                          </td>
                          <td className="table-y-middle py-7 min-width-px-100">
                            <a
                              href="/#"
                              className="font-size-3 font-weight-bold text-red-2 text-uppercase"
                            >
                              Delete
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
