import React, { useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import Link from "next/link";

import imgF from "../../assets/image/svg/icon-fire-rounded.svg";
import iconL from "../../assets/image/svg/icon-loaction-pin-black.svg";
import iconS from "../../assets/image/svg/icon-suitecase.svg";
import iconC from "../../assets/image/svg/icon-clock.svg";
import { useContext } from "react";
import GlobalContext from "../../context/GlobalContext";
import { useEffect } from "react";
import moment from "moment/moment";
import ErrorPage from "../../pages/404";
import Loader from "../../components/Loader";

const SearchTab = (props) => {
  const gContext = useContext(GlobalContext);
  const { loading } = gContext;
  const allListedJobs = props.allListedJobs;

  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({});
  const [limit, setLimit] = useState(2);
  const [offset, setOffset] = useState(0);

  useEffect(async () => {
    if (props.category && props.category !== "all") {
      filters.category = props.category;
      filters.categoryRegex = new RegExp(filters.category);
    } else {
      filters.category = null;
      filters.categoryRegex = null;
    }
    if (props.jobType && props.jobType !== "all") {
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

    if (props.country && props.country !== "any") {
      filters.country = props.country;
      filters.countryRegex = new RegExp(filters.country);
    } else {
      filters.country = null;
      filters.countryRegex = null;
    }
    if (props.sortType && props.sortType !== "any") {
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
        console.log("job.parsedInfo.title ", conditions);
        return eval(conditions);
      });

      if (filters.sortType && filteredJobs && filteredJobs.length) {
        if (filters.sortType === "latest") {
          filteredJobs.sort((a, b) =>
            moment(b.parsedInfo.created_at).diff(
              moment(a.parsedInfo.created_at)
            )
          );
        } else if (filters.sortType === "oldest") {
          filteredJobs.sort((a, b) =>
            moment(a.parsedInfo.created_at).diff(
              moment(b.parsedInfo.created_at)
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
                    {filteredJobs?.slice(offset, limit)?.map((job, index) => (
                      <Nav.Link
                        className="mb-8 p-0 w-100"
                        eventKey={`${job.id}`}
                        key={index}
                        href={`/job-details/${job?.pubkey?.toString()}`}
                      >
                        {/* <!-- Single Featured Job --> */}
                        <div className="pt-9 px-xl-9 px-lg-7 px-7 pb-7 light-mode-texts bg-white rounded hover-shadow-3 hover-border-green">
                          <div className="row">
                            <div className="col-md-6">
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
                                  <span className="text-black-2">
                                    {`${Number(job?.parsedInfo?.min_salary)} -
                                    ${Number(job?.parsedInfo?.max_salary)}`}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="row pt-8">
                            <div className="col-md-7">
                              <ul className="d-flex list-unstyled mr-n3 flex-wrap">
                                {job?.parsedInfo?.skills.map((skill, index) => (
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
                                    {job?.parsedInfo?.job_location_type ===
                                    "remote"
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
                              className="btn btn-outline-gray text-black text-uppercase btn-medium rounded-3 ml-3"
                              href={`https://explorer.solana.com/address/${job?.pubkey?.toString()}?cluster=devnet`}
                              target="_blank"
                            >
                              <i className="fa fa-globe mr-3"></i>
                              View on chain
                            </a>
                          </div>
                        </div>
                        {/* <!-- End Single Featured Job --> */}
                      </Nav.Link>
                    ))}
                  </Nav>
                ) : (
                  <ErrorPage />
                )}
                {filteredJobs?.length > limit && (
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
                )}
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
export default SearchTab;
