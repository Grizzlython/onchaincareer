import React, { useContext, useState } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import GlobalContext from "../../context/GlobalContext";
import { Select } from "../Core";

import { useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

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
  const router = useRouter();

  const gContext = useContext(GlobalContext);

  const [workExperience, setWorkExperience] = useState(
    gContext.workExperience.length > 0
      ? gContext.workExperience
      : [
          {
            companyName: "",
            designation: "",
            isCurrentlyWorkingHere: false,
            startDate: "",
            endDate: "",
            description: "",
            location: "",
          },
        ]
  );

  const handleAddWorkExperienceInput = async (e) => {
    e.preventDefault();
    setWorkExperience([
      ...workExperience,
      {
        companyName: "",
        designation: "",
        isCurrentlyWorkingHere: false,
        startDate: "",
        endDate: "",
        description: "",
        location: "",
      },
    ]);
  };

  const handleRemoveWorkExperienceInput = async (e, index) => {
    e.preventDefault();
    const workExperienceCopy = [...workExperience];

    // prevent removing the last input
    if (workExperienceCopy.length === 1) {
      return;
    }

    workExperienceCopy.splice(index, 1);
    setWorkExperience(workExperienceCopy);
  };

  const handleWorkExperience = async (e, index, key) => {
    if (key === "isCurrentlyWorkingHere") {
      const selectValue = e.value;
      console.log(selectValue, "selectValue");
      const workExperienceCopy = [...workExperience];
      workExperienceCopy[index][key] = selectValue;
      setWorkExperience(workExperienceCopy);
      return;
    }
    const { value } = e.target;
    const workExperienceCopy = [...workExperience];
    workExperienceCopy[index][key] = value;
    setWorkExperience(workExperienceCopy);
  };

  const handleClose = () => {
    gContext.toggleWorkExperienceModal();
  };

  const { publicKey, signTransaction, connected } = useWallet();
  const { connection } = useConnection();

  const handleSaveWorkExperience = async () => {
    try {
      const payload = workExperience;

      // add username to the payload
      payload.map((item, index) => {
        item["username"] = gContext.user?.username;
      });

      console.log(payload, "payload");
      // if (gContext.workExperience.length > 0) {
      //   workExperience.map(async (item, index) => {
      //     await gContext.updateWorkExperience(item.id, item);
      //   });
      // } else {
      //   await gContext.addWorkExperience(payload);
      // }

      workExperience.map(async (item, index) => {
        const payload = {
          archived: false, //1
          company_name: item.companyName, //64
          designation: item.designation, //128
          is_currently_working_here: false, //1
          start_date: new Date().getTime().toString(), //64
          end_date: new Date().getTime().toString(), //64
          description: item.description, //512
          location: item.location, //256
          website: "website url", //128
        };
        await gContext.addWorkExperience(
          publicKey,
          payload,
          connection,
          signTransaction
        );
      });
      handleClose();
    } catch (error) {
      console.log(error.message);
    }
  };

  // useEffect(() => {
  //   if (gContext.workExperience.length > 0) {
  //     setWorkExperience(gContext.workExperience);
  //   }
  // }, [gContext.workExperience]);

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
        <div className="mt-12" id="dashboard-body">
          <div className="container">
            <div className="mb-12 mb-lg-23">
              <div className="row">
                <div className="col-xxxl-9 px-lg-13 px-6">
                  <h5 className="font-size-6 font-weight-semibold mb-11">
                    Add work experience
                  </h5>
                  <div
                    className="contact-form bg-white shadow-8 rounded-4 pl-sm-10 pl-4 pr-sm-11 pr-4 pt-15 pb-13"
                    style={{
                      border: "1px solid #e5e5e5",
                    }}
                  >
                    <form action="/">
                      <fieldset>
                        {workExperience.map((item, index) => (
                          <div className="mb-8">
                            <div className="row" key={index}>
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
                                    value={item.companyName}
                                    onChange={(e) =>
                                      handleWorkExperience(
                                        e,
                                        index,
                                        "companyName"
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
                                    value={item.designation}
                                    onChange={(e) =>
                                      handleWorkExperience(
                                        e,
                                        index,
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
                                    value={item.description}
                                    onChange={(e) =>
                                      handleWorkExperience(
                                        e,
                                        index,
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
                                    className="form-control pl-0 arrow-3 w-100 font-size-4 d-flex align-items-center w-100 "
                                    border={false}
                                    onChange={(e) =>
                                      handleWorkExperience(
                                        e,
                                        index,
                                        "isCurrentlyWorkingHere"
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
                                    value={item.startDate}
                                    onChange={(e) =>
                                      handleWorkExperience(
                                        e,
                                        index,
                                        "startDate"
                                      )
                                    }
                                  />
                                </div>
                              </div>
                              {item.isCurrentlyWorkingHere === false && (
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
                                      value={item.endDate}
                                      onChange={(e) =>
                                        handleWorkExperience(
                                          e,
                                          index,
                                          "endDate"
                                        )
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
                                    value={item.location}
                                    onChange={(e) =>
                                      handleWorkExperience(e, index, "location")
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            {workExperience.length - 1 === index && (
                              <a
                                className="btn btn-outline-green text-uppercase w-180 h-px-48 rounded-5 mr-7 mb-7"
                                onClick={handleAddWorkExperienceInput}
                              >
                                <i className="fa fa-plus mr-2"></i>
                                Add more
                              </a>
                            )}
                            {workExperience.length !== 1 && (
                              <a
                                className="btn btn-outline-red text-uppercase w-180 h-px-48 rounded-5 mr-7 mb-7"
                                onClick={(e) =>
                                  handleRemoveWorkExperienceInput(e, index)
                                }
                              >
                                <i className="fa fa-pen mr-2"></i>
                                Remove
                              </a>
                            )}
                          </div>
                        ))}
                        <pre>{JSON.stringify(workExperience, null, 2)}</pre>
                        <div className="row">
                          <div className="col-md-12">
                            <input
                              type="button"
                              value="Submit"
                              className="btn btn-green btn-h-60 text-white min-width-px-210 rounded-5 text-uppercase"
                              onClick={handleSaveWorkExperience}
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
        </div>
      </Modal.Body>
    </ModalStyled>
  );
};

export default ModalWorkExperience;
