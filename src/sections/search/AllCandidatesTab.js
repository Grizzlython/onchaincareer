import moment from "moment";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const AllCandidatesTab = (props) => {
  const allCandidates = props.allCandidates;

  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(async () => {
    if (props.employmentStatus && props.employmentStatus !== "Any") {
      filters.employmentStatus = props.employmentStatus;
      filters.employmentStatusRegex = new RegExp(filters.employmentStatus);
    } else {
      filters.employmentStatus = null;
      filters.employmentStatusRegex = null;
    }
    if (props.joiningBy && props.joiningBy !== "Any") {
      filters.joiningBy = props.joiningBy;
      filters.joiningByRegex = new RegExp(filters.joiningBy, "i");
    } else {
      filters.joiningBy = null;
      filters.joiningByRegex = null;
    }

    if (props.searchString && props.searchString !== "") {
      filters.searchString = props.searchString;
      filters.searchStringRegex = new RegExp(filters.searchString, "i");
    } else {
      filters.searchString = null;
      filters.searchStringRegex = null;
    }
    if (props.sortType && props.sortType !== "Any") {
      filters.sortType = props.sortType;
    } else {
      filters.sortType = null;
    }
    setFilters({ ...filters });
    console.log(filters, "filters");
  }, [props]);

  useEffect(async () => {
    if (allCandidates && filters) {
      let conditions = "";
      let firstConditionAdded = false;
      if (filters.employmentStatus) {
        conditions += `filters.employmentStatusRegex && filters.employmentStatus === candidate.current_employment_status`;
        firstConditionAdded = true;
      }

      if (filters.joiningBy) {
        if (firstConditionAdded) {
          conditions += ` && `;
        } else {
          firstConditionAdded = true;
        }
        conditions += `filters.joiningByRegex && filters.joiningByRegex.test(candidate.can_join_in)`;
      }

      if (filters.searchString) {
        if (firstConditionAdded) {
          conditions += ` && `;
        } else {
          firstConditionAdded = true;
        }
        conditions += `filters.searchStringRegex && filters.searchStringRegex.test(candidate.designation) || filters.searchStringRegex.test(candidate.name)`;
      }

      if (!conditions.length) {
        conditions = "true";
      }

      console.log(conditions, "conditions");

      const filteredCandidates = allCandidates.filter((candidate) => {
        return eval(conditions);
      });

      if (filters.sortType && filteredCandidates && filteredCandidates.length) {
        if (filters.sortType === "Latest") {
          filteredCandidates.sort((a, b) =>
            moment(b.created_at.toNumber()).diff(
              moment(a.created_at.toNumber())
            )
          );
        } else if (filters.sortType === "Oldest") {
          filteredCandidates.sort((a, b) =>
            moment(a.created_at.toNumber()).diff(
              moment(b.created_at.toNumber())
            )
          );
        }
      }

      console.log(filteredCandidates, "filteredCandidates");

      setFilteredCandidates(filteredCandidates);
    } else {
      setFilteredCandidates(allCandidates);
    }
  }, [filters, allCandidates]);

  return (
    <div className="row justify-content-center">
      {filteredCandidates && filteredCandidates?.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th
                scope="col"
                className="pl-0  border-0 font-size-4 font-weight-normal"
              >
                Name
              </th>
              <th
                scope="col"
                className="border-0 font-size-4 font-weight-normal"
              >
                Designation
              </th>
              <th
                scope="col"
                className="border-0 font-size-4 font-weight-normal"
              >
                Current status
              </th>
              <th
                scope="col"
                className="border-0 font-size-4 font-weight-normal"
              >
                Can Join In
              </th>
              <th
                scope="col"
                className="border-0 font-size-4 font-weight-normal"
              >
                Skills
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates?.map((applicant, index) => (
              <tr
                className="border border-color-2"
                key={index}
                style={{
                  minHeight: "1000px",
                }}
              >
                <td className="table-y-middle py-7 pr-0">
                  <Link href={`/candidate-profile/${applicant.owner_pubkey}`}>
                    <a
                      className="media min-width-px-235 align-items-center"
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <div className="circle-36 mr-6">
                        <img
                          src={applicant?.image_uri}
                          alt=""
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                            borderRadius: "50%",
                          }}
                        />
                      </div>
                      <h4 className="font-size-4 mb-0 font-weight-semibold text-black-2">
                        {applicant?.name}
                      </h4>
                    </a>
                  </Link>
                </td>
                <td className="table-y-middle py-7 min-width-px-235 pr-0">
                  <h3 className="font-size-4 font-weight-normal text-black-2 mb-0">
                    {applicant?.designation}
                  </h3>
                </td>
                <td className="table-y-middle py-7 min-width-px-170 pr-0">
                  <h3
                    className="font-size-4 font-weight-semibold text-black-2 mb-0"
                    style={{
                      textTransform: "capitalize",
                    }}
                  >
                    {applicant?.current_employment_status}
                  </h3>
                </td>
                <td className="table-y-middle py-5 min-width-px-100 pr-0">
                  <h3
                    className="font-size-4 font-weight-semibold text-black-2 mb-0"
                    style={{
                      textTransform: "capitalize",
                    }}
                  >
                    {applicant?.can_join_in}
                  </h3>
                </td>
                <td
                  className="table-y-middle py-7 min-width-px-170 pr-0"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "200px",
                  }}
                >
                  <h3 className="font-size-4 font-weight-normal text-black-2 mb-0">
                    {applicant?.skills?.join(", ")}
                  </h3>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "50px 20px",
            fontSize: "20px",
            fontWeight: "normal",
            width: "100%",
            background: "#eee",
          }}
        >
          No applicants found
        </div>
      )}
    </div>
  );
};

export default AllCandidatesTab;
