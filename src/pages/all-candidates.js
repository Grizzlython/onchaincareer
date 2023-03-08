import React, { useContext, useEffect } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import GlobalContext from "../context/GlobalContext";
import Loader from "../components/Loader";
import Link from "next/link";

const AllCandidates = () => {
  const gContext = useContext(GlobalContext);

  const { allCandidates, loading } = gContext;

  const { connection } = useConnection();
  console.log(allCandidates, "allCandidates");
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

  return (
    <>
      <div className="pt-11 pt-lg-27 pb-7 pb-lg-26 ">
        {loading ? (
          <Loader />
        ) : (
          <div className="container">
            <div className="row align-items-center pb-14">
              <div className="">
                <div className="text-center text-lg-left mb-13 mb-lg-0">
                  <h2 className="font-size-9 font-weight-bold">
                    All Candidates
                  </h2>
                </div>
              </div>
            </div>

            <div className="row justify-content-center">
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
                      Current employment status
                    </th>
                    <th
                      scope="col"
                      className="border-0 font-size-4 font-weight-normal"
                    >
                      Can join in
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
                  {allCandidates && allCandidates?.length > 0 ? (
                    allCandidates?.map((applicant, index) => (
                      <tr
                        className="border border-color-2"
                        key={index}
                        style={{
                          minHeight: "1000px",
                        }}
                      >
                        <th scope="row" className="pl-6 border-0 py-7 pr-0">
                          <Link
                            href={`/candidate-profile/${applicant.owner_pubkey}`}
                          >
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
                        </th>
                        <td className="table-y-middle py-7 min-width-px-235 pr-0">
                          <h3 className="font-size-4 font-weight-normal text-black-2 mb-0">
                            {applicant?.designation}
                          </h3>
                        </td>
                        <td className="table-y-middle py-7 min-width-px-170 pr-0">
                          <h3 className="font-size-4 font-weight-normal text-black-2 mb-0">
                            {applicant?.current_employment_status?.toUpperCase()}
                          </h3>
                        </td>
                        <td className="table-y-middle py-5 min-width-px-100 pr-0">
                          <h3 className="font-size-4 font-weight-normal text-black-2 mb-0">
                            {applicant?.can_join_in?.toUpperCase()}
                          </h3>
                        </td>
                        <td className="table-y-middle py-7 min-width-px-170 pr-0">
                          <h3 className="font-size-4 font-weight-normal text-black-2 mb-0">
                            {applicant?.skills?.join(", ")}
                          </h3>
                        </td>
                      </tr>
                    ))
                  ) : (
                    // <tr className="border border-color-2">
                    //   <td className="table-y-middle py-7 min-width-px-235 pr-0">
                    //     <h3 className="font-size-4 font-weight-normal text-black-2 mb-0"></h3>
                    //   </td>
                    //   <td className="table-y-full py-7 pr-0">
                    //     <h3 className="font-size-4 font-weight-normal text-black-2 mb-0">
                    //       No Applicants yet
                    //     </h3>
                    //   </td>
                    //   <td className="table-y-middle py-7 pr-0">
                    //     <h3 className="font-size-4 font-weight-normal text-black-2 mb-0"></h3>
                    //   </td>
                    //   <td className="table-y-middle py-7 pr-0">
                    //     <h3 className="font-size-4 font-weight-normal text-black-2 mb-0"></h3>
                    //   </td>
                    //   <td className="table-y-middle py-7 pr-0">
                    //     <h3 className="font-size-4 font-weight-normal text-black-2 mb-0"></h3>
                    //   </td>
                    //   <td className="table-y-middle py-7 pr-0">
                    //     <h3 className="font-size-4 font-weight-normal text-black-2 mb-0"></h3>
                    //   </td>
                    // </tr>
                    <div
                      style={{
                        textAlign: "center",
                        padding: "50px 20px",
                        fontSize: "20px",
                        fontWeight: "normal",
                        width: "225%",
                        background: "#eee",
                      }}
                    >
                      No applicants found
                    </div>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AllCandidates;
