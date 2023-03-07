import currencyList from "./currencyList.json";
import countryList from "./countriesList.json";
import cryptoCurrencyList from "./cryptoCurrency.json";

export const currencies = currencyList;
export const countries = countryList;

export const jobPostJson = {
  username: "string - wallet address",
  companyName: "string - max 32 characters",
  title: "string - max 32 characters",
  shortDescription: "string - max 256 characters",
  description: "string - max 512 characters",
  category: "string[] - max 5",
  jobType: "string - full-time, part-time, contract, internship",
  salaryRange: "string - max 32 characters",
  experience: "string - max 128 characters",
  skills: "string[] - max 5",
  qualification: "string - max 128 characters",
  jobLocationType: "string - remote, inOffice",
  country: "string - max 32 characters",
  city: "string - max 32 characters",
  currencyType: "string - fiat, crypto",
  currency: "string - max 32 characters",
};

export const companyProfileJson = {
  username: "string - wallet address",
  name: "string - max 32 characters",
  logo: "string - max 128 characters",
  domain: "string - max 32 characters",
  type: "string - max 32 characters",
  foundedIn: "string - max 4 characters",
  employeeSize: "string - max 32 characters",
  address: "string - max 32 characters",
  linkedinHandle: "string - max 32 characters",
  twitterHandle: "string - max 32 characters",
  description: "string - max 512 characters",
  website: "string - max 32 characters",
};

export const candidateOverviewJson = {
  username: "string - wallet address",
  name: "string - max 32 characters",
  address: "string - max 32 characters",
  skills: "string[] - max 5",
  designation: "string - max 32 characters",
  bio: "string - max 512 characters",
  currentEmploymentStatus: "string - max 16 characters",
  canJoinIn: "string - max 16 characters",
};

export const workExpJson = {
  companyName: "string - max 32 characters",
  designation: "string - max 32 characters",
  isCurrentlyWorkingHere: "boolean",
  startDate: "date - YYYY-MM-DD",
  endDate: "date - YYYY-MM-DD",
  description: "string - max 512 characters",
  location: "string - max 64 characters",
};

export const projectsJson = {
  projectName: "string - max 32 characters",
  description: "string - max 512 characters",
  projectLink: "string - max 128 characters",
  startDate: "date - YYYY-MM-DD",
  endDate: "date - YYYY-MM-DD",
};

export const socialsJson = {
  username: "string - wallet address",
  email: "string - max 32 characters",
  phone: "string - max 32 characters",
  resume: "string - max 128 characters",
  github: "string - max 32 characters",
  linkedin: "string - max 32 characters",
  twitter: "string - max 32 characters",
  dribble: "string - max 32 characters",
  behance: "string - max 32 characters",
  website: "string - max 32 characters",
};
