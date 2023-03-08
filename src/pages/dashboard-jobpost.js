import React from "react";

import PageWrapper from "../components/PageWrapper";
import { Select, Switch } from "../components/Core";
import SidebarDashboard from "../components/SidebarDashboard";
import { useContext } from "react";
import GlobalContext from "../context/GlobalContext";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { countries, currencies } from "../staticData";
import { BN } from "bn.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Col, Form, Row } from "react-bootstrap";
import { Steps, StepsProvider, useSteps } from "react-step-builder";

import { Stepper } from "react-form-stepper";

const defaultTypes = [
  { value: "b2b", label: "B2B" },
  { value: "saas", label: "SAAS" },
  { value: "b2b", label: "b2b" },
];

const jobTypes = [
  { value: "Full-Time", label: "Full-Time" },
  { value: "Part-Time", label: "Part-Time" },
  { value: "Freelancer", label: "Freelancer" },
  { value: "Internship", label: "Internship" },
];

const defaultCategories = [
  { value: "marketing", label: "Marketing" },
  { value: "development", label: "Development" },
  { value: "design", label: "Design" },
  { value: "business_development", label: "Business Development" },
  { value: "customer_service", label: "Customer service" },
  { value: "sales_&_communication", label: "Sales & Communication" },
  { value: "project_management", label: "Project Management" },
  { value: "human_resource", label: "Human Resource" },
];

const defaultCurrencyTypes = [
  { value: "fiat", label: "Fiat" },
  { value: "crypto", label: "Crypto" },
];

const defaultJobLocationTypes = [
  {
    label: "Yes",
    value: "remote",
  },
  {
    label: "No",
    value: "inOffice",
  },
];

