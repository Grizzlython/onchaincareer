import currencyList from "./currencyList.json";
import countryList from "./countriesList.json";
import { coinList } from "./cryptoCurrency";

export const currencies = [...currencyList, ...coinList];
export const countries = countryList;
export const defaultCategories = [
  { value: "Marketing", label: "Marketing" },
  { value: "Development", label: "Development" },
  { value: "Design", label: "Design" },
  { value: "Business Development", label: "Business Development" },
  { value: "Customer service", label: "Customer service" },
  { value: "sales_&Sales & Communication", label: "Sales & Communication" },
  { value: "Project Management", label: "Project Management" },
  { value: "Human Resource", label: "Human Resource" },
];

export const categories = [
  { name: "Business Development", icon: "fa fa-briefcase", color: "blue" },
  { name: "Customer service", icon: "fa fa-headset", color: "spray" },
  { name: "Development", icon: "fa fa-layer-group", color: "coral" },
  { name: "Design", icon: "fa fa-pen-nib", color: "red" },
  { name: "Marketing & management", icon: "fa fa-rocket", color: "orange" },
  { name: "Sales & Communication", icon: "fa fa-comments", color: "yellow" },
  { name: "Project Management", icon: "fa fa-tasks", color: "turquoise" },
  { name: "Human Resource", icon: "fa fa-user-tie", color: "green" },
];

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

export const defaultEmployees = [
  { value: "10-50", label: "10-50" },
  { value: "50-100", label: "50-100" },
  { value: "100-500", label: "100-500" },
  { value: "500+", label: "500+" },
];

export const defaultCompanyTypeOptions = [
  { value: "Product-based", label: "Product based" },
  { value: "Service-based", label: "Service based" },
];

export const jobTypes = [
  { value: "Full-Time", label: "Full-Time" },
  { value: "Part-Time", label: "Part-Time" },
  { value: "Freelancer", label: "Freelancer" },
  { value: "Internship", label: "Internship" },
];

export const defaultCurrencyTypes = [
  { value: "fiat", label: "Fiat" },
  { value: "crypto", label: "Crypto" },
];

export const remoteJobTypes = [
  {
    label: "Yes",
    value: "remote",
  },
  {
    label: "No",
    value: "inOffice",
  },
];

