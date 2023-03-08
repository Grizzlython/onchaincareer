import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

export const userTypeEnum = {
  RECRUITER: "recruiter",
  APPLICANT: "applicant",
};

export const ACTIVE_SOLANA_NETWORK = process.env.ENVRIONMENT_TYPE === "production" ? WalletAdapterNetwork.Mainnet : WalletAdapterNetwork.Devnet;

export const EXPLORER_CLUSTER = process.env.ENVRIONMENT_TYPE === "production" ? "" : "?cluster=devnet";
export const EXPLORER_ADDRESS_URL = process.env.ENVRIONMENT_TYPE === "production" ? "https://explorer.solana.com/address/" : "https://explorer.solana.com/address/";

export const BUNDLR_ENDPOINT = process.env.ENVRIONMENT_TYPE === "production" ? "https://mainnet.bundlr.network":"https://devnet.bundlr.network";

export const BUNDLR_CURRENCY = "solana";

export const SOLANA_RPC_NETWORK = process.env.ENVRIONMENT_TYPE === "production" ? "https://api.mainnet-beta.solana.com": "https://api.devnet.solana.com";


export const defaultJobTypes = [
  { value: "All", label: "All Types" },
  { value: "Full-Time", label: "Full Time" },
  { value: "Part-Time", label: "Part Time" },
  { value: "Freelancer", label: "Freelancer" },
  { value: "Internship", label: "Internship" },
];


export const sortTypes = [
  { value: "Any", label: "Any"},
  { value: "Latest", label: "Newest" },
  { value: "Oldest", label: "Oldest" },
];

export const companyTypes = [
  { value: "All", label: "All Companies" },
  { value: "Service-based", label: "Service-based" },
  { value: "Product-based", label: "Product-based" },
];

export const categoryOptions = [
  { value: "All", label: "All" },
  { value: "Marketing", label: "Marketing" },
  { value: "Development", label: "Development" },
  { value: "Design", label: "Design" },
  { value: "Business Development", label: "Business Development" },
  { value: "Customer service", label: "Customer service" },
  { value: "Sales & Communication", label: "Sales & Communication" },
  { value: "Project Management", label: "Project Management" },
  { value: "Human Resource", label: "Human Resource" },
];