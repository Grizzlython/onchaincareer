import React, { useContext, useState } from "react";
import Link from "next/link";
import CountUp from "react-countup";
import LazyLoad from "react-lazyload";
import SEO from "@bradgarropy/next-seo";
import PageWrapper from "../components/PageWrapper";
import GlobalContext from "../context/GlobalContext";
import Loader from "../components/Loader";

import { useEffect } from "react";
import { Chart as ChartJS, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";
import { publicKey } from "@project-serum/borsh";
import { useRouter } from "next/router";
ChartJS.register(...registerables);

export default function DashboardMain() {
  const gContext = useContext(GlobalContext);
  const [selectedCompanyInfo, setSelectedCompanyState] = useState({});
  const [barChartData, setBarChartData] = useState({});

  const {
    selectedCompanyInfo: selectedCompanyInfoContext,
    allAppliedApplicants,
    companyPostedJobs,
    loading,
  } = gContext;

  // useEffect(() => {
  //   if (!companySelectedByUser && !connection) return;

  //   console.log("I am rendered after change");

  //   console.log(companySelectedByUser, "companySelectedByUser");

  //   (async () => {
  //     console.log("In async");
  //     await gContext.fetchAndSetCompanyPostedJobs(
  //       companySelectedByUser.value,
  //       connection
  //     );
  //     await gContext.fetchAndSetAllAppliedApplicants(
  //       connection,
  //       companySelectedByUser?.value
  //     );
  //     await gContext.fetchAndSetCompanyPostedJobs(
  //       companySelectedByUser.value,
  //       connection
  //     );
  //   })();
  // }, [companySelectedByUser]);
  const router = useRouter();

  useEffect(() => {
    if (!publicKey) {
      router.push("/");
      return;
    }
  }, [publicKey]);

  useEffect(() => {
    if (
      selectedCompanyInfoContext &&
      Object.keys(selectedCompanyInfoContext).length
    ) {
      setSelectedCompanyState(selectedCompanyInfoContext);
    }
  }, [selectedCompanyInfoContext]);

  useEffect(() => {
    if (allAppliedApplicants) {
      const barData = {
        labels: [
          "POSTED JOBS",
          ...Object.keys(allAppliedApplicants).map((key) =>
            key.toUpperCase().split("_").join(" ")
          ),
        ],
        datasets: [
          {
            label: "Jobs by Statuses",
            backgroundColor: [
              "#E67E22",
              "#3498DB",
              "#27AE60",
              "#C0392B",
              "#F7DC6F",
            ],
            borderColor: [
              "#E67E22",
              "#3498DB",
              "#27AE60",
              "#C0392B",
              "#F7DC6F",
            ],
            borderWidth: 1,
            hoverBackgroundColor: "#0B5345",
            hoverBorderColor: "#0069b4",
            data: [
              (companyPostedJobs && companyPostedJobs.length) || 0,
              ...Object.keys(allAppliedApplicants).map(
                (key) => allAppliedApplicants[key].length
              ),
            ],
          },
        ],
      };
      setBarChartData(barData);
    }
  }, [allAppliedApplicants]);

  return (
    <>
      <SEO
        description="Search for your dream job on OnChainCareer's secure and decentralized job marketplace. Our cutting-edge blockchain technology ensures reliable and transparent job solutions for job seekers, employers, and stakeholders. Find your next career opportunity today!"
        keywords={[
          "OnChainCareer",
          "blockchain",
          "decentralized",
          "job marketplace",
          "job platform",
          "job search",
          "job listings",
          "job opportunities",
          "job seekers",
          "employers",
          "secure",
          "reliable",
          "transparent",
          "job solutions",
        ]}
      />
      <PageWrapper
        headerConfig={{
          button: "profile",
          isFluid: true,
          bgClass: "bg-default",
          reveal: false,
        }}
      >
        <div className="dashboard-main-container mt-25 mt-lg-31">
          {loading ? (
            <div
              style={{
                display: "grid",
                placeItems: "center",
                height: "70vh",
              }}
            >
              <Loader size={150} />
            </div>
          ) : (
            <div className="container">
              <div className="row mb-7" style={{ justifyContent: "center" }}>
                <h5
                  className="line-height-reset mb-6"
                  style={{ fontWeight: "normal" }}
                >
                  Selected company :{" "}
                  <strong>{`${selectedCompanyInfo.name}`}</strong>
                </h5>
              </div>
              <div className="row mb-7" style={{ justifyContent: "center" }}>
                <div className="col-xxl-3 col-xl-4 col-lg-6 col-sm-6">
                  <Link href={"/dashboard-jobs"}>
                    <a className="media bg-white rounded-4 pl-8 pt-9 pb-9 pr-7 hover-shadow-1 mb-9 shadow-8">
                      <div className="text-blue bg-blue-opacity-1 circle-56 font-size-6 mr-7">
                        <i className="fas fa-briefcase"></i>
                      </div>

                      <div className="">
                        <h5 className="font-size-8 font-weight-semibold text-black-2 line-height-reset font-weight-bold mb-1">
                          <LazyLoad>
                            <span className="counter">
                              <CountUp
                                duration={1}
                                end={companyPostedJobs?.length}
                              />
                            </span>
                          </LazyLoad>
                        </h5>
                        <p className="font-size-4 font-weight-normal text-gray mb-0">
                          Posted Jobs
                        </p>
                      </div>
                    </a>
                  </Link>
                </div>
                <div className="col-xxl-3 col-xl-4 col-lg-6 col-sm-6">
                  <Link href={"/dashboard-applicants"}>
                    <a className="media bg-white rounded-4 pl-8 pt-9 pb-9 pr-7 hover-shadow-1 mb-9 shadow-8">
                      <div className="text-yellow bg-yellow-opacity-1 circle-56 font-size-6 mr-7">
                        <i className="fas fa-user"></i>
                      </div>

                      <div className="">
                        <h5 className="font-size-8 font-weight-semibold text-black-2 line-height-reset font-weight-bold mb-1">
                          <LazyLoad>
                            <span className="counter">
                              <CountUp
                                duration={1}
                                end={allAppliedApplicants?.applied?.length}
                              />
                            </span>
                          </LazyLoad>
                        </h5>
                        <p className="font-size-4 font-weight-normal text-gray mb-0">
                          Total Applicants
                        </p>
                      </div>
                    </a>
                  </Link>
                </div>
                <div className="col-xxl-3 col-xl-4 col-lg-6 col-sm-6">
                  <a
                    href="/#"
                    className="media bg-white rounded-4 pl-8 pt-9 pb-9 pr-7 hover-shadow-1 mb-9 shadow-8"
                  >
                    <div className="text-green bg-green-opacity-1 circle-56 font-size-6 mr-7">
                      <i className="fas fa-eye"></i>
                    </div>

                    <div className="">
                      <h5 className="font-size-8 font-weight-semibold text-black-2 line-height-reset font-weight-bold mb-1">
                        <LazyLoad>
                          <span className="counter">
                            <CountUp
                              duration={1}
                              end={allAppliedApplicants?.in_progress?.length}
                            />
                          </span>
                        </LazyLoad>
                      </h5>
                      <p className="font-size-4 font-weight-normal text-gray mb-0">
                        In Progress
                      </p>
                    </div>
                  </a>
                </div>
              </div>
              <div className="mb-14">
                <div className="row mb-11 align-items-center">
                  <div className="col-lg-12" style={{ maxHeight: "500px" }}>
                    {barChartData && Object.keys(barChartData).length > 0 && (
                      <Bar
                        data={barChartData}
                        style={{ width: "100%" }}
                        options={{
                          maintainAspectRatio: true,
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </PageWrapper>
    </>
  );
  //TODO: add pages for contacted, accepted and rejected applicants
}
