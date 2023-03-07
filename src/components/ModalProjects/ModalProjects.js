import React, { useContext, useState } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
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

const ModalProjects = (props) => {
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [skills, setSkills] = useState("");
  const [resume, setResume] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [dribble, setDribble] = useState("");
  const [behance, setBehance] = useState("");
  const [currentEmploymentStatusState, setCurrentEmploymentStatusState] =
    useState("");
  const [canJoinInState, setCanJoinInState] = useState("");
  const [about, setAbout] = useState("");

  const router = useRouter();

  const gContext = useContext(GlobalContext);

  const [candidateProjects, setCandidateProjects] = useState([
    {
      projectName: "",
      description: "",
      projectLink: "",
      startDate: "",
      endDate: "",
    },
  ]);

  const handleAddProjectInput = async (e) => {
    e.preventDefault();
    setCandidateProjects([
      ...candidateProjects,
      {
        projectName: "",
        projectDescription: "",
        projectLink: "",
        projectStartDate: "",
        projectEndDate: "",
      },
    ]);
  };

  const handleRemoveProjectInput = async (e, index) => {
    e.preventDefault();
    const candidateProjectsCopy = [...candidateProjects];

    // prevent removing the last input
    if (candidateProjectsCopy.length === 1) {
      return;
    }

    candidateProjectsCopy.splice(index, 1);
    setCandidateProjects(candidateProjectsCopy);
  };

  const handleProjects = async (e, index, key) => {
    const { value } = e.target;
    const candidateProjectsCopy = [...candidateProjects];
    candidateProjectsCopy[index][key] = value;
    setCandidateProjects(candidateProjectsCopy);
  };

  const handleClose = () => {
    gContext.toggleProjectsModal();
  };

  const handleSaveProjects = async () => {
    try {
      const payload = candidateProjects;

      payload.map((item, index) => {
        item["username"] = gContext.user?.username;
      });

      console.log(payload, "project payload");

      await gContext.addProjects(payload);

      handleClose();
    } catch (error) {
      console.log(error.message);
    }
  };

  // useEffect(() => {
  //   if (!gContext.user) {
  //     toast.error("Please login to add candidate profile");
  //     router.push("/");
  //     gContext.toggleSignInModal();
  //     return;
  //   }

  //   if (gContext.user?.userType === "recruiter") {
  //     toast.error("Only candidates can add candidate profile");
  //     router.push("/");
  //     return;
  //   }
  // }, []);

  return (
    <ModalStyled
      {...props}
      size="xl"
      centered
      show={gContext.projectsModalVisible}
      onHide={gContext.toggleProjectsModal}
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
                    Add projects
                  </h5>
                  <div
                    className="contact-form bg-white shadow-8 rounded-4 pl-sm-10 pl-4 pr-sm-11 pr-4 pt-15 pb-13"
                    style={{
                      border: "1px solid #e5e5e5",
                    }}
                  >
                    <form action="/">
                      <fieldset>
                        {candidateProjects.map((item, index) => (
                          <>
                            <div className="row " key={index}>
                              <div className="col-lg-6">
                                <div className="form-group">
                                  <label
                                    htmlFor="weCname"
                                    className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                                  >
                                    Project Name
                                  </label>
                                  <input
                                    type="text"
                                    name="weCompanyName"
                                    className="form-control h-px-48"
                                    id="weCname"
                                    placeholder="eg. Music player app"
                                    value={item.projectName}
                                    onChange={(e) =>
                                      handleProjects(e, index, "projectName")
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
                                    Project Description
                                  </label>
                                  <input
                                    type="text"
                                    name="weDesignation"
                                    className="form-control h-px-48"
                                    id="weDesignation"
                                    placeholder="eg. Brief description"
                                    value={item.projectDescription}
                                    onChange={(e) =>
                                      handleProjects(e, index, "description")
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
                                    Project Start Date
                                  </label>
                                  <input
                                    type="date"
                                    name="weStartDate"
                                    className="form-control h-px-48"
                                    id="weSdate"
                                    placeholder="eg. Project Start Date"
                                    value={item.projectStartDate}
                                    onChange={(e) =>
                                      handleProjects(e, index, "startDate")
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
                                    Project End Date
                                  </label>
                                  <input
                                    type="date"
                                    name="weEndDate"
                                    className="form-control h-px-48"
                                    id="eDate"
                                    placeholder="eg. Project end date"
                                    value={item.projectEndDate}
                                    onChange={(e) =>
                                      handleProjects(e, index, "endDate")
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
                                    Project Link
                                  </label>
                                  <input
                                    type="text"
                                    name="weDescription"
                                    className="form-control h-px-48"
                                    id="weDescription"
                                    placeholder="eg. Project Link"
                                    value={item.projectLink}
                                    onChange={(e) =>
                                      handleProjects(e, index, "projectLink")
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            {candidateProjects.length - 1 === index && (
                              <a
                                className="btn btn-outline-green text-uppercase w-180 h-px-48 rounded-5 mr-7 mb-7"
                                onClick={handleAddProjectInput}
                              >
                                Add more
                              </a>
                            )}
                            {candidateProjects.length !== 1 && (
                              <a
                                className="btn btn-outline-red text-uppercase w-180 h-px-48 rounded-5 mr-7 mb-7"
                                onClick={(e) =>
                                  handleRemoveProjectInput(e, index)
                                }
                              >
                                Remove
                              </a>
                            )}
                          </>
                        ))}
                        <pre>{JSON.stringify(candidateProjects, null, 2)}</pre>
                        <div className="row">
                          <div className="col-md-12">
                            <input
                              type="button"
                              value="Submit"
                              className="btn btn-green btn-h-60 text-white min-width-px-210 rounded-5 text-uppercase"
                              onClick={handleSaveProjects}
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

export default ModalProjects;