export const defaultSkills = [
  {
    label: "HTML",
    value: "HTML",
  },
  {
    label: "CSS",
    value: "CSS",
  },
  {
    label: "JavaScript",
    value: "JavaScript",
  },
  {
    label: "React",
    value: "React",
  },
  {
    label: "AngularJS",
    value: "AngularJS",
  },
  {
    label: "Vue.js",
    value: "Vue.js",
  },
  {
    label: "JQuery",
    value: "JQuery",
  },
  {
    label: "Node.js",
    value: "Node.js",
  },
  {
    label: "Express.js",
    value: "Express.js",
  },

  {
    label: "Laravel",
    value: "Laravel",
  },
  {
    label: "Symfony",
    value: "Symfony",
  },

  {
    label: "ASP.NET",
    value: "ASP.NET",
  },

  {
    label: "Ruby on Rails",
    value: "Ruby on Rails",
  },
  {
    label: "Django",
    value: "Django",
  },
  {
    label: "PHP",
    value: "PHP",
  },
  {
    label: "Python",
    value: "Python",
  },
  {
    label: "Java",
    value: "Java",
  },
  {
    label: ".NET",
    value: ".NET",
  },
  {
    label: "SQL",
    value: "SQL",
  },
  {
    label: "MongoDB",
    value: "MongoDB",
  },
  {
    label: "MySQL",
    value: "MySQL",
  },
  {
    label: "PostgreSQL",
    value: "PostgreSQL",
  },
  {
    label: "C",
    value: "C",
  },
  {
    label: "C++",
    value: "C++",
  },
  {
    label: "C#",
    value: "C#",
  },
  {
    label: "Go",
    value: "Go",
  },
  {
    label: "Swift",
    value: "Swift",
  },
  {
    label: "Kotlin",
    value: "Kotlin",
  },
  {
    label: "R",
    value: "R",
  },
  {
    label: "Scala",
    value: "Scala",
  },
  {
    label: "Rust",
    value: "Rust",
  },
  {
    label: "TypeScript",
    value: "TypeScript",
  },
  {
    label: "AWS",
    value: "AWS",
  },
  {
    label: "Azure",
    value: "Azure",
  },
  {
    label: "Google Cloud",
    value: "Google Cloud",
  },
  {
    label: "Docker",
    value: "Docker",
  },
  {
    label: "Kubernetes",
    value: "Kubernetes",
  },
  {
    label: "Linux",
    value: "Linux",
  },
  {
    label: "Windows",
    value: "Windows",
  },
  {
    label: "MacOS",
    value: "MacOS",
  },
  {
    label: "Git",
    value: "Git",
  },
  {
    label: "GitHub",
    value: "GitHub",
  },
  {
    label: "GitLab",
    value: "GitLab",
  },
  {
    label: "Bitbucket",
    value: "Bitbucket",
  },
  {
    label: "Jira",
    value: "Jira",
  },
  {
    label: "Confluence",
    value: "Confluence",
  },
  {
    label: "Trello",
    value: "Trello",
  },
  {
    label: "Slack",
    value: "Slack",
  },
  {
    label: "Microsoft Teams",
    value: "Microsoft Teams",
  },
  {
    label: "Zoom",
    value: "Zoom",
  },
  {
    label: "Google Meet",
    value: "Google Meet",
  },

  {
    label: "Adobe Photoshop",
    value: "Adobe Photoshop",
  },
  {
    label: "Adobe Illustrator",
    value: "Adobe Illustrator",
  },
  {
    label: "Adobe XD",
    value: "Adobe XD",
  },
  {
    label: "Figma",
    value: "Figma",
  },
  {
    label: "Sketch",
    value: "Sketch",
  },
  {
    label: "InVision",
    value: "InVision",
  },
  {
    label: "Zeplin",
    value: "Zeplin",
  },
  {
    label: "Adobe Premiere Pro",
    value: "Adobe Premiere Pro",
  },
  {
    label: "Adobe After Effects",
    value: "Adobe After Effects",
  },
  {
    label: "Adobe Lightroom",
    value: "Adobe Lightroom",
  },
  {
    label: "Adobe Audition",
    value: "Adobe Audition",
  },
  {
    label: "Adobe Animate",
    value: "Adobe Animate",
  },
  {
    label: "Adobe Spark",
    value: "Adobe Spark",
  },
  {
    label: "Adobe InDesign",
    value: "Adobe InDesign",
  },
  {
    label: "Adobe Dreamweaver",
    value: "Adobe Dreamweaver",
  },
  {
    label: "Adobe Muse",
    value: "Adobe Muse",
  },
  {
    label: "Adobe Bridge",
    value: "Adobe Bridge",
  },
  {
    label: "Adobe Character Animator",
    value: "Adobe Character Animator",
  },
  {
    label: "Adobe Dimension",
    value: "Adobe Dimension",
  },
  {
    label: "Adobe Fuse",
    value: "Adobe Fuse",
  },
  { label: "Communication", value: "Communication" },
  { label: "Teamwork", value: "Teamwork" },
  { label: "Problem Solving", value: "Problem Solving" },
  { label: "Time Management", value: "Time Management" },
  { label: "Leadership", value: "Leadership" },
  { label: "Adaptability", value: "Adaptability" },
  { label: "Critical Thinking", value: "Critical Thinking" },
  { label: "Organization", value: "Organization" },
  { label: "Attention to Detail", value: "Attention to Detail" },
  { label: "Creativity", value: "Creativity" },
  { label: "Flexibility", value: "Flexibility" },
  { label: "Ethereum", value: "Ethereum" },
  { label: "Solidity", value: "Solidity" },
  { label: "Truffle", value: "Truffle" },
  { label: "Web3", value: "Web3" },
  { label: "IPFS", value: "IPFS" },
  { label: "Hyperledger", value: "Hyperledger" },
  { label: "Hyperledger Fabric", value: "Hyperledger Fabric" },
  { label: "Hyperledger Sawtooth", value: "Hyperledger Sawtooth" },
  { label: "Hyperledger Iroha", value: "Hyperledger Iroha" },
  { label: "Hyperledger Burrow", value: "Hyperledger Burrow" },
  { label: "Hyperledger Besu", value: "Hyperledger Besu" },
  { label: "Hyperledger Avalon", value: "Hyperledger Avalon" },
  { label: "Hyperledger Cello", value: "Hyperledger Cello" },
  { label: "Hyperledger Explorer", value: "Hyperledger Explorer" },
  { label: "Solana", value: "Solana" },
  { label: "Rust", value: "Rust" },
  { label: "C", value: "C" },
  { label: "C++", value: "C++" },
  { label: "Python", value: "Python" },
  { label: "JavaScript", value: "JavaScript" },
  { label: "TypeScript", value: "TypeScript" },
  { label: "React", value: "React" },
  { label: "Angular", value: "Angular" },
  { label: "Vue", value: "Vue" },
  { label: "Node.js", value: "Node.js" },
  { label: "Express.js", value: "Express.js" },
  { label: "Nest.js", value: "Nest.js" },
  { label: "Django", value: "Django" },
  { label: "Flask", value: "Flask" },
  { label: "FastAPI", value: "FastAPI" },
  { label: "GraphQL", value: "GraphQL" },
  { label: "Apollo", value: "Apollo" },
  { label: "Docker", value: "Docker" },
  { label: "Kubernetes", value: "Kubernetes" },
  { label: "AWS", value: "AWS" },
  { label: "Azure", value: "Azure" },
  { label: "Google Cloud", value: "Google Cloud" },
  { label: "Firebase", value: "Firebase" },
  { label: "Heroku", value: "Heroku" },
  { label: "Netlify", value: "Netlify" },
  { label: "Vercel", value: "Vercel" },
  { label: "GitHub", value: "GitHub" },
  { label: "GitLab", value: "GitLab" },
  { label: "Bitbucket", value: "Bitbucket" },
  { label: "Jira", value: "Jira" },
  { label: "Confluence", value: "Confluence" },
  { label: "Trello", value: "Trello" },
  { label: "SEO", value: "SEO" },
  { label: "SEM", value: "SEM" },
  { label: "SMM", value: "SMM" },
  { label: "Google Ads", value: "Google Ads" },
  { label: "Facebook Ads", value: "Facebook Ads" },
  { label: "Twitter Ads", value: "Twitter Ads" },
  { label: "LinkedIn Ads", value: "LinkedIn Ads" },
  { label: "Instagram Ads", value: "Instagram Ads" },
  { label: "Pinterest Ads", value: "Pinterest Ads" },
  { label: "Snapchat Ads", value: "Snapchat Ads" },
  { label: "TikTok Ads", value: "TikTok Ads" },
  { label: "Google Analytics", value: "Google Analytics" },
  { label: "Facebook Pixel", value: "Facebook Pixel" },
  { label: "Google Tag Manager", value: "Google Tag Manager" },
  { label: "Google Optimize", value: "Google Optimize" },
  { label: "Google Data Studio", value: "Google Data Studio" },
  { label: "Google Search Console", value: "Google Search Console" },
  { label: "Google My Business", value: "Google My Business" },
  { label: "Google Ads Editor", value: "Google Ads Editor" },
  { label: "Google Ads Scripts", value: "Google Ads Scripts" },
  { label: "Google Ads API", value: "Google Ads API" },
  { label: "Adobe Photoshop", value: "Adobe Photoshop" },
  { label: "Adobe Illustrator", value: "Adobe Illustrator" },
  { label: "Adobe InDesign", value: "Adobe InDesign" },
  { label: "Adobe XD", value: "Adobe XD" },
  { label: "Adobe Premiere Pro", value: "Adobe Premiere Pro" },
  { label: "Adobe After Effects", value: "Adobe After Effects" },
  { label: "Adobe Animate", value: "Adobe Animate" },
  { label: "Adobe Audition", value: "Adobe Audition" },
  { label: "Adobe Bridge", value: "Adobe Bridge" },
  { label: "Adobe Character Animator", value: "Adobe Character Animator" },
  { label: "Adobe Dreamweaver", value: "Adobe Dreamweaver" },
  { label: "Adobe Lightroom", value: "Adobe Lightroom" },
  { label: "Adobe Muse", value: "Adobe Muse" },
  { label: "Adobe Prelude", value: "Adobe Prelude" },
  { label: "Adobe Premiere Rush", value: "Adobe Premiere Rush" },
  { label: "Adobe Spark", value: "Adobe Spark" },
  { label: "Adobe Stock", value: "Adobe Stock" },
  { label: "Adobe Typekit", value: "Adobe Typekit" },
  { label: "Adobe XD", value: "Adobe XD" },
  { label: "Adobe Experience Manager", value: "Adobe Experience Manager" },
  { label: "Adobe Campaign", value: "Adobe Campaign" },
  { label: "Adobe Target", value: "Adobe Target" },
  { label: "Adobe Analytics", value: "Adobe Analytics" },
  { label: "Adobe Audience Manager", value: "Adobe Audience Manager" },
  { label: "Adobe Experience Cloud", value: "Adobe Experience Cloud" },
  { label: "Adobe Experience Platform", value: "Adobe Experience Platform" },
  {
    label: "Adobe Experience Platform Launch",
    value: "Adobe Experience Platform Launch",
  },
  {
    label: "Adobe Experience Platform Mobile",
    value: "Adobe Experience Platform Mobile",
  },
  {
    label: "Adobe Experience Platform Web",
    value: "Adobe Experience Platform Web",
  },
  {
    label: "Adobe Experience Platform Edge",
    value: "Adobe Experience Platform Edge",
  },
  {
    label: "Adobe Experience Platform Data Collection",
    value: "Adobe Experience Platform Data Collection",
  },
  { label: "Customer Service", value: "Customer Service" },
  { label: "Customer Support", value: "Customer Support" },
  { label: "Customer Success", value: "Customer Success" },
  { label: "Customer Experience", value: "Customer Experience" },
  { label: "Customer Retention", value: "Customer Retention" },
  { label: "Customer Engagement", value: "Customer Engagement" },
  { label: "Customer Loyalty", value: "Customer Loyalty" },
  { label: "Customer Satisfaction", value: "Customer Satisfaction" },
  { label: "Customer Feedback", value: "Customer Feedback" },
  { label: "Customer Retention", value: "Customer Retention" },
  { label: "Customer Journey", value: "Customer Journey" },
  { label: "Customer Acquisition", value: "Customer Acquisition" },
  { label: "Customer Lifetime Value", value: "Customer Lifetime Value" },
  { label: "Customer Churn", value: "Customer Churn" },
  { label: "Customer Acquisition Cost", value: "Customer Acquisition Cost" },
  {
    label: "Customer Relationship Management",
    value: "Customer Relationship Management",
  },
  { label: "Customer Data Platform", value: "Customer Data Platform" },
  { label: "Customer Data Management", value: "Customer Data Management" },
  { label: "Customer Data Integration", value: "Customer Data Integration" },
  { label: "Customer Data Management", value: "Customer Data Management" },
  { label: "Sales", value: "Sales" },
  { label: "Salesforce", value: "Salesforce" },
  { label: "Salesforce CRM", value: "Salesforce CRM" },
  { label: "Salesforce CPQ", value: "Salesforce CPQ" },
  { label: "Salesforce Pardot", value: "Salesforce Pardot" },
  { label: "Salesforce Marketing Cloud", value: "Salesforce Marketing Cloud" },
  { label: "Salesforce Service Cloud", value: "Salesforce Service Cloud" },
  { label: "Salesforce Sales Cloud", value: "Salesforce Sales Cloud" },
  { label: "Salesforce Einstein", value: "Salesforce Einstein" },
  { label: "Salesforce Community Cloud", value: "Salesforce Community Cloud" },
  { label: "Salesforce Commerce Cloud", value: "Salesforce Commerce Cloud" },
  {
    label: "Salesforce Field Service Lightning",
    value: "Salesforce Field Service Lightning",
  },
  { label: "Salesforce Quip", value: "Salesforce Quip" },
  { label: "Salesforce Service Cloud", value: "Salesforce Service Cloud" },
  { label: "Salesforce Sales Cloud", value: "Salesforce Sales Cloud" },
  { label: "Salesforce Einstein", value: "Salesforce Einstein" },
  { label: "Salesforce Community Cloud", value: "Salesforce Community Cloud" },
  { label: "Salesforce Commerce Cloud", value: "Salesforce Commerce Cloud" },
  {
    label: "Salesforce Field Service Lightning",
    value: "Salesforce Field Service Lightning",
  },
  { label: "Salesforce Quip", value: "Salesforce Quip" },
  { label: "Salesforce Service Cloud", value: "Salesforce Service Cloud" },
  { label: "Salesforce Sales Cloud", value: "Salesforce Sales Cloud" },
  { label: "Salesforce Einstein", value: "Salesforce Einstein" },
  { label: "Salesforce Community Cloud", value: "Salesforce Community Cloud" },
  { label: "Salesforce Commerce Cloud", value: "Salesforce Commerce Cloud" },
  {
    label: "Salesforce Field Service Lightning",
    value: "Salesforce Field Service Lightning",
  },
  { label: "Salesforce Quip", value: "Salesforce Quip" },
  { label: "Salesforce Service Cloud", value: "Salesforce Service Cloud" },
  { label: "Salesforce Sales Cloud", value: "Salesforce Sales Cloud" },
  { label: "Salesforce Einstein", value: "Salesforce Einstein" },
  { label: "Project Management", value: "Project Management" },
  { label: "Project Manager", value: "Project Manager" },
  { label: "Project Planning", value: "Project Planning" },
  { label: "Project Scheduling", value: "Project Scheduling" },
  { label: "Project Tracking", value: "Project Tracking" },
  { label: "Project Estimation", value: "Project Estimation" },
  { label: "Project Budgeting", value: "Project Budgeting" },
  { label: "Project Costing", value: "Project Costing" },
  { label: "Project Risk Management", value: "Project Risk Management" },
  {
    label: "Project Resource Management",
    value: "Project Resource Management",
  },
  { label: "Project Scope Management", value: "Project Scope Management" },
  { label: "Project Quality Management", value: "Project Quality Management" },
  { label: "Project Time Management", value: "Project Time Management" },
  {
    label: "Project Procurement Management",
    value: "Project Procurement Management",
  },
  {
    label: "Project Communication Management",
    value: "Project Communication Management",
  },
  {
    label: "Project Stakeholder Management",
    value: "Project Stakeholder Management",
  },
  {
    label: "Project Integration Management",
    value: "Project Integration Management",
  },
  {
    label: "Project Human Resource Management",
    value: "Project Human Resource Management",
  },
  {
    label: "Project Procurement Management",
    value: "Project Procurement Management",
  },
  {
    label: "Project Communication Management",
    value: "Project Communication Management",
  },
  {
    label: "Project Stakeholder Management",
    value: "Project Stakeholder Management",
  },
  {
    label: "Project Integration Management",
    value: "Project Integration Management",
  },
  {
    label: "Project Human Resource Management",
    value: "Project Human Resource Management",
  },
  {
    label: "Project Procurement Management",
    value: "Project Procurement Management",
  },
  {
    label: "Project Communication Management",
    value: "Project Communication Management",
  },
  {
    label: "Project Stakeholder Management",
    value: "Project Stakeholder Management",
  },
  { label: "Human Resources", value: "Human Resources" },
  { label: "Human Resource Management", value: "Human Resource Management" },
  {
    label: "Human Resource Information System",
    value: "Human Resource Information System",
  },
  { label: "Human Resource Planning", value: "Human Resource Planning" },
  { label: "Human Resource Development", value: "Human Resource Development" },
  { label: "Human Resource Analytics", value: "Human Resource Analytics" },
  {
    label: "Human Resource Management System",
    value: "Human Resource Management System",
  },
  {
    label: "Human Resource Management Software",
    value: "Human Resource Management Software",
  },
  {
    label: "others",
    value: "others",
  },
];

