import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import imgF1 from "../../assets/image/l1/png/feature-brand-1.png";

import { toast } from "react-toastify";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import GlobalContext from "../../context/GlobalContext";

const Companies = () => {
  const gContext = useContext(GlobalContext);

  const { allListedCompanies } = gContext;

  const { connection } = useConnection();

  console.log(allListedCompanies, "allListedCompanies");

  return (
    <>
      {/* <!-- FeaturedJobs Area -->  */}
      <div className="pt-11 pt-lg-27 pb-7 pb-lg-26 bg-black-2 dark-mode-texts">
        <div className="container">
          <div className="row align-items-center pb-14">
            {/* <!-- Section Title --> */}
            <div className="col-12 col-xl-6 col-lg-6">
              <div className="text-center text-lg-left mb-13 mb-lg-0">
                <h2 className="font-size-9 font-weight-bold">
                  Recently Added Companies
                </h2>
              </div>
            </div>
            {/* <!-- Section Button --> */}
            <div className="col-12 col-xl-6 col-lg-6">
              <div className="text-center text-lg-right">
                <Link href="/all-companies">
                  <a className="btn btn-outline-white text-uppercase">
                    Explore All
                  </a>
                </Link>
              </div>
            </div>
            {/* <!-- Section Button End --> */}
          </div>

          <div className="row justify-content-start">
            {allListedCompanies &&
              allListedCompanies.length > 0 &&
              allListedCompanies.map((company, index) => (
                <div
                  className="col-12 col-lg-4 col-md-6 px-xxl-7"
                  data-aos="fade-up"
                  data-aos-duration="800"
                  key={index}
                >
                  <div
                    className="bg-white px-8 pt-9 pb-7 rounded-4 mb-9 feature-cardOne-adjustments"
                    style={{
                      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                      border: "1px solid #E5E5E5",
                    }}
                  >
                    <div className="d-flex align-items-center mb-7">
                      <Link href="/#">
                        <a>
                          <img
                            src={company?.logo_uri || imgF1.src}
                            alt=""
                            style={{
                              width: "100px",
                              height: "100px",
                              borderRadius: "50%",
                            }}
                          />
                        </a>
                      </Link>
                      <div className="ml-6">
                        <h2 className="mt-n4">
                          <a className="font-size-7 text-black-2 font-weight-bold mb-0">
                            {company?.name.toUpperCase()}
                          </a>
                        </h2>
                        <div className="">
                          <div className="icon-link d-flex align-items-center">
                            <Link
                              href={
                                company?.linkedin ? company?.linkedin : "/#"
                              }
                            >
                              <a className="text-smoke circle-32 bg-concrete mr-5 hover-bg-green">
                                <i className="fab fa-linkedin-in"></i>
                              </a>
                            </Link>

                            <Link
                              href={company?.twitter ? company?.twitter : "/#"}
                            >
                              <a className="text-smoke circle-32 bg-concrete mr-5 hover-bg-green">
                                <i className="fab fa-twitter"></i>
                              </a>
                            </Link>
                            <Link
                              href={company?.website ? company?.website : "/#"}
                            >
                              <a className="text-smoke circle-32 bg-concrete mr-5 hover-bg-green">
                                <i className="fa fa-globe"></i>
                              </a>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    <a className="font-size-4 d-block pb-4 text-gray">
                      Company Type: {company?.company_type}
                    </a>
                    <a className="font-size-4 d-block pb-2 text-gray mb-2">
                      Company Domain: {company?.domain}
                    </a>

                    <div
                      className="card-btn-group mt-4"
                      style={{
                        display: "flex",
                      }}
                    >
                      <Link
                        href={`/company/${company.company_info_account?.toString()}`}
                      >
                        <a className="btn btn-green text-uppercase btn-medium rounded-3">
                          View Company
                        </a>
                      </Link>
                      <a
                        className="btn btn-outline-green text-uppercase btn-medium rounded-3"
                        href={`https://explorer.solana.com/address/${company.company_info_account?.toString()}?cluster=devnet`}
                        target="_blank"
                      >
                        <i className="fa fa-globe mr-2"></i>
                        View on chain
                      </a>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Companies;
