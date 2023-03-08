import React, { useContext, useState } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import GlobalContext from "../../context/GlobalContext";

import { useEffect } from "react";
import { toast } from "react-toastify";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Select } from "../Core";

const educationSchema = {
  school_name: "",
  degree: "",
  field_of_study: "",
  start_date: "",
  end_date: "",
  grade: "",
  activities: [],
  subjects: [],
  description: "",
  is_college: "",
  is_studying: "",
  certificate_uris: [],
};

const ModalStyled = styled(Modal)`
  /* &.modal {
    z-index: 10050;
  } */
`;

const ModalEducation = (props) => {
  const gContext = useContext(GlobalContext);
  const eductions = gContext.educations;
  const currentEducationNumber = gContext.currentEducationNumber;
  console.log(currentEducationNumber, "currentEducationNumber");
  const [candidateEducation, setCandidateEducation] = useState(educationSchema);

  // const handleToggleofArchive = async (e, index) => {
  //   e.preventDefault();
  //   candidateProject.archived = !candidateProject.archived;
  //   setCandidateProject({ ...candidateProject });
  // };

  const handleEducation = async (e, key) => {
    let value;
    if (key == "start_date") {
      console.log(e, "--start_dat--");
    }
    if (key === "is_college" || key === "is_studying") {
      value = e.value;
    } else if (
      key === "activities" ||
      key === "subjects" ||
      key === "certificate_uris"
    ) {
      value = e.target.value.split(",");
    } else {
      value = e.target.value;
    }
    const candidateEducationCopy = { ...candidateEducation };
    candidateEducationCopy[key] = value;
    setCandidateEducation({ ...candidateEducationCopy });
  };

  const handleClose = () => {
    gContext.toggleEducationModal();
  };

  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    if (eductions.length > 0 && currentEducationNumber) {
      const filteredEducation = eductions.filter(
        (edu) => edu.education_number === currentEducationNumber
      );
      if (filteredEducation && filteredEducation.length > 0) {
        setCandidateEducation({ ...filteredEducation[0] });
      }
    }
  }, [currentEducationNumber]);

  const handleOrUpdateCandidateEducation = async () => {
    try {
      if (!publicKey) {
        toast.error("Please connect your wallet");
        return;
      }
      const educationInfo = { ...candidateEducation };
      console.log(
        educationInfo,
        "educationInfo in handleOrUpdateCandidateEducation"
      );
      if (educationInfo.start_date) {
        educationInfo.start_date = new Date(educationInfo.start_date)
          .getTime()
          .toString();
        console.log(educationInfo.start_date, "educationInfo.start_date");
      }
      if (educationInfo.end_date) {
        educationInfo.end_date = new Date(educationInfo.end_date)
          .getTime()
          .toString();
      }

      // check if there is any undefined value in educationInfo and store it in notDefined variable
      const notDefined = Object.keys(educationInfo).filter(
        (key) => educationInfo[key] === undefined
      );

      console.log(notDefined, "notDefined");

      if (notDefined && notDefined.length > 0) {
        toast.error(`Please fill ${notDefined.join(", ")}`);
        return;
      }

      let notFilledFields;
      if (educationInfo.school_name === "") {
        notFilledFields = "School Name";
      }
      if (educationInfo.degree === "") {
        notFilledFields += "Degree,";
      }
      if (educationInfo.field_of_study === "") {
        notFilledFields += "Field of Study,";
      }
      if (educationInfo.start_date === "") {
        notFilledFields += "Start Date,";
      }
      if (educationInfo.end_date === "") {
        notFilledFields += "End Date,";
      }
      if (educationInfo.grade === "") {
        notFilledFields += "Grade,";
      }

      if (notFilledFields && notFilledFields.length > 0) {
        toast.error(`Please fill ${notFilledFields}`, {
          autoClose: 10000,
        });
        return;
      }

      if (currentEducationNumber) {
        educationInfo.education_number = currentEducationNumber;
        await gContext.updateEducation(
          publicKey,
          educationInfo,
          connection,
          signTransaction
        );
      } else {
        await gContext.addEducation(
          publicKey,
          educationInfo,
          connection,
          signTransaction
        );
      }
      handleClose();
    } catch (error) {
      console.log(error.message);
    }
  };

  // console.log(candidateEducation, "candidateEducation");

  return (
    <ModalStyled
      {...props}
      size="xl"
      centered
      show={gContext.educationModalVisible}
      onHide={gContext.toggleEducationModal}
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
                    {currentEducationNumber ? "Update " : "Add "} Education
                  </h5>
                  <div
                    className="contact-form bg-white shadow-8 rounded-4 pl-sm-10 pl-4 pr-sm-11 pr-4 pt-15 pb-13"
                    style={{
                      border: "1px solid #e5e5e5",
                    }}
                  >
                    <form action="/">
                      <fieldset>
                        {candidateEducation && (
                          <>
                            <div className="row">
                              <div className="col-lg-6">
                                <div className="form-group">
                                  <label
                                    htmlFor="weCname"
                                    className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                  >
                                    School Name
                                  </label>
                                  <input
                                    type="text"
                                    name="weCompanyName"
                                    className="form-control h-px-48"
                                    id="weCname"
                                    placeholder="eg. Oxford"
                                    value={candidateEducation.school_name}
                                    onChange={(e) =>
                                      handleEducation(e, "school_name")
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
                                    Degree
                                  </label>
                                  <input
                                    type="text"
                                    name="weDesignation"
                                    className="form-control h-px-48"
                                    id="weDesignation"
                                    placeholder="eg. B.tech"
                                    value={candidateEducation.degree}
                                    onChange={(e) =>
                                      handleEducation(e, "degree")
                                    }
                                  />
                                </div>
                              </div>

                              <div className="col-lg-6">
                                <div className="form-group">
                                  <label
                                    htmlFor="weFs"
                                    className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                  >
                                    Field of study
                                  </label>
                                  <input
                                    type="text"
                                    name="weStartDate"
                                    className="form-control h-px-48"
                                    id="weFs"
                                    placeholder="eg. Computer Science"
                                    value={candidateEducation.field_of_study}
                                    onChange={(e) =>
                                      handleEducation(e, "field_of_study")
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="form-group">
                                  <label
                                    htmlFor="sDate"
                                    className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                  >
                                    Start date
                                  </label>
                                  <input
                                    type="date"
                                    name="weEndDate"
                                    className="form-control h-px-48"
                                    id="sDate"
                                    placeholder="eg. School start date"
                                    value={
                                      candidateEducation.start_date
                                      // &&
                                      // new Date(
                                      //   Number(candidateEducation.start_date)
                                      // )
                                      //   .toISOString()
                                      //   .slice(0, 10)
                                    }
                                    onChange={(e) =>
                                      handleEducation(e, "start_date")
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="form-group">
                                  <label
                                    htmlFor="eDate"
                                    className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                  >
                                    End date
                                  </label>
                                  <input
                                    type="date"
                                    name="weEndDate"
                                    className="form-control h-px-48"
                                    id="eDate"
                                    placeholder="eg. School end date"
                                    value={
                                      candidateEducation.end_date
                                      // &&
                                      // new Date(
                                      //   Number(candidateEducation.end_date)
                                      // )
                                      //   .toISOString()
                                      //   .slice(0, 10)
                                    }
                                    onChange={(e) =>
                                      handleEducation(e, "end_date")
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
                                    Grade
                                  </label>
                                  <input
                                    type="text"
                                    name="weDescription"
                                    className="form-control h-px-48"
                                    id="weDescription"
                                    placeholder="eg. Grade"
                                    value={candidateEducation.grade}
                                    onChange={(e) =>
                                      handleEducation(e, "grade")
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
                                    Activities (Comma seperated)
                                  </label>
                                  <input
                                    type="text"
                                    name="weDescription"
                                    className="form-control h-px-48"
                                    id="weDescription"
                                    placeholder="eg. Class representative"
                                    value={candidateEducation.activities}
                                    onChange={(e) =>
                                      handleEducation(e, "activities")
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
                                    Subjects (Comma seperated)
                                  </label>
                                  <input
                                    type="text"
                                    name="weDescription"
                                    className="form-control h-px-48"
                                    id="weDescription"
                                    placeholder="eg. Maths"
                                    value={candidateEducation.subjects}
                                    onChange={(e) =>
                                      handleEducation(e, "subjects")
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
                                    Is College ?
                                  </label>

                                  <Select
                                    options={[
                                      {
                                        value: true,
                                        label: "Yes",
                                      },
                                      {
                                        value: false,
                                        label: "No",
                                      },
                                    ]}
                                    value={{
                                      value: candidateEducation.is_college,
                                      label: candidateEducation.is_college
                                        ? "Yes"
                                        : "No",
                                    }}
                                    placeholder="Select"
                                    onChange={(e) =>
                                      handleEducation(e, "is_college")
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
                                    Is Studying ?
                                  </label>

                                  <Select
                                    options={[
                                      {
                                        value: true,
                                        label: "Yes",
                                      },
                                      {
                                        value: false,
                                        label: "No",
                                      },
                                    ]}
                                    value={{
                                      value: candidateEducation.is_studying,
                                      label: candidateEducation.is_studying
                                        ? "Yes"
                                        : "No",
                                    }}
                                    placeholder="Select"
                                    onChange={(e) =>
                                      handleEducation(e, "is_studying")
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-md-12">
                                <div className="form-group">
                                  <label
                                    htmlFor="weDescription"
                                    className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                  >
                                    Certificate urls
                                  </label>
                                  <input
                                    type="text"
                                    name="weDescription"
                                    className="form-control h-px-48"
                                    id="weDescription"
                                    placeholder="eg. https://udemy.com/certifcate/yfgiabweq"
                                    value={candidateEducation.certificate_uris}
                                    onChange={(e) =>
                                      handleEducation(e, "certificate_uris")
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-md-12">
                                <div className="form-group">
                                  <label
                                    htmlFor="weDescription"
                                    className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                  >
                                    Description
                                  </label>
                                  <input
                                    type="text"
                                    name="weDescription"
                                    className="form-control h-px-48"
                                    id="weDescription"
                                    placeholder="eg. Description"
                                    value={candidateEducation.description}
                                    onChange={(e) =>
                                      handleEducation(e, "description")
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
                              {!candidateProject.archived
                                ? "Archive"
                                : "Unarchive"}
                            </a> */}
                          </>
                        )}
                        <pre>{JSON.stringify(candidateEducation)}</pre>
                        <div className="row">
                          <div className="col-md-12">
                            <input
                              type="button"
                              value="Submit"
                              className="btn btn-green btn-h-60 text-white min-width-px-210 rounded-5 text-uppercase"
                              onClick={handleOrUpdateCandidateEducation}
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

export default ModalEducation;
