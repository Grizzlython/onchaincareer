import React, { useContext, useState } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import GlobalContext from "../../context/GlobalContext";

import { useEffect } from "react";
import { toast } from "react-toastify";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import Loader from "../Loader";

const projectSchema = {
  archived: false,
  project_name: "",
  project_description: "",
  project_image_uris: [],
  project_link: "",
  project_skills: [],
  project_start_date: "",
  project_end_date: "",
  project_status: "status",
};

const ModalStyled = styled(Modal)`
  /* &.modal {
    z-index: 10050;
  } */
`;

const ModalProjects = (props) => {
  const gContext = useContext(GlobalContext);
  const projects = gContext.projects;
  const currentProjectNumber = gContext.currentProjectNumber;

  const { loading } = gContext;

  const [candidateProject, setCandidateProject] = useState(projectSchema);
  const [archived, setArchived] = useState(false);
  const handleChange = (e) => {
    setArchived(!archived);
    handleToggleofArchive(e);
  };
  const handleToggleofArchive = async (e, index) => {
    e.preventDefault();
    candidateProject.archived = !candidateProject.archived;
    setCandidateProject({ ...candidateProject });
  };

  const handleProjects = async (e, key) => {
    const { value } = e.target;
    const candidateProjectCopy = { ...candidateProject };
    candidateProjectCopy[key] = value;
    setCandidateProject({ ...candidateProjectCopy });
  };

  const handleClose = () => {
    gContext.toggleProjectsModal();
  };

  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    if (projects.length > 0 && currentProjectNumber) {
      const fitleredProject = projects.filter(
        (project) => project.project_number === currentProjectNumber
      );
      if (fitleredProject && fitleredProject.length > 0) {
        const tempProjects = { ...fitleredProject[0] };
        if (tempProjects.project_start_date) {
          tempProjects.project_start_date = new Date(
            parseInt(tempProjects.project_start_date)
          )
            .toISOString()
            .slice(0, 10);
        }
        if (tempProjects.project_end_date) {
          tempProjects.project_end_date = new Date(
            parseInt(tempProjects.project_end_date)
          )
            .toISOString()
            .slice(0, 10);
        }

        setCandidateProject({ ...tempProjects });
      }
    }
  }, [currentProjectNumber]);

  const resetForm = () => {
    setCandidateProject({ ...projectSchema });
  };

  const handleOrUpdateCandidateProject = async () => {
    try {
      if (!publicKey) {
        toast.error("Please connect your wallet");
        return;
      }
      const projectInfo = { ...candidateProject };
      if (projectInfo.project_start_date) {
        projectInfo.project_start_date = new Date(
          projectInfo.project_start_date
        )
          .getTime()
          .toString();
      }
      if (projectInfo.project_end_date) {
        projectInfo.project_end_date = new Date(projectInfo.project_end_date)
          .getTime()
          .toString();
      }

      const notDefined = Object.keys(projectInfo).filter(
        (key) =>  projectInfo[key] === undefined
      );

      if (notDefined && notDefined.length > 0) {
        toast.error(`Please fill ${notDefined.join(", ")}`);
        return;
      }

      let notFilled = Object.keys(projectInfo).filter(
        (key) => key !== "project_link" && projectInfo[key] === ""
      );

      if (notFilled && notFilled.length > 0) {
        toast.error(`Please fill ${notFilled.join(", ")}`);
        return;
      }

      if (currentProjectNumber) {
        projectInfo.project_number = currentProjectNumber;
        await gContext.updateProject(
          publicKey,
          projectInfo,
          connection,
          signTransaction
        );
        resetForm();
      } else {
        await gContext.addProject(
          publicKey,
          projectInfo,
          connection,
          signTransaction
        );
        resetForm();
      }
      handleClose();
    } catch (error) {
      console.log(error.message);
    }
  };

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
                      {currentProjectNumber ? "Update " : "Add "} project
                    </h5>
                    <div
                      className="contact-form bg-white shadow-8 rounded-4 pl-sm-10 pl-4 pr-sm-11 pr-4 pt-15 pb-13"
                      style={{
                        border: "1px solid #e5e5e5",
                      }}
                    >
                      <form action="/">
                        <fieldset>
                          {candidateProject && (
                            <>
                              <div className="row">
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
                                      value={candidateProject.project_name}
                                      onChange={(e) =>
                                        handleProjects(e, "project_name")
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
                                      value={
                                        candidateProject.project_description
                                      }
                                      onChange={(e) =>
                                        handleProjects(e, "project_description")
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
                                      value={
                                        candidateProject.project_start_date
                                      }
                                      onChange={(e) =>
                                        handleProjects(e, "project_start_date")
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
                                      value={candidateProject.project_end_date}
                                      onChange={(e) =>
                                        handleProjects(e, "project_end_date")
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
                                      value={candidateProject.project_link}
                                      onChange={(e) =>
                                        handleProjects(e, "project_link")
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
                            </>
                          )}

                          <div className="row">
                            <div className="col-md-12">
                              <input
                                type="button"
                                value="Submit"
                                className="btn btn-green btn-h-60 text-white min-width-px-210 rounded-5 text-uppercase"
                                onClick={handleOrUpdateCandidateProject}
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

export default ModalProjects;
