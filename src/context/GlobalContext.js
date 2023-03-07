import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

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

  const getCompanyProfileByUsername = async (username) => {
    try {
      console.log("In getCompanyProfileByUsername context function");

      const response = await axios.get(
        `http://localhost:3001/api/companyProfile/getCompanyByUsername/${username}`
      );

      setCompanyProfile(response.data?.data);
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

  const getJobListings = async (filters) => {
    try {
      console.log("jl filters", filters);
      const response = await axios.post(
        "http://localhost:3001/api/joblistings/showall",
        filters
      );
      setJobListings(response.data?.data);
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

  const addCompanyProfile = async (payload) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/companyProfile/addCompany",
        payload
      );
      setCompanyProfile(response.data?.data);
      toast.success("😃 Company profile created successfully");
      getUserProfileByUserName(user.username);
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

  const addJobPost = async (payload) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/joblistings/add",
        payload
      );
      setJobPost(response.data?.data);
      toast.success("😃 Job post created successfully");
    } catch (error) {
      toast.error("⚠️ Error creating job post");
    }
  };

  const addJobApplication = async (payload) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/application/add",
        payload
      );
      setJobApplication(response.data?.data);
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

  const getJobDetails = async (jobId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/joblistings/getJobListingById/${jobId}`
      );
      setJobDetails(response.data?.data);
    } catch (error) {
      toast.error("⚠️ Error while fetching job details");
    }
  };

  const getCompanyPostedJobs = async (companyName) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/joblistings/getTotalJobPostingsByCompany/${companyName}`
      );
      setCompanyPostedJobs(response.data?.data);
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

  const addWorkExperience = async (payload) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/candidateInfo/addCandidateWorkExperience",
        payload
      );
      setWorkExperience(response.data?.data);
      toast.success("😃 Work experience added successfully");
    } catch (error) {
      toast.error("⚠️ Error while adding work experience");
    }
  };

  const getWorkExperience = async (username) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/candidateInfo/getCandidateWorkExperience/${username}`
      );
      setWorkExperience(response.data?.data);
    } catch (error) {
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

  const addProjects = async (payload) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/candidateInfo/addCandidateProjects",
        payload
      );
      setProjects(response.data?.data);
      toast.success("😃 Project added successfully");
    } catch (error) {
      toast.error("⚠️ Error while adding project");
    }
  };

  const getProjects = async (username) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/candidateInfo/getCandidateProjects/${username}`
      );
      setProjects(response.data?.data);
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

  const addCandidateSocials = async (payload) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/candidateInfo/addCandidateContactInfo",
        payload
      );
      setCandidateSocials(response.data?.data);
      toast.success("😃 Socials added successfully");
    } catch (error) {
      toast.error("⚠️ Error while adding socials");
    }
  };

  const getCandidateSocials = async (username) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/candidateInfo/getCandidateContactInfo/${username}`
      );
      setCandidateSocials(response.data?.data);
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
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
export { GlobalProvider };
