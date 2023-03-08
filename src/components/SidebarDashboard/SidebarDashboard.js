import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { Collapse } from "react-bootstrap";
import GlobalContext from "../../context/GlobalContext";
import imgL from "../../assets/image/logo-main-black.png";
import { Select } from "../Core";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const Sidebar = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [selectedCompanyState, setSelectedCompanyState] = useState({});
  const [companyOptions, setCompanyOptions] = useState([]);
  const gContext = useContext(GlobalContext);
  const {
    allListedCompaniesByUser,
    selectedCompanyInfo,
    setCompanySelectedByUser,
    companySelectedByUser,
    fetchAndSetCompanyInfo,
    fetchAndSetCompanyPostedJobs,
    fetchAndSetAllAppliedApplicants,
  } = gContext;

  useEffect(() => {}, [selectedCompanyInfo]);

  useEffect(() => {
    if (!companySelectedByUser && !connection) return;

    console.log("I am rendered after change");

    console.log(companySelectedByUser, "companySelectedByUser");

    (async () => {
      console.log("In async");
      await fetchAndSetCompanyPostedJobs(
        companySelectedByUser.value,
        connection
      );
      await fetchAndSetAllAppliedApplicants(
        connection,
        companySelectedByUser?.value
      );
    })();
  }, [companySelectedByUser]);

  useEffect(() => {
    if (!publicKey) return;
    (async () => {
      await gContext.fetchAndSetAllListedCompaniesByUser(connection, publicKey);
    })();
  }, [publicKey]);

  useEffect(() => {
    if (
      (allListedCompaniesByUser && allListedCompaniesByUser.length === 0) ||
      !allListedCompaniesByUser
    )
      console.log(allListedCompaniesByUser, "allListedCompaniesByUser");
    // return;
    const companyOptions = allListedCompaniesByUser.map((company) => {
      return {
        value: company.company_info_account.toString(),
        label: company.name,
      };
    });
    setCompanyOptions(companyOptions);
    setSelectedCompanyState(companyOptions[0]);
  }, [allListedCompaniesByUser]);

  useEffect(() => {
    if (companyOptions.length === 0) return;
    setCompanySelectedByUser(companyOptions[0]);
  }, [companyOptions]);

  useEffect(() => {
    console.log(companySelectedByUser, "companySelectedByUser");
    if (companySelectedByUser && companySelectedByUser.value && connection) {
      fetchAndSetCompanyInfo(companySelectedByUser.value, connection);
    }
  }, [companySelectedByUser]);

  const handleSelectCompany = async (e) => {
    try {
      console.log(e, "sidebar e");

      setCompanySelectedByUser({ ...e });
    } catch (err) {
      console.log(err);
      throw Error("Error in handleSelectCompany");
    }
  };

  return (
    <>
      <Collapse in={gContext.showSidebarDashboard}>
        <div className="dashboard-sidebar-wrapper pt-11" id="sidebar">
          <div className="brand-logo px-11">
            <Link href="/">
              <a>
                <img src={imgL.src} alt="" />
              </a>
            </Link>
          </div>

          <ul className="list-unstyled dashboard-layout-sidebar">
            {/* <Link href="/dashboard-jobpost"> */}
            <div className="my-15 px-11">
              {/* <a className="btn btn-primary btn-xl w-100 text-uppercase">
                <span className="mr-5 d-inline-block">+</span>Select a company
              </a> */}
              {/* <a className="px-10 py-1 my-5 font-size-4 font-weight-semibold flex-y-center">
                <i className="icon icon-layout-11 mr-7"></i>Select company
              </a> */}
              <h5>Select company </h5>
              <Select
                options={companyOptions}
                onChange={handleSelectCompany}
                value={companySelectedByUser}
                style={{
                  cursor: "pointer",
                }}
              />
            </div>
            {/* </Link> */}

            <Link href="/dashboard-jobpost">
              <div className="my-15 px-11">
                <a className="btn btn-primary btn-xl w-100 text-uppercase">
                  <span className="mr-5 d-inline-block">+</span>Post a new job
                </a>
              </div>
            </Link>

            <li className="">
              <Link href="/dashboard-main">
                <a className="px-10 py-1 my-5 font-size-4 font-weight-semibold flex-y-center">
                  <i className="icon icon-layout-11 mr-7"></i>Dashboard
                </a>
              </Link>
            </li>
            {companySelectedByUser && (
              <li className="">
                <Link href={`/company/${companySelectedByUser?.value}`}>
                  <a className="px-10 py-1 my-5 font-size-4 font-weight-semibold flex-y-center">
                    <i className="fas fa-user mr-7"></i>Company Profile
                  </a>
                </Link>
              </li>
            )}
            <li className="">
              <Link href="/dashboard-jobs">
                <a className="px-10 py-1 my-5 font-size-4 font-weight-semibold flex-y-center">
                  <i className="fas fa-briefcase mr-7"></i>Posted Jobs
                </a>
              </Link>
            </li>
            <li className="">
              <Link href="/dashboard-applicants">
                <a className="px-10 py-1 my-5 font-size-4 font-weight-semibold flex-y-center">
                  <i className="fas fa-user mr-7"></i>Applicants{" "}
                  {/* <span className="ml-auto px-1 h-1 bg-dodger text-white font-size-3 rounded-5 max-height-px-18 flex-all-center">
                    14
                  </span> */}
                </a>
              </Link>
            </li>
            <li className="">
              <Link href="/dashboard-in-progress-applicants">
                <a className="px-10 py-1 my-5 font-size-4 font-weight-semibold flex-y-center">
                  <i className="fas fa-user mr-7"></i>In Progress Applicants
                  {/* <span className="ml-auto px-1 h-1 bg-dodger text-white font-size-3 rounded-5 max-height-px-18 flex-all-center">
                    14
                  </span> */}
                </a>
              </Link>
            </li>
            <li className="">
              <Link href="/dashboard-accepted">
                <a className="px-10 py-1 my-5 font-size-4 font-weight-semibold flex-y-center">
                  <i className="fas fa-user mr-7"></i>Accepted{" "}
                  {/* <span className="ml-auto px-1 h-1 bg-dodger text-white font-size-3 rounded-5 max-height-px-18 flex-all-center">
                    14
                  </span> */}
                </a>
              </Link>
            </li>
            <li className="">
              <Link href="/dashboard-rejected">
                <a className="px-10 py-1 my-5 font-size-4 font-weight-semibold flex-y-center">
                  <i className="fas fa-user mr-7"></i>Rejected{" "}
                  {/* <span className="ml-auto px-1 h-1 bg-dodger text-white font-size-3 rounded-5 max-height-px-18 flex-all-center">
                    14
                  </span> */}
                </a>
              </Link>
            </li>
            <li className="">
              <Link href="/dashboard-update-company">
                <a className="px-10 py-1 my-5 font-size-4 font-weight-semibold flex-y-center">
                  <i className="fas fa-cog mr-7"></i>Update company profile
                </a>
              </Link>
            </li>
            <li className="">
              <Link href="/dashboard-add-company">
                <a className="px-10 py-1 my-5 font-size-4 font-weight-semibold flex-y-center">
                  <i className="fas fa-plus mr-7"></i>Add company
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </Collapse>
      <a
        href="/#"
        className="sidebar-mobile-button"
        onClick={(e) => {
          e.preventDefault();
          gContext.toggleSidebarDashboard();
        }}
      >
        <i className="icon icon-sidebar-2"></i>
      </a>
    </>
  );
};

export default Sidebar;
