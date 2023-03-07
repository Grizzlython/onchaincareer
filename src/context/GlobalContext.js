import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import {
  add_company_info,
  add_contact_info,
  add_jobpost_info,
  add_job_workflow_info,
  add_project_info,
  add_work_experience_info,
  check_if_user_exists,
  fetchAllCompanies,
  fetchAllJobs,
  findAllCompanyInfosOfUser,
  findAllProjectsOfUser,
  findAllWorkExperiencesOfUser,
  getContactInfoByUserAccount,
  getJobPostInfo,
  getUserCandidateInfo,
} from "../utils/web3/web3_functions";

const GlobalContext = React.createContext();

const GlobalProvider = ({ children }) => {
  const [themeDark, setThemeDark] = useState(false);
  const [showSidebarDashboard, setShowSidebarDashboard] = useState(true);
  const [applicationModalVisible, setApplicationModalVisible] = useState(false);

  const [signInModalVisible, setSignInModalVisible] = useState(false);
  const [signUpModalVisible, setSignUpModalVisible] = useState(false);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [visibleOffCanvas, setVisibleOffCanvas] = useState(false);
  const [header, setHeader] = useState({
    theme: "light",
    bgClass: "default",
    variant: "primary",
    align: "left",
    isFluid: false,
    button: "cta", // profile, account, null
    buttonText: "Get started free", // profile, account, null
    reveal: true,
  });
  const [footer, setFooter] = useState({
    theme: "dark",
    style: "style1", //style1, style2
  });

  // custom states for the application
  // const [testContext, setTestContext] = useState("test context");

  const [user, setUser] = useState("");
  const [categories, setCategories] = useState([]);
  const [jobListings, setJobListings] = useState([]);
  const [companyProfile, setCompanyProfile] = useState([]);
  const [candidateProfile, setCandidateProfile] = useState([]);
  const [jobPost, setJobPost] = useState([]);
  const [jobApplication, setJobApplication] = useState([]);
  const [jobDetails, setJobDetails] = useState([]);
  const [companyPostedJobs, setCompanyPostedJobs] = useState([]);
  const [userAppliedJobsByCompany, setUserAppliedJobsByCompany] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [workExperience, setWorkExperience] = useState([]);
  const [projects, setProjects] = useState([]);
  const [hasCandidateAppliedForJob, setHasCandidateAppliedForJob] =
    useState(false);
  const [hasCandidateSavedJob, setHasCandidateSavedJob] = useState(false);
  const [candidateSocials, setCandidateSocials] = useState([]);
  const [candidateInfoOpenAction, setCandidateInfoOpenAction] = useState(""); // either fresh or edit

  // modal states
  const [companyProfileModalVisible, setCompanyProfileModalVisible] =
    useState(false);
  const [candidateProfileModalVisible, setCandidateProfileModalVisible] =
    useState(false);
  const [jobPostModalVisible, setJobPostModalVisible] = useState(false);
  const [workExperienceModalVisible, setWorkExperienceModalVisible] =
    useState(false);
  const [projectsModalVisible, setProjectsModalVisible] = useState(false);
  const [candidateSocialsModalVisible, setCandidateSocialsModalVisible] =
    useState(false);

  const [userTypeModalVisible, setUserTypeModalVisible] = useState(false);

  const router = useRouter();

  const toggleTheme = () => {
    setThemeDark(!themeDark);
  };

  const toggleSidebarDashboard = () => {
    setShowSidebarDashboard(!showSidebarDashboard);
  };

  const toggleVideoModal = () => {
    setVideoModalVisible(!videoModalVisible);
  };

  const toggleApplicationModal = () => {
    setApplicationModalVisible(!applicationModalVisible);
  };

  const toggleCompanyProfileModal = () => {
    setCompanyProfileModalVisible(!companyProfileModalVisible);
  };

  const toggleCandidateProfileModal = () => {
    setCandidateProfileModalVisible(!candidateProfileModalVisible);
  };

  const toggleJobPostModal = () => {
    setJobPostModalVisible(!jobPostModalVisible);
  };

  const toggleSignInModal = () => {
    setSignInModalVisible(!signInModalVisible);
  };

  const toggleSignUpModal = () => {
    setSignUpModalVisible(!signUpModalVisible);
  };

  const toggleOffCanvas = () => {
    setVisibleOffCanvas(!visibleOffCanvas);
  };

  const closeOffCanvas = () => {
    setVisibleOffCanvas(false);
  };

  const toggleWorkExperienceModal = () => {
    setWorkExperienceModalVisible(!workExperienceModalVisible);
  };

  const toggleProjectsModal = () => {
    setProjectsModalVisible(!projectsModalVisible);
  };

  const toggleCandidateSocialsModal = () => {
    setCandidateSocialsModalVisible(!candidateSocialsModalVisible);
  };

  const setCandidateInfoAction = (action) => {
    setCandidateInfoOpenAction(action);
  };

  const toggleUserTypeModal = () => {
    setUserTypeModalVisible(!userTypeModalVisible);
  };

  // custom functions for the application
  const signUpUser = async (payload) => {
    try {
      console.log("In signUpUser context function");
      console.log("signUpUser payload", payload);

      const response = await axios.post(
        "http://localhost:3001/api/user/addUser",
        payload
      );
      console.log(response, "signUpUser response");
      setUser(response.data?.data);
      toast.success(
        `${
          response.data?.data?.userType === "recruiter"
            ? "😃 User created successfully. Now please complete company profile"
            : "😃 User created successfully. Now please complete candidate profile"
        }`
      );
    } catch (error) {
      console.log(error);
      toast.error("User creation failed");
    }
  };

  const getCompanyProfileByUsername = async (
    user_info_state_account,
    connection
  ) => {
    try {
      // console.log("In getCompanyProfileByUsername context function");

      // const response = await axios.get(
      //   `http://localhost:3001/api/companyProfile/getCompanyByUsername/${username}`
      // );

      const response = await findAllCompanyInfosOfUser(
        user_info_state_account,
        connection
      );

      console.log(response, "response from getCompanyProfileByUsername");

      setCompanyProfile(response);
      toast.success("😃 Company profile fetched successfully");
    } catch (error) {
      console.log(error);
      toast.error("Company profile fetch failed");
    }
  };

  const getCandidateProfileByUsername = async (username) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/candidateInfo/getCandidateByUsername/${username}`
      );

      setCandidateProfile(response.data?.data);
      toast.success("😃 Candidate profile fetched successfully");
    } catch (error) {
      console.log(error);
      toast.error("Candidate profile fetch failed");
    }
  };

  const loginUser = async (payload) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/user/loginUser",
        payload
      );
      setUser(response.data?.data);
      toast.success("👍 Login successful");
      if (response.data?.data?.userType === "recruiter") {
        getCompanyProfileByUsername(response.data?.data?.username);
        router.push("/dashboard-main");
      } else {
        getCandidateProfileByUsername(response.data?.data?.username);
      }
    } catch (error) {
      console.log(error);
      toast(error.message, {
        type: "error",
      });
    }
  };

  const logoutUser = async () => {
    setUser("");
    toast.success("👍 Logout successful");
  };

  const getCategories = async (filters) => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/category/getAllCategories",
        filters
      );
      setCategories(response.data?.data);
    } catch (error) {
      toast("⚠️ Error getting categories", {
        type: "error",
      });
    }
  };

  const getJobListings = async (owner, connection) => {
    try {
      // console.log("jl filters", filters);
      // const response = await axios.post(
      //   "http://localhost:3001/api/joblistings/showall",
      //   filters
      // );
      const response = await fetchAllJobs(owner, connection);

      console.log(response, "response from getJobListings");
      setJobListings(response);
    } catch (error) {
      toast.error("⚠️ Error getting job listings");
    }
  };

  const getUserProfileByUserName = async (username) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/user/findUserByUsername/${username}`
      );
      setUser(response.data?.data);
    } catch (error) {
      toast.error("⚠️ Error getting user profile");
    }
  };

  const addCompanyProfile = async (
    owner,
    companyInfo,
    connection,
    signTransaction
  ) => {
    try {
      // const response = await axios.post(
      //   "http://localhost:3001/api/companyProfile/addCompany",
      //   payload
      // );

      const response = await add_company_info(
        owner,
        companyInfo,
        connection,
        signTransaction
      );
      console.log(response, "addCompanyProfile response");
      setCompanyProfile(response);
      toast.success("😃 Company profile created successfully");
      // getUserProfileByUserName(user.username);
    } catch (error) {
      toast.error("⚠️ Error creating company profile");
    }
  };

  const getCompanyProfile = async (companyName) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/companyProfile/getCompanyByName/${companyName}`
      );
      setCompanyProfile(response.data?.data);
    } catch (error) {
      toast.error("⚠️ Error getting company profile");
    }
  };

  const addCandidateProfile = async (payload) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/candidateInfo/add",
        payload
      );
      setCandidateProfile(response.data?.data);
      toast.success("😃 Candidate profile created successfully");
      getUserProfileByUserName(user.username);
    } catch (error) {
      toast.error("⚠️ Error creating candidate profile");
    }
  };

  const updateCandidateProfile = async (username, payload) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/api/candidateInfo/updateCandidateByUsername/${username}`,
        payload
      );

      setCandidateProfile(response.data?.data);
      toast.success("😃 Candidate profile updated successfully");
      getUserProfileByUserName(username);
    } catch (error) {
      toast.error("⚠️ Error updating candidate profile");
    }
  };

  const addJobPost = async (
    owner,
    jobPostInfo,
    company_seq_number,
    connection,
    signTransaction
  ) => {
    try {
      // const response = await axios.post(
      //   "http://localhost:3001/api/joblistings/add",
      //   payload
      // );
      const response = await add_jobpost_info(
        owner,
        jobPostInfo,
        company_seq_number,
        connection,
        signTransaction
      );
      setJobPost(response.data?.data);
      toast.success("😃 Job post created successfully");
    } catch (error) {
      toast.error("⚠️ Error creating job post");
    }
  };

  const addJobApplication = async (
    owner,
    connection,
    signTransaction,
    applyJobWorkflowInfo,
    company_seq_number,
    job_number
  ) => {
    try {
      // const response = await axios.post(
      //   "http://localhost:3001/api/application/add",
      //   payload
      // );
      const response = await add_job_workflow_info(
        owner,
        connection,
        signTransaction,
        applyJobWorkflowInfo,
        company_seq_number,
        job_number
      );

      console.log(response, "addJobApplication response");
      // setJobApplication(response.data?.data);
      toast.success("😃 Job applied successfully");
    } catch (error) {
      toast.error("⚠️ Error while applying for job");
    }
  };

  const getUserAppliedJobs = async (username) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/application/getUserAppliedJobs/${username}`
      );
      setJobApplication(response.data?.data);
    } catch (error) {
      toast.error("⚠️ Error while fetching applied jobs");
    }
  };

  const getJobDetails = async (jobpost_info_account, connection) => {
    try {
      // const response = await axios.get(
      //   `http://localhost:3001/api/joblistings/getJobListingById/${jobId}`
      // );
      const response = await getJobPostInfo(jobpost_info_account, connection);
      console.log(response, "response from getJobDetails");

      setJobDetails(response);
    } catch (error) {
      toast.error("⚠️ Error while fetching job details");
    }
  };

  const getCompanyPostedJobs = async (owner, connection) => {
    try {
      // const response = await axios.get(
      //   `http://localhost:3001/api/joblistings/getTotalJobPostingsByCompany/${companyName}`
      // );
      const response = await fetchAllCompanies(owner, connection);
      setCompanyPostedJobs(response);
    } catch (error) {
      toast.error("⚠️ Error while fetching company posted jobs");
    }
  };

  const getUserAppliedJobsByCompany = async (companyName) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/application/getCandidateDetailsAppliedForCompany/${companyName}`
      );
      setUserAppliedJobsByCompany(response.data?.data);
    } catch (error) {
      toast.error("⚠️ Error while fetching user applied jobs by company");
    }
  };

  const saveJob = async (payload) => {
    try {
      console.log("Inside save job");
      const response = await axios.post(
        "http://localhost:3001/api/joblistings/saveJobListing",
        payload
      );
      setSavedJobs(response.data?.data);
      toast.success("😃 Job saved successfully");
    } catch (error) {
      console.log(error, "save job error");
      toast.error("⚠️ Error while saving job");
    }
  };

  const addWorkExperience = async (
    owner,
    payload,
    connection,
    signTransaction
  ) => {
    try {
      // const response = await axios.post(
      //   "http://localhost:3001/api/candidateInfo/addCandidateWorkExperience",
      //   payload
      // );

      console.log(payload, "payload in context");

      const response = await add_work_experience_info(
        owner,
        payload,
        connection,
        signTransaction
      );

      console.log(response, "response in context exp");

      if (response) {
        toast.success("😃 Work experience added successfully");
        if (workExperience.length > 0) {
          setWorkExperience([...workExperience, payload]);
        } else {
          setWorkExperience([payload]);
        }
      }

      // setWorkExperience(payload);
      // toast.success("😃 Work experience added successfully");
    } catch (error) {
      toast.error("⚠️ Error while adding work experience");
    }
  };

  const getWorkExperience = async (
    applicant_info_state_account,
    connection
  ) => {
    try {
      // const response = await axios.get(
      //   `http://localhost:3001/api/candidateInfo/getCandidateWorkExperience/${username}`
      // );

      console.log("I am in get exp");

      const response = await findAllWorkExperiencesOfUser(
        applicant_info_state_account,
        connection
      );
      console.log(response, "response in context work exp");
      setWorkExperience(response);
    } catch (error) {
      console.log(error, "error in context work exp");
      toast.error("⚠️ Error while fetching work experience");
    }
  };

  const updateWorkExperience = async (id, payload) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/api/candidateInfo/updateCandidateWorkExperience/${id}`,
        payload
      );
      setWorkExperience(response.data?.data);
      toast.success("😃 Work experience updated successfully");
    } catch (error) {
      toast.error("⚠️ Error while updating work experience");
    }
  };

  const addProjects = async (
    owner,
    projectInfo,
    connection,
    signTransaction
  ) => {
    try {
      // const response = await axios.post(
      //   "http://localhost:3001/api/candidateInfo/addCandidateProjects",
      //   payload
      // );

      console.log("rreach here");

      console.log(projectInfo, "payload in context project");

      const response = await add_project_info(
        owner,
        projectInfo,
        connection,
        signTransaction
      );

      console.log(response, "response in context project");
      projects.push(response);
      console.log(projects, "projects in context project");
      toast.success("😃 Project added successfully");
    } catch (error) {
      console.log(error, "error in context project");
      toast.error("⚠️ Error while adding project");
    }
  };

  const getProjects = async (applicant_info_state_account, connection) => {
    try {
      // const response = await axios.get(
      //   `http://localhost:3001/api/candidateInfo/getCandidateProjects/${username}`
      // );

      const response = await findAllProjectsOfUser(
        applicant_info_state_account,
        connection
      );

      console.log(response, "response in context project");

      setProjects(response);
    } catch (error) {
      toast.error("⚠️ Error while fetching projects");
    }
  };

  const updateProjects = async (id, payload) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/api/candidateInfo/updateCandidateProjects/${id}`,
        payload
      );
      setProjects(response.data?.data);
      toast.success("😃 Project updated successfully");
    } catch (error) {
      toast.error("⚠️ Error while updating project");
    }
  };

  const getIfCandidateHasAppliedForJob = async (username, jobListingId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/application/hasCandidateAppliedForJob/${username}/${jobListingId}`
      );

      setHasCandidateAppliedForJob(response.data?.data);
    } catch (error) {
      console.log(error, "error");
      toast.error("⚠️ Error while fetching if candidate has applied for job");
    }
  };

  const getIfCandidateHasSavedJob = async (username, jobListingId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/application/hasCandidateSavedJob/${username}/${jobListingId}`
      );

      setHasCandidateSavedJob(response.data?.data);
    } catch (error) {
      console.log(error, "error");
      toast.error("⚠️ Error while fetching if candidate has saved job");
    }
  };

  const getSavedJobs = async (username) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/application/getUserSavedJobs/${username}`
      );
      setSavedJobs(response.data?.data);
    } catch (error) {
      toast.error("⚠️ Error while fetching saved jobs");
    }
  };

  const addCandidateSocials = async (
    owner,
    contactInfo,
    connection,
    signTransaction
  ) => {
    try {
      // const response = await axios.post(
      //   "http://localhost:3001/api/candidateInfo/addCandidateContactInfo",
      //   payload
      // );
      const response = await add_contact_info(
        owner,
        contactInfo,
        connection,
        signTransaction
      );

      console.log(response, "response in context socials");
      setCandidateSocials(response);
      toast.success("😃 Socials added successfully");
    } catch (error) {
      toast.error("⚠️ Error while adding socials");
    }
  };

  const getCandidateSocials = async (publicKey, connection) => {
    try {
      const res = await getContactInfoByUserAccount(publicKey, connection);

      console.log(res, "res in context socials");
      setCandidateSocials(res);
    } catch (error) {
      toast.error("⚠️ Error while fetching socials");
    }
  };

  const updateCandidateSocials = async (username, payload) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/api/candidateInfo/updateCandidateContactInfo/${username}`,
        payload
      );
      setCandidateSocials(response.data?.data);
      toast.success("😃 Socials updated successfully");
    } catch (error) {
      toast.error("⚠️ Error while updating socials");
    }
  };

  const getApplicantInfoStateAccount = async (
    applicant_public_key,
    connection
  ) => {
    // try {
    const resp = await getUserCandidateInfo(applicant_public_key, connection);
    console.log(applicant_public_key.toString(), "applicant_public_key");
    console.log(resp, "resp");
    return resp;
    // } catch (err) {
    //   console.log(err, "err");
    // }
  };

  const setUserFromChain = async (payload) => {
    setUser(payload);
  };

  const [userStateAccount, setUserStateAccount] = useState("");

  const updateUserStateAccount = async (applicant_info_state_account) => {
    // const res = await check_if_user_exists(publicKey, connection);
    setUserStateAccount(applicant_info_state_account);
  };

  return (
    <GlobalContext.Provider
      value={{
        themeDark,
        toggleTheme,
        showSidebarDashboard,
        toggleSidebarDashboard,
        videoModalVisible,
        toggleVideoModal,
        applicationModalVisible,
        toggleApplicationModal,
        signInModalVisible,
        toggleSignInModal,
        signUpModalVisible,
        toggleSignUpModal,
        visibleOffCanvas,
        toggleOffCanvas,
        closeOffCanvas,
        header,
        setHeader,
        footer,
        setFooter,
        user,
        signUpUser,
        loginUser,
        logoutUser,
        categories,
        getCategories,
        jobListings,
        getJobListings,
        companyProfileModalVisible,
        toggleCompanyProfileModal,
        candidateProfileModalVisible,
        toggleCandidateProfileModal,
        companyProfile,
        addCompanyProfile,
        getCompanyProfile,
        candidateProfile,
        addCandidateProfile,
        updateCandidateProfile,
        jobPostModalVisible,
        toggleJobPostModal,
        jobPost,
        addJobPost,
        getCandidateProfileByUsername,
        getCompanyProfileByUsername,
        jobApplication,
        addJobApplication,
        getUserAppliedJobs,
        jobDetails,
        getJobDetails,
        companyPostedJobs,
        getCompanyPostedJobs,
        userAppliedJobsByCompany,
        getUserAppliedJobsByCompany,
        savedJobs,
        saveJob,
        getSavedJobs,
        workExperience,
        addWorkExperience,
        getWorkExperience,
        updateWorkExperience,
        projects,
        addProjects,
        getProjects,
        updateProjects,
        hasCandidateAppliedForJob,
        getIfCandidateHasAppliedForJob,
        workExperienceModalVisible,
        toggleWorkExperienceModal,
        projectsModalVisible,
        toggleProjectsModal,
        candidateSocialsModalVisible,
        toggleCandidateSocialsModal,
        hasCandidateSavedJob,
        getIfCandidateHasSavedJob,
        candidateSocials,
        addCandidateSocials,
        getCandidateSocials,
        updateCandidateSocials,
        candidateInfoOpenAction,
        setCandidateInfoAction,
        userTypeModalVisible,
        toggleUserTypeModal,
        getApplicantInfoStateAccount,
        setUserFromChain,
        userStateAccount,
        updateUserStateAccount,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
export { GlobalProvider };
