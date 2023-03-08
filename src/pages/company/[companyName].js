import React, { useState } from "react";
import { Nav, Tab } from "react-bootstrap";
import Link from "next/link";
import PageWrapper from "../../components/PageWrapper";

import imgF1 from "../../assets/image/l2/png/featured-job-logo-1.png";
import imgB1 from "../../assets/image/l1/png/feature-brand-1.png";
import imgB2 from "../../assets/image/l1/png/feature-brand-4.png";
import imgB3 from "../../assets/image/l1/png/feature-brand-5.png";
import imgB4 from "../../assets/image/l3/png/github-mark.png";
import imgB5 from "../../assets/image/l3/png/universal.png";
import imgF from "../../assets/image/svg/icon-fire-rounded.svg";
import iconL from "../../assets/image/svg/icon-loaction-pin-black.svg";
import iconS from "../../assets/image/svg/icon-suitecase.svg";
import iconC from "../../assets/image/svg/icon-clock.svg";

import { useRouter } from "next/router";
import { useEffect } from "react";
import { useContext } from "react";
import GlobalContext from "../../context/GlobalContext";
import { PublicKey } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";

import moment from "moment";
import Loader from "../../components/Loader";

export default function Company() {
  const router = useRouter();
  const { companyName } = router.query;
  const [selectedCompanyInfo, setSelectedCompanyInfo] = useState({});
  let company_pubkey = companyName;
  const gContext = useContext(GlobalContext);
  const {
    selectedCompanyInfo: selectedCompanyInfoContext,
    fetchAndSetCompanyInfo,
    companyPostedJobs,
    allListedCompanies,
    fetchAndSetCompanyPostedJobs,
    fetchAndSetAllListedCompanies,
    loading,
  } = gContext;
  const { connection } = useConnection();

  useEffect(() => {
    if (!company_pubkey || company_pubkey === "undefined") {
      // toast.error("Company not found");
      return;
    }

    (async () => {
      const companyPubKey = new PublicKey(company_pubkey);
      await fetchAndSetCompanyInfo(companyPubKey, connection);
      await fetchAndSetCompanyPostedJobs(companyPubKey, connection);
      await fetchAndSetAllListedCompanies(connection);
    })();
  }, [company_pubkey]);

  useEffect(() => {
    if (selectedCompanyInfoContext) {
      setSelectedCompanyInfo(selectedCompanyInfoContext);
    }
  }, [selectedCompanyInfoContext]);

  console.log("companyPostedJobs", companyPostedJobs);

  return (
    <>
      <PageWrapper headerConfig={{ button: "profile" }}>
        <div className="bg-default-2 pt-16 pt-lg-22 pb-lg-27">
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
              {/* <!-- back Button --> */}
              <div className="row justify-content-center">
                <div className="col-12 mt-13 dark-mode-texts">
                  <div className="mb-9">
                    <a
                      className="d-flex align-items-center ml-4"
                      onClick={() => router.back()}
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <i className="icon icon-small-left bg-white circle-40 mr-5 font-size-7 text-black font-weight-bold shadow-8"></i>
                      <span className="text-uppercase font-size-3 font-weight-bold text-gray">
                        Back
                      </span>
                    </a>
                  </div>
                </div>
              </div>
              {/* <!-- back Button End --> */}
              {selectedCompanyInfo &&
                Object.keys(selectedCompanyInfo).length > 0 && (
                  <div className="row ">
                    {/* <!-- Company Profile --> */}
                    <div className="col-12 col-xl-9 col-lg-8">
                      <div className="bg-white rounded-4  shadow-9">
                        <img
                          src={selectedCompanyInfo?.cover_image_uri}
                          style={{
                            // position: "absolute",
                            // top: "0",
                            // right: "0",
                            zIndex: "99",
                            background: "#b2b2b2",
                            height: "300px",
                            width: "100%",
                            borderRadius: "10px",
                            objectFit: "cover",
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                          }}
                          onClick={() => {
                            gContext.toggleVideoModal();
                          }}
                        />
                        <div className="d-xs-flex align-items-center pl-xs-12 mb-8 text-center text-xs-left">
                          <Link href="/#">
                            <a className="mr-xs-7 mb-5 mb-xs-0 mt-4">
                              <img
                                className="square-72 rounded-6"
                                src={selectedCompanyInfo?.logo_uri || imgF1.src}
                                alt=""
                                // style={{
                                //   transform: "translateY(-10%)",
                                // }}
                              />
                            </a>
                          </Link>
                          <div className="mt-4">
                            <h2 className="mt-xs-n5 ">
                              <Link href="/#">
                                <a className="font-size-6 text-black-2 font-weight-semibold">
                                  {selectedCompanyInfo?.name.toUpperCase()}
                                </a>
                              </Link>
                            </h2>
                            <span
                              className="mb-0 text-gray font-size-4"
                              // style={{
                              //   transform: "translateY(-40%)",
                              // }}
                            >
                              {selectedCompanyInfo?.domain}
                            </span>
                          </div>
                        </div>
                        {/* <!-- Tab Section Start --> */}
                        <Tab.Container
                          id="left-tabs-example"
                          defaultActiveKey="company"
                        >
                          <Nav
                            className="nav border-bottom border-mercury pl-12"
                            role="tablist"
                          >
                            <li className="tab-menu-items nav-item pr-12">
                              <Nav.Link
                                eventKey="company"
                                className="text-uppercase font-size-3 font-weight-bold text-default-color py-3 px-0"
                              >
                                Company
                              </Nav.Link>
                            </li>
                            <li className="tab-menu-items nav-item pr-12">
                              <Nav.Link
                                eventKey="jobs"
                                className="text-uppercase font-size-3 font-weight-bold text-default-color py-3 px-0"
                              >
                                Posted Jobs
                              </Nav.Link>
                            </li>
                          </Nav>
                          {/* <!-- Tab Content --> */}
                          <Tab.Content className="pl-12 pt-10 pb-7 pr-12 pr-xxl-24">
                            <Tab.Pane eventKey="company">
                              {/* <!-- Middle Body Start --> */}
                              <div className="row">
                                {/* <!-- Single Widgets Start --> */}
                                <div className="col-12 col-lg-4 col-md-4 col-xs-6">
                                  <div className="mb-8">
                                    <p className="font-size-4">Company size</p>
                                    <h5 className="font-size-4 font-weight-semibold text-black-2">
                                      {selectedCompanyInfo?.employee_size}{" "}
                                      employees
                                    </h5>
                                  </div>
                                  <div className="mb-8">
                                    <p className="font-size-4">Est. Since</p>
                                    <h5 className="font-size-4 font-weight-semibold text-black-2">
                                      {selectedCompanyInfo?.founded_in}
                                    </h5>
                                  </div>
                                </div>
                                {/* <!-- Single Widgets End --> */}
                                {/* <!-- Single Widgets Start --> */}
                                <div className="col-12 col-lg-4 col-md-4 col-xs-6">
                                  <div className="mb-8">
                                    <p className="font-size-4">
                                      Type of corporation
                                    </p>
                                    <h5 className="font-size-4 font-weight-semibold text-black-2">
                                      {selectedCompanyInfo?.company_type}
                                    </h5>
                                  </div>
                                  <div className="mb-8">
                                    <p className="font-size-4">Social Media</p>
                                    <div className="icon-link d-flex align-items-center">
                                      <Link
                                        href={
                                          selectedCompanyInfo?.linkedin
                                            ? selectedCompanyInfo?.linkedin
                                            : "/#"
                                        }
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
                                      <Link
                                        href={
                                          selectedCompanyInfo?.twitter
                                            ? selectedCompanyInfo?.twitter
                                            : "/#"
                                        }
                                      >
                                        <a className="text-smoke circle-32 bg-concrete mr-5 hover-bg-green">
                                          <i className="fab fa-twitter"></i>
                                        </a>
                                      </Link>
                                      <Link
                                        href={
                                          selectedCompanyInfo?.website
                                            ? selectedCompanyInfo?.website
                                            : "/#"
                                        }
                                      >
                                        <a className="text-smoke circle-32 bg-concrete mr-5 hover-bg-green">
                                          <i className="fa fa-globe"></i>
                                        </a>
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                                {/* <!-- Single Widgets End --> */}
                                {/* <!-- Single Widgets Start --> */}
                                <div className="col-12 col-lg-4 col-md-4 col-xs-6">
                                  <div className="mb-8">
                                    <p className="font-size-4">Location</p>
                                    <h5 className="font-size-4 font-weight-semibold text-black-2">
                                      {selectedCompanyInfo?.address}
                                    </h5>
                                  </div>
                                </div>
                                {/* <!-- Single Widgets End --> */}
                              </div>
                              {/* <!-- Middle Body End --> */}
                              {/* <!-- Excerpt Start --> */}
                              <h4 className="font-size-6 mb-7 text-black-2 font-weight-semibold">
                                About {selectedCompanyInfo?.name}
                              </h4>
                              <div className="pt-5 ">
                                <p className="font-size-4 mb-8">
                                  {selectedCompanyInfo?.description}
                                </p>
                              </div>
                              {/* <!-- Excerpt End --> */}
                            </Tab.Pane>
                            <Tab.Pane eventKey="jobs">
                              {companyPostedJobs?.map((job, index) => (
                                <div
                                  className="pt-9 px-xl-9 px-lg-7 px-7 pb-7 light-mode-texts bg-white rounded hover-shadow-3 hover-border-green mt-4"
                                  style={{
                                    border: "1px solid #e5e5e5",
                                  }}
                                >
                                  <div className="row">
                                    <div className="col-md-6">
                                      <div className="media align-items-center">
                                        <div className="square-72 d-block mr-8">
                                          <img
                                            src={
                                              job?.parsedInfo?.company_info
                                                ?.logo_uri || job.logo
                                            }
                                            alt=""
                                            style={{
                                              width: "75px",
                                              height: "75px",
                                            }}
                                          />
                                        </div>
                                        <div>
                                          <h3 className="mb-0 font-size-6 heading-default-color">
                                            {job?.jobTitle}
                                          </h3>
                                          <span className="font-size-3 text-default-color line-height-2 d-block">
                                            {job?.parsedInfo?.company_info?.name?.toUpperCase()}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-6 text-right pt-7 pt-md-5">
                                      <div className="media justify-content-md-end">
                                        <div className="image mr-5 mt-2">
                                          <img src={imgF.src} alt="" />
                                        </div>
                                        <p className="font-weight-bold font-size-7 text-hit-gray mb-0">
                                          <span className="text-primary mr-2">
                                            {job?.parsedInfo?.currency}{" "}
                                          </span>
                                          <span className="text-black-2">
                                            {` ${Number(
                                              job?.parsedInfo?.min_salary
                                            )} -
                                    ${Number(job?.parsedInfo?.max_salary)}`}
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="row pt-8">
                                    <div className="col-md-7">
                                      <ul className="d-flex list-unstyled mr-n3 flex-wrap">
                                        {job?.parsedInfo?.skills.map(
                                          (skill, index) => (
                                            <li key={index}>
                                              <span className="bg-regent-opacity-15 min-width-px-96 mr-3 text-center rounded-3 px-6 py-1 font-size-3 text-black-2 mt-2 d-inline-block">
                                                {skill}
                                              </span>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                    <div className="col-md-5">
                                      <ul className="d-flex list-unstyled mr-n3 flex-wrap mr-n8 justify-content-md-end">
                                        <li className="mt-2 mr-8 font-size-small text-black-2 d-flex">
                                          <span
                                            className="mr-4"
                                            css={`
                                              margin-top: -2px;
                                            `}
                                          >
                                            <img src={iconL.src} alt="" />
                                          </span>
                                          <span className="font-weight-semibold">
                                            {job?.parsedInfo
                                              ?.job_location_type === "remote"
                                              ? "Remote"
                                              : `${job?.parsedInfo?.city}, ${job?.parsedInfo?.country}`}
                                          </span>
                                        </li>
                                        <li className="mt-2 mr-8 font-size-small text-black-2 d-flex">
                                          <span
                                            className="mr-4"
                                            css={`
                                              margin-top: -2px;
                                            `}
                                          >
                                            <img src={iconS.src} alt="" />
                                          </span>
                                          <span className="font-weight-semibold">
                                            {job?.parsedInfo?.job_type}
                                          </span>
                                        </li>
                                        <li className="mt-2 mr-8 font-size-small text-black-2 d-flex">
                                          <span
                                            className="mr-4"
                                            css={`
                                              margin-top: -2px;
                                            `}
                                          >
                                            <img src={iconC.src} alt="" />
                                          </span>
                                          <span className="font-weight-semibold">
                                            {
                                              // convert created at date to days ago
                                              moment(new Date()).fromNow()
                                            }
                                          </span>
                                        </li>
                                      </ul>
                                      <ul className="d-flex list-unstyled mr-n3 flex-wrap mr-n8 justify-content-md-end">
                                        <li className="mt-2 mr-8 font-size-small text-black-2 d-flex">
                                          <span className="mr-4">
                                            Categories:
                                          </span>
                                          <span className="font-weight-semibold">
                                            {job?.parsedInfo?.category.join(
                                              ","
                                            )}
                                          </span>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>

                                  <div
                                    className="card-btn-group mt-3"
                                    style={{
                                      display: "flex",
                                    }}
                                  >
                                    <Link
                                      href={`/job-details/${job?.pubkey?.toString()}`}
                                    >
                                      <a className="btn btn-green text-uppercase btn-medium rounded-3">
                                        View Job
                                      </a>
                                    </Link>
                                    <a
                                      className="btn btn-outline-gray  text-uppercase btn-medium rounded-3 ml-3"
                                      href={`https://explorer.solana.com/address/${job?.pubkey?.toString()}?cluster=devnet`}
                                      target="_blank"
                                    >
                                      <i className="fa fa-globe mr-3"></i>
                                      View on chain
                                    </a>
                                  </div>
                                </div>
                              ))}
                            </Tab.Pane>
                          </Tab.Content>
                          {/* <!-- Tab Content End --> */}
                          {/* <!-- Tab Section End --> */}
                        </Tab.Container>
                      </div>
                    </div>
                    {/* <!-- Company Profile End --> */}
                    {/* <!-- Sidebar --> */}
                    <div className="col-12 col-xl-3 col-lg-4 col-md-5 col-sm-6">
                      <div className="pt-11 pt-lg-0 pl-lg-5">
                        <h4 className="font-size-6 font-weight-semibold mb-0">
                          Other Companies
                        </h4>
                        <ul className="list-unstyled">
                          {allListedCompanies &&
                            // filter out the current job company
                            allListedCompanies
                              .slice(0, 5)
                              .filter(
                                (company) =>
                                  company?.company_info_account?.toString() !==
                                  companyName
                              )
                              .map((company, index) => (
                                <li className="border-bottom" key={index}>
                                  <Link href="/#">
                                    <a className="media align-items-center py-9">
                                      <div className="mr-7">
                                        <img
                                          className=""
                                          src={
                                            company?.logo_uri.length > 0
                                              ? company?.logo_uri
                                              : imgB1.src
                                          }
                                          alt=""
                                          style={{
                                            width: "100px",
                                            height: "100px",
                                            objectFit: "cover",
                                            borderRadius: "50%",
                                          }}
                                        />
                                      </div>
                                      <div className="mt-n4">
                                        <Link
                                          href={company?.company_info_account?.toString()}
                                        >
                                          <h4 className="mb-0 font-size-6 font-weight-semibold">
                                            {company?.name?.toUpperCase()}.
                                          </h4>
                                        </Link>
                                        <p className="mb-0 font-size-4">
                                          {company?.domain}
                                        </p>
                                      </div>
                                    </a>
                                  </Link>
                                </li>
                              ))}
                        </ul>
                      </div>
                    </div>
                    {/* <!-- end Sidebar --> */}
                  </div>
                )}
              {!selectedCompanyInfo ||
                (!Object.keys(selectedCompanyInfo).length && (
                  <div className="row">No company info found</div>
                ))}
            </div>
          )}
        </div>
      </PageWrapper>
    </>
  );
}
