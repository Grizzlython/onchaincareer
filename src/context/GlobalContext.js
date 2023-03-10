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
  fetchAllWorkflowOfUsers,
  findAllCompanyInfosOfUser,
  findAllJobsOfCompany,
  findAllProjectsOfUser,
  findAllWorkExperiencesOfUser,
  findAllWorkflowOfJobPost,
  getCompanyInfo,
  getContactInfoByUserAccount,
  getJobPostInfo,
  getUserCandidateInfo,
  update_company_info,
  update_jobpost_info,
  update_contact_info,
  update_project_info,
  update_work_experience_info,
  update_job_workflow_info,
  fetchUserInfoAccount,
  findAllEducationsOfUser,
  add_education_info,
  update_education_info,
  getWorkflowInfo,
  fetchAllUsers,
  update_jobpost_long_description,
} from "../utils/web3/web3_functions";
import { WORKFLOW_STATUSES } from "../utils/web3/struct_decoders/jobsonchain_constants_enum";
import { PublicKey } from "@solana/web3.js";
import { userTypeEnum } from "../utils/constants";

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
    align: "right",
    isFluid: false,
    button: null, // profile, account, null
    buttonText: null, // profile, account, null
    reveal: true,
  });
  const [footer, setFooter] = useState({
    theme: "dark",
    style: "style1", //style1, style2
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [user, setUser] = useState("");
  const [categories, setCategories] = useState([]);
  const [jobListingsByUser, setJobListingsByUser] = useState([]);
  const [allListedCompanies, setAllListedCompanies] = useState([]);
  const [allListedJobs, setAllListedJobs] = useState([]);
  const [allInteractedJobsByUser, setAllInteractedJobsByUser] = useState([]);
  const [selectedCompanyInfo, setSelectedCompanyInfo] = useState({});
  const [companySelectedByUser, setCompanySelectedByUser] = useState({});
  const [candidateProfile, setCandidateProfile] = useState([]);
  const [workflowSelectedToView, setWorkflowSelectedToView] = useState(null);
  const [allListedCompaniesByUser, setAllListedCompaniesByUser] = useState([]);
  const [isPremiumCompanyOwner, setIsPremiumCompanyOwner] = useState(false);
  const [jobPost, setJobPost] = useState([]);
  const [jobApplication, setJobApplication] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);
  const [companyPostedJobs, setCompanyPostedJobs] = useState([]);
  const [userAppliedJobsByCompany, setUserAppliedJobsByCompany] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [workExperience, setWorkExperience] = useState([]);
  const [projects, setProjects] = useState([]);
  const [educations, setEducations] = useState([]);
  const [hasCandidateAppliedForJob, setHasCandidateAppliedForJob] =
    useState(false);
  const [hasCandidateSavedJob, setHasCandidateSavedJob] = useState(false);
  const [candidateSocials, setCandidateSocials] = useState(null);
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
  const [educationModalVisible, setEducationModalVisible] = useState(false);

  const [userTypeModalVisible, setUserTypeModalVisible] = useState(false);
  const [showSelectCompanyModal, setShowSelectCompanyModal] = useState(false);

  const [recruiterProfileModal, setRecruiterProfileModal] = useState(false);

  const [currentWorkflowSequenceNumber, setCurrentWorkflowSequenceNumber] =
    useState(0);
  const [currentProjectNumber, setCurrentProjectNumber] = useState(0);
  const [currentEducationNumber, setCurrentEducationNumber] = useState(0);

  const [userStateAccount, setUserStateAccount] = useState(null);
  const [isUserApplicant, setIsUserApplicant] = useState(true);

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

  const toggleEducationModal = () => {
    setEducationModalVisible(!educationModalVisible);
  };

  const toggleSelectCompanyModal = () => {
    setShowSelectCompanyModal(!showSelectCompanyModal);
  };

  const toggleRecruiterProfileModal = () => {
    setRecruiterProfileModal(!recruiterProfileModal);
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
            ? "???? User created successfully. Now please complete company profile"
            : "???? User created successfully. Now please complete candidate profile"
        }`
      );
    } catch (error) {
      console.log(error);
      toast.error("User creation failed");
    }
  };

  const setRecruiterUser = (user) => {
    try {
      setUser(user);
    } catch (error) {
      console.log(error);
      toast.error("Setting user failed");
    }
  };

  const fetchAndSetAllListedCompaniesByUser = async (connection, owner) => {
    try {
      if (!owner) {
        toast.error("Please login or provide owner to view company list");
        return;
      }
      setLoading(true);
      const user_info_state_account = await fetchUserInfoAccount(
        owner,
        connection,
        false
      );

      if (!user_info_state_account || !user_info_state_account?.pubkey) {
        toast.error("User info account not found");
        return;
      }
      console.log(
        user_info_state_account.pubkey,
        "user_info_state_account.pubkey"
      );
      const response = await findAllCompanyInfosOfUser(
        connection,
        user_info_state_account.pubkey
      );

      console.log(
        response,
        "response from fetchAndSetAllListedCompaniesByUser"
      );

      if (response.status) {
        toast.success("???? Company list fetched successfully");
        setAllListedCompaniesByUser(response.data);
        setIsPremiumCompanyOwner(response.isPremiumCompanyOwner);
      } else toast.error("Error fetching company list");
      setLoading(false);
    } catch (error) {
      console.log(error, "error from fetchAndSetAllListedCompaniesByUser");
      toast.error("Error fetching company list");
      setLoading(false);
      throw Error(error.message);
    }
  };

  const getCandidateProfileByUsername = async (
    applicantStateAccount,
    connection
  ) => {
    try {
      // const response = await axios.get(
      //   `http://localhost:3001/api/candidateInfo/getCandidateByUsername/${username}`
      // );

      setLoading(true);

      const response = await getUserCandidateInfo(
        applicantStateAccount,
        connection
      );

      console.log(response, "response from getCandidateProfileByUsername");

      setCandidateProfile(response);
      setLoading(false);
      toast.success("???? Candidate profile fetched successfully");
    } catch (error) {
      console.log(error);
      toast.error("Candidate profile fetch failed");
      setLoading(false);
      throw Error(error.message);
    }
  };

  const loginUser = async (payload) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/user/loginUser",
        payload
      );
      setUser(response.data?.data);
      toast.success("???? Login successful");
      if (response.data?.data?.userType === "recruiter") {
        fetchAndSetAllListedCompaniesByUser(response.data?.data?.username);
        router.push("/dashboard-main");
      } else {
        getCandidateProfileByUsername(response.data?.data?.username);
      }
    } catch (error) {
      console.log(error);
      toast(error, {
        type: "error",
      });
    }
  };

  const logoutUser = async () => {
    setUser("");
    toast.success("???? Logout successful");
  };

  const getCategories = async (filters) => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/category/getAllCategories",
        filters
      );
      setCategories(response.data?.data);
    } catch (error) {
      toast("?????? Error getting categories", {
        type: "error",
      });
    }
  };

  const getJobListingsByUser = async (owner, connection) => {
    try {
      setLoading(true);
      const response = await fetchAllJobs(owner, connection);
      setJobListingsByUser(response);
      setLoading(false);
    } catch (error) {
      toast.error("?????? Error getting job listings");
      setLoading(false);
      throw Error(error.message);
    }
  };

  const getUserProfileByUserName = async (username) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/user/findUserByUsername/${username}`
      );
      setUser(response.data?.data);
    } catch (error) {
      toast.error("?????? Error getting user profile");
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
      setLoading(true);
      const response = await add_company_info(
        owner,
        companyInfo,
        connection,
        signTransaction
      );
      console.log(response, "addCompanyProfile response");
      toast.success("???? Company profile created successfully");
      await fetchAndSetAllListedCompaniesByUser(
        connection,
        owner
      );
      // setLoading(false);
      // getUserProfileByUserName(user.username);
    } catch (error) {
      toast.error("?????? Error creating company profile");
      setLoading(false);
      return {
        status: false,
        message: error.message,
      }
    }
  };

  const updateCompanyProfile = async (
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
      setLoading(true);
      const response = await update_company_info(
        owner,
        companyInfo,
        connection,
        signTransaction
      );
      console.log(response, "updateCompany response");
      toast.success("???? Company profile updated successfully");
      setLoading(false);
      // getUserProfileByUserName(user.username);
    } catch (error) {
      toast.error("?????? Error updating company profile");
      setLoading(false);
      throw Error(error.message);
    }
  };

  const getCompanyProfile = async (companyPubKey, connection) => {
    try {
      // const response = await axios.get(
      //   `http://localhost:3001/api/companyProfile/getCompanyByName/${companyName}`
      // );

      setLoading(true);

      const response = await getCompanyInfo(companyPubKey, connection);

      console.log(response, "getCompanyProfile response");

      setLoading(false);
      // setSelectedCompanyInfo(response);
    } catch (error) {
      toast.error("?????? Error getting company profile");
      setLoading(false);
      throw Error(error.message);
    }
  };

  const [selectedCompany, setSelectedCompany] = useState({});

  const updateSelectedCompany = (company) => {
    setSelectedCompany(company);
  };

  const addCandidateProfile = async (payload) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/candidateInfo/add",
        payload
      );
      setCandidateProfile(response.data?.data);
      toast.success("???? Candidate profile created successfully");
      getUserProfileByUserName(user.username);
    } catch (error) {
      toast.error("?????? Error creating candidate profile");
    }
  };

  const updateCandidateProfile = async (username, payload) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:3001/api/candidateInfo/updateCandidateByUsername/${username}`,
        payload
      );

      setCandidateProfile(response.data?.data);
      toast.success("???? Candidate profile updated successfully");
      getUserProfileByUserName(username);
      setLoading(false);
    } catch (error) {
      toast.error("?????? Error updating candidate profile");
      setLoading(false);
      throw Error(error.message);
    }
  };

  const addJobPost = async (
    provider,
    owner,
    jobPostInfo,
    selectedCompanyPubkey,
    connection,
    signTransaction
  ) => {
    try {
      // const response = await axios.post(
      //   "http://localhost:3001/api/joblistings/add",
      //   payload
      // );
      setLoading(true);
      const response = await add_jobpost_info(
        provider,
        owner,
        jobPostInfo,
        selectedCompanyPubkey,
        connection,
        signTransaction
      );

      if (response && response !== "undefined") {
        setJobPost(response);

        console.log(response, "addJobPost_response");
        await fetchAndSetCompanyPostedJobs(
          selectedCompanyPubkey,
          connection,
          false
        );
        setLoading(false);
        toast.success("???? Job post created successfully");

        return response;
      } else {
        setLoading(false);
        toast.error("?????? Error creating job post");
        return;
      }
    } catch (error) {
      toast.error("?????? Error creating job post");
      setLoading(false);
      throw Error(error.message);
    }
  };

  const updateJobPostLongDescription = async (
    owner,
    jobPostInfo,
    selectedCompanyPubkey,
    connection,
    signTransaction
  ) => {
    try {
      setLoading(true);
      const response = await update_jobpost_long_description(
        owner,
        jobPostInfo,
        selectedCompanyPubkey,
        connection,
        signTransaction
      );

      console.log(response, "updateJobPostLongDescription_response");
      // toast.success("???? Job post updated successfully");
      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      toast.error("?????? Error updating job post");
      throw Error(error.message);
    }
  };

  const updateJobPost = async (
    owner,
    jobPostInfo,
    selectedCompanyPubkey,
    connection,
    signTransaction
  ) => {
    try {
      // const response = await axios.post(
      //   "http://localhost:3001/api/joblistings/add",
      //   payload
      // );
      setLoading(true);
      const response = await update_jobpost_info(
        owner,
        jobPostInfo,
        selectedCompanyPubkey,
        connection,
        signTransaction
      );
      setJobPost(response.data?.data);
      toast.success("???? Job post updated successfully");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("?????? Error updating job post");
      throw Error(error.message);
    }
  };

  const addJobApplication = async (
    owner,
    connection,
    signTransaction,
    jobWorkflowInfo,
    jobInfoAccount,
    companyInfoAccount
  ) => {
    try {
      // const response = await axios.post(
      //   "http://localhost:3001/api/application/add",
      //   payload
      // );
      setLoading(true);
      const response = await add_job_workflow_info(
        owner,
        connection,
        signTransaction,
        jobWorkflowInfo,
        jobInfoAccount,
        companyInfoAccount
      );

      console.log(response, "addJobApplication response");
      // setJobApplication(response.data?.data);
      toast.success("???? Job applied successfully");
      setLoading(false);
    } catch (error) {
      console.log(error, "error in addJobApplication");
      toast.error("?????? Error while applying for job");
      setLoading(false);
      throw Error(error);
    }
  };

  const updateJobApplication = async (
    owner,
    connection,
    signTransaction,
    updateWorkflowInfo,
    jobInfoAccount,
    companyInfoAccount,
    applicantInfoAccount = null //it's not applicant info account, it's the user account
  ) => {
    try {
      // const response = await axios.post(
      //   "http://localhost:3001/api/application/add",
      //   payload
      // );
      setLoading(true);

      const response = await update_job_workflow_info(
        owner,
        connection,
        signTransaction,
        updateWorkflowInfo,
        jobInfoAccount,
        companyInfoAccount,
        applicantInfoAccount
      );

      console.log(response, "update response");
      // setJobApplication(response.data?.data);
      toast.success("???? Job updated successfully");

      await fetchAndSetAllAppliedApplicants(connection, companyInfoAccount);

      // setLoading(false);
    } catch (error) {
      console.log(error, "err in uodate job application");
      toast.error("?????? Error while updating for job");
      setLoading(false);
      throw Error(error, "err in uodate job application");
    }
  };

  const fetchAndSetAllInteractedJobsByUser = async (owner, connection) => {
    try {
      setLoading(true);
      const response = await fetchAllWorkflowOfUsers(owner, connection);
      setAllInteractedJobsByUser(response);
      setLoading(false);
    } catch (error) {
      toast.error("?????? Error while fetching user interacted workflows");
      setLoading(false);
    }
  };

  // const [jobInfo, setJobInfo] = useState("");

  // const getJobPostInfo = async (jobpost_info_account, connection) => {
  //   try {
  //     const jobInfo = await getJobPostInfo(jobpost_info_account, connection);
  //     setJobInfo(jobInfo);
  //   } catch (err) {
  //     console.log(err, "err in getJobInfo");
  //     toast.error("?????? Error while fetching job details");
  //   }
  // };

  const getJobDetails = async (jobpost_info_account, connection) => {
    try {
      // const response = await axios.get(
      //   `http://localhost:3001/api/joblistings/getJobListingById/${jobId}`
      // );

      setLoading(true);
      const response = await getJobPostInfo(jobpost_info_account, connection);

      if (response) {
        const company_info_account = response?.company_pubkey;
        const companyInfo = await getCompanyInfo(
          company_info_account,
          connection
        );
        response.companyInfo = companyInfo;
      }
      console.log(response, "response from getJobDetails");

      setJobDetails(response);
      setLoading(false);
    } catch (error) {
      toast.error("?????? Error while fetching job details");
      setLoading(false);
      throw Error(error.message);
    }
  };

  const fetchAndSetCompanyPostedJobs = async (
    company_info_account,
    connection,
    fetchApplicantsAlso = false
  ) => {
    try {
      if (!company_info_account) {
        return;
      }

      setLoading(true);
      const response = await findAllJobsOfCompany(
        connection,
        new PublicKey(company_info_account)
      );

      console.log(response, "response from fetchAndSetCompanyPostedJobs");

      if (response.status && response.data?.length > 0) {
        const companyInfo = await getCompanyInfo(
          new PublicKey(company_info_account),
          connection
        );
        response.data.map((job) => {
          job.parsedInfo.company_info = companyInfo;
        });
        setCompanyPostedJobs(response.data);
      } else {
        setCompanyPostedJobs([]);
      }

      if (fetchApplicantsAlso) {
        await fetchAndSetAllAppliedApplicants(connection, company_info_account);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error, "error in getCompanyPostedJobs");
      toast.error("?????? Error while fetching company posted jobs");
      setLoading(false);
      throw Error("Error while fetching company posted jobs");
    }
  };

  const [allWorkflowsOfJob, setAllWorkflowsOfJob] = useState(null);

  const getAllWorkflowsOfJob = async (jobpost_info_account, connection) => {
    try {
      setLoading(true);
      const response = await findAllWorkflowOfJobPost(
        jobpost_info_account,
        connection
      );

      console.log(response, "response from getAllWorkflowsOfJob");
      setLoading(false);
    } catch (error) {
      console.log(error, "error in getAllWorkflowsOfJob");
      toast.error("?????? Error while fetching all workflows of job");
      setLoading(false);
      throw Error(error.message);
    }
  };

  const getUserAppliedJobsByCompany = async (companyName) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/application/getCandidateDetailsAppliedForCompany/${companyName}`
      );
      setUserAppliedJobsByCompany(response.data?.data);
    } catch (error) {
      toast.error("?????? Error while fetching user applied jobs by company");
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
      toast.success("???? Job saved successfully");
    } catch (error) {
      console.log(error, "save job error");
      toast.error("?????? Error while saving job");
    }
  };

  const addWorkExperience = async (
    owner,
    payload,
    connection,
    signTransaction
  ) => {
    try {
      setLoading(true);
      const response = await add_work_experience_info(
        owner,
        payload,
        connection,
        signTransaction
      );

      console.log(response, "response in context exp");

      if (response) {
        toast.success("???? Work experience added successfully");
        fetchAndSetWorkExperience(owner, connection);
      }
      setLoading(false);
    } catch (error) {
      console.log(error, "error in addWorkExperience");
      toast.error("?????? Error while adding work experience");
      setLoading(false);
      throw error;
    }
  };

  const fetchAndSetWorkExperience = async (
    applicant_info_state_account,
    connection
  ) => {
    try {
      setLoading(true);
      const response = await findAllWorkExperiencesOfUser(
        applicant_info_state_account,
        connection
      );
      console.log(response, "response in context work exp");
      setWorkExperience(response);
      setLoading(false);
    } catch (error) {
      console.log(error, "error in context work exp");
      toast.error("?????? Error while fetching work experience");
      setLoading(false);
      throw Error(error.message);
    }
  };

  const updateWorkExperience = async (
    owner,
    payload,
    connection,
    signTransaction
  ) => {
    try {
      setLoading(true);
      const response = await update_work_experience_info(
        owner,
        payload,
        connection,
        signTransaction
      );
      if (response) {
        toast.success("???? Work experience updated successfully");
        fetchAndSetWorkExperience(owner, connection);
        setLoading(false);
      } else {
        setLoading(false);

        toast.error("?????? Error while updating work experience");
        throw Error;
      }
    } catch (error) {
      console.log(error, "error in updateWorkExperience");
      toast.error("?????? Error while updating work experience");
      throw error;
    }
  };

  const addProject = async (
    owner,
    projectInfo,
    connection,
    signTransaction
  ) => {
    try {
      setLoading(true);
      await add_project_info(owner, projectInfo, connection, signTransaction);
      await fetchAndSetProjects(owner, connection);
      toast.success("???? Project added successfully");
      setLoading(false);
    } catch (error) {
      console.log(error, "error in context project");
      toast.error("?????? Error while adding project");
      setLoading(false);
      throw error;
    }
  };

  const fetchAndSetProjects = async (
    applicant_info_state_account,
    connection
  ) => {
    try {
      setLoading(true);
      const response = await findAllProjectsOfUser(
        applicant_info_state_account,
        connection
      );

      console.log(response, "response in context project");

      setProjects(response);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("?????? Error while fetching projects");
      throw Error(error.message);
    }
  };

  const updateProject = async (
    owner,
    projectInfo,
    connection,
    signTransaction
  ) => {
    try {
      setLoading(true);
      await update_project_info(
        owner,
        projectInfo,
        connection,
        signTransaction
      );
      await fetchAndSetProjects(owner, connection);
      toast.success("???? Project updated successfully");
      setLoading(false);
    } catch (error) {
      console.log(error, "error in context project");
      toast.error("?????? Error while updating project");
      setLoading(false);
      throw error;
    }
  };

  const addEducation = async (
    owner,
    educationInfo,
    connection,
    signTransaction
  ) => {
    try {
      setLoading(true);
      await add_education_info(
        owner,
        educationInfo,
        connection,
        signTransaction
      );
      await fetchAndSetEducation(owner, connection);
      toast.success("???? Education added successfully");
      setLoading(false);
    } catch (error) {
      console.log(error, "error in context education");
      toast.error("?????? Error while adding education");
      setLoading(false);
      throw error;
    }
  };

  const fetchAndSetEducation = async (
    applicant_info_state_account,
    connection
  ) => {
    try {
      setLoading(true);
      const response = await findAllEducationsOfUser(
        applicant_info_state_account,
        connection
      );

      console.log(response, "response in context fetchAndSetEducation");

      setEducations(response);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("?????? Error in fetchAndSetEducation");
      setLoading(false);
      throw Error(error.message);
    }
  };

  const updateEducation = async (
    owner,
    educationInfo,
    connection,
    signTransaction
  ) => {
    try {
      setLoading(true);
      await update_education_info(
        owner,
        educationInfo,
        connection,
        signTransaction
      );
      await fetchAndSetProjects(owner, connection);
      toast.success("???? Education updated successfully");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error, "error in context education");
      toast.error("?????? Error while updating Education");
      throw error;
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
      toast.error("?????? Error while fetching if candidate has applied for job");
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
      toast.error("?????? Error while fetching if candidate has saved job");
    }
  };

  const getSavedJobs = async (username) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/application/getUserSavedJobs/${username}`
      );
      setSavedJobs(response.data?.data);
    } catch (error) {
      toast.error("?????? Error while fetching saved jobs");
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
      setLoading(true);
      const response = await add_contact_info(
        owner,
        contactInfo,
        connection,
        signTransaction
      );

      console.log(response, "response in context socials");
      fetchAndSetCandidateSocials(owner, connection);
      toast.success("???? Socials added successfully");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("?????? Error while adding socials");
    }
  };

  const fetchAndSetCandidateSocials = async (
    publicKey,
    connection,
    user_info_state_account = ""
  ) => {
    try {
      const res = await getContactInfoByUserAccount(
        publicKey,
        connection,
        user_info_state_account
      );
      console.log(res, "res in context socials");
      setCandidateSocials(res);
    } catch (error) {
      toast.error("?????? Error while fetching socials");
    }
  };

  const updateCandidateSocials = async (
    owner,
    contactInfo,
    connection,
    signTransaction
  ) => {
    try {
      setLoading(true);
      await update_contact_info(
        owner,
        contactInfo,
        connection,
        signTransaction
      );

      fetchAndSetCandidateSocials(owner, connection);
      toast.success("???? Socials updated successfully");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("?????? Error while updating socials");
    }
  };

  const getApplicantInfoStateAccount = async (
    applicant_public_key,
    connection
  ) => {
    try {
      setLoading(true);
      const resp = await getUserCandidateInfo(applicant_public_key, connection);
      console.log(applicant_public_key.toString(), "applicant_public_key");
      console.log(resp, "resp");
      setLoading(false);
      return resp;
    } catch (err) {
      console.log(err, "err");
      setLoading(false);
    }
  };

  const setUserFromChain = async (payload, connection) => {
    try {
      console.log(payload, "payload in setUserFromChain");
      setUser(payload);
      setIsUserApplicant(
        payload.user_type === userTypeEnum.APPLICANT ? true : false
      );
      if (payload.user_type === userTypeEnum.RECRUITER) {
        await fetchAndSetAllListedCompaniesByUser(
          connection,
          payload.owner_pubkey
        );
      }
    } catch (error) {
      console.log(error, "error in setUserFromChain");
      toast.error("?????? Error while setting user from chain");
    }
  };
  const updateUserStateAccount = async (applicant_info_state_account) => {
    // const res = await check_if_user_exists(publicKey, connection);
    setUserStateAccount(applicant_info_state_account);
  };

  const fetchAndSetAllListedCompanies = async (connection) => {
    try {
      console.log("In fetchAndSetAllListedCompanies context function");
      setLoading(true);
      const response = await findAllCompanyInfosOfUser(connection);
      console.log(response, "response in fetchAndSetAllListedCompanies");
      setAllListedCompanies(response.data);
      setLoading(false);
      // toast.success("???? All listed companies fetched successfully");
    } catch (error) {
      console.log(error, "error in getAllListedCompanies");
      toast.error(error.message);
      setLoading(false);
      throw Error(error.message);
    }
  };

  const fetchAndSetAllJobListings = async (
    connection
    // company_info_account
  ) => {
    try {
      // let response;
      // if (company_info_account) {
      //   response = await fetchAllJobs(connection, company_info_account);
      // } else {
      // }
      setLoading(true);

      const response = await fetchAllJobs(connection);
      if (response) {
        const jobsInfo = response;
        // console.log(jobsInfo, "jobsInfo in fetchAndSetAllJobListings");
        for (let job of jobsInfo) {
          const jobInfo = job?.parsedInfo;
          // console.log(job.parsedInfo, "job in fetchAndSetAllJobListings");
          const company_info_account = jobInfo.company_pubkey;
          const company_info = await getCompanyInfo(
            company_info_account,
            connection
          );
          jobInfo.company_info = company_info;

          // console.log(jobInfo, "jobInfo in fetchAndSetAllJobListings");
        }

        // // const jobWithPubKey = {

        // // }
        setAllListedJobs(jobsInfo);
        setLoading(false);
      }

      // toast.success("???? All job listings fetched successfully");
    } catch (error) {
      console.log(error, "error in fetchAndSetAllJobListings");
      toast.error("Error while fetching all job listings");
      setLoading(false);
      throw Error(error);
    }
  };

  const setWorkflowSequenceNumber = async (sequenceNumber) => {
    setCurrentWorkflowSequenceNumber(sequenceNumber);
  };

  const setProjectNumber = async (projectNumber) => {
    setCurrentProjectNumber(projectNumber);
  };

  const setEducationNumber = async (educationNumber) => {
    setCurrentEducationNumber(educationNumber);
  };

  const allWorkflows_initial = {
    [WORKFLOW_STATUSES[0]]: [],
    [WORKFLOW_STATUSES[1]]: [],
    [WORKFLOW_STATUSES[2]]: [],
    [WORKFLOW_STATUSES[3]]: [],
    [WORKFLOW_STATUSES[4]]: [],
  };
  const [allAppliedApplicants, setAllAppliedApplicants] =
    useState(allWorkflows_initial);

  const fetchAndSetAllAppliedApplicants = async (
    connection,
    company_info_account
  ) => {
    try {
      setLoading(true);
      setAllAppliedApplicants(null);

      if (!company_info_account) {
        // response = await findAllWorkflowOfJobPost(connection, null, null, null);
        return;
      }
      const allWorkflows = { ...allWorkflows_initial };
      const response = await findAllWorkflowOfJobPost(
        connection,
        null,
        null,
        new PublicKey(company_info_account)
      );

      const jobWorkFlows = response.data;

      for (let workflow of jobWorkFlows) {
        const applicantInfo = await getUserCandidateInfo(
          workflow.user_pubkey,
          connection
        );
        const jobInfo = await getJobPostInfo(workflow.job_pubkey, connection);

        workflow.applicantInfo = {
          ...applicantInfo,
          pubkey: workflow.user_pubkey,
        };
        workflow.jobInfo = { ...jobInfo, pubkey: workflow.job_pubkey };

        allWorkflows[workflow.status].push({
          ...workflow,
          pubkey: workflow.pubkey,
        });
      }
      console.log(allWorkflows, "allWorkflows");

      setAllAppliedApplicants(allWorkflows);
      setLoading(false);
    } catch (err) {
      console.log(err, "err in fetch applicants");
      toast.error("?????? Error while fetching applicants");
      setLoading(false);
      throw Error(err, "err in fetch applicants");
    }
  };

  const [allCandidates, setAllCandidates] = useState([]);

  const fetchAndSetAllUsers = async (connection) => {
    try {
      setLoading(true);
      // setAllAppliedApplicants(null);

      const result = await fetchAllUsers(userTypeEnum.APPLICANT, connection);
      if (result.status) {
        setAllCandidates(result.candidates);
      } else setAllCandidates([]);
      setLoading(false);
    } catch (err) {
      console.log(err, "err in fetch applicants");
      toast.error("?????? Error while fetching applicants");
      setLoading(false);
      throw Error(err, "err in fetch applicants");
    }
  };

  const fetchAndSetWorkflowInfo = async (workflowPubkey, connection) => {
    try {
      if (!workflowPubkey) {
        toast.error("?????? No workflow found");
        return;
      }

      setLoading(true);
      const workflow = await getWorkflowInfo(
        new PublicKey(workflowPubkey),
        connection
      );
      if (!workflow) {
        toast.error("?????? No workflow found");
        return;
      }

      const applicantInfo = await getUserCandidateInfo(
        workflow.user_pubkey,
        connection
      );

      const jobInfo = await getJobPostInfo(workflow.job_pubkey, connection);

      const companyInfo = await getCompanyInfo(
        workflow.company_pubkey,
        connection
      );

      if (applicantInfo)
        workflow.applicantInfo = {
          ...applicantInfo,
          pubkey: workflow.user_pubkey,
        };

      if (jobInfo)
        workflow.jobInfo = { ...jobInfo, pubkey: workflow.job_pubkey };

      if (companyInfo)
        workflow.companyInfo = {
          ...companyInfo,
          pubkey: workflow.company_pubkey,
        };

      workflow.pubkey = workflowPubkey;
      console.log(workflow, "response in fetchAndSetWorkflowInfo");

      setWorkflowSelectedToView(workflow);
      setLoading(false);
    } catch (err) {
      console.log(err, "err in fetchAndSetWorkflowInfo");
      toast.error(err.message || "?????? Error while fetching workflow info");
      setLoading(false);
      throw err;
    }
  };

  const fetchAndSetCompanyInfo = async (companyInfoAccount, connection) => {
    try {
      if (!companyInfoAccount) {
        toast.error("?????? No company info found");
        return;
      }

      setLoading(true);

      const response = await getCompanyInfo(
        new PublicKey(companyInfoAccount),
        connection
      );
      if (!response) {
        toast.error("?????? No company info found");
        return;
      }
      console.log(response, "response in fetchAndSetCompanyInfo");
      setSelectedCompanyInfo(response);
      setLoading(false);
    } catch (err) {
      console.log(err, "err in fetchAndSetCompanyInfo");
      setLoading(false);
      toast.error(err.message || "?????? Error while fetching company info");
    }
  };

  // const rejectApplicant = async (
  //   owner,
  //   connection,
  //   signTransaction,
  //   updateWorkflowInfo,
  //   job_number,
  //   companyInfoAccount
  // ) => {
  //   try {
  //     const response = await update_job_workflow_info(
  //       owner,
  //       connection,
  //       signTransaction,
  //       updateWorkflowInfo,
  //       job_number,
  //       companyInfoAccount
  //     );

  //     console.log(response, "response in rejectApplicant");
  //     toast.success("???? Applicant rejected successfully");
  //   } catch (err) {
  //     console.log(err, "err in rejectApplicant");
  //     toast.error("?????? Error while rejecting applicant");
  //     throw new Error(err, "err in rejectApplicant");
  //   }
  // };

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
        jobListingsByUser,
        getJobListingsByUser,
        companyProfileModalVisible,
        toggleCompanyProfileModal,
        candidateProfileModalVisible,
        toggleCandidateProfileModal,
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
        fetchAndSetAllListedCompaniesByUser,
        jobApplication,
        addJobApplication,
        updateJobApplication,
        fetchAndSetAllInteractedJobsByUser,
        allInteractedJobsByUser,
        jobDetails,
        getJobDetails,
        companyPostedJobs,
        fetchAndSetCompanyPostedJobs,
        userAppliedJobsByCompany,
        getUserAppliedJobsByCompany,
        savedJobs,
        saveJob,
        getSavedJobs,
        workExperience,
        addWorkExperience,
        fetchAndSetWorkExperience,
        updateWorkExperience,
        projects,
        addProject,
        fetchAndSetProjects,
        updateProject,
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
        fetchAndSetCandidateSocials,
        updateCandidateSocials,
        candidateInfoOpenAction,
        setCandidateInfoAction,
        userTypeModalVisible,
        toggleUserTypeModal,
        getApplicantInfoStateAccount,
        setUserFromChain,
        userStateAccount,
        updateUserStateAccount,
        selectedCompany,
        updateSelectedCompany,
        allWorkflowsOfJob,
        getAllWorkflowsOfJob,
        updateJobPost,
        updateCompanyProfile,
        allListedCompanies,
        fetchAndSetAllListedCompanies,
        allListedJobs,
        fetchAndSetAllJobListings,
        setWorkflowSequenceNumber,
        currentWorkflowSequenceNumber,
        setProjectNumber,
        currentProjectNumber,
        allAppliedApplicants,
        fetchAndSetAllAppliedApplicants,
        loading,
        error,
        allListedCompaniesByUser,
        fetchAndSetCompanyInfo,
        selectedCompanyInfo,
        setCompanySelectedByUser,
        companySelectedByUser,
        educationModalVisible,
        toggleEducationModal,
        educations,
        fetchAndSetEducation,
        currentEducationNumber,
        setEducationNumber,
        addEducation,
        updateEducation,
        setWorkflowSelectedToView,
        workflowSelectedToView,
        fetchAndSetWorkflowInfo,
        showSelectCompanyModal,
        toggleSelectCompanyModal,
        allCandidates,
        fetchAndSetAllUsers,
        isUserApplicant,
        isPremiumCompanyOwner,
        recruiterProfileModal,
        toggleRecruiterProfileModal,
        setRecruiterUser,
        updateJobPostLongDescription,
        profileLoading,
        setProfileLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
export { GlobalProvider };
