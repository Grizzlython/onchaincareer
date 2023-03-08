import React, { useContext } from "react";
import PageWrapper from "../components/PageWrapper";
import { Select } from "../components/Core";

import SearchTab from "../sections/search/SearchTab";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import { countries } from "../staticData";
import { categoryOptions, sortTypes } from "../utils/constants";
import GlobalContext from "../context/GlobalContext";
import SearchCompanyTab from "../sections/search/SearchCompanyTab";

const defaultExpLevels = [
  { value: "entry", label: "Entry" },
  { value: "jn", label: "Junior" },
  { value: "mid", label: "Mid Level" },
  { value: "sr", label: "Sinior" },
];

const defaultCompanyTypes = [
  { value: "all", label: "All Types" },
  { value: "Product-based", label: "Product based" },
  { value: "Service-based", label: "Service based" },
];

const defaultEmployees = [
  { value: "all", label: "All Types" },
  { value: "10-50", label: "10-50" },
  { value: "50-100", label: "50-100" },
  { value: "100-500", label: "100-500" },
  { value: "500+", label: "500+" },
];

export default function SearchListTwo() {
  const [employeeSize, setEmployeeSize] = useState("all");
  const [country, setCountry] = useState("any");
  const [companyType, setCompanyType] = useState("all");
  const [companyName, setCompanyName] = useState("");
  const [sortType, setSortType] = useState("any");

  const gContext = useContext(GlobalContext);

  const { allListedCompanies } = gContext;

  const { query } = useRouter();
  useEffect(() => {
    if (query.employeeSize) {
      setEmployeeSize(query.employeeSize);
    }
    if (query.country) {
      setCountry(query.country);
    }
    if (query.companyType) {
      setCompanyType(query.companyType);
    }
    if (query.companyName) {
      setCompanyName(query.companyName);
    }
  }, [query]);
  return (
    <>
      <PageWrapper>
        <div className="bg-black-2 mt-15 mt-lg-22 pt-18 pt-lg-13 pb-13">
          <div className="container">
            <div className="row">
              <div className="col-12">
                {/* <!-- form --> */}
                <div
                  className="filter-search-form-2 bg-white rounded-sm shadow-7 py-7 pl-10"
                  style={{
                    width: "60%",
                    display: "flex",
                    marginLeft: "20%",
                  }}
                >
                  <div
                    className="filter-inputs"
                    style={{
                      width: "100%",
                    }}
                  >
                    <div className="form-group position-relative w-lg-50">
                      <input
                        className="form-control focus-reset pl-13"
                        type="text"
                        id="keyword"
                        placeholder="Search company"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                      <span className="h-100 w-px-50 pos-abs-tl d-flex align-items-center justify-content-center font-size-6">
                        <i className="icon icon-zoom-2 text-primary font-weight-bold"></i>
                      </span>
                    </div>
                    {/* <!-- .select-city starts --> */}
                    {/* <div className="form-group position-relative w-lg-50">
                      <Select
                        options={countries}
                        className="pl-8 h-100 arrow-3 font-size-4 d-flex align-items-center w-100"
                        border={false}
                        value={
                          countries.filter((item) => item.value === country)[0]
                        }
                        onChange={(e) => setCountry(e.value)}
                        style={{
                          cursor: "pointer",
                        }}
                      />
                      <span className="h-100 w-px-50 pos-abs-tl d-flex align-items-center justify-content-center font-size-6">
                        <i className="icon icon-pin-3 text-primary font-weight-bold"></i>
                      </span>
                    </div> */}
                    {/* <!-- ./select-city ends --> */}
                  </div>
                  {/* <div className="button-block">
                      <button className="btn btn-primary btn-medium line-height-reset h-100 btn-submit w-100 text-uppercase">
                        Search
                      </button>
                    </div> */}
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-12 col-lg-10 col-xl-12 mt-12">
                <div
                  className="search-filter from-group d-flex align-items-center flex-wrap"
                  style={{
                    justifyContent: "center",
                  }}
                >
                  <div
                    className="mr-5"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <label
                      style={{
                        color: "white",
                        marginBottom: "2px",
                      }}
                    >
                      Company Type
                    </label>
                    <Select
                      options={defaultCompanyTypes}
                      className="font-size-4"
                      // border={false}
                      css={`
                        min-width: 175px;
                        cursor: "pointer";
                        border-radius: 1px;
                      `}
                      value={
                        defaultCompanyTypes.filter(
                          (item) => item.value === companyType
                        )[0]
                      }
                      onChange={(e) => setCompanyType(e.value)}
                    />
                  </div>
                  <div
                    className="mr-5"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <label
                      style={{
                        color: "white",
                        marginBottom: "2px",
                      }}
                    >
                      Employee size
                    </label>
                    <Select
                      options={defaultEmployees}
                      className="font-size-4"
                      // border={false}
                      css={`
                        min-width: 175px;
                      `}
                      value={
                        defaultEmployees.filter(
                          (item) => item.value === employeeSize
                        )[0]
                      }
                      onChange={(e) => setEmployeeSize(e.value)}
                    />
                  </div>
                  <div
                    className="mr-5"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <label
                      style={{
                        color: "white",
                        marginBottom: "2px",
                      }}
                    >
                      Sort By
                    </label>
                    <Select
                      options={sortTypes}
                      className="font-size-4"
                      // border={false}
                      css={`
                        min-width: 175px;
                      `}
                      value={
                        sortTypes.filter((item) => item.value === sortType)[0]
                      }
                      onChange={(e) => setSortType(e.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-default-1 pt-9 pb-13 pb-xl-30 pb-13 position-relative overflow-hidden">
          <div className="container">
            <SearchCompanyTab
              employeeSize={employeeSize}
              country={country}
              companyName={companyName}
              companyType={companyType}
              sortType={sortType}
              allListedCompanies={allListedCompanies}
            />
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
