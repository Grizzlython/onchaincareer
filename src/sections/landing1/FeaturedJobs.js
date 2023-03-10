import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import imgF1 from "../../assets/image/l1/png/feature-brand-1.png";

import GlobalContext from "../../context/GlobalContext";
import Loader from "../../components/Loader";
import { EXPLORER_ADDRESS_URL, EXPLORER_CLUSTER } from "../../utils/constants";

const FeaturedJobs = () => {
  const gContext = useContext(GlobalContext);
  const { allListedJobs, loading } = gContext;

  return (
    <>
      {/* <!-- FeaturedJobs Area -->  */}
      <div className="pt-11 pt-lg-27 pb-7 pb-lg-26 bg-black-2 dark-mode-texts">
        {loading ? (
          <Loader />
        ) : (
          <div className="container">
            {/* <!-- Section Top --> */}
            <div className="row align-items-center pb-14">
              {/* <!-- Section Title --> */}
              <div className="col-12 col-xl-6 col-lg-6">
                <div className="text-center text-lg-left mb-13 mb-lg-0">
                  <h2 className="font-size-9 font-weight-bold">
                    Recently Added Jobs
                  </h2>
                </div>
              </div>
              {/* <!-- Section Button --> */}
              <div className="col-12 col-xl-6 col-lg-6">
                <div className="text-center text-lg-right">
                  <Link href="/search-jobs">
                    <a className="btn btn-outline-white text-uppercase">
                      Explore All
                    </a>
                  </Link>
                </div>
              </div>
              {/* <!-- Section Button End --> */}
            </div>
            {/* <!-- End Section Top --> */}

            <div className="row justify-content-start">
              {allListedJobs &&
                allListedJobs.length > 0 &&
                allListedJobs.slice(0, 6).map((jobListing, index) => (
                  <div
                    className="col-12 col-lg-4 col-md-6 px-xxl-7"
                    data-aos="fade-up"
                    data-aos-duration="800"
                    key={index}
                    // style={{
                    //   minHeight: "300px",
                    // }}
                  >
                    {/* <!-- Start Feature One --> */}
                    <div className="bg-white px-8 pt-9 pb-7 rounded-4 mb-9 feature-cardOne-adjustments">
                      <div className="d-block mb-7">
                        <Link href="/#">
                          <a>
                            <img
                              src={
                                jobListing.parsedInfo?.company_info?.logo_uri ||
                                imgF1.src
                              }
                              alt=""
                              style={{
                                width: "75px",
                                height: "75px",
                                objectFit: "cover",
                                borderRadius: "50%",
                              }}
                            />
                          </a>
                        </Link>
                      </div>
                      <Link
                        href={`/company/${jobListing.parsedInfo?.company_pubkey?.toString()}`}
                      >
                        <a className="font-size-3 d-block mb-0 text-gray">
                          {jobListing.parsedInfo?.company_info?.name.toUpperCase()}
                        </a>
                      </Link>
                      <h2 className="mt-n4">
                        {/* <Link href="/#"> */}
                        <a className="font-size-7 text-black-2 font-weight-bold mb-4">
                          {jobListing.parsedInfo?.job_title}
                        </a>
                        {/* </Link> */}
                      </h2>
                      <ul className="list-unstyled mb-1 card-tag-list">
                        <li>
                          {/* <Link href="/#"> */}
                          <a className="bg-regent-opacity-15 text-denim font-size-3 rounded-3">
                            <i className="icon icon-pin-3 mr-2 font-weight-bold"></i>{" "}
                            {jobListing.parsedInfo?.job_location_type ===
                            "remote"
                              ? "Remote"
                              : `${jobListing.parsedInfo.city}, ${jobListing.parsedInfo.country}`}
                          </a>
                          {/* </Link> */}
                        </li>
                        <li>
                          {/* <Link href="/#"> */}
                          <a className="bg-regent-opacity-15 text-orange font-size-3 rounded-3">
                            <i className="fa fa-briefcase mr-2 font-weight-bold"></i>{" "}
                            {jobListing.parsedInfo.job_type}
                          </a>
                          {/* </Link> */}
                        </li>
                        <li>
                          {/* <Link href="/#"> */}
                          <a className="bg-regent-opacity-15 text-eastern font-size-3 rounded-3">
                            {/* <i className="fa fa-rupee-sign mr-2 font-weight-bold"></i>{" "} */}
                            <span className="text-primary mr-2">
                              {jobListing.parsedInfo?.currency}{" "}
                            </span>
                            {Number(jobListing.parsedInfo.min_salary) +
                              " -" +
                              Number(jobListing.parsedInfo.max_salary)}
                          </a>
                          {/* </Link> */}
                        </li>
                      </ul>
                      <p
                        className="mb-7 font-size-4 text-gray"
                        style={{
                          maxHeight: "80px",
                          minHeight: "80px",
                          overflow: "auto",
                        }}
                      >
                        {jobListing.parsedInfo.short_description}
                      </p>
                      <div
                        className="card-btn-group"
                        style={{
                          display: "flex",
                        }}
                      >
                        <Link
                          href={`/job-details/${jobListing?.pubkey?.toString()}`}
                        >
                          <a className="btn btn-green text-uppercase btn-medium rounded-3">
                            View Job
                          </a>
                        </Link>
                        <a
                                      className="btn btn-outline-green text-uppercase btn-medium rounded-3 ml-3"
                                      href={`${EXPLORER_ADDRESS_URL}${jobListing?.pubkey?.toString()}${EXPLORER_CLUSTER}`}
                                      target="_blank"
                                    >
                                      <i className="fa fa-globe mr-3"></i>
                                      View on chain
                                    </a>
                      </div>
                    </div>

                    {/* <!-- End Feature One --> */}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FeaturedJobs;
