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

const SearchCompanyTab = (props) => {
  const gContext = useContext(GlobalContext);
  const { loading } = gContext;
  const allListedCompanies = props.allListedCompanies;

  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [filters, setFilters] = useState({});
  const [limit, setLimit] = useState(2);
  const [offset, setOffset] = useState(0);

  useEffect(async () => {
    if (props.employeeSize && props.employeeSize !== "all") {
      filters.employeeSize = props.employeeSize;
      filters.employeeSizeRegex = new RegExp(filters.employeeSize);
    } else {
      filters.employeeSize = null;
      filters.employeeSizeRegex = null;
    }
    if (props.companyType && props.companyType !== "all") {
      filters.companyType = props.companyType;
      filters.companyTypeRegex = new RegExp(filters.companyType, "i");
    } else {
      filters.companyType = null;
      filters.companyTypeRegex = null;
    }

    if (props.companyName) {
      filters.companyName = props.companyName;
      filters.companyNameRegex = new RegExp(filters.companyName, "i");
    } else {
      filters.companyName = null;
      filters.companyNameRegex = null;
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
    if (allListedCompanies && filters) {
      let conditions = "";
      let firstConditionAdded = false;
      if (filters.employeeSizeRegex) {
        conditions += `filters.employeeSizeRegex && filters.employeeSizeRegex.test(company.employee_size)`;
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

      if (filters.companyNameRegex) {
        if (firstConditionAdded) {
          conditions += ` && `;
        } else {
          firstConditionAdded = true;
        }
        conditions += `filters.companyNameRegex && filters.companyNameRegex.test(company.name)`;
      }

      if (filters.companyTypeRegex) {
        if (firstConditionAdded) {
          conditions += ` && `;
        } else {
          firstConditionAdded = true;
        }
        conditions += `filters.companyTypeRegex && filters.companyTypeRegex.test(company.company_type)`;
      }

      if (!conditions.length) {
        conditions = "true";
      }

      const filteredCompanies = allListedCompanies.filter((company) => {
        console.log("company.title ", conditions);
        return eval(conditions);
      });

      if (filters.sortType && filteredCompanies && filteredCompanies.length) {
        if (filters.sortType === "latest") {
          filteredCompanies.sort((a, b) =>
            moment(b.created_at).diff(moment(a.created_at))
          );
        } else if (filters.sortType === "oldest") {
          filteredCompanies.sort((a, b) =>
            moment(a.created_at).diff(moment(b.created_at))
          );
        }
      }

      setFilteredCompanies(filteredCompanies);
    } else {
      setFilteredCompanies(allListedCompanies);
    }
  }, [filters, allListedCompanies]);

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
                {filteredCompanies?.length > 0 ? (
                  <Nav
                    className="justify-content-center search-nav-tab nav nav-tabs border-bottom-0"
                    id="search-nav-tab"
                  >
                    {filteredCompanies
                      ?.slice(offset, limit)
                      ?.map((company, index) => (
                        <Nav.Link
                          className="mb-8 p-0 w-100"
                          // eventKey={`${job.id}`}
                          key={index}
                          href={`/company/${company?.company_info_account?.toString()}`}
                        >
                          {/* <!-- Single Featured Job --> */}
                          <div className="pt-9 px-xl-9 px-lg-7 px-7 pb-7 light-mode-texts bg-white rounded hover-shadow-3 hover-border-green">
                            <div className="row">
                              <div className="col-md-6">
                                <div className="media align-items-center">
                                  <div className="square-72 d-block mr-8">
                                    <img
                                      src={company?.logo_uri}
                                      alt=""
                                      style={{
                                        width: "75px",
                                        height: "75px",
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <h3 className="mb-0 font-size-6 heading-default-color">
                                      {company?.name?.toUpperCase()}
                                    </h3>
                                    <span className="font-size-3 text-default-color line-height-2 d-block">
                                      Company domain:
                                      {company?.domain?.toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6 text-right pt-7 pt-md-5">
                                <div className="media justify-content-md-end">
                                  <div className="image mr-5 mt-2">
                                    <img src={imgF.src} alt="" />
                                  </div>
                                  <div>
                                    <p className="font-weight-bold font-size-7 text-hit-gray mb-0">
                                      <span className="text-black-2">
                                        Employee size: {company?.employee_size}
                                      </span>
                                    </p>
                                  </div>
                                  <br />
                                </div>
                              </div>
                            </div>

                            <div className="row ">
                              {/* <div className="col-md-7">
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
                              </div> */}
                              <div className="col-md-12">
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
                                      {company?.address}
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
                                      {company?.company_type}
                                    </span>
                                  </li>
                                  <br />
                                </ul>
                                <ul className="d-flex list-unstyled mr-n3 flex-wrap mr-n8 justify-content-md-end">
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
                                      Created at:
                                      {moment(
                                        new Date(company?.created_at.toNumber())
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
                                href={`/company/${company?.company_info_account?.toString()}`}
                              >
                                <a className="btn btn-green text-uppercase btn-medium rounded-3">
                                  View Company
                                </a>
                              </Link>
                              <a
                                className="btn btn-outline-gray text-black text-uppercase btn-medium rounded-3 ml-3"
                                href={`https://explorer.solana.com/address/${company?.company_info_account?.toString()}?cluster=devnet`}
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
                {filteredCompanies?.length > limit && (
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
export default SearchCompanyTab;
