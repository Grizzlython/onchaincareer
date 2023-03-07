import React from "react";
import { Tab, Nav } from "react-bootstrap";
import Link from "next/link";

import imgF1 from "../../assets/image/l2/png/featured-job-logo-1.png";
import imgF2 from "../../assets/image/l2/png/featured-job-logo-2.png";
import imgF3 from "../../assets/image/l2/png/featured-job-logo-3.png";
import imgF4 from "../../assets/image/l2/png/featured-job-logo-4.png";
import imgF5 from "../../assets/image/l2/png/featured-job-logo-5.png";

import imgF from "../../assets/image/svg/icon-fire-rounded.svg";
import iconL from "../../assets/image/svg/icon-loaction-pin-black.svg";
import iconS from "../../assets/image/svg/icon-suitecase.svg";
import iconC from "../../assets/image/svg/icon-clock.svg";
import iconL2 from "../../assets/image/svg/icon-location.svg";
import iconD from "../../assets/image/svg/icon-dolor.svg";
import iconB from "../../assets/image/svg/icon-briefcase.svg";
import { useContext } from "react";
import GlobalContext from "../../context/GlobalContext";
import { useEffect } from "react";
import moment from "moment/moment";
import ErrorPage from "../../pages/404";

const SearchTab = (props) => {
  const gContext = useContext(GlobalContext);

  useEffect(async () => {
    let filters = {};
    if (props.category) {
      // add category to filters
      console.log("category", props.category);
      filters.category = props.category;
    }
    if (props.jobType) {
      filters.jobType = props.jobType;
    }
    if (props.jobTitle) {
      filters.jobTitle = props.jobTitle;
    }
    if (props.country) {
      filters.location = props.country;
    }
    if (props.companyType) {
      filters.companyType = props.companyType;
    }
    if (props.sortType) {
      filters.sortType = props.sortType;
    }
    await gContext.getJobListings(filters);
  }, [props]);

  return (
    <>
      <div className="row justify-content-center position-static">
        <Tab.Container defaultActiveKey="first">
          <div className="col-12 col-xxl-8 col-xl-7 col-lg-10">
            {/* <!-- Left Section --> */}
            <div className="Left">
              {gContext.jobListings.length > 0 ? (
                <Nav
                  className="justify-content-center search-nav-tab nav nav-tabs border-bottom-0"
                  id="search-nav-tab"
                >
                  {gContext.jobListings.map((job, index) => (
                    <Nav.Link
                      className="mb-8 p-0 w-100"
                      eventKey={`${job.id}`}
                      key={index}
                    >
                      {/* <!-- Single Featured Job --> */}
                      <div className="pt-9 px-xl-9 px-lg-7 px-7 pb-7 light-mode-texts bg-white rounded hover-shadow-3 hover-border-green">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="media align-items-center">
                              <div className="square-72 d-block mr-8">
                                <img
                                  src={job.logo}
                                  alt=""
                                  style={{
                                    width: "75px",
                                    height: "75px",
                                  }}
                                />
                              </div>
                              <div>
                                <h3 className="mb-0 font-size-6 heading-default-color">
                                  {job.title}
                                </h3>
                                <span className="font-size-3 text-default-color line-height-2 d-block">
                                  {job.companyName.toUpperCase()}
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
                                <span className="text-black-2">
                                  {job.salaryRange}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="row pt-8">
                          <div className="col-md-7">
                            <ul className="d-flex list-unstyled mr-n3 flex-wrap">
                              {job.skills.map((skill, index) => (
                                <li key={index}>
                                  <span className="bg-regent-opacity-15 min-width-px-96 mr-3 text-center rounded-3 px-6 py-1 font-size-3 text-black-2 mt-2 d-inline-block">
                                    {skill}
                                  </span>
                                </li>
                              ))}
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
                                  {job.jobLocationType === "remote"
                                    ? "Remote"
                                    : `${job.city}, ${job.country}`}
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
                                  {job.jobType}
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
                                    moment(job.createdAt).fromNow()
                                  }
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="card-btn-group mt-3">
                          <Link href={`/job-details/${job.id}`}>
                            <a className="btn btn-green text-uppercase btn-medium rounded-3">
                              View Job
                            </a>
                          </Link>
                        </div>
                      </div>
                      {/* <!-- End Single Featured Job --> */}
                    </Nav.Link>
                  ))}
                </Nav>
              ) : (
                <ErrorPage />
              )}

              <div className="text-center pt-5 pt-lg-13">
                <Link href="/#">
                  <a className="text-green font-weight-bold text-uppercase font-size-3 d-flex align-items-center justify-content-center">
                    Load More{" "}
                    <i className="fas fa-sort-down ml-3 mt-n2 font-size-4"></i>
                  </a>
                </Link>
              </div>
            </div>
            {/* <!-- form end --> */}
          </div>
          {/* <!-- Right Section --> */}
        </Tab.Container>
      </div>
    </>
  );
};
export default SearchTab;