export default function DashboardJobPost() {
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [category, setCategory] = useState([defaultCategories[0]]);
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState(jobTypes[0]);
  const [minSalary, setMinSalary] = useState(0);
  const [maxSalary, setMaxSalary] = useState(0);
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [qualification, setQualification] = useState("");
  const [description, setDescription] = useState("");

  const [jobLocationType, setJobLocationType] = useState(
    defaultJobLocationTypes[0]
  );
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [currencyType, setCurrencyType] = useState("");
  const [currency, setCurrency] = useState("");

  console.log(defaultCategories, "defaultCategories");

  const gContext = useContext(GlobalContext);

  const { selectedCompanyInfo, addJobPost } = gContext;

  // console.log(category, "category");

  // console.log(skills.split(","), "skills");
  // console.log(gContext.user, "gContext");
  const { publicKey, wallet, signTransaction } = useWallet();
  const { connection } = useConnection();

  const user_info_state_account = gContext.userStateAccount;
  const router = useRouter();

  useEffect(() => {
    // gContext.getCompanyProfileByUsername(gContext.user?.username);
    if (
      // !gContext.user?.isCompanyProfileComplete ||

      !gContext.user?.userType === "recruiter"
    ) {
      Router.push("/");
      toast.error("Not allowed to view this page");
    }

    // if (publicKey) {
    //   (async () => {
    //     await gContext.getCompanyProfileByUsername(
    //       user_info_state_account,
    //       connection
    //     );
    //   })();
    // }
  }, [publicKey]);

  const handleAddJobPost = async (e) => {
    try {
      e.preventDefault();

      let notFilledFields = "";
      if (!title) {
        notFilledFields = "Title,";
      }
      if (!shortDescription) {
        notFilledFields += "Short Description,";
      }

      if (!category) {
        notFilledFields += "Category,";
      }
      if (!jobType) {
        notFilledFields += "Job Type,";
      }
      if (!currencyType) {
        notFilledFields += "Currency Type,";
      }
      if (!currency) {
        notFilledFields += "Currency,";
      }
      if (!minSalary) {
        notFilledFields += "Min Salary,";
      }
      if (!maxSalary) {
        notFilledFields += "Max Salary,";
      }
      if (!experience) {
        notFilledFields += "Experience,";
      }
      if (!skills) {
        notFilledFields += "Skills,";
      }
      if (!qualification) {
        notFilledFields += "Qualification,";
      }
      if (!jobLocationType) {
        notFilledFields += "Job Location Type,";
      }

      if (notFilledFields && notFilledFields.length > 0) {
        toast.error(`Please fill ${notFilledFields} fields`, {
          duration: 20000,
        });
        return;
      }

      console.log(category, "category");

      const categories = [];
      category.map((item) => categories.push(item.value));

      const jobPostInfo = {
        job_title: title, //128
        short_description: shortDescription, //256
        long_description: description, //1024
        category: categories, //32*4+10+10 //category is an array of job category like Frontend Developer
        job_type: jobType.value, //16 full-time, part-time, contract, internship",
        currency_type: currencyType.value, //8 fiat, crypto
        currency: currency.value, //8 USD, ETH, BTC, etc
        min_salary: new BN(minSalary), //8 u64
        max_salary: new BN(maxSalary), //8 u64
        experience_in_months: new BN(experience), //8 u64
        skills: skills.split(","), //64*10+10+10 // ReactJs, NodeJs, etc
        qualification: qualification, //512
        job_location_type: jobLocationType.value, //32
        country: jobLocationType.value === "remote" ? "" : country.value, //64
        city: city, //64
      };

      const company_seq_number = selectedCompanyInfo?.company_seq_number;

      console.log(jobPostInfo, "payload-job-post");
      console.log(selectedCompanyInfo, "companyName");

      console.log(company_seq_number, "company_seq_number");

      await addJobPost(
        wallet.adapter,
        publicKey,
        jobPostInfo,
        company_seq_number,
        connection,
        signTransaction
      );

      router.push("/dashboard-main");
    } catch (error) {
      console.log(error, "error");
    }
  };

  const [activeStep, setActiveStep] = useState(0);

  return (
    <>
      <PageWrapper
        headerConfig={{
          button: "profile",
          isFluid: true,
          bgClass: "bg-default",
          reveal: false,
        }}
      >
        <div
          className="dashboard-main-container mt-24 mt-lg-31"
          id="dashboard-body"
        >
          <div className="container">
            <div className="mb-15 mb-lg-23">
              <div className="row">
                <div className="col-xxxl-9 px-lg-13 px-6">
                  <h5 className="font-size-6 font-weight-semibold mb-11">
                    Post a Job
                  </h5>
                  <Stepper
                    steps={[
                      { label: "Basic job info" },
                      { label: "Job description" },
                    ]}
                    styleConfig={{
                      size: 50,
                      completedBgColor: "#007d52",
                      activeBgColor: "#333541",
                    }}
                    activeStep={activeStep}
                  />
                  {/* <StepsProvider>
                    <Steps>
                      <div>
                        <h1>Step 1</h1>
                      </div>
                      <div>
                        <h1>Step 2</h1>
                      </div>
                      <div>
                        <h1>Step 3</h1>
                      </div>
                    </Steps>
                  </StepsProvider> */}

                  <div className="contact-form bg-white shadow-8 rounded-4 pl-sm-10 pl-4 pr-sm-11 pr-4 pt-15 pb-13">
                    {/* <div className="upload-file mb-16 text-center">
                      <div
                        id="userActions"
                        className="square-144 m-auto px-6 mb-7"
                      >
                        <label
                          htmlFor="fileUpload"
                          className="mb-0 font-size-4 text-smoke"
                        >
                          Browse or Drag and Drop
                        </label>
                        <input
                          type="file"
                          id="fileUpload"
                          className="sr-only"
                        />
                      </div>
                    </div> */}
                    <form action="/">
                      {activeStep === 0 && (
                        <fieldset>
                          <div className="row mb-xl-1 mb-9">
                            <div className="col-lg-6">
                              <div className="form-group position-relative">
                                <label
                                  htmlFor="category"
                                  className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                >
                                  Job Category
                                </label>
                                <Select
                                  options={defaultCategories}
                                  className="form-control pl-0 arrow-3 w-100 font-size-4 d-flex align-items-center w-100 "
                                  border={false}
                                  placeholder="Select Category"
                                  isMulti={true}
                                  value={category}
                                  onChange={setCategory}
                                />
                                <span className="h-100 w-px-50 pos-abs-tl d-flex align-items-center justify-content-center font-size-6"></span>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label
                                  htmlFor="namedash"
                                  className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                >
                                  Job Title
                                </label>
                                <input
                                  type="text"
                                  className="form-control h-px-48"
                                  id="namedash"
                                  placeholder="eg. Frontend Developer"
                                  value={title}
                                  onChange={(e) => setTitle(e.target.value)}
                                  maxLength="32"
                                />
                              </div>
                            </div>

                            <div className="col-lg-6 mb-xl-0 mb-7">
                              <div className="form-group position-relative">
                                <label
                                  htmlFor="location"
                                  className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                >
                                  Is remote job ?
                                </label>
                                <Select
                                  options={defaultJobLocationTypes}
                                  className="form-control pl-0 arrow-3 w-100 font-size-4 d-flex align-items-center w-100 "
                                  border={false}
                                  placeholder="Select job location type"
                                  value={jobLocationType}
                                  onChange={setJobLocationType}
                                />
                              </div>
                            </div>
                            {jobLocationType?.value === "inOffice" && (
                              <>
                                <div className="col-lg-6 mb-xl-0 mb-7">
                                  <div className="form-group position-relative">
                                    <label
                                      htmlFor="location"
                                      className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                    >
                                      Country
                                    </label>
                                    <Select
                                      options={countries}
                                      className="form-control pl-0 arrow-3 w-100 font-size-4 d-flex align-items-center w-100 "
                                      border={false}
                                      placeholder="Select country"
                                      value={country}
                                      onChange={setCountry}
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6 mb-xl-0 mb-7">
                                  <div className="form-group position-relative">
                                    <label
                                      htmlFor="location"
                                      className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                    >
                                      City
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control h-px-48"
                                      id="location"
                                      placeholder="eg. Chicago"
                                      maxLength={32}
                                      value={city}
                                      onChange={(e) => setCity(e.target.value)}
                                    />
                                  </div>
                                </div>
                              </>
                            )}
                            <div className="col-lg-6 mb-xl-0 mb-7">
                              <div className="form-group position-relative">
                                <label
                                  htmlFor="location"
                                  className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                >
                                  Currency type
                                </label>
                                <Select
                                  options={defaultCurrencyTypes}
                                  className="form-control pl-0 arrow-3 w-100 font-size-4 d-flex align-items-center w-100 "
                                  border={false}
                                  placeholder="Select currency type"
                                  value={currencyType}
                                  onChange={setCurrencyType}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 mb-xl-0 mb-7">
                              <div className="form-group position-relative">
                                <label
                                  htmlFor="location"
                                  className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                >
                                  Currency
                                </label>
                                <Select
                                  options={currencies}
                                  className="form-control pl-0 arrow-3 w-100 font-size-4 d-flex align-items-center w-100 "
                                  border={false}
                                  placeholder="Select currency"
                                  value={currency}
                                  onChange={setCurrency}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="form-group position-relative">
                                <label
                                  htmlFor="address"
                                  className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                >
                                  Job Type
                                </label>
                                <Select
                                  options={jobTypes}
                                  className="form-control pl-0 arrow-3 w-100 font-size-4 d-flex align-items-center w-100 "
                                  border={false}
                                  placeholder="Select Job Type"
                                  value={jobType}
                                  onChange={setJobType}
                                />
                                <span className="h-100 w-px-50 pos-abs-tl d-flex align-items-center justify-content-center font-size-6"></span>
                              </div>
                            </div>
                          </div>
                          <div className="row mb-8">
                            <div className="col-lg-6">
                              <div className="form-group position-relative">
                                <label
                                  htmlFor="salaryRange"
                                  className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                >
                                  Min salary
                                </label>
                                <input
                                  type="number"
                                  className="form-control h-px-48"
                                  id="salaryRange"
                                  placeholder="eg. 800"
                                  maxLength={32}
                                  value={minSalary}
                                  onChange={(e) => setMinSalary(e.target.value)}
                                />
                                <span className="h-100 w-px-50 pos-abs-tl d-flex align-items-center justify-content-center font-size-6"></span>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="form-group position-relative">
                                <label
                                  htmlFor="salaryRange"
                                  className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                >
                                  Max salary
                                </label>
                                <input
                                  type="number"
                                  className="form-control h-px-48"
                                  id="salaryRange"
                                  placeholder="eg. 1000"
                                  maxLength={32}
                                  value={maxSalary}
                                  onChange={(e) => setMaxSalary(e.target.value)}
                                />
                                <span className="h-100 w-px-50 pos-abs-tl d-flex align-items-center justify-content-center font-size-6"></span>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="form-group position-relative">
                                <label
                                  htmlFor="experience"
                                  className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                >
                                  Experience in months
                                </label>
                                <input
                                  type="number"
                                  className="form-control h-px-48"
                                  id="experience"
                                  placeholder="eg. 24"
                                  maxLength={128}
                                  value={experience}
                                  onChange={(e) =>
                                    setExperience(e.target.value)
                                  }
                                />
                                <span className="h-100 w-px-50 pos-abs-tl d-flex align-items-center justify-content-center font-size-6"></span>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="form-group position-relative">
                                <label
                                  htmlFor="qualification"
                                  className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                >
                                  Qualification
                                </label>
                                <input
                                  type="text"
                                  className="form-control h-px-48"
                                  id="qualification"
                                  placeholder="eg. Bachelor's degree in Computer Science"
                                  maxLength={128}
                                  value={qualification}
                                  onChange={(e) =>
                                    setQualification(e.target.value)
                                  }
                                />
                                <span className="h-100 w-px-50 pos-abs-tl d-flex align-items-center justify-content-center font-size-6"></span>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12">
                              <div className="form-group">
                                <label
                                  htmlFor="sdesc"
                                  className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                >
                                  Short Description
                                </label>

                                <textarea
                                  name="textarea"
                                  id="sdesc"
                                  cols="30"
                                  rows="4"
                                  className="border border-mercury text-gray w-100 pt-4 pl-6"
                                  placeholder="Describe about the job"
                                  maxLength={2048}
                                  value={shortDescription}
                                  onChange={(e) =>
                                    setShortDescription(e.target.value)
                                  }
                                ></textarea>
                              </div>
                            </div>

                            <div className="col-md-12">
                              <div className="form-group mb-11">
                                <label
                                  htmlFor="formGroupExampleInput"
                                  className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                >
                                  Skills (Comma separated)
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="formGroupExampleInput"
                                  placeholder="eg. Html, css, js"
                                  maxLength={256}
                                  value={skills}
                                  onChange={(e) => setSkills(e.target.value)}
                                />
                              </div>

                              <input
                                type="button"
                                value="Next"
                                className="btn btn-green btn-h-60 text-white min-width-px-210 rounded-5 text-uppercase"
                                onClick={handleAddJobPost}
                              />
                            </div>
                          </div>
                        </fieldset>
                      )}

                      {activeStep === 1 && (
                        <fieldset>
                          <div className="row">
                            <div className="col-md-12">
                              <div className="form-group">
                                <label
                                  htmlFor="aboutTextarea"
                                  className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                >
                                  Job Description
                                </label>
                                <textarea
                                  name="textarea"
                                  id="aboutTextarea"
                                  cols="30"
                                  rows="7"
                                  className="border border-mercury text-gray w-100 pt-4 pl-6"
                                  placeholder="Describe about the job"
                                  maxLength={2048}
                                  value={description}
                                  onChange={(e) =>
                                    setDescription(e.target.value)
                                  }
                                ></textarea>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div
                                style={{
                                  display: "flex",
                                }}
                              >
                                <input
                                  type="button"
                                  value="Back"
                                  className="btn btn-outline-gray btn-h-60 text-black mr-4 min-width-px-210 rounded-5 text-uppercase"
                                  onClick={() => setActiveStep(0)}
                                />
                                <input
                                  type="button"
                                  value="Post Job"
                                  className="btn btn-green btn-h-60 text-white min-width-px-210 rounded-5 text-uppercase"
                                  onClick={handleAddJobPost}
                                />
                              </div>
                            </div>
                          </div>
                        </fieldset>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
