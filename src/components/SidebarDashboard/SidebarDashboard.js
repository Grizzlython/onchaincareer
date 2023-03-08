import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { Collapse } from "react-bootstrap";
import GlobalContext from "../../context/GlobalContext";
import imgL from "../../assets/image/logo-main-black.png";
import { Select } from "../Core";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";
import Logo from "../Logo";
import { useRouter } from "next/router";

const Sidebar = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [selectedCompanyState, setSelectedCompanyState] = useState({});
  const [companyOptions, setCompanyOptions] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const gContext = useContext(GlobalContext);
  const {
    allListedCompaniesByUser,
    selectedCompanyInfo,
    setCompanySelectedByUser,
    companySelectedByUser,
    fetchAndSetCompanyInfo,
    fetchAndSetCompanyPostedJobs,
  } = gContext;
  const router = useRouter();

  useEffect(() => {}, [selectedCompanyInfo]);

  useEffect(() => {
    if (!companySelectedByUser && !connection) return;

    (async () => {
      await fetchAndSetCompanyPostedJobs(
        companySelectedByUser.value,
        connection,
        true
      );
    })();
  }, [companySelectedByUser]);

  useEffect(() => {
    if (!publicKey) {
      router.push("/");
      return;
    }

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
      setCompanySelectedByUser({ ...e });
    } catch (err) {
      console.log(err);
      toast.error("Error in handleSelectCompany");
    }
  };

  return (
    <>
      <Collapse in={gContext.showSidebarDashboard}>
        <div
          className="dashboard-sidebar-wrapper pt-11"
          id="sidebar"
          style={{
            overflowY: "scroll",
          }}
        >
          {/* <div className="brand-logo px-11">
            <Logo />
          </div> */}

          <ul className="list-unstyled dashboard-layout-sidebar">
            {/* <Link href="/dashboard-jobpost"> */}
            <div className="my-15 px-11 pt-10">
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
                className="basic-multi-select"
                border={true}
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
                <a
                  className={`px-10 py-1 my-5 font-size-4 font-weight-semibold flex-y-center ${
                    selectedMenu &&
                    selectedMenu.length > 0 &&
                    selectedMenu === "dashboard" &&
                    "sidebar-menu-selected"
                  }`}
                  onClick={() => setSelectedMenu("dashboard")}
                >
                  <i className="icon icon-layout-11 mr-7"></i>Dashboard
                </a>
              </Link>
            </li>
            <li className="">
              <Link href={`/recruiter/${publicKey}`}>
                <a
                  className={`px-10 py-1 my-5 font-size-4 font-weight-semibold flex-y-center ${
                    selectedMenu &&
                    selectedMenu.length > 0 &&
                    selectedMenu === "profile" &&
                    "sidebar-menu-selected"
                  }`}
                  onClick={() => setSelectedMenu("profile")}
                >
                  <i className="icon icon-layout-11 mr-7"></i>Profile
                </a>
              </Link>
            </li>
            {companySelectedByUser && (
              <li className="">
                <Link href={`/company/${companySelectedByUser?.value}`}>
                  <a
                    className={`px-10 py-1 my-5 font-size-4 font-weight-semibold flex-y-center ${
                      selectedMenu &&
                      selectedMenu.length > 0 &&
                      selectedMenu === "company-profile" &&
                      "sidebar-menu-selected"
                    }`}
                    onClick={() => setSelectedMenu("company-profile")}
                  >
                    <i className="fas fa-user mr-7"></i>Company Profile
                  </a>
                </Link>
              </li>
            )}
            <li className="">
              <Link href="/dashboard-jobs">
                <a
                  className={`px-10 py-1 my-5 font-size-4 font-weight-semibold flex-y-center ${
                    selectedMenu &&
                    selectedMenu.length > 0 &&
                    selectedMenu === "posted-jobs" &&
                    "sidebar-menu-selected"
                  }`}
                  onClick={() => setSelectedMenu("posted-jobs")}
                >
                  <i className="fas fa-briefcase mr-7"></i>Posted Jobs
                </a>
              </Link>
            </li>
            <li className="">
              <Link href="/dashboard-applicants">
                <a
                  className={`px-10 py-1 my-5 font-size-4 font-weight-semibold flex-y-center ${
                    selectedMenu &&
                    selectedMenu.length > 0 &&
                    selectedMenu === "applicants" &&
                    "sidebar-menu-selected"
                  }`}
                  onClick={() => setSelectedMenu("applicants")}
                >
                  <i className="fas fa-user mr-7"></i>Applied Applicants{" "}
                  {/* <span className="ml-auto px-1 h-1 bg-dodger text-white font-size-3 rounded-5 max-height-px-18 flex-all-center">
                    14
                  </span> */}
                </a>
              </Link>
            </li>
            <li className="">
              <Link href="/dashboard-in-progress-applicants">
                <a
                  className={`px-10 py-1 my-5 font-size-4 font-weight-semibold flex-y-center ${
                    selectedMenu &&
                    selectedMenu.length > 0 &&
                    selectedMenu === "in-progress" &&
                    "sidebar-menu-selected"
                  }`}
                  onClick={() => setSelectedMenu("in-progress")}
                >
                  <i
                    className={`fas fa-user mr-7 ${
                      selectedMenu &&
                      selectedMenu.length > 0 &&
                      selectedMenu === "in-progress" &&
                      "sidebar-menu-selected"
                    }`}
                  ></i>
                  In-Progress Applicants
                  {/* <span className="ml-auto px-1 h-1 bg-dodger text-white font-size-3 rounded-5 max-height-px-18 flex-all-center">
                    14
                  </span> */}
                </a>
              </Link>
            </li>
            <li className="">
              <Link href="/dashboard-accepted">
                <a
                  className={`px-10 py-1 my-5 font-size-4 font-weight-semibold flex-y-center ${
                    selectedMenu &&
                    selectedMenu.length > 0 &&
                    selectedMenu === "accepted" &&
                    "sidebar-menu-selected"
                  }}`}
                  onClick={() => setSelectedMenu("accepted")}
                >
                  <i
                    className={`fas fa-user mr-7 ${
                      selectedMenu &&
                      selectedMenu.length > 0 &&
                      selectedMenu === "accepted" &&
                      "sidebar-menu-selected"
                    }`}
                  ></i>
                  Accepted Applicants
                </a>
              </Link>
            </li>
            <li className="">
              <Link href="/dashboard-rejected">
                <a
                  className={`px-10 py-1 my-5 font-size-4 font-weight-semibold flex-y-center ${
                    selectedMenu &&
                    selectedMenu.length > 0 &&
                    selectedMenu === "rejected" &&
                    "sidebar-menu-selected"
                  }`}
                  onClick={() => setSelectedMenu("rejected")}
                >
                  <i
                    className={`fas fa-user mr-7 ${
                      selectedMenu &&
                      selectedMenu.length > 0 &&
                      selectedMenu === "rejected" &&
                      "sidebar-menu-selected"
                    }`}
                  ></i>
                  Rejected Applicants
                </a>
              </Link>
            </li>
            {selectedCompanyInfo && selectedCompanyInfo.pubkey && (
              <li className="">
                <Link href="/dashboard-update-company">
                  <a
                    className={`px-10 py-1 my-5 font-size-4 font-weight-semibold flex-y-center ${
                      selectedMenu &&
                      selectedMenu.length > 0 &&
                      selectedMenu === "update-company" &&
                      "sidebar-menu-selected"
                    }`}
                    onClick={() => setSelectedMenu("update-company")}
                  >
                    <i
                      className={`fas fa-cog mr-7 ${
                        selectedMenu &&
                        selectedMenu.length > 0 &&
                        selectedMenu === "update-company" &&
                        "sidebar-menu-selected"
                      }`}
                    ></i>
                    Update company profile
                  </a>
                </Link>
              </li>
            )}
            <li className="">
              <Link href="/dashboard-add-company">
                <a
                  className={`px-10 py-1 my-5 font-size-4 font-weight-semibold flex-y-center ${
                    selectedMenu &&
                    selectedMenu.length > 0 &&
                    selectedMenu === "add-company" &&
                    "sidebar-menu-selected"
                  }`}
                  onClick={() => setSelectedMenu("add-company")}
                >
                  <i
                    className={`fas fa-plus mr-7 ${
                      selectedMenu &&
                      selectedMenu.length > 0 &&
                      selectedMenu === "add-company" &&
                      "sidebar-menu-selected"
                    }`}
                  ></i>
                  Add company
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