// remove duplicates from defaultSkills
export const skillsJson = defaultSkills.filter(
  (v, i, a) => a.findIndex((t) => t.label === v.label) === i
);

export const currentEmploymentStatusOptions = [
  { value: "employed", label: "Employed" },
  { value: "unemployed", label: "Unemployed" },
  { value: "self-Employed", label: "Self-Employed" },
  { value: "student", label: "Student" },
];

export const canJoinInOptions = [
  { value: "immediately", label: "Immediately" },
  { value: "within 1 month", label: "1 Month" },
  { value: "within 2 months", label: "2 Months" },
  { value: "within 3 months", label: "3 Months" },
  { value: "later", label: "More than 3 months" },
];

export const currentEmploymentStatusFilters = [
  { value: "Any", label: "Any" },
  { value: "employed", label: "Employed" },
  { value: "unemployed", label: "Unemployed" },
  { value: "self-Employed", label: "Self-Employed" },
  { value: "student", label: "Student" },
];

export const canJoinInFilters = [
  { value: "Any", label: "Any" },
  { value: "immediately", label: "Immediately" },
  { value: "within 1 month", label: "1 Month" },
  { value: "within 2 months", label: "2 Months" },
  { value: "within 3 months", label: "3 Months" },
  { value: "later", label: "More than 3 months" },
];

export const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
