import React, { useContext, useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import GlobalContext from "../context/GlobalContext";
import Loader from "../components/Loader";
import Link from "next/link";
import SEO from "@bradgarropy/next-seo";
import {
  categoryOptions,
  defaultJobTypes,
  sortTypes,
} from "../utils/constants";
import { Select } from "../components/Core";
import {
  canJoinInFilters,
  currentEmploymentStatusFilters,
} from "../staticData";
import AllCandidatesTab from "../sections/search/AllCandidatesTab";

const AllCandidates = () => {
  const gContext = useContext(GlobalContext);

  const { allCandidates, loading } = gContext;

  const { connection } = useConnection();
  useEffect(() => {
    if (!connection) return;

    (async () => {
      await gContext.fetchAndSetAllUsers(connection);
    })();
  }, [connection]);

  //remove duplicate applicants based on pubKey
  // useEffect(()=>{
  //   if(!allCandidates || !allCandidates.length) return;

  // },[allCandidates])

  console.log(allCandidates, "allCandidates");

  const [employmentStatus, setEmploymentStatus] = useState("Any");
  const [joiningBy, setJoiningBy] = useState("Any");
  const [sortType, setSortType] = useState("Any");
  const [searchString, setSearchString] = useState("");

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
      <div className="pt-11 pt-lg-27 pb-7 pb-lg-26 ">
        {loading ? (
          <Loader />
        ) : (
          <div className="container">
            <div>
              <h3
                style={{
                  textAlign: "center",
                }}
              >
                All Candidates
              </h3>
            </div>
            <div className="row justify-content-center ">
              {/* <div className="col-lg-4">
                <p className="font-size-4 mb-0 mr-6 py-2 text-center text-black">
                  Filter by name and designation:
                </p>
                <div className="h-px-48">
                  <input
                    type="text"
                    className="form-control h-px-48"
                    id="namedash"
                    placeholder="eg. Frontend Developer"
                    value={searchString}
                    onChange={(e) => setSearchString(e.target.value)}
                  />
                </div>
              </div> */}
              <div className="col-12 col-lg-10 col-xl-12 mt-8 mb-12">
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
                        color: "black",
                        marginBottom: "2px",
                      }}
                    >
                      Employment status
                    </label>
                    <Select
                      options={currentEmploymentStatusFilters}
                      className="font-size-4"
                      // border={false}
                      css={`
                        min-width: 175px;
                        cursor: "pointer";
                        border-radius: 1px;
                      `}
                      value={
                        currentEmploymentStatusFilters.filter(
                          (item) => item.value === employmentStatus
                        )[0]
                      }
                      onChange={(e) => setEmploymentStatus(e.value)}
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
                        color: "black",
                        marginBottom: "2px",
                      }}
                    >
                      Joining by
                    </label>
                    <Select
                      options={canJoinInFilters}
                      className="font-size-4"
                      // border={false}
                      css={`
                        min-width: 175px;
                      `}
                      value={
                        canJoinInFilters.filter(
                          (item) => item.value === joiningBy
                        )[0]
                      }
                      onChange={(e) => setJoiningBy(e.value)}
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
                        color: "black",
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
                  <div
                    className="mr-5"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <label
                      style={{
                        color: "black",
                        marginBottom: "2px",
                      }}
                    >
                      Filter by name and designation:
                    </label>

                    <input
                      type="text"
                      className="form-control h-px-48"
                      id="namedash"
                      placeholder="eg. Frontend Developer"
                      value={searchString}
                      onChange={(e) => setSearchString(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <AllCandidatesTab
              allCandidates={allCandidates}
              employmentStatus={employmentStatus}
              joiningBy={joiningBy}
              searchString={searchString}
              sortType={sortType}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default AllCandidates;
