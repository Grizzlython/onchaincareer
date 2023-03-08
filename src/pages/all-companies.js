import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import imgF1 from "../assets/image/l1/png/feature-brand-1.png";

import { toast } from "react-toastify";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import GlobalContext from "../context/GlobalContext";

const AllCompanies = () => {
  const gContext = useContext(GlobalContext);

  const { allListedCompanies } = gContext;

  const { connection } = useConnection();

  console.log(allListedCompanies, "allListedCompanies");

  return (
    <>
      {/* <!-- FeaturedJobs Area -->  */}
      <div className="pt-11 pt-lg-27 pb-7 pb-lg-26 ">
        <div className="container">
          {/* <!-- Section Top --> */}
          <div className="row align-items-center pb-14">
            {/* <!-- Section Title --> */}
            <div className="col-12 col-xl-6 col-lg-6">
              <div className="text-center text-lg-left mb-13 mb-lg-0">
                <h2 className="font-size-9 font-weight-bold">All Companies</h2>
              </div>
            </div>
            {/* <!-- Section Button --> */}
            {/* <div className="col-12 col-xl-6 col-lg-6">
              <div className="text-center text-lg-right">
                <Link href="/search-jobs">
                  <a className="btn btn-outline-white text-uppercase">
                    Explore All
                  </a>
                </Link>
              </div>
            </div> */}
            {/* <!-- Section Button End --> */}
          </div>
          {/* <!-- End Section Top --> */}

          <div className="row justify-content-center">
            {allListedCompanies &&
              allListedCompanies.length > 0 &&
              allListedCompanies.map((company, index) => (
                <div
                  className="col-12 col-lg-4 col-md-6 px-xxl-7"
                  data-aos="fade-up"
                  data-aos-duration="800"
                  key={index}
                >
                  {/* <!-- Start Feature One --> */}
                  <div
                    className="bg-white px-8 pt-9 pb-7 rounded-4 mb-9 feature-cardOne-adjustments"
                    style={{
                      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                      border: "1px solid #E5E5E5",
                    }}
                  >
                    <div className="d-block mb-7">
                      <Link href="/#">
                        <a>
                          <img
                            src={company?.logo || imgF1.src}
                            alt=""
                            style={{
                              width: "75px",
                              height: "75px",
                            }}
                          />
                        </a>
                      </Link>
                    </div>
                    <h2 className="mt-n4">
                      {/* <Link href="/#"> */}
                      <a className="font-size-7 text-black-2 font-weight-bold mb-0">
                        {company?.name.toUpperCase()}
                      </a>
                      {/* </Link> */}
                    </h2>
                    <a className="font-size-4 d-block pb-2 text-gray">
                      Company Domain: {company?.domain}
                    </a>

                    <a className="font-size-4 d-block pb-4 text-gray">
                      Company Type: {company?.company_type}
                    </a>
                    <div className="mb-8 mt-2">
                      <div className="icon-link d-flex align-items-center">
                        <Link
                          href={company?.linkedin ? company?.linkedin : "/#"}
                        >
                          <a className="text-smoke circle-32 bg-concrete mr-5 hover-bg-green">
                            <i className="fab fa-linkedin-in"></i>
                          </a>
                        </Link>
                        {/* <Link href="/#">
                                  <a className="text-smoke circle-32 bg-concrete mr-5 hover-bg-green">
                                    <i className="fab fa-facebook-f"></i>
                                  </a>
                                </Link> */}
                        <Link href={company?.twitter ? company?.twitter : "/#"}>
                          <a className="text-smoke circle-32 bg-concrete mr-5 hover-bg-green">
                            <i className="fab fa-twitter"></i>
                          </a>
                        </Link>
                        <Link href={company?.website ? company?.website : "/#"}>
                          <a className="text-smoke circle-32 bg-concrete mr-5 hover-bg-green">
                            <i className="fa fa-globe"></i>
                          </a>
                        </Link>
                      </div>
                    </div>

                    <div className="card-btn-group">
                      <Link
                        href={`/company/${company.company_info_account?.toString()}`}
                      >
                        <a className="btn btn-green text-uppercase btn-medium rounded-3">
                          View Company
                        </a>
                      </Link>
                    </div>
                  </div>

                  {/* <!-- End Feature One --> */}
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllCompanies;
