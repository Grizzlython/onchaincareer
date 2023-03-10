import React, { useContext } from "react";
import PageWrapper from "../components/PageWrapper";
import { Select } from "../components/Core";

import SearchJobs from "../sections/search/SearchJobs";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import { countries } from "../staticData";
import {
  categoryOptions,
  defaultJobTypes,
  sortTypes,
} from "../utils/constants";
import GlobalContext from "../context/GlobalContext";
import { useConnection } from "@solana/wallet-adapter-react";
import SEO from "@bradgarropy/next-seo";

export default function SearchListTwo() {
  const [category, setCategory] = useState("All");
  const [country, setCountry] = useState("Any");
  const [jobType, setJobType] = useState("All");
  const [jobTitle, setJobTitle] = useState("");
  const [sortType, setSortType] = useState("Any");

  const gContext = useContext(GlobalContext);

  const { allListedJobs, fetchAndSetAllJobListings } = gContext;

  const { connection } = useConnection();

  const { query } = useRouter();
  useEffect(() => {
    if (query.category) {
      setCategory(query.category);
    }
    if (query.country) {
      setCountry(query.country);
    }
    if (query.jobType) {
      setJobType(query.jobType);
    }
    if (query.jobTitle) {
      setJobTitle(query.jobTitle);
    }
  }, [query]);

  useEffect(() => {
    (async () => {
      await fetchAndSetAllJobListings(connection);
    })();
  }, []);

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
                        placeholder="Search by Job Title"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                      />
                      <span className="h-100 w-px-50 pos-abs-tl d-flex align-items-center justify-content-center font-size-6">
                        <i className="icon icon-zoom-2 text-primary font-weight-bold"></i>
                      </span>
                    </div>
                    {/* <!-- .select-city starts --> */}
                    <div className="form-group position-relative w-lg-50">
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
                    </div>
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
                      Job Type
                    </label>
                    <Select
                      options={defaultJobTypes}
                      className="font-size-4"
                      // border={false}
                      css={`
                        min-width: 175px;
                        cursor: "pointer";
                        border-radius: 1px;
                      `}
                      value={
                        defaultJobTypes.filter(
                          (item) => item.value === jobType
                        )[0]
                      }
                      onChange={(e) => setJobType(e.value)}
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
                      Job Category
                    </label>
                    <Select
                      options={categoryOptions}
                      className="font-size-4"
                      // border={false}
                      css={`
                        min-width: 175px;
                      `}
                      value={
                        categoryOptions.filter(
                          (item) => item.value === category
                        )[0]
                      }
                      onChange={(e) => setCategory(e.value)}
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
            <SearchJobs
              category={category}
              country={country}
              jobTitle={jobTitle}
              jobType={jobType}
              sortType={sortType}
              allListedJobs={allListedJobs}
            />
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
