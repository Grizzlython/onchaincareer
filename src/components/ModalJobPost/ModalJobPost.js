import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Modal, Nav, Tab } from "react-bootstrap";
import GlobalContext from "../../context/GlobalContext";
import { Button, Select } from "../Core";
import {
  currencies,
  countries,
  defaultCurrencyTypes,
  defaultCategories,
  remoteJobTypes,
  jobTypes,
  skillsJson,
} from "../../staticData";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { BN } from "bn.js";
import { toast } from "react-toastify";
import { Stepper } from "react-form-stepper";
import Loader from "../Loader";
import { useRouter } from "next/router";

const ModalStyled = styled(Modal)`
  /* &.modal {
    z-index: 10050;
  } */
`;

const ModalJobPost = (props) => {
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [category, setCategory] = useState([defaultCategories[0]]);
  const [jobType, setJobType] = useState(jobTypes[0]);
  const [currencyType, setCurrencyType] = useState(defaultCurrencyTypes[0]);
  const [currency, setCurrency] = useState(currencies[0]);
  const [minSalary, setMinSalary] = useState(0);
  const [maxSalary, setMaxSalary] = useState(0);
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState([]);
  const [qualification, setQualification] = useState("");
  const [description, setDescription] = useState("");

  const [jobLocationType, setJobLocationType] = useState(remoteJobTypes[0]);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  const gContext = useContext(GlobalContext);

  const { loading } = gContext;

  const { signTransaction, publicKey } = useWallet();
  const { connection } = useConnection();

  const router = useRouter();

  const {
    jobDetails,
    selectedCompanyInfo,
    updateJobPost,
    updateJobPostLongDescription,
  } = gContext;

  useEffect(() => {
    if (!jobDetails || !publicKey) return;

    setTitle(jobDetails?.job_title);
    setShortDescription(jobDetails?.short_description);
    setDescription(jobDetails?.long_description);

    const selectedCategories = [];
    for (let i = 0; i < jobDetails?.category.length; i++) {
      const category = defaultCategories.filter(
        (category) => category.value === jobDetails?.category[i]
      )[0];
      selectedCategories.push({ ...category });
    }
    setCategory(selectedCategories);

    const jobType = jobTypes.filter(
      (type) => type.value === jobDetails?.job_type
    );

    if (jobType && jobType.length > 0) setJobType({ ...jobType[0] });
    let currencyType = defaultCurrencyTypes.filter(
      (currency) => currency.value === jobDetails?.currency_type
    );
    if (currencyType && currencyType.length > 0)
      setCurrencyType({
        ...currencyType[0],
      });
    const currency = currencies.filter(
      (currency) => currency.value === jobDetails?.currency
    );
    if (currency && currency.length > 0) setCurrency({ ...currency[0] });
    setMinSalary(jobDetails?.min_salary);
    setMaxSalary(jobDetails?.max_salary);
    setExperience(jobDetails?.experience_in_months);
    setSkills(jobDetails?.skills);
    setQualification(jobDetails?.qualification);
    const jobLocationType = remoteJobTypes.filter(
      (type) => type.value === jobDetails?.job_location_type
    );
    if (jobLocationType && jobLocationType.length > 0)
      setJobLocationType({
        ...jobLocationType[0],
      });
    setCountry({ value: jobDetails?.country, label: jobDetails?.country });
    setCity(jobDetails?.city);
  }, [jobDetails]);

  const [archived, setArchived] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const updateJobPostInfo = async (e) => {
    try {
      e.preventDefault();
      if (!selectedCompanyInfo) {
        toast.error("Please select a company profile and try again");
        return;
      }
      const categories = [];
      if (category && category.length > 0)
        category.forEach((element) => categories.push(element.value));

      const jobPostInfo = {
        archived: archived,
        job_title: title, //128
        short_description: shortDescription, //256
        category: categories, //32*4+10+10 //category   is an array of job category like Frontend Developer
        job_type: jobType && jobType.value.length > 0 ? jobType.value : "", //16 full-time, part-time, contract, internship",
        currency_type:
          currencyType && currencyType.value.length > 0
            ? currencyType.value
            : "", //8 fiat, crypto
        currency: currency && currency.value.length > 0 ? currency.value : "", //8 USD, ETH, BTC, etc
        min_salary: new BN(minSalary), //8 u64
        max_salary: new BN(maxSalary), //8 u64
        experience_in_months: new BN(experience), //8 u64
        skills: skills && skills.length > 0 ? skills : [], //64*10+10+10 // ReactJs, NodeJs, etc
        qualification: qualification, //512
        job_location_type:
          jobLocationType && jobLocationType.value.length > 0
            ? jobLocationType.value
            : "", //32
        country:
          jobLocationType &&
          jobLocationType.value.length > 0 &&
          jobLocationType.value === "remote"
            ? "Any"
            : country.value, //64
        city: city, //64
        job_number: jobDetails ? jobDetails?.job_number : "",
      };

      const selectedCompanyPubkey =
        selectedCompanyInfo && selectedCompanyInfo?.pubkey;

      if (!selectedCompanyPubkey) {
        toast.error("Please select a valid company profile and try again");
        return;
      }

      await updateJobPost(
        publicKey,
        jobPostInfo,
        selectedCompanyPubkey,
        connection,
        signTransaction
      );
      toast.success("Job post basic info updated successfully");
      gContext.toggleJobPostModal();

      router.push("/dashboard-main");
    } catch (err) {
      console.log(err, "err in updateJobPostInfo");
      toast.error(
        (err && err.message) || "Something went wrong while updating job post."
      );
    }
  };

  const updateLongDescription = async (e) => {
    try {
      e.preventDefault();

      if (!jobDetails) return;

      if (!description && !description.length > 0) {
        toast.error("Please enter description");
        return;
      }

      const longDescriptionInfo = {
        long_description:
          description && description.length > 0 ? description : "", //1024
        job_number: jobDetails.job_number,
      };

      const res = await updateJobPostLongDescription(
        publicKey,
        longDescriptionInfo,
        selectedCompanyInfo.pubkey,
        connection,
        signTransaction
      );

      if (res.status && res.jobpost_info_account) {
        toast.success("Job post added successfully");
        router.push("/dashboard-main");
      }
      gContext.toggleJobPostModal();

      console.log(res, "res");
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleClose = () => {
    gContext.toggleJobPostModal();
  };

  const handleSkills = (e) => {
    console.log(e, "value");
    // map throough e and get the values and set it to skills
    const selectedSkills = [];
    e.map((item) => {
      console.log(item.value, "value");
      selectedSkills.push(item.value);
    });
    console.log(selectedSkills, "selectedSkills");
    setSkills(selectedSkills);
  };

  const handleSetCategory = (e) => {
    // limit to 5
    if (e.length > 5) {
      toast.error("You can select maximum 5 categories");
      return;
    }
    setCategory(e);
  };

  const handleSetSkills = (e) => {
    // limit to 10
    if (e.length > 10) {
      toast.error("You can select maximum 10 skills");
      return;
    }
    handleSkills(e);
  };

  return (
    <ModalStyled
      {...props}
      size="xl"
      centered
      show={gContext.jobPostModalVisible}
      onHide={gContext.toggleJobPostModal}
      backdrop="static"
    >
      <Modal.Body
        className="p-0"
        // style={{
        //   backgroundColor: "#e5e5e5",
        // }}
        style={{
          minHeight: "70vh",
        }}
      >
        <button
          type="button"
          className="circle-32 btn-reset bg-white pos-abs-tr mt-md-n6 mr-lg-n6 focus-reset z-index-supper"
          onClick={handleClose}
        >
          <i className="fas fa-times"></i>
        </button>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <Loader />
          </div>
        ) : (
          <div className="container">
            <div className="mb-15 mb-lg-23">
              <div className="row">
                <div className="col-xxxl-9 px-lg-13 px-6 pt-15">
                  {/* <h5 className="font-size-6 font-weight-semibold mb-4 mt-11 text-center">
                  Update job post
                </h5> */}

                  <Tab.Container defaultActiveKey="first" className="mt-9">
                    <Nav
                      className=" justify-content-center border-bottom border-mercury pl-12 font-weight-semibold font-size-4 "
                      role={"tablist"}
                      as="ul"
                    >
                      <li className="tab-menu-items nav-item pr-12">
                        <Nav.Link
                          eventKey="first"
                          className="font-size-4 text-uppercase"
                        >
                          Update basic info
                        </Nav.Link>
                      </li>
                      <li className="tab-menu-items nav-item pr-12">
                        <Nav.Link
                          eventKey="second"
                          className="font-size-4 text-uppercase"
                        >
                          Update long description
                        </Nav.Link>
                      </li>
                    </Nav>

                    <Tab.Content>
                      <Tab.Pane eventKey="first">
                        <div className="contact-form bg-white shadow-8 rounded-4 pl-sm-10 pl-4 pr-sm-11 pr-4 pt-15 pb-13">
                          <form action="/">
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
                                      className="basic-multi-select"
                                      border={true}
                                      placeholder="Select Category"
                                      isMulti={true}
                                      value={category}
                                      onChange={handleSetCategory}
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
                                      maxLength="64"
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
                                      options={remoteJobTypes}
                                      className="basic-multi-select"
                                      border={true}
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
                                          className="basic-multi-select"
                                          border={true}
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
                                          onChange={(e) =>
                                            setCity(e.target.value)
                                          }
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
                                      className="basic-multi-select"
                                      border={true}
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
                                      className="basic-multi-select"
                                      border={true}
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
                                      className="basic-multi-select"
                                      border={true}
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
                                      maxLength={8}
                                      value={minSalary}
                                      onChange={(e) =>
                                        setMinSalary(e.target.value)
                                      }
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
                                      maxLength={8}
                                      value={maxSalary}
                                      onChange={(e) =>
                                        setMaxSalary(e.target.value)
                                      }
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
                                      maxLength={8}
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
                                    <div
                                      style={{
                                        position: "absolute",
                                        right: "20px",
                                        top: "0",
                                        color: "#000",
                                      }}
                                    >
                                      <span>{shortDescription?.length}</span>/
                                      <span>256</span>{" "}
                                    </div>
                                    <textarea
                                      name="textarea"
                                      id="sdesc"
                                      cols="30"
                                      rows="4"
                                      className="border border-mercury text-gray w-100 pt-4 pl-6"
                                      placeholder="Describe about the job"
                                      maxLength={256}
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
                                    <Select
                                      isMulti
                                      onChange={handleSetSkills}
                                      options={skillsJson}
                                      value={skills.map((skill) => {
                                        return { value: skill, label: skill };
                                      })}
                                      placeholder="eg. Html, css, js"
                                      className="basic-multi-select"
                                      border={true}
                                    />
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <input
                                      type="button"
                                      value="Update job post"
                                      className="btn btn-green btn-h-60 text-white min-width-px-210 rounded-5 text-uppercase"
                                      onClick={updateJobPostInfo}
                                    />
                                  </div>
                                </div>
                              </div>
                            </fieldset>
                          </form>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="second">
                        <div className="contact-form bg-white shadow-8 rounded-4 pl-sm-10 pl-4 pr-sm-11 pr-4 pt-15 pb-13">
                          <form action="/">
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
                                    <div
                                      style={{
                                        position: "absolute",
                                        right: "20px",
                                        top: "0",
                                        color: "#000",
                                      }}
                                    >
                                      <span>{description.length}</span>/
                                      <span>1024</span>{" "}
                                    </div>
                                    <textarea
                                      name="textarea"
                                      id="aboutTextarea"
                                      cols="30"
                                      rows="7"
                                      className="border border-mercury text-gray w-100 pt-4 pl-6"
                                      placeholder="Description about the job"
                                      maxLength={1024}
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
                                      value="Update Job"
                                      className="btn btn-green btn-h-60 text-white min-width-px-210 rounded-5 text-uppercase"
                                      onClick={updateLongDescription}
                                    />
                                  </div>
                                </div>
                              </div>
                            </fieldset>
                          </form>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal.Body>
    </ModalStyled>
  );
};

export default ModalJobPost;
