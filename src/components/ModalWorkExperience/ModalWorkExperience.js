import React, { useContext, useState } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import GlobalContext from "../../context/GlobalContext";
import { Select } from "../Core";

import { useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Loader from "../Loader";

const currentEmploymentStatus = [
  { value: "employed", label: "Employed" },
  { value: "unemployed", label: "Unemployed" },
  { value: "self-Employed", label: "Self-Employed" },
  { value: "student", label: "Student" },
];

const canJoinIn = [
  { value: "immediately", label: "Immediately" },
  { value: "within 1 month", label: "1 Month" },
  { value: "within 2 months", label: "2 Months" },
  { value: "within 3 months", label: "3 Months" },
  { value: "later", label: "More than 3 months" },
];

const ModalStyled = styled(Modal)`
  /* &.modal {
    z-index: 10050;
  } */
`;

const ModalWorkExperience = (props) => {
  const gContext = useContext(GlobalContext);

  const applicantWorkExperiences = gContext.workExperience;

  const to_be_updated_work_experience_number =
    gContext.currentWorkflowSequenceNumber;

  const [workExperience, setWorkExperience] = useState({
    archived: false,
    company_name: "",
    designation: "",
    is_currently_working_here: false,
    start_date: "",
    end_date: "",
    description: "",
    location: "",
    website: "",
  });

  const { loading } = gContext;

  // const handleAddWorkExperienceInput = async (e) => {
  //   e.preventDefault();
  // };

  const [archived, setArchived] = useState(false);
  const handleChange = (e) => {
    setArchived(!archived);
    handleToggleofArchive(e);
  };

  const handleToggleofArchive = async (e) => {
    e.preventDefault();
    workExperience.archived = !workExperience.archived;
    setWorkExperience({ ...workExperience });
  };

  const handleWorkExperience = async (e, key) => {
    if (key === "is_currently_working_here") {
      const selectValue = e.value;
      const workExperienceCopy = { ...workExperience };
      workExperienceCopy[key] = selectValue;
      setWorkExperience(workExperienceCopy);
      return;
    }

    const { value } = e.target;

    const workExperienceCopy = { ...workExperience };
    workExperienceCopy[key] = value;
    setWorkExperience(workExperienceCopy);
  };

  const handleClose = () => {
    gContext.toggleWorkExperienceModal();
  };

  const { publicKey, signTransaction, connected } = useWallet();
  const { connection } = useConnection();

  const resetForm = () => {
    setWorkExperience({
      archived: false,
      company_name: "",
      designation: "",
      is_currently_working_here: false,
      start_date: "",
      end_date: "",
      description: "",
      location: "",
      website: "",
    });
  };

  const addOrUpdateWorkExperience = async () => {
    try {
      if (!publicKey) {
        toast.error("Please connect your wallet");
        return;
      }

      console.log(workExperience, "workExperience");
      if (workExperience.start_date && workExperience.start_date !== "NaN") {
        workExperience.start_date = new Date(workExperience.start_date)
          .getTime()
          .toString();
      }
      if (workExperience.end_date && workExperience.end_date !== "NaN") {
        workExperience.end_date = new Date(workExperience.end_date)
          .getTime()
          .toString();
      }

      if (
        !workExperience.is_currently_working_here &&
        !workExperience.end_date
      ) {
        workExperience.end_date = new Date().getTime().toString();
      }

      if (workExperience.is_currently_working_here) {
        workExperience.end_date = null;
      }

      const payload = {
        ...workExperience,
      };

      const notDefined = Object.keys(payload).filter(
        (key) => payload[key] === undefined
      );

      if (notDefined && notDefined.length > 0) {
        toast.error(`Please fill ${notDefined.join(", ")}`);
        return;
      }

      let notFilled = Object.keys(payload).filter((key) => payload[key] === "");

      // replace underscore with space and capitalize first letter
      notFilled = notFilled.map((key) => {
        return key
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      });

      if (notFilled && notFilled.length > 0) {
        toast.error(`Please fill ${notFilled.join(", ")}`);
        return;
      }

      if (to_be_updated_work_experience_number) {
        payload.work_experience_number = to_be_updated_work_experience_number;
        await gContext.updateWorkExperience(
          publicKey,
          payload,
          connection,
          signTransaction
        );
        // toast.success("Work experience updated successfully");
        resetForm();
      } else {
        await gContext.addWorkExperience(
          publicKey,
          payload,
          connection,
          signTransaction
        );
        // toast.success("Work experience added successfully");
        resetForm();
      }
      handleClose();
    } catch (error) {
      console.log(error.message, "Error in adding work experience");
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (
      applicantWorkExperiences.length > 0 &&
      to_be_updated_work_experience_number
    ) {
      const workEx = applicantWorkExperiences.filter(
        (work) =>
          work.work_experience_number === to_be_updated_work_experience_number
      );
      if (workEx.length > 0) {
        const tempWorkEx = { ...workEx[0] };
        if (tempWorkEx.start_date && tempWorkEx.start_date !== "NaN") {
          tempWorkEx.start_date = new Date(parseInt(tempWorkEx.start_date))
            .toISOString()
            .slice(0, 10);
        }
        if (tempWorkEx.end_date && tempWorkEx.end_date !== "NaN") {
          tempWorkEx.end_date = new Date(parseInt(tempWorkEx.end_date))
            .toISOString()
            .slice(0, 10);
        }
        setWorkExperience({ ...tempWorkEx });
      }
    }
  }, [to_be_updated_work_experience_number]);

  return (
    <ModalStyled
      {...props}
      size="xl"
      centered
      show={gContext.workExperienceModalVisible}
      onHide={gContext.toggleWorkExperienceModal}
      backdrop="static"
    >
      <Modal.Body
        className="p-0"
        // style={{
        //   backgroundColor: "#e5e5e5",
        // }}
      >
        <button
          type="button"
          className="circle-32 btn-reset bg-white pos-abs-tr mt-md-n6 mr-lg-n6 focus-reset z-index-supper"
          onClick={handleClose}
        >
          <i className="fas fa-times"></i>
        </button>
        <div
          className="mt-12"
          id="dashboard-body"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          {loading ? (
            <Loader />
          ) : (
            <div className="container">
              <div className="mb-12 mb-lg-23">
                <div className="row">
                  <div className="col-xxxl-9 px-lg-13 px-6">
                    <h5 className="font-size-6 font-weight-semibold mb-11">
                      {to_be_updated_work_experience_number ? "Update" : "Add"}{" "}
                      work experience
                    </h5>
                    <div
                      className="contact-form bg-white shadow-8 rounded-4 pl-sm-10 pl-4 pr-sm-11 pr-4 pt-15 pb-13"
                      style={{
                        border: "1px solid #e5e5e5",
                      }}
                    >
                      <form action="/">
                        <fieldset>
                          {workExperience && (
                            <div className="mb-8">
                              <div className="row">
                                <div className="col-lg-6">
                                  <div className="form-group">
                                    <label
                                      htmlFor="weCname"
                                      className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                    >
                                      Company Name
                                    </label>
                                    <input
                                      type="text"
                                      name="weCompanyName"
                                      className="form-control h-px-48"
                                      id="weCname"
                                      placeholder="eg. Solgames"
                                      value={workExperience.company_name}
                                      onChange={(e) =>
                                        handleWorkExperience(
                                          e,

                                          "company_name"
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="form-group">
                                    <label
                                      htmlFor="weDesignation"
                                      className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                    >
                                      Designation
                                    </label>
                                    <input
                                      type="text"
                                      name="weDesignation"
                                      className="form-control h-px-48"
                                      id="weDesignation"
                                      placeholder="eg. Frontend Developer"
                                      value={workExperience.designation}
                                      onChange={(e) =>
                                        handleWorkExperience(
                                          e,

                                          "designation"
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="form-group">
                                    <label
                                      htmlFor="weDescription"
                                      className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                    >
                                      Brief description
                                    </label>
                                    <input
                                      type="text"
                                      name="weDescription"
                                      className="form-control h-px-48"
                                      id="weDescription"
                                      placeholder="eg. Brief description"
                                      value={workExperience.description}
                                      onChange={(e) =>
                                        handleWorkExperience(
                                          e,

                                          "description"
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="form-group">
                                    <label
                                      htmlFor="weCurrentlyWorking"
                                      className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                    >
                                      Are you currently working here ?
                                    </label>
                                    <Select
                                      options={[
                                        { value: true, label: "Yes" },
                                        { value: false, label: "No" },
                                      ]}
                                      value={{
                                        value:
                                          workExperience.is_currently_working_here,
                                        label:
                                          workExperience.is_currently_working_here
                                            ? "Yes"
                                            : "No",
                                      }}
                                      className="basic-multi-select"
                                      border={true}
                                      onChange={(e) =>
                                        handleWorkExperience(
                                          e,

                                          "is_currently_working_here"
                                        )
                                      }
                                    />
                                  </div>
                                </div>

                                <div className="col-lg-6">
                                  <div className="form-group">
                                    <label
                                      htmlFor="weSdate"
                                      className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                    >
                                      Start Date
                                    </label>
                                    <input
                                      type="date"
                                      name="weStartDate"
                                      className="form-control h-px-48"
                                      id="weSdate"
                                      placeholder="eg. Frontend Developer"
                                      value={workExperience.start_date}
                                      onChange={(e) =>
                                        handleWorkExperience(
                                          e,

                                          "start_date"
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                                {workExperience.is_currently_working_here ===
                                  false && (
                                  <div className="col-lg-6">
                                    <div className="form-group">
                                      <label
                                        htmlFor="eDate"
                                        className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                      >
                                        End Date
                                      </label>
                                      <input
                                        type="date"
                                        name="weEndDate"
                                        className="form-control h-px-48"
                                        id="eDate"
                                        placeholder="eg. Frontend Developer"
                                        value={workExperience.end_date}
                                        onChange={(e) =>
                                          handleWorkExperience(e, "end_date")
                                        }
                                      />
                                    </div>
                                  </div>
                                )}
                                <div className="col-lg-6">
                                  <div className="form-group">
                                    <label
                                      htmlFor="weLocation"
                                      className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                    >
                                      Location
                                    </label>
                                    <input
                                      type="text"
                                      name="weLocation"
                                      className="form-control h-px-48"
                                      id="weLocation"
                                      placeholder="eg. New York, US"
                                      value={workExperience.location}
                                      onChange={(e) =>
                                        handleWorkExperience(e, "location")
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="form-group">
                                    <label
                                      htmlFor="weLocation"
                                      className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                    >
                                      Website
                                    </label>
                                    <input
                                      type="text"
                                      name="weLocation"
                                      className="form-control h-px-48"
                                      id="weLocation"
                                      placeholder="eg. https://www.google.com"
                                      value={workExperience.website}
                                      onChange={(e) =>
                                        handleWorkExperience(e, "website")
                                      }
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* <a
                              className="btn btn-outline-red text-uppercase w-180 h-px-48 rounded-5 mr-7 mb-7"
                              onClick={(e) => handleToggleofArchive(e)}
                            >
                              <i className="fa fa-archive mr-2"></i>
                              {!workExperience.archived
                                ? "Archive"
                                : "Unarchive"}
                            </a> */}
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginBottom: "20px",
                                }}
                              >
                                <h5 className="text-black-2 font-size-4 font-weight-semibold mb-4">
                                  Archive ?
                                </h5>
                                <label
                                  class="switch"
                                  style={{
                                    marginLeft: "10px",
                                    marginTop: "10px",
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    id="switchArchive"
                                    onChange={handleChange}
                                  />
                                  <span class="slider round"></span>
                                </label>
                              </div>
                            </div>
                          )}

                          <div className="row">
                            <div className="col-md-12">
                              <input
                                type="button"
                                value="Submit"
                                className="btn btn-green btn-h-60 text-white min-width-px-210 rounded-5 text-uppercase"
                                onClick={addOrUpdateWorkExperience}
                              />
                            </div>
                          </div>
                        </fieldset>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal.Body>
    </ModalStyled>
  );
};

export default ModalWorkExperience;
