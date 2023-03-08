import React, { useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import Link from "next/link";

import iconL from "../../assets/image/svg/icon-loaction-pin-black.svg";
import iconS from "../../assets/image/svg/icon-suitecase.svg";
import iconC from "../../assets/image/svg/icon-clock.svg";
import { useContext } from "react";
import GlobalContext from "../../context/GlobalContext";
import { useEffect } from "react";
import moment from "moment/moment";
import ErrorPage from "../../pages/404";
import Loader from "../../components/Loader";
import { EXPLORER_ADDRESS_URL, EXPLORER_CLUSTER } from "../../utils/constants";

const SearchJobsList = (props) => {
  const gContext = useContext(GlobalContext);
  const { loading } = gContext;
  const allListedJobs = props.allListedJobs;

  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({});
  useEffect(async () => {
    if (props.category && props.category !== "All") {
      filters.category = props.category;
      filters.categoryRegex = new RegExp(filters.category);
    } else {
      filters.category = null;
      filters.categoryRegex = null;
    }
    if (props.jobType && props.jobType !== "All") {
      filters.jobType = props.jobType;
      filters.jobTypeRegex = new RegExp(filters.jobType, "i");
    } else {
      filters.jobType = null;
      filters.jobTypeRegex = null;
    }

    if (props.jobTitle) {
      filters.jobTitle = props.jobTitle;
      filters.jobTitleRegex = new RegExp(filters.jobTitle, "i");
    } else {
      filters.jobTitle = null;
      filters.jobTitleRegex = null;
    }

    if (props.country && props.country !== "Any") {
      filters.country = props.country;
      filters.countryRegex = new RegExp(filters.country);
    } else {
      filters.country = null;
      filters.countryRegex = null;
    }
    if (props.sortType && props.sortType !== "Any") {
      filters.sortType = props.sortType;
    } else {
      filters.sortType = null;
    }
    setFilters({ ...filters });
  }, [props]);

  useEffect(async () => {
    if (allListedJobs && filters) {
      let conditions = "";
      let firstConditionAdded = false;
      if (filters.categoryRegex) {
        conditions += `filters.categoryRegex && filters.categoryRegex.test(job.parsedInfo.category.join(","))`;
        firstConditionAdded = true;
      }

      if (filters.countryRegex) {
        if (firstConditionAdded) {
          conditions += ` && `;
        } else {
          firstConditionAdded = true;
        }
        conditions += `filters.countryRegex && filters.countryRegex.test(job.parsedInfo.country)`;
      }

      if (filters.jobTitleRegex) {
        if (firstConditionAdded) {
          conditions += ` && `;
        } else {
          firstConditionAdded = true;
        }
        conditions += `filters.jobTitleRegex && filters.jobTitleRegex.test(job.parsedInfo.job_title)`;
      }

      if (filters.jobTypeRegex) {
        if (firstConditionAdded) {
          conditions += ` && `;
        } else {
          firstConditionAdded = true;
        }
        conditions += `filters.jobTypeRegex && filters.jobTypeRegex.test(job.parsedInfo.job_type)`;
      }

      if (!conditions.length) {
        conditions = "true";
      }

      const filteredJobs = allListedJobs.filter((job) => {
        return eval(conditions);
      });

      if (filters.sortType && filteredJobs && filteredJobs.length) {
        if (filters.sortType === "Latest") {
          filteredJobs.sort((a, b) =>
            moment(b.parsedInfo.created_at.toNumber()).diff(
              moment(a.parsedInfo.created_at.toNumber())
            )
          );
        } else if (filters.sortType === "Oldest") {
          filteredJobs.sort((a, b) =>
            moment(a.parsedInfo.created_at.toNumber()).diff(
              moment(b.parsedInfo.created_at.toNumber())
            )
          );
        }
      }

      setFilteredJobs(filteredJobs);
    } else {
      setFilteredJobs(allListedJobs);
    }
  }, [filters, allListedJobs]);

  return (
    <>
      <div className="row justify-content-center position-static">
        {loading ? (
          <Loader />
        ) : (
          <Tab.Container defaultActiveKey="first">
            <div className="col-12 col-xxl-8 col-xl-7 col-lg-10">
              {/* <!-- Left Section --> */}
              <div className="Left">
                {filteredJobs?.length > 0 ? (
                  <Nav
                    className="justify-content-center search-nav-tab nav nav-tabs border-bottom-0"
                    id="search-nav-tab"
                  >
                    {filteredJobs?.map((job, index) => (
                      <Nav.Link
                        className="mb-8 p-0 w-100"
                        eventKey={`${job.id}`}
                        key={index}
                        href={`/job-details/${job?.pubkey?.toString()}`}
                      >
                        {/* <!-- Single Featured Job --> */}
                        <div className="pt-9 light-mode-texts bg-white rounded hover-shadow-3 hover-border-green p-6">
                          <div className="row">
                            <div className="col-md-12" style={{
                              display: "flex",
                              justifyContent: "space-between",
                              flexWrap: "wrap",
                            }}>
                              <div className="media align-items-center">
                                <div className="square-72 d-block mr-8">
                                  <img
                                    src={
                                      job?.parsedInfo?.company_info?.logo_uri
                                    }
                                    alt=""
                                    style={{
                                      width: "75px",
                                      height: "75px",
                                      objectFit: "contain",
                                      borderRadius: "50%",
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
                              <div className="mt-2">
                                <p className="font-weight-semibold font-size-6 text-hit-gray mb-0">
                                  <span className="text-primary mr-2">
                                    {job?.parsedInfo?.currency}
                                  </span>
                                  <span className="text-black-2">
                                    {` ${Number(job?.parsedInfo?.min_salary)} -
                                    ${Number(job?.parsedInfo?.max_salary)}`}
                                  </span>
                                </p>
                              </div>
                            </div>
                            {/* <div className="col-md-4 text-right pt-7 pt-md-5"> */}
                            {/* </div> */}
                          </div>

                          <div className="row pt-8">
                            <div className="col-md-8" style={{
                              display: "flex",
                              justifyContent: "space-between",
                              flexWrap: "wrap",
                              flexDirection: "column",
                            }}>
                              <ul className="d-flex list-unstyled mr-n3 flex-wrap">
                                {job?.parsedInfo?.skills.map((skill, index) => (
                                  <li key={index}>
                                    <span className="bg-regent-opacity-15 min-width-px-96 mr-3 text-center rounded-3 px-6 py-1 font-size-3 text-black-2 mt-2 d-inline-block">
                                      {skill}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                              <div style={{
                                color: "#000",
                                fontSize: "14px",
                                maxHeight: "150px",
                                overflow: "hidden",
                                overflowY: "auto",
                                paddingTop: "10px",
                                marginBottom: "10px",
                                borderTop: "1px solid #e5e5e5",
                              }}>
                                {job.parsedInfo.short_description}
                              </div>
                              <ul className="list-unstyled" style={{
                              float: "left",
                              marginBottom: "0px",
                            }}>
                              <li className="mt-2 mr-8 font-size-small text-black-2 d-flex">
                                <span className="mr-4">Categories:</span>
                                <span className="font-weight-semibold">
                                  {job?.parsedInfo?.category.join(",")} , Tech Skills, Hello World
                                </span>
                              </li>
                              </ul>
                            </div>
                            <div className="col-md-4" style={{
                              display: "flex",
                              justifyContent: "space-between",
                              flexWrap: "wrap",
                              flexDirection: "column",
                              marginRight: "0px",
                              paddingRight: "10px",
                              textAlign: "right",
                            }}>
                              <ul className="list-unstyled mr-n3 flex-wrap mr-n8" style={{
                                float: "left",
                                marginLeft: "50px",
                              }} >
                                <li className="mt-2 font-size-small text-black-2 d-flex">
                                  <span
                                    className="mr-4"
                                    css={`
                                      margin-top: -2px;
                                    `}
                                  >
                                    <img src={iconL.src} alt="" />
                                  </span>
                                  <span className="font-weight-semibold">
                                    {job?.parsedInfo?.job_location_type ===
                                      "remote"
                                      ? "Remote"
                                      : `${job?.parsedInfo?.city}, ${job?.parsedInfo?.country}`}
                                  </span>
                                </li>
                                <li className="mt-2 font-size-small text-black-2 d-flex">
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
                                <li className="mt-2 font-size-small text-black-2 d-flex">
                                  <span
                                    className="mr-4"
                                    css={`
                                      margin-top: -1px;
                                    `}
                                  >
                                    <img src={iconC.src} alt="" />
                                  </span>
                                  <span className="font-weight-semibold">
                                    {moment(
                                      new Date(
                                        job?.parsedInfo?.created_at.toNumber()
                                      )
                                    ).fromNow()}
                                  </span>
                                </li>
                              </ul>
                              <div style={{
                                float: "left",
                              }}>

                                <a
                                  className="btn btn-outline-green text-uppercase btn-medium rounded-3 mb-2"
                                  href={`${EXPLORER_ADDRESS_URL}${job?.pubkey?.toString()}${EXPLORER_CLUSTER}`}
                                  target="_blank"
                                >
                                  <i className="fa fa-globe mr-3"></i>
                                  View on chain
                                </a>
                                <Link
                                  href={`/job-details/${job?.pubkey?.toString()}`}
                                >
                                  <a className="btn btn-green text-uppercase btn-medium rounded-3">
                                    View Job
                                  </a>
                                </Link>
                              </div>
                            </div>
                            
                            {/* <div className="col-md-5"></div> */}
                          </div>
                          
                          

                        </div>
                        {/* <!-- End Single Featured Job --> */}
                      </Nav.Link>
                    ))}
                  </Nav>
                ) : (
                  <ErrorPage />
                )}
                {/* {filteredJobs?.length > limit && (
                  <div className="text-center pt-5 pt-lg-13">
                    <a
                      className="text-green font-weight-bold text-uppercase font-size-3 d-flex align-items-center justify-content-center"
                      onClick={() => {
                        setLimit(limit + 10);
                      }}
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      Load More{" "}
                      <i className="fas fa-sort-down ml-3 mt-n2 font-size-4"></i>
                    </a>
                  </div>
                )} */}
              </div>
              {/* <!-- form end --> */}
            </div>
            {/* <!-- Right Section --> */}
          </Tab.Container>
        )}
      </div>
    </>
  );
};
export default SearchJobsList;
