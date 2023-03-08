import {
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { sendTxUsingExternalSignature } from "./externalwallet";
import {
  getPayer,
  JobsOnChain_Company_Info_ID,
  JobsOnChain_JobPost_Info_ID,
  JobsOnChain_User_Info_ID,
  JobsOnChain_Workflow_Info_ID,
} from "./program_ids";
import {
  UserCandidateInfoState,
  ProjectInfoState,
  ContactInfoState,
  WorkExperienceInfoState,
  EducationInfoState,
  ProjectInfoState_SIZE,
  EducationInfoState_SIZE,
  WorkExperienceInfoState_SIZE,
  UserCandidateInfoState_SIZE,
} from "./struct_decoders/jobsonchain_user_info_decoder";
import {
  JobPostInfoState,
  JobPostInfoState_SIZE,
} from "./struct_decoders/jobsonchain_jobpost_info_decoder";
import {
  WorkflowInfoState,
  WorkflowInfoState_SIZE,
} from "./struct_decoders/jobsonchain_workflow_info_decoder";
import {
  CompanyInfoState,
  CompanyInfoState_SIZE,
} from "./struct_decoders/jobsonchain_company_info_decoder";
import { Buffer } from "buffer";
import {
  REVEAL_USER_DETAILS_PRICE,
  SOLANA_USDC_MINT_KEY_DEVNET,
  SOLANA_USDC_MINT_KEY_LOCALHOST,
  SUBSCRIPTION_PLANS,
  SUBSCRIPTION_PLANS_enum,
  SUBSCRIPTION_PLANS_PRICES,
  WORKFLOW_STATUSES,
  WORKFLOW_STATUSES_enum,
} from "./struct_decoders/jobsonchain_constants_enum";
import { findAssociatedTokenAccountPublicKey } from "./associatedAccounts";
import { transferCustomToken } from "./transferCustomToken";
import { toast } from "react-toastify";
const BN = require("bn.js");
// export const create_game_daily_league_cpi = async (owner,game_info_state_account, LEAGUE_ID, connection, signTransaction): Promise<FunctionResponse> => {
//   try{
//     const solgames_uac_state_account = platform_state_account;

//     const daily_league_platform_state_account = await PublicKey.findProgramAddress(
//       [
//         Buffer.from("daily_league_program"),
//         Buffer.from(LEAGUE_ID.toString()),
//         game_info_state_account.toBuffer(),
//       ],
//       Solgames_UAC_ProgramID
//     );
//     console.log('daily_league_platform_state_account ', daily_league_platform_state_account[0].toBase58());

//     const daily_league_pda_token_account = await getOrCreateAssociatedAccount(
//       daily_league_platform_state_account[0],
//       SOLG_token_mint,
//       owner,
//       connection,
//       signTransaction
//     );
//     console.log('daily_league_pda_token_account ', daily_league_pda_token_account.toBase58());

//     const createDailyLeagueViaCPI = new TransactionInstruction({
//       programId: Solgames_UAC_ProgramID,
//       keys: [
//         { pubkey: owner, isSigner: true, isWritable: true },
//         {
//           pubkey: solgames_uac_state_account,
//           isSigner: false,
//           isWritable: true,
//         },
//         {
//           pubkey: daily_league_platform_state_account[0],
//           isSigner: false,
//           isWritable: true,
//         },
//         { pubkey: daily_league_pda_token_account, isSigner: false, isWritable: true },
//         { pubkey: Daily_Game_League_ProgramID, isSigner: false, isWritable: false },
//         {
//           pubkey: game_info_state_account,
//           isSigner: false,
//           isWritable: true,
//         },

//         { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
//       ],

//       data: Buffer.from(Uint8Array.of(3,
//         ...new BN(LEAGUE_ID).toArray("le", 8),
//         )),
//     });

//     await sendTxUsingExternalSignature(
//       [createDailyLeagueViaCPI],
//       connection,
//       null,
//       [],
//       new PublicKey(owner),
//       signTransaction
//     );
//     await new Promise((resolve) => setTimeout(resolve, 2000));

//     return {
//       status: true,
//       message: "Daily league created successfully",
//       data: daily_league_platform_state_account[0].toString()
//     }
//   }catch(err){
//     console.log(err)
//     return {
//       status: false,
//       message: "Error occured while creating the daily league",
//       error: err
//     }
//   }
// }

/**
 * Web3Jobs
 */

export const getUserCandidateInfo = async (
  applicant_info_state_account,
  connection
) => {
  const accountInfo = await connection.getAccountInfo(
    applicant_info_state_account
  );

  if (accountInfo === null) {
    return null;
  }
  const applicantInfo = UserCandidateInfoState.deserialize(accountInfo.data);
  return applicantInfo;
};

export const getProjectInfo = async (
  project_info_state_account,
  connection
) => {
  let projectExists = await connection.getAccountInfo(
    project_info_state_account
  );
  if (projectExists === null) {
    return null;
  }
  const projectInfo = ProjectInfoState.deserialize(projectExists.data);
  return projectInfo;
};

export const getContactInfoByUserAccount = async (
  owner,
  connection,
  user_info_state_account = ""
) => {
  let candidate_info_state_account = [];
  if (user_info_state_account) {
    candidate_info_state_account = [user_info_state_account];
  } else {
    candidate_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(APPLICANT_STATE_ACCOUNT_PREFIX),
        new PublicKey(owner).toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );
  }

  let candidateInfoExists = await connection.getAccountInfo(
    candidate_info_state_account[0]
  );

  if (candidateInfoExists === null) {
    return null;
  }

  const contact_info_state_account = await PublicKey.findProgramAddress(
    [
      Buffer.from(CONTACT_STATE_ACCOUNT_PREFIX),
      candidate_info_state_account[0].toBuffer(),
    ],
    JobsOnChain_User_Info_ID
  );

  let contactInfoExists = await connection.getAccountInfo(
    contact_info_state_account[0]
  );

  if (!contactInfoExists) {
    return null;
  }

  const contactInfo = ContactInfoState.deserialize(contactInfoExists.data);
  return contactInfo;
};

export const getContactInfo = async (
  contact_info_state_account,
  connection
) => {
  let contactInfoExists = await connection.getAccountInfo(
    contact_info_state_account
  );
  if (contactInfoExists === null) {
    return null;
  }
  const contactInfo = ContactInfoState.deserialize(contactInfoExists.data);
  return contactInfo;
};

export const getEducationInfo = async (
  education_info_state_account,
  connection
) => {
  let educationInfoExists = await connection.getAccountInfo(
    education_info_state_account
  );
  if (educationInfoExists === null) {
    return null;
  }
  const educationInfo = EducationInfoState.deserialize(
    educationInfoExists.data
  );
  return educationInfo;
};

export const getWorkExperienceInfo = async (
  work_experience_info_state_account,
  connection
) => {
  let workExperienceInfoExists = await connection.getAccountInfo(
    work_experience_info_state_account
  );
  if (workExperienceInfoExists === null) {
    return null;
  }
  const workExperienceInfo = WorkExperienceInfoState.deserialize(
    workExperienceInfoExists.data
  );
  return workExperienceInfo;
};

export const findAllProjectsOfUser = async (
  user_info_state_account,
  connection
) => {
  let projectsOfUser = await connection.getProgramAccounts(
    JobsOnChain_User_Info_ID,
    {
      filters: [
        {
          dataSize: ProjectInfoState_SIZE,
        },
        {
          memcmp: {
            offset: 1,
            bytes: user_info_state_account.toString(),
          },
        },
      ],
    }
  );

  const projects = [];
  for (let i = 0; i < projectsOfUser.length; i++) {
    const project = ProjectInfoState.deserialize(
      projectsOfUser[i].account.data
    );
    projects.push(project);
  }

  return projects;
};

export const findAllEducationsOfUser = async (
  user_info_state_account,
  connection
) => {
  let educationsOfUser = await connection.getProgramAccounts(
    JobsOnChain_User_Info_ID,
    {
      filters: [
        {
          dataSize: EducationInfoState_SIZE,
        },
        {
          memcmp: {
            offset: 1,
            bytes: user_info_state_account.toString(),
          },
        },
      ],
    }
  );

  const educations = [];
  for (let i = 0; i < educationsOfUser.length; i++) {
    const education = EducationInfoState.deserialize(
      educationsOfUser[i].account.data
    );
    educations.push(education);
  }

  return educations;
};

export const findAllWorkExperiencesOfUser = async (
  user_info_state_account,
  connection
) => {
  let workExperiencesOfUser = await connection.getProgramAccounts(
    JobsOnChain_User_Info_ID,
    {
      filters: [
        {
          dataSize: WorkExperienceInfoState_SIZE,
        },
        {
          memcmp: {
            offset: 1,
            bytes: user_info_state_account.toString(),
          },
        },
      ],
    }
  );

  const workExperiences = [];

  for (let i = 0; i < workExperiencesOfUser.length; i++) {
    const workExperience = WorkExperienceInfoState.deserialize(
      workExperiencesOfUser[i].account.data
    );
    workExperiences.push(workExperience);
  }

  console.log(workExperiences, "---workExperiences---");

  return workExperiences;
};

export const findAllCompanyInfosOfUser = async (
  connection,
  user_info_state_account
) => {
  try {
    const filters = [
      {
        dataSize: CompanyInfoState_SIZE,
      },
    ];
    //if user_info_state_account is not null, then filter by user_info_state_account else return all company infos
    if (user_info_state_account) {
      filters.push({
        memcmp: {
          offset: 2,
          bytes: user_info_state_account.toString(),
        },
      });
    }

    let companyInfosOfUser = await connection.getProgramAccounts(
      JobsOnChain_Company_Info_ID,
      {
        filters,
      }
    );

    const companyInfos = [];
    let isPremiumCompanyOwner = false;
    for (let i = 0; i < companyInfosOfUser.length; i++) {
      const companyInfo = CompanyInfoState.deserialize(
        companyInfosOfUser[i].account.data
      );

      if (
        companyInfo.subscription_plan != SUBSCRIPTION_PLANS_enum.PAYNUSE &&
        companyInfo.subscription_valid_till > Date.now()
      ) {
        isPremiumCompanyOwner = true;
      }

      const companyInfoWithPubKey = {
        ...companyInfo,
        company_info_account: companyInfosOfUser[i].pubkey,
      };

      companyInfos.push(companyInfoWithPubKey);
    }

    return {
      status: true,
      data: companyInfos,
      isPremiumCompanyOwner,
    };
  } catch (err) {
    console.log(err);
    return {
      status: false,
      message: err,
    };
  }
};

export const findAllJobsOfCompanyByPublicKey = async (
  connection,
  company_info_account
) => {
  try {
    const filters = [
      {
        dataSize: JobPostInfoState_SIZE,
      },
    ];

    //if company_info_account is not null, then filter by company_info_account else return all jobs
    if (company_info_account) {
      filters.push({
        memcmp: {
          offset: 34,
          bytes: company_info_account.toString(),
        },
      });
    }

    let allJobsOfCompany = await connection.getProgramAccounts(
      JobsOnChain_JobPost_Info_ID,
      {
        filters,
      }
    );

    return {
      status: true,
      data: allJobsOfCompany,
    };
  } catch (err) {
    console.log(err);
    return {
      status: false,
      message: err,
    };
  }
};

export const findAllJobsOfCompany = async (
  connection,
  company_info_account
) => {
  try {
    const filters = [
      {
        dataSize: JobPostInfoState_SIZE,
      },
    ];
    console.log(company_info_account, "---company_info_account---");
    //if company_info_account is not null, then filter by company_info_account else return all jobs
    if (company_info_account) {
      filters.push({
        memcmp: {
          offset: 34,
          bytes: company_info_account.toString(),
        },
      });
    }

    let allJobsOfCompany = await connection.getProgramAccounts(
      JobsOnChain_JobPost_Info_ID,
      {
        filters,
      }
    );

    const jobs = [];

    for (let i = 0; i < allJobsOfCompany.length; i++) {
      const job = JobPostInfoState.deserialize(
        allJobsOfCompany[i].account.data
      );

      // const jobWithPubKey = {
      //   ...job,
      //   // job_post_info_account: allJobsOfCompany[i].pubkey,

      // };

      jobs.push({
        pubkey: allJobsOfCompany[i].pubkey,
        parsedInfo: job,
        jobTitle: job.job_title,
      });
    }

    return {
      status: true,
      data: jobs,
    };
  } catch (err) {
    console.log(err);
    return {
      status: false,
      message: err,
    };
  }
};

export const findAllWorkflowOfApplicant = async (
  connection,
  applicant_info_state_account
) => {
  try {
    const filters = [
      {
        dataSize: WorkflowInfoState_SIZE,
      },
    ];

    //if applicant_info_state_account is not null, then filter by applicant_info_state_account else return all workflow
    if (applicant_info_state_account) {
      filters.push({
        memcmp: {
          offset: 67,
          bytes: applicant_info_state_account.toString(),
        },
      });
    }

    let allWorkflowOfApplicant = await connection.getProgramAccounts(
      JobsOnChain_Workflow_Info_ID,
      {
        filters,
      }
    );

    return {
      status: true,
      data: allWorkflowOfApplicant,
    };
  } catch (err) {
    console.log(err);
    return {
      status: false,
      message: err,
    };
  }
};

export const findAllWorkflowOfJobPost = async (
  connection,
  jobpost_info_account,
  applicant_info_state_account = "",
  company_info_account = ""
) => {
  try {
    const filters = [
      {
        dataSize: WorkflowInfoState_SIZE,
      },
    ];

    //if jobpost_info_account is not null, then filter by jobpost_info_account else return all workflow
    if (jobpost_info_account) {
      filters.push({
        memcmp: {
          offset: 99,
          bytes: jobpost_info_account.toString(),
        },
      });
    }
    if (applicant_info_state_account) {
      filters.push({
        memcmp: {
          offset: 67,
          bytes: applicant_info_state_account.toString(),
        },
      });
    }

    if (company_info_account) {
      filters.push({
        memcmp: {
          offset: 35,
          bytes: company_info_account.toString(),
        },
      });
    }

    let allWorkflowOfJobs = await connection.getProgramAccounts(
      JobsOnChain_Workflow_Info_ID,
      {
        filters,
      }
    );

    const jobWorkflows = [];

    for (let i = 0; i < allWorkflowOfJobs.length; i++) {
      const jobWorkflow = WorkflowInfoState.deserialize(
        allWorkflowOfJobs[i].account.data
      );

      jobWorkflows.push({
        ...jobWorkflow,
        pubkey: allWorkflowOfJobs[i].pubkey,
      });
    }

    // return jobWorkflows;

    return {
      status: true,
      data: jobWorkflows,
    };
  } catch (err) {
    console.log(err);
    return {
      status: false,
      message: err,
    };
  }
};

export const getCompanyInfo = async (company_info_account, connection) => {
  let companyInfoAccountExists = await connection.getAccountInfo(
    company_info_account
  );
  if (companyInfoAccountExists === null) {
    return null;
  }
  const companyStateInfo = CompanyInfoState.deserialize(
    companyInfoAccountExists.data
  );
  if (companyStateInfo) {
    companyStateInfo.pubkey = company_info_account;
  }
  return companyStateInfo;
};

export const getJobPostInfo = async (jobpost_info_account, connection) => {
  let jobPostExists = await connection.getAccountInfo(jobpost_info_account);
  if (jobPostExists === null) {
    return null;
  }
  const jobPostInfo = JobPostInfoState.deserialize(jobPostExists.data);
  if (jobPostInfo) {
    jobPostInfo.pubkey = jobpost_info_account;
  }
  return jobPostInfo;
};

export const getWorkflowInfo = async (workflow_info_account, connection) => {
  let workflowExists = await connection.getAccountInfo(workflow_info_account);
  if (workflowExists === null) {
    return null;
  }
  const workflowInfo = WorkflowInfoState.deserialize(workflowExists.data);
  return workflowInfo;
};

export const getWorkflowInfoByUser = async (
  jobpost_info_account,
  owner,
  connection
) => {
  const applicant_info_state_account = await PublicKey.findProgramAddress(
    [Buffer.from(APPLICANT_STATE_ACCOUNT_PREFIX), owner.toBuffer()],
    JobsOnChain_User_Info_ID
  );
  console.log("applicant_info_state_account", applicant_info_state_account[0]);

  const workflow_info_account = await PublicKey.findProgramAddress(
    [
      Buffer.from(WORKFLOW_STATE_ACCOUNT_PREFIX),
      jobpost_info_account.toBuffer(),
      applicant_info_state_account[0].toBuffer(),
    ],
    JobsOnChain_Workflow_Info_ID
  );

  console.log("workflow_info_account", workflow_info_account[0].toBase58());

  // console.log("workflow_info_account", workflow_info_account);

  let workflowExists = await connection.getAccountInfo(
    workflow_info_account[0]
  );
  if (workflowExists === null) {
    return null;
  }
  const workflowInfo = WorkflowInfoState.deserialize(workflowExists.data);
  return workflowInfo;
};

/**
 * Web3Jobs
 */
const CONTACT_STATE_ACCOUNT_PREFIX = "socials";
const PROJECTS_STATE_ACCOUNT_PREFIX = "project";
const EDUCATION_STATE_ACCOUNT_PREFIX = "education";
const APPLICANT_STATE_ACCOUNT_PREFIX = "applicant";
const WORK_EXPERIENCE_STATE_ACCOUNT_PREFIX = "work_experience";
const COMPANY_STATE_ACCOUNT_PREFIX = "company";
const JOBPOST_STATE_ACCOUNT_PREFIX = "jobpost";
const WORKFLOW_STATE_ACCOUNT_PREFIX = "workflow";

export const check_if_user_exists = async (user_public_key, connection) => {
  const applicant_info_state_account = await PublicKey.findProgramAddress(
    [
      Buffer.from(APPLICANT_STATE_ACCOUNT_PREFIX),
      new PublicKey(user_public_key).toBuffer(),
    ],
    JobsOnChain_User_Info_ID
  );

  console.log(applicant_info_state_account[0], "applicant_info_state_account");

  const applicant_info_state_account_exists = await connection.getAccountInfo(
    applicant_info_state_account[0]
  );

  if (!applicant_info_state_account_exists) {
    console.log("applicant_info_state_account not found");
    return {
      status: false,
    };
  }

  const userData = await getUserCandidateInfo(
    applicant_info_state_account[0],
    connection
  );

  console.log(
    applicant_info_state_account_exists,
    "applicant_info_state_account"
  );

  return {
    status: true,
    data: { ...userData, pubkey: applicant_info_state_account[0] },
    applicantInfoStateAccount: applicant_info_state_account[0],
  };
};

export const add_applicant_info = async (
  owner,
  applicantInfo,
  connection,
  signTransaction
) => {
  // const applicantInfo = {
  //   username: "blocksan",
  //   name: "Sandeep Ghosh",
  //   address: "Metaverse",
  //   image_uri: "https://dummy.org",
  //   bio: "applicant bio",
  //   skills: ["Developer", "Speaker"],
  //   designation: "Developer",
  //   current_employment_status: "Startup",
  //   can_join_in: "never",
  //   user_type: "recruiter",
  //   is_company_profile_complete: false,
  //   is_overview_complete: true,
  //   is_projects_complete: false,
  //   is_contact_info_complete: true,
  //   is_education_complete: false,
  //   is_work_experience_complete: false,
  // };
  const applicant_info_state_account = await PublicKey.findProgramAddress(
    [
      Buffer.from(APPLICANT_STATE_ACCOUNT_PREFIX),
      new PublicKey(owner).toBuffer(),
    ],
    JobsOnChain_User_Info_ID
  );
  console.log(
    " applicant_info_state_account => ",
    applicant_info_state_account[0].toBase58()
  );

  const newApplicantInfo = new UserCandidateInfoState({
    ...applicantInfo,
  });

  const buffer =
    UserCandidateInfoState.serializeSaveApplicantInfoInstruction(
      newApplicantInfo
    );
  console.log("buffer => ", buffer);
  console.log("buffer.length => ", buffer.length);
  const applicant_info = new TransactionInstruction({
    programId: JobsOnChain_User_Info_ID,
    keys: [
      { pubkey: owner, isSigner: true, isWritable: false },
      {
        pubkey: applicant_info_state_account[0],
        isSigner: false,
        isWritable: true,
      },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
    ],
    data: Buffer.from(Uint8Array.of(0, ...buffer)),
  });
  await sendTxUsingExternalSignature(
    [applicant_info],
    connection,
    null,
    [],
    new PublicKey(owner),
    signTransaction
  );
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const userCandidateInfoResult = await getUserCandidateInfo(
    applicant_info_state_account[0],
    connection
  );
  console.log("userCandidateInfoResult => ", userCandidateInfoResult);

  return userCandidateInfoResult;
};

export const update_applicant_info = async (
  owner,
  applicantInfo,
  connection,
  signTransaction
) => {
  // const applicantInfo = {
  //   username: "updated blocksan",
  //   name: "Sandeep Ghosh",
  //   address: "Metaverse",
  //   image_uri: "https://dummy.org",
  //   bio: "applicant bio",
  //   skills: ["Developer", "Speaker"],
  //   designation: "Developer",
  //   current_employment_status: "Startup",
  //   can_join_in: "never",
  //   user_type: "recruiter",
  //   is_company_profile_complete: false,
  //   is_overview_complete: true,
  //   is_projects_complete: false,
  //   is_contact_info_complete: true,
  //   is_education_complete: false,
  //   is_work_experience_complete: false,
  // };

  const applicant_info_state_account = await PublicKey.findProgramAddress(
    [
      Buffer.from(APPLICANT_STATE_ACCOUNT_PREFIX),
      new PublicKey(owner).toBuffer(),
    ],
    JobsOnChain_User_Info_ID
  );
  console.log(
    " applicant_info_state_account => ",
    applicant_info_state_account[0].toBase58()
  );

  const newApplicantInfo = new UserCandidateInfoState({
    ...applicantInfo,
  });

  const buffer =
    UserCandidateInfoState.serializeUpdateApplicantInfoInstruction(
      newApplicantInfo
    );
  const applicant_info = new TransactionInstruction({
    programId: JobsOnChain_User_Info_ID,
    keys: [
      { pubkey: owner, isSigner: true, isWritable: false },
      {
        pubkey: applicant_info_state_account[0],
        isSigner: false,
        isWritable: true,
      },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
    ],
    data: Buffer.from(Uint8Array.of(1, ...buffer)),
  });
  await sendTxUsingExternalSignature(
    [applicant_info],
    connection,
    null,
    [],
    new PublicKey(owner),
    signTransaction
  );
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const userCandidateInfoResult = await getUserCandidateInfo(
    applicant_info_state_account[0],
    connection
  );
  console.log("userCandidateInfoResult => ", userCandidateInfoResult);

  return userCandidateInfoResult;
};

export const add_project_info = async (
  owner,
  projectInfo,
  connection,
  signTransaction
) => {
  try {
    console.log("owner => ", owner.toBase58());
    // const projectInfo = {
    //   archived: false,
    //   project_name: "project",
    //   project_description: "Sandeep Ghosh",
    //   project_image_uris: ["https://dummy.org"],
    //   project_link: "applicant bio",
    //   project_skills: ["Developer", "Speaker"],
    //   project_start_date: new Date().getTime().toString(),
    //   project_end_date: new Date().getTime().toString(),
    //   project_status: "Completed",
    // };

    const applicant_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(APPLICANT_STATE_ACCOUNT_PREFIX),
        new PublicKey(owner).toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    const applicant_info_state_account_exists = await connection.getAccountInfo(
      applicant_info_state_account[0]
    );

    if (!applicant_info_state_account_exists) {
      console.log("applicant_info_state_account not found");
      return;
    }
    console.log(
      " applicant_info_state_account => ",
      applicant_info_state_account[0].toBase58()
    );

    const projectsOfUser = await findAllProjectsOfUser(
      applicant_info_state_account[0],
      connection
    );

    if (projectsOfUser && projectsOfUser.length > 0) {
      projectInfo.project_number = "P" + (projectsOfUser.length + 1);
    } else {
      projectInfo.project_number = "P1";
    }

    const newProjectInfo = new ProjectInfoState({
      ...projectInfo,
    });

    const buffer =
      ProjectInfoState.serializeAddProjectInfoInstruction(newProjectInfo);

    const project_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(PROJECTS_STATE_ACCOUNT_PREFIX),
        Buffer.from(projectInfo.project_number),
        applicant_info_state_account[0].toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    const project_info_state_account_exists = await connection.getAccountInfo(
      project_info_state_account[0]
    );

    if (project_info_state_account_exists) {
      console.log("project_info_state_account already exists");
      return;
    }

    console.log(
      " project_info_state_account => ",
      project_info_state_account[0].toBase58()
    );

    const add_project_info = new TransactionInstruction({
      programId: JobsOnChain_User_Info_ID,
      keys: [
        { pubkey: owner, isSigner: true, isWritable: false },
        {
          pubkey: applicant_info_state_account[0],
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: project_info_state_account[0],
          isSigner: false,
          isWritable: true,
        },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
      ],
      data: Buffer.from(Uint8Array.of(2, ...buffer)),
    });
    await sendTxUsingExternalSignature(
      [add_project_info],
      connection,
      null,
      [],
      new PublicKey(owner),
      signTransaction
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return;
  } catch (err) {
    console.log("err => ", err);
    throw err;
  }
};

export const update_project_info = async (
  owner,
  projectInfo,
  connection,
  signTransaction
) => {
  try {
    console.log("owner => ", owner.toBase58());

    const applicant_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(APPLICANT_STATE_ACCOUNT_PREFIX),
        new PublicKey(owner).toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    const applicant_info_state_account_exists = await connection.getAccountInfo(
      applicant_info_state_account[0]
    );

    if (!applicant_info_state_account_exists) {
      console.log("applicant_info_state_account not found");
      return;
    }
    console.log(
      " applicant_info_state_account => ",
      applicant_info_state_account[0].toBase58()
    );

    const updatedProjectInfo = new ProjectInfoState({
      ...projectInfo,
    });

    const buffer =
      ProjectInfoState.serializeUpdateProjectInfoInstruction(
        updatedProjectInfo
      );

    const project_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(PROJECTS_STATE_ACCOUNT_PREFIX),
        Buffer.from(projectInfo.project_number),
        applicant_info_state_account[0].toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    const project_info_state_account_exists = await connection.getAccountInfo(
      project_info_state_account[0]
    );

    if (!project_info_state_account_exists) {
      console.log("project_info_state_account do not exists");
      return;
    }
    const projectInfoBeforeUpdate = await getProjectInfo(
      project_info_state_account[0],
      connection
    );
    console.log("projectInfoBeforeUpdate => ", projectInfoBeforeUpdate);

    const update_project_info = new TransactionInstruction({
      programId: JobsOnChain_User_Info_ID,
      keys: [
        { pubkey: owner, isSigner: true, isWritable: false },
        {
          pubkey: applicant_info_state_account[0],
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: project_info_state_account[0],
          isSigner: false,
          isWritable: true,
        },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
      ],
      data: Buffer.from(Uint8Array.of(3, ...buffer)),
    });
    await sendTxUsingExternalSignature(
      [update_project_info],
      connection,
      null,
      [],
      new PublicKey(owner),
      signTransaction
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return;
  } catch (err) {
    console.log("err => ", err);
    throw err;
  }
};

export const add_contact_info = async (
  owner,
  contactInfo,
  connection,
  signTransaction
) => {
  try {
    console.log("owner => ", owner.toBase58());
    // const contactInfo = {
    //   email: "email", //64
    //   phone: "phone", //16
    //   resume_uri: "resume_uri", //128
    //   github: "github link", //128
    //   linkedin: "linkedin link", //128
    //   twitter: "twitter link", //128
    //   dribble: "dribble link", //128
    //   behance: "behance link", //128
    //   twitch: "twitch link", //128
    //   solgames: "solgames link", //128
    //   facebook: "facebook link", //128
    //   instagram: "instagram link", //128
    //   website: "website link", //128
    // };

    const applicant_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(APPLICANT_STATE_ACCOUNT_PREFIX),
        new PublicKey(owner).toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    const applicant_info_state_account_exists = await connection.getAccountInfo(
      applicant_info_state_account[0]
    );

    if (!applicant_info_state_account_exists) {
      console.log("applicant_info_state_account not found");
      return;
    }
    console.log(
      " applicant_info_state_account => ",
      applicant_info_state_account[0].toBase58()
    );

    const newContactInfo = new ContactInfoState({
      ...contactInfo,
    });

    const buffer =
      ContactInfoState.serializeAddContactInfoInstruction(newContactInfo);

    const contact_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(CONTACT_STATE_ACCOUNT_PREFIX),
        applicant_info_state_account[0].toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    const contact_info_state_account_exists = await connection.getAccountInfo(
      contact_info_state_account[0]
    );

    console.log(
      " contact_info_state_account => ",
      contact_info_state_account[0].toBase58()
    );

    if (contact_info_state_account_exists) {
      console.log("contact_info_state_account already exists");
      return;
    }

    const add_contact_info = new TransactionInstruction({
      programId: JobsOnChain_User_Info_ID,
      keys: [
        { pubkey: owner, isSigner: true, isWritable: false },
        {
          pubkey: applicant_info_state_account[0],
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: contact_info_state_account[0],
          isSigner: false,
          isWritable: true,
        },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
      ],
      data: Buffer.from(Uint8Array.of(4, ...buffer)),
    });
    await sendTxUsingExternalSignature(
      [add_contact_info],
      connection,
      null,
      [],
      new PublicKey(owner),
      signTransaction
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const contactInfoResult = await getContactInfo(
      contact_info_state_account[0],
      connection
    );
    console.log("contactInfoResult => ", contactInfoResult);
    return contactInfoResult;
  } catch (err) {
    console.log("err => ", err);
    throw err;
  }
};

export const update_contact_info = async (
  owner,
  contactInfo,
  connection,
  signTransaction
) => {
  try {
    // const contactInfo = {
    //   email: "updated email again", //64
    //   phone: "updated phone", //16
    //   resume_uri: "updated resume_uri", //128
    //   github: "updated github link", //128
    //   linkedin: "linkedin link", //128
    //   twitter: "twitter link", //128
    //   dribble: "dribble link", //128
    //   behance: "behance link", //128
    //   twitch: "twitch link", //128
    //   solgames: "solgames link", //128
    //   facebook: "facebook link", //128
    //   instagram: "instagram link", //128
    //   website: "website link", //128
    // };

    const applicant_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(APPLICANT_STATE_ACCOUNT_PREFIX),
        new PublicKey(owner).toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    const applicant_info_state_account_exists = await connection.getAccountInfo(
      applicant_info_state_account[0]
    );

    if (!applicant_info_state_account_exists) {
      console.log("applicant_info_state_account not found");
      return;
    }
    console.log(
      " applicant_info_state_account => ",
      applicant_info_state_account[0].toBase58()
    );

    const updateContactInfo = new ContactInfoState({
      ...contactInfo,
    });

    const buffer =
      ContactInfoState.serializeUpdateContactInfoInstruction(updateContactInfo);

    const contact_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(CONTACT_STATE_ACCOUNT_PREFIX),
        applicant_info_state_account[0].toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    const contact_info_state_account_exists = await connection.getAccountInfo(
      contact_info_state_account[0]
    );

    if (!contact_info_state_account_exists) {
      console.log("contact_info_state_account do not exists");
      return;
    }

    const update_contact_info = new TransactionInstruction({
      programId: JobsOnChain_User_Info_ID,
      keys: [
        { pubkey: owner, isSigner: true, isWritable: false },
        {
          pubkey: applicant_info_state_account[0],
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: contact_info_state_account[0],
          isSigner: false,
          isWritable: true,
        },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
      ],
      data: Buffer.from(Uint8Array.of(5, ...buffer)),
    });
    await sendTxUsingExternalSignature(
      [update_contact_info],
      connection,
      null,
      [],
      new PublicKey(owner),
      signTransaction
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const contactInfoResult = await getContactInfo(
      contact_info_state_account[0],
      connection
    );
    return contactInfoResult;
  } catch (err) {
    console.log("err => ", err);
    throw err;
  }
};

export const add_education_info = async (
  owner,
  educationInfo,
  connection,
  signTransaction
) => {
  try {
    console.log("owner => ", owner.toBase58());
    // const educationInfo = {
    //   school_name: "school_name", //128
    //   degree: "degree", //64
    //   field_of_study: "field_of_study", //64
    //   start_date: "start_date", //64
    //   end_date: "end_data", //64
    //   grade: "grade", //64
    //   activities: ["activities"], //64*10 //640+10+10 ~700
    //   subjects: ["subjects 1", "subjects 2"], //64*10 //640+10+10 ~700
    //   description: "description", //1024
    //   is_college: true, //1 //if true then school_name is college name
    //   is_studying: false, //1
    //   certificate_uris: ["uri 1", "uri 2"], //128*5 //640+5+5 ~650
    // };

    const applicant_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(APPLICANT_STATE_ACCOUNT_PREFIX),
        new PublicKey(owner).toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    const applicant_info_state_account_exists = await connection.getAccountInfo(
      applicant_info_state_account[0]
    );

    if (!applicant_info_state_account_exists) {
      console.log("applicant_info_state_account not found");
      return;
    }
    console.log(
      " applicant_info_state_account => ",
      applicant_info_state_account[0].toBase58()
    );

    const educationsOfUser = await findAllEducationsOfUser(
      applicant_info_state_account[0],
      connection
    );

    if (educationsOfUser && educationsOfUser.length > 0) {
      educationInfo.education_number = "E" + (educationsOfUser.length + 1);
    } else {
      educationInfo.education_number = "E1";
    }

    const addEducationInfo = new EducationInfoState({
      ...educationInfo,
    });

    console.log("addEducationInfo js => ", addEducationInfo);

    const buffer =
      EducationInfoState.serializeAddEducationInfoInstruction(addEducationInfo);

    const education_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(EDUCATION_STATE_ACCOUNT_PREFIX),
        Buffer.from(educationInfo.education_number),
        applicant_info_state_account[0].toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    const education_info_state_account_exists = await connection.getAccountInfo(
      education_info_state_account[0]
    );

    if (education_info_state_account_exists) {
      console.log("education_info_state_account already exists");
      return;
    }

    const add_education_info_ins = new TransactionInstruction({
      programId: JobsOnChain_User_Info_ID,
      keys: [
        { pubkey: owner, isSigner: true, isWritable: false },
        {
          pubkey: applicant_info_state_account[0],
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: education_info_state_account[0],
          isSigner: false,
          isWritable: true,
        },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
      ],
      data: Buffer.from(Uint8Array.of(6, ...buffer)),
    });
    await sendTxUsingExternalSignature(
      [add_education_info_ins],
      connection,
      null,
      [],
      new PublicKey(owner),
      signTransaction
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const educationInfoResult = await getEducationInfo(
      education_info_state_account[0],
      connection
    );
    console.log("educationInfoResult => ", educationInfoResult);
    return educationInfoResult;
  } catch (err) {
    console.log("err => ", err);
    throw err;
  }
};

export const update_education_info = async (
  owner,
  educationInfo,
  connection,
  signTransaction
) => {
  try {
    console.log("owner => ", owner.toBase58());
    // const educationInfo = {
    //   school_name: "updated school_name", //128
    //   degree: "updated degree", //64
    //   field_of_study: "field_of_study", //64
    //   start_date: "start_date", //64
    //   end_date: "end_data", //64
    //   grade: "grade", //64
    //   activities: ["activities"], //64*10 //640+10+10 ~700
    //   subjects: ["subjects 1", "subjects 2"], //64*10 //640+10+10 ~700
    //   description: "description", //1024
    //   is_college: true, //1 //if true then school_name is college name
    //   is_studying: false, //1
    //   certificate_uris: ["uri 1", "uri 2"], //128*5 //640+5+5 ~650
    //   education_number: "E1",
    // };

    const applicant_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(APPLICANT_STATE_ACCOUNT_PREFIX),
        new PublicKey(owner).toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    const applicant_info_state_account_exists = await connection.getAccountInfo(
      applicant_info_state_account[0]
    );

    if (!applicant_info_state_account_exists) {
      console.log("applicant_info_state_account not found");
      return;
    }
    console.log(
      " applicant_info_state_account => ",
      applicant_info_state_account[0].toBase58()
    );

    const updateEducationInfo = new EducationInfoState({
      ...educationInfo,
    });

    const buffer =
      EducationInfoState.serializeUpdateEducationInfoInstruction(
        updateEducationInfo
      );

    const education_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(EDUCATION_STATE_ACCOUNT_PREFIX),
        Buffer.from(educationInfo.education_number),
        applicant_info_state_account[0].toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    const education_info_state_account_exists = await connection.getAccountInfo(
      education_info_state_account[0]
    );

    if (!education_info_state_account_exists) {
      console.log("education_info_state_account do not exists");
      return;
    }

    const update_education_info_ins = new TransactionInstruction({
      programId: JobsOnChain_User_Info_ID,
      keys: [
        { pubkey: owner, isSigner: true, isWritable: false },
        {
          pubkey: applicant_info_state_account[0],
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: education_info_state_account[0],
          isSigner: false,
          isWritable: true,
        },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
      ],
      data: Buffer.from(Uint8Array.of(7, ...buffer)),
    });
    await sendTxUsingExternalSignature(
      [update_education_info_ins],
      connection,
      null,
      [],
      new PublicKey(owner),
      signTransaction
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return true;
  } catch (err) {
    console.log("err => ", err);
    throw err;
  }
};

export const add_work_experience_info = async (
  owner,
  workExperienceIn,
  connection,
  signTransaction
) => {
  try {
    console.log("owner => ", owner.toBase58());

    console.log(workExperienceIn, "---workExperienceIn---");

    const workExperience = workExperienceIn;

    console.log(typeof workExperience, typeof workExperienceIn, "---types---");

    const applicant_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(APPLICANT_STATE_ACCOUNT_PREFIX),
        new PublicKey(owner).toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    const applicant_info_state_account_exists = await connection.getAccountInfo(
      applicant_info_state_account[0]
    );

    if (!applicant_info_state_account_exists) {
      console.log("applicant_info_state_account not found");
      return;
    }
    console.log(
      " applicant_info_state_account => ",
      applicant_info_state_account[0].toBase58()
    );

    const workExperiencesOfUser = await findAllWorkExperiencesOfUser(
      applicant_info_state_account[0],
      connection
    );

    if (workExperiencesOfUser && workExperiencesOfUser.length > 0) {
      workExperience.work_experience_number =
        "W" + (workExperiencesOfUser.length + 1);
    } else {
      workExperience.work_experience_number = "W1";
    }

    const addWorkExperience = new WorkExperienceInfoState({
      ...workExperience,
    });

    const buffer =
      WorkExperienceInfoState.serializeAddWorkExperienceInfoInstruction(
        addWorkExperience
      );

    const work_experience_info_state_account =
      await PublicKey.findProgramAddress(
        [
          Buffer.from(WORK_EXPERIENCE_STATE_ACCOUNT_PREFIX),
          Buffer.from(workExperience.work_experience_number),
          applicant_info_state_account[0].toBuffer(),
        ],
        JobsOnChain_User_Info_ID
      );

    console.log(
      " work_experience_info_state_account => ",
      work_experience_info_state_account[0].toBase58()
    );

    const work_experience_info_state_account_exists =
      await connection.getAccountInfo(work_experience_info_state_account[0]);

    if (work_experience_info_state_account_exists) {
      console.log("work_experience_info_state_account already exists");
      return;
    }

    const add_work_experience_info_ins = new TransactionInstruction({
      programId: JobsOnChain_User_Info_ID,
      keys: [
        { pubkey: owner, isSigner: true, isWritable: false },
        {
          pubkey: applicant_info_state_account[0],
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: work_experience_info_state_account[0],
          isSigner: false,
          isWritable: true,
        },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
      ],
      data: Buffer.from(Uint8Array.of(8, ...buffer)),
    });
    await sendTxUsingExternalSignature(
      [add_work_experience_info_ins],
      connection,
      null,
      [],
      new PublicKey(owner),
      signTransaction
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const workExperienceInfoResult = await getWorkExperienceInfo(
      work_experience_info_state_account[0],
      connection
    );
    console.log("workExperienceInfoResult => ", workExperienceInfoResult);
    return workExperienceInfoResult;
  } catch (err) {
    console.log("err => ", err);
    throw err;
  }
};

export const update_work_experience_info = async (
  owner,
  workExperience,
  connection,
  signTransaction
) => {
  try {
    const applicant_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(APPLICANT_STATE_ACCOUNT_PREFIX),
        new PublicKey(owner).toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    const applicant_info_state_account_exists = await connection.getAccountInfo(
      applicant_info_state_account[0]
    );

    if (!applicant_info_state_account_exists) {
      console.log("applicant_info_state_account not found");
      return;
    }
    console.log(
      " applicant_info_state_account => ",
      applicant_info_state_account[0].toBase58()
    );

    const work_experience_info_state_account =
      await PublicKey.findProgramAddress(
        [
          Buffer.from(WORK_EXPERIENCE_STATE_ACCOUNT_PREFIX),
          Buffer.from(workExperience.work_experience_number),
          applicant_info_state_account[0].toBuffer(),
        ],
        JobsOnChain_User_Info_ID
      );

    const work_experience_info_state_account_exists =
      await connection.getAccountInfo(work_experience_info_state_account[0]);
    if (!work_experience_info_state_account_exists) {
      console.log("work_experience_info_state_account do not exists");
      return;
    }

    const updateWorkExperience = new WorkExperienceInfoState({
      ...workExperience,
    });

    const buffer =
      WorkExperienceInfoState.serializeUpdateWorkExperienceInfoInstruction(
        updateWorkExperience
      );

    const update_work_experience_info_ins = new TransactionInstruction({
      programId: JobsOnChain_User_Info_ID,
      keys: [
        { pubkey: owner, isSigner: true, isWritable: false },
        {
          pubkey: applicant_info_state_account[0],
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: work_experience_info_state_account[0],
          isSigner: false,
          isWritable: true,
        },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
      ],
      data: Buffer.from(Uint8Array.of(9, ...buffer)),
    });
    await sendTxUsingExternalSignature(
      [update_work_experience_info_ins],
      connection,
      null,
      [],
      new PublicKey(owner),
      signTransaction
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return true;
  } catch (err) {
    console.log("err => ", err);
    throw err;
  }
};

export const add_company_info = async (
  owner,
  companyInfo,
  connection,
  signTransaction
) => {
  try {
    console.log(companyInfo, "companyInfo");

    // const companyInfo = {
    //   username: "user name", //32
    //   name: "name ", //64
    //   logo_uri: "logo uri", //128
    //   domain: "domain ", //64
    //   company_type: "company_type", //8 "product, service, both"
    //   company_size: "company_size", //8 "small, medium, large"
    //   company_stage: "company_stage", //32
    //   funding_amount: "10000", //8
    //   funding_currency: "SOLG", //8
    //   image_uri: "image_uri", //128
    //   cover_image_uri: "cover_image_uri", //128
    //   founded_in: "founded_in", //8
    //   employee_size: "1000", //8
    //   address: "address", //512
    //   description: "description", // 1024
    //   website: "website", //128
    //   linkedin: "linkedin", //128
    //   twitter: "twitter", //128
    //   facebook: "facebook", //128
    //   instagram: "instagram", //128
    // };

    const applicant_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(APPLICANT_STATE_ACCOUNT_PREFIX),
        new PublicKey(owner).toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    const applicant_info_state_account_exists = await connection.getAccountInfo(
      applicant_info_state_account[0]
    );

    if (!applicant_info_state_account_exists) {
      console.log("applicant_info_state_account not found");
      return;
    }
    console.log(
      " applicant_info_state_account => ",
      applicant_info_state_account[0].toBase58()
    );

    const companyInfosOfUser = await findAllCompanyInfosOfUser(
      connection,
      applicant_info_state_account[0]
    );
    console.log("companyInfosOfUser => ", companyInfosOfUser);
    if (companyInfosOfUser.status && companyInfosOfUser.data.length > 0) {
      companyInfo.company_seq_number =
        "CP" + (companyInfosOfUser.data.length + 1);
    } else {
      companyInfo.company_seq_number = "CP1";
    }

    console.log(
      companyInfo.company_seq_number,
      "companyInfo.company_seq_number"
    );

    const addcompanyInfo = new CompanyInfoState({
      ...companyInfo,
    });

    const buffer =
      CompanyInfoState.serializeSaveCompanyInfoInstruction(addcompanyInfo);

    const company_info_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(COMPANY_STATE_ACCOUNT_PREFIX),
        Buffer.from(companyInfo.company_seq_number),
        applicant_info_state_account[0].toBuffer(),
      ],
      JobsOnChain_Company_Info_ID
    );

    console.log(
      " company_info_account => ",
      company_info_account[0].toBase58()
    );

    const company_info_account_exists = await connection.getAccountInfo(
      company_info_account[0]
    );

    if (company_info_account_exists) {
      console.log("company_info_account already exists");
      return;
    }

    const add_company_info_ins = new TransactionInstruction({
      programId: JobsOnChain_Company_Info_ID,
      keys: [
        { pubkey: owner, isSigner: true, isWritable: false },
        { pubkey: company_info_account[0], isSigner: false, isWritable: true },
        {
          pubkey: applicant_info_state_account[0],
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: JobsOnChain_User_Info_ID,
          isSigner: false,
          isWritable: false,
        },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
      ],
      data: Buffer.from(Uint8Array.of(0, ...buffer)),
    });
    await sendTxUsingExternalSignature(
      [add_company_info_ins],
      connection,
      null,
      [],
      new PublicKey(owner),
      signTransaction
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const companyInfoResult = await getCompanyInfo(
      company_info_account[0],
      connection
    );
    console.log("companyInfoResult => ", companyInfoResult);
    return companyInfoResult;
  } catch (err) {
    console.log("err => ", err);
    throw err;
  }
};

export const update_company_info = async (
  owner,
  companyInfo,
  connection,
  signTransaction
) => {
  try {
    // const companyInfo = {
    //   archived: false,
    //   username: "update user name", //32
    //   name: "update name ", //64
    //   logo_uri: "logo uri", //128
    //   domain: "domain ", //64
    //   company_type: "company_type", //8 "product, service, both"
    //   company_size: "company_size", //8 "small, medium, large"
    //   company_stage: "company_stage", //32
    //   funding_amount: "10000", //8
    //   funding_currency: "SOLG", //8
    //   image_uri: "image_uri", //128
    //   cover_image_uri: "cover_image_uri", //128
    //   founded_in: "founded_in", //8
    //   employee_size: "1000", //8
    //   address: "address", //512
    //   description: "description", // 1024
    //   website: "website", //128
    //   linkedin: "linkedin", //128
    //   twitter: "twitter", //128
    //   facebook: "facebook", //128
    //   instagram: "instagram", //128
    //   company_seq_number: "CP1",
    // };

    const applicant_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(APPLICANT_STATE_ACCOUNT_PREFIX),
        new PublicKey(owner).toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    const applicant_info_state_account_exists = await connection.getAccountInfo(
      applicant_info_state_account[0]
    );

    if (!applicant_info_state_account_exists) {
      console.log("applicant_info_state_account not found");
      return;
    }
    console.log(
      " applicant_info_state_account => ",
      applicant_info_state_account[0].toBase58()
    );

    const updateCompanyInfo = new CompanyInfoState({
      ...companyInfo,
    });

    const buffer =
      CompanyInfoState.serializeUpdateCompanyInfoInstruction(updateCompanyInfo);
    const company_info_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(COMPANY_STATE_ACCOUNT_PREFIX),
        Buffer.from(companyInfo.company_seq_number),
        applicant_info_state_account[0].toBuffer(),
      ],
      JobsOnChain_Company_Info_ID
    );

    console.log(
      " company_info_account => ",
      company_info_account[0].toBase58()
    );

    const company_info_account_exists = await connection.getAccountInfo(
      company_info_account[0]
    );

    if (!company_info_account_exists) {
      console.log("company_info_account do not exists");
      return;
    }

    const update_company_info_ins = new TransactionInstruction({
      programId: JobsOnChain_Company_Info_ID,
      keys: [
        { pubkey: owner, isSigner: true, isWritable: false },
        { pubkey: company_info_account[0], isSigner: false, isWritable: true },
        {
          pubkey: applicant_info_state_account[0],
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: JobsOnChain_User_Info_ID,
          isSigner: false,
          isWritable: false,
        },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
      ],
      data: Buffer.from(Uint8Array.of(1, ...buffer)),
    });
    await sendTxUsingExternalSignature(
      [update_company_info_ins],
      connection,
      null,
      [],
      new PublicKey(owner),
      signTransaction
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const companyInfoResult = await getCompanyInfo(
      company_info_account[0],
      connection
    );
    console.log("companyInfoResult => ", companyInfoResult);
    return companyInfoResult;
  } catch (err) {
    console.log("err => ", err);
    throw err;
  }
};

export const update_company_subscription_info = async (owner, connection) => {
  try {
    const companyInfo = {
      subscription_plan: "paynuse", //8
      subscription_purchased_on: new BN(new Date().getTime()), //10
      subscription_valid_till: new BN(new Date().getTime()), //10
      company_seq_number: "CP1",
    };

    const applicant_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(APPLICANT_STATE_ACCOUNT_PREFIX),
        new PublicKey(owner).toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    const applicant_info_state_account_exists = await connection.getAccountInfo(
      applicant_info_state_account[0]
    );

    if (!applicant_info_state_account_exists) {
      console.log("applicant_info_state_account not found");
      return;
    }
    console.log(
      " applicant_info_state_account => ",
      applicant_info_state_account[0].toBase58()
    );

    const updateCompanyInfo = new CompanyInfoState({
      ...companyInfo,
    });

    const buffer =
      CompanyInfoState.serializeUpdateCompanyInfoInstruction(updateCompanyInfo);
    const company_info_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(COMPANY_STATE_ACCOUNT_PREFIX),
        Buffer.from(companyInfo.company_seq_number),
        applicant_info_state_account[0].toBuffer(),
      ],
      JobsOnChain_Company_Info_ID
    );

    console.log(
      " company_info_account => ",
      company_info_account[0].toBase58()
    );

    const company_info_account_exists = await connection.getAccountInfo(
      company_info_account[0]
    );

    if (!company_info_account_exists) {
      console.log("company_info_account do not exists");
      return;
    }

    const subscriptionModifier = await getPayer();
    const update_company_info_ins = new TransactionInstruction({
      programId: JobsOnChain_Company_Info_ID,
      keys: [
        { pubkey: subscriptionModifier, isSigner: true, isWritable: false },
        { pubkey: owner, isSigner: false, isWritable: false },
        { pubkey: company_info_account[0], isSigner: false, isWritable: true },
        {
          pubkey: applicant_info_state_account[0],
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: JobsOnChain_User_Info_ID,
          isSigner: false,
          isWritable: false,
        },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
      ],
      data: Buffer.from(Uint8Array.of(1, ...buffer)),
    });
    await sendTxUsingExternalSignature(
      [update_company_info_ins],
      connection,
      null,
      [],
      new PublicKey(owner)
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const companyInfoResult = await getCompanyInfo(
      company_info_account[0],
      connection
    );
    console.log("companyInfoResult => ", companyInfoResult);
    return companyInfoResult;
  } catch (err) {
    console.log("err => ", err);
    throw err;
  }
};

export const add_jobpost_info = async (
  provider,
  owner,
  jobPostInfo,
  selectedCompanyPubkey,
  connection,
  signTransaction
) => {
  try {
    const applicant_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(APPLICANT_STATE_ACCOUNT_PREFIX),
        new PublicKey(owner).toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    const applicant_info_state_account_exists = await connection.getAccountInfo(
      applicant_info_state_account[0]
    );

    if (!applicant_info_state_account_exists) {
      console.log("applicant_info_state_account not found");
      return;
    }
    console.log(
      " applicant_info_state_account => ",
      applicant_info_state_account[0].toBase58()
    );

    const company_info_account = [new PublicKey(selectedCompanyPubkey)];

    const company_info_account_exists = await connection.getAccountInfo(
      company_info_account[0]
    );
    if (!company_info_account_exists) {
      console.log("company_info_account do not exists");
      return;
    }
    console.log(
      " company_info_account => ",
      company_info_account[0].toBase58()
    );

    const allJobsOfCompany = await findAllJobsOfCompany(
      connection,
      company_info_account[0]
    );

    console.log("allJobsOfCompany => ", allJobsOfCompany);

    if (allJobsOfCompany.status && allJobsOfCompany.data.length > 0) {
      jobPostInfo.job_number = "JP" + (allJobsOfCompany.data.length + 1);
    } else {
      jobPostInfo.job_number = "JP1";
    }

    const jobpost_info_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(JOBPOST_STATE_ACCOUNT_PREFIX),
        Buffer.from(jobPostInfo.job_number),
        company_info_account[0].toBuffer(),
      ],
      JobsOnChain_JobPost_Info_ID
    );
    const jobpost_info_account_exists = await connection.getAccountInfo(
      jobpost_info_account[0]
    );
    if (jobpost_info_account_exists) {
      console.log("jobpost_info_account already exists");
      return;
    }
    console.log(
      " jobpost_info_account => ",
      jobpost_info_account[0].toBase58()
    );

    const newJobPostInfo = new JobPostInfoState({
      ...jobPostInfo,
    });

    const buffer =
      JobPostInfoState.serializeAddJobPostInfoInstruction(newJobPostInfo);

    console.log(buffer, "---jobpost buffer---", buffer.length);

    const companyParsedInfo = await getCompanyInfo(
      company_info_account[0],
      connection
    );

    if (!companyParsedInfo) {
      console.log("company info not found");
      return;
    }

    //if the company is not on forever plan then ask the user to pay for the job posting
    if (
      companyParsedInfo &&
      companyParsedInfo.subscription_plan != SUBSCRIPTION_PLANS_enum.FOREVER
    ) {
      const selectedPlan =
        SUBSCRIPTION_PLANS_PRICES[companyParsedInfo.subscription_plan];
      console.log(selectedPlan, "selectedPlan");
      if (!selectedPlan) {
        console.log("Not a valid subscription plan found");
        return;
      }
      const transactionStatus = await payFromCompanyToPlatform(
        provider,
        owner,
        connection,
        selectedPlan.job_posting_price
      );

      if (!transactionStatus || !transactionStatus.status) {
        console.log(transactionStatus.message || "Transaction failed");
        return;
      }

      console.log(transactionStatus.message || "Transaction success");
    }

    console.log("companyParsedInfo => ", companyParsedInfo);
    const add_jobpost_info_ins = new TransactionInstruction({
      programId: JobsOnChain_JobPost_Info_ID,
      keys: [
        { pubkey: owner, isSigner: true, isWritable: false },
        { pubkey: company_info_account[0], isSigner: false, isWritable: false },
        {
          pubkey: applicant_info_state_account[0],
          isSigner: false,
          isWritable: false,
        },
        { pubkey: jobpost_info_account[0], isSigner: false, isWritable: true },
        {
          pubkey: JobsOnChain_User_Info_ID,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: JobsOnChain_Company_Info_ID,
          isSigner: false,
          isWritable: false,
        },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
      ],
      data: Buffer.from(Uint8Array.of(0, ...buffer)),
    });
    await sendTxUsingExternalSignature(
      [add_jobpost_info_ins],
      connection,
      null,
      [],
      new PublicKey(owner),
      signTransaction
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const jobPostInfoResult = await getJobPostInfo(
      jobpost_info_account[0],
      connection
    );
    console.log("jobPostInfoResult => ", jobPostInfoResult);
    return jobPostInfoResult;
  } catch (err) {
    console.log("err => ", err);
    throw err;
  }
};

export const update_jobpost_info = async (
  owner,
  jobPostInfo,
  selectedCompanyPubkey,
  connection,
  signTransaction
) => {
  try {
    // const jobPostInfo = {
    //   archived: false,
    //   job_title: "updated job_title", //128
    //   short_description: "updated short_description", //256
    //   long_description: "long_description", //1024
    //   category: ["category 1", "category 2"], //32*4+10+10 //category is an array of job category like Frontend Developer
    //   job_type: "job_type", //16 full-time, part-time, contract, internship",
    //   currency_type: "currency_type", //8 fiat, crypto
    //   currency: "currency", //8 USD, ETH, BTC, etc
    //   min_salary: new BN(10000), //8 u64
    //   max_salary: new BN(50000), //8 u64
    //   experience_in_months: new BN(100), //8 u64
    //   skills: ["Coding", "painting"], //64*10+10+10 // ReactJs, NodeJs, etc
    //   qualification: "qualification", //512
    //   job_location_type: "job_location_type", //32
    //   country: "country", //64
    //   city: "city", //64
    //   job_number: "JP1",
    // };

    // const company_seq_number = "CP1";

    const applicant_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(APPLICANT_STATE_ACCOUNT_PREFIX),
        new PublicKey(owner).toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    const applicant_info_state_account_exists = await connection.getAccountInfo(
      applicant_info_state_account[0]
    );

    if (!applicant_info_state_account_exists) {
      console.log("applicant_info_state_account not found");
      return;
    }
    console.log(
      " applicant_info_state_account => ",
      applicant_info_state_account[0].toBase58()
    );

    // const company_info_account = await PublicKey.findProgramAddress(
    //   [
    //     Buffer.from(COMPANY_STATE_ACCOUNT_PREFIX),
    //     Buffer.from(company_seq_number),
    //     applicant_info_state_account[0].toBuffer(),
    //   ],
    //   JobsOnChain_Company_Info_ID
    // );

    const company_info_account = [selectedCompanyPubkey];

    const company_info_account_exists = await connection.getAccountInfo(
      company_info_account[0]
    );
    if (!company_info_account_exists) {
      console.log("company_info_account do not exists");
      return;
    }
    console.log(
      " company_info_account => ",
      company_info_account[0].toBase58()
    );

    // const allJobsOfCompany = await findAllJobsOfCompany(company_info_account[0], connection);
    // if(allJobsOfCompany && allJobsOfCompany.length > 0){
    //   jobPostInfo.job_number = 'JP'+(allJobsOfCompany.length+1);
    // }else{
    //   jobPostInfo.job_number = 'JP1';
    // }

    const jobpost_info_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(JOBPOST_STATE_ACCOUNT_PREFIX),
        Buffer.from(jobPostInfo.job_number),
        company_info_account[0].toBuffer(),
      ],
      JobsOnChain_JobPost_Info_ID
    );
    const jobpost_info_account_exists = await connection.getAccountInfo(
      jobpost_info_account[0]
    );
    if (!jobpost_info_account_exists) {
      console.log("jobpost_info_account do not exists");
      return;
    }
    console.log(
      " jobpost_info_account => ",
      jobpost_info_account[0].toBase58()
    );

    const newJobPostInfo = new JobPostInfoState({
      ...jobPostInfo,
    });

    const buffer =
      JobPostInfoState.serializeUpdateJobPostInfoInstruction(newJobPostInfo);

    const update_jobpost_info_ins = new TransactionInstruction({
      programId: JobsOnChain_JobPost_Info_ID,
      keys: [
        { pubkey: owner, isSigner: true, isWritable: false },
        { pubkey: company_info_account[0], isSigner: false, isWritable: false },
        {
          pubkey: applicant_info_state_account[0],
          isSigner: false,
          isWritable: false,
        },
        { pubkey: jobpost_info_account[0], isSigner: false, isWritable: true },
        {
          pubkey: JobsOnChain_User_Info_ID,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: JobsOnChain_Company_Info_ID,
          isSigner: false,
          isWritable: false,
        },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
      ],
      data: Buffer.from(Uint8Array.of(1, ...buffer)),
    });
    await sendTxUsingExternalSignature(
      [update_jobpost_info_ins],
      connection,
      null,
      [],
      new PublicKey(owner),
      signTransaction
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const jobPostInfoResult = await getJobPostInfo(
      jobpost_info_account[0],
      connection
    );
    console.log("jobPostInfoResult => ", jobPostInfoResult);
    return jobPostInfoResult;
  } catch (err) {
    console.log("err => ", err);
    throw err;
  }
};

export const update_jobpost_long_description = async (
  owner,
  jobPostInfo,
  selectedCompanyPubkey,
  connection,
  signTransaction
) => {
  try {
    // const jobPostInfo = {
    //   long_description: "long_description", //1024
    //   job_number: "JP1",
    // };

    // const company_seq_number = "CP1";

    const applicant_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(APPLICANT_STATE_ACCOUNT_PREFIX),
        new PublicKey(owner).toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    const applicant_info_state_account_exists = await connection.getAccountInfo(
      applicant_info_state_account[0]
    );

    if (!applicant_info_state_account_exists) {
      console.log("applicant_info_state_account not found");
      return;
    }
    console.log(
      " applicant_info_state_account => ",
      applicant_info_state_account[0].toBase58()
    );

    const company_info_account = [selectedCompanyPubkey];
    const company_info_account_exists = await connection.getAccountInfo(
      company_info_account[0]
    );
    if (!company_info_account_exists) {
      console.log("company_info_account do not exists");
      return;
    }
    console.log(
      " company_info_account => ",
      company_info_account[0].toBase58()
    );

    // const allJobsOfCompany = await findAllJobsOfCompany(company_info_account[0], connection);
    // if(allJobsOfCompany && allJobsOfCompany.length > 0){
    //   jobPostInfo.job_number = 'JP'+(allJobsOfCompany.length+1);
    // }else{
    //   jobPostInfo.job_number = 'JP1';
    // }

    const jobpost_info_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(JOBPOST_STATE_ACCOUNT_PREFIX),
        Buffer.from(jobPostInfo.job_number),
        company_info_account[0].toBuffer(),
      ],
      JobsOnChain_JobPost_Info_ID
    );
    const jobpost_info_account_exists = await connection.getAccountInfo(
      jobpost_info_account[0]
    );
    if (!jobpost_info_account_exists) {
      console.log("jobpost_info_account do not exists");
      return;
    }

    const updateJobPostDescription = new JobPostInfoState({
      ...jobPostInfo,
    });

    const buffer =
      JobPostInfoState.serializeUpdateJobPostLongDescriptionInstruction(
        updateJobPostDescription
      );

    const update_jobpost_info_ins = new TransactionInstruction({
      programId: JobsOnChain_JobPost_Info_ID,
      keys: [
        { pubkey: owner, isSigner: true, isWritable: false },
        { pubkey: company_info_account[0], isSigner: false, isWritable: false },
        {
          pubkey: applicant_info_state_account[0],
          isSigner: false,
          isWritable: false,
        },
        { pubkey: jobpost_info_account[0], isSigner: false, isWritable: true },
        {
          pubkey: JobsOnChain_User_Info_ID,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: JobsOnChain_Company_Info_ID,
          isSigner: false,
          isWritable: false,
        },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
      ],
      data: Buffer.from(Uint8Array.of(2, ...buffer)),
    });
    await sendTxUsingExternalSignature(
      [update_jobpost_info_ins],
      connection,
      null,
      [],
      new PublicKey(owner),
      signTransaction
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      jobpost_info_account: jobpost_info_account[0].toBase58(),
      status: true,
    };
  } catch (err) {
    console.log("err => ", err);
    throw err;
  }
};

export const add_job_workflow_info = async (
  owner,
  connection,
  signTransaction,
  applyJobWorkflowInfo,
  jobInfoAccount,
  companyInfoAccount
) => {
  try {
    // const applyJobWorkflowInfo = {
    //   status: "applied", //16 => 'saved' or 'applied' or 'in_progress' or 'accepted' or 'rejected' or 'withdraw'
    //   job_applied_at: new BN(new Date().getTime()), //8 => timestamp in unix format
    //   last_updated_at: new BN(new Date().getTime()), //8 => timestamp in unix format
    // };

    // const company_seq_number = "CP2";
    // const job_number = "JP2";

    const applicant_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(APPLICANT_STATE_ACCOUNT_PREFIX),
        new PublicKey(owner).toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    const applicant_info_state_account_exists = await connection.getAccountInfo(
      applicant_info_state_account[0]
    );

    if (!applicant_info_state_account_exists) {
      console.log("applicant_info_state_account not found");
      return;
    }
    console.log(
      " applicant_info_state_account => ",
      applicant_info_state_account[0].toBase58()
    );

    const company_info_account = companyInfoAccount;

    const company_info_account_exists = await connection.getAccountInfo(
      company_info_account
    );
    if (!company_info_account_exists) {
      console.log("company_info_account do not exists");
      return;
    }
    console.log(" company_info_account => ", company_info_account);

    const jobpost_info_account = jobInfoAccount;
    const jobpost_info_account_exists = await connection.getAccountInfo(
      jobpost_info_account
    );
    if (!jobpost_info_account_exists) {
      console.log("jobpost_info_account do not exists");
      return;
    }
    console.log(" jobpost_info_account => ", jobpost_info_account.toBase58());

    const workflow_info_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(WORKFLOW_STATE_ACCOUNT_PREFIX),
        jobpost_info_account.toBuffer(),
        applicant_info_state_account[0].toBuffer(),
      ],
      JobsOnChain_Workflow_Info_ID
    );
    console.log(
      " workflow_info_account => ",
      workflow_info_account[0].toBase58()
    );
    const workflow_info_account_exists = await connection.getAccountInfo(
      workflow_info_account[0]
    );
    if (workflow_info_account_exists) {
      console.log("workflow_info_account already exists, apply job again");
      // return;
    }

    // const workflowInfoResult = await getWorkflowInfo(
    //   workflow_info_account[0],
    //   connection
    // );
    // console.log("workflowInfoResult => ", workflowInfoResult);
    // return workflowInfoResult;

    const newJobApplyWorkflowInfo = new WorkflowInfoState({
      ...applyJobWorkflowInfo,
    });

    const buffer = WorkflowInfoState.serializeApplyJobWorkflowInfoInstruction(
      newJobApplyWorkflowInfo
    );

    console.log("owner => ", owner);
    console.log("connection => ", connection);
    console.log("signTransaction => ", signTransaction);
    console.log("applyJobWorkflowInfo => ", applyJobWorkflowInfo);
    console.log("jobInfoAccount => ", jobInfoAccount.toBase58());
    console.log("companyInfoAccount => ", companyInfoAccount.toBase58());
    console.log(
      "applicant_info_state_account => ",
      applicant_info_state_account[0].toBase58()
    );
    console.log(
      "workflow_info_account => ",
      workflow_info_account[0].toBase58()
    );

    const apply_job_workflow_info_account_inst = new TransactionInstruction({
      programId: JobsOnChain_Workflow_Info_ID,
      keys: [
        { pubkey: owner, isSigner: true, isWritable: false },
        { pubkey: company_info_account, isSigner: false, isWritable: false },
        {
          pubkey: applicant_info_state_account[0],
          isSigner: false,
          isWritable: false,
        },
        { pubkey: jobpost_info_account, isSigner: false, isWritable: false },
        { pubkey: workflow_info_account[0], isSigner: false, isWritable: true },

        {
          pubkey: JobsOnChain_User_Info_ID,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: JobsOnChain_Company_Info_ID,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: JobsOnChain_JobPost_Info_ID,
          isSigner: false,
          isWritable: false,
        },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
      ],
      data: Buffer.from(Uint8Array.of(0, ...buffer)),
    });
    await sendTxUsingExternalSignature(
      [apply_job_workflow_info_account_inst],
      connection,
      null,
      [],
      new PublicKey(owner),
      signTransaction
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
  } catch (err) {
    console.log("err => ", err);
    throw err;
  }
};

export const update_job_workflow_info = async (
  owner,
  connection,
  signTransaction,
  updateWorkflowInfo,
  jobInfoAccount,
  companyInfoAccount
) => {
  try {
    console.log("updateWorkflowInfo => ", updateWorkflowInfo);

    // console.log();
    // const updateWorkflowInfo = {
    //   archived: false, //1 => true or false
    //   status: "in_progress", //16 => 'saved' or 'applied' or 'in_progress' or 'accepted' or 'rejected' or 'withdraw'
    //   last_updated_at: new BN(new Date().getTime()), //8 => timestamp in unix format
    // };

    // const company_seq_number = "CP2";
    // const job_number = "JP2";

    const applicant_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(APPLICANT_STATE_ACCOUNT_PREFIX),
        new PublicKey(owner).toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    const applicant_info_state_account_exists = await connection.getAccountInfo(
      applicant_info_state_account[0]
    );

    if (!applicant_info_state_account_exists) {
      console.log("applicant_info_state_account not found");
      return;
    }
    // console.log(
    //   " applicant_info_state_account => ",
    //   applicant_info_state_account[0].toBase58()
    // );

    const company_info_account = companyInfoAccount;
    const company_info_account_exists = await connection.getAccountInfo(
      company_info_account
    );
    if (!company_info_account_exists) {
      console.log("company_info_account do not exists");
      return;
    }
    // console.log(
    //   " company_info_account => ",
    //   company_info_account[0].toBase58()
    // );

    const jobpost_info_account = jobInfoAccount;
    console.log("jobpost_info_account => ", jobpost_info_account);
    const jobpost_info_account_exists = await connection.getAccountInfo(
      jobpost_info_account
    );
    if (!jobpost_info_account_exists) {
      console.log("jobpost_info_account do not exists");
      return;
    }
    // console.log(
    //   " jobpost_info_account => ",
    //   jobpost_info_account[0].toBase58()
    // );

    // const jobPostInfo = await getJobPostInfo(
    //   job_info_state_account,
    //   connection
    // );

    const workflow_info_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(WORKFLOW_STATE_ACCOUNT_PREFIX),
        jobpost_info_account.toBuffer(),
        applicant_info_state_account[0].toBuffer(),
      ],
      JobsOnChain_Workflow_Info_ID
    );

    console.log(
      "workflow_info_account => ",
      workflow_info_account[0].toBase58()
    );

    const workflow_info_account_exists = await connection.getAccountInfo(
      workflow_info_account[0]
    );
    if (!workflow_info_account_exists) {
      console.log("workflow_info_account do not exists");
      return;
    }
    // console.log(
    //   " workflow_info_account => ",
    //   workflow_info_account[0].toBase58()
    // );

    const updateJobApplyWorkflowInfo = new WorkflowInfoState({
      ...updateWorkflowInfo,
    });

    console.log("updateJobApplyWorkflowInfo => ", updateJobApplyWorkflowInfo);

    const buffer = WorkflowInfoState.serializeUpdateWorkflowInfoInstruction(
      updateJobApplyWorkflowInfo
    );

    console.log(
      owner,
      company_info_account,
      applicant_info_state_account[0],
      jobpost_info_account[0],
      workflow_info_account[0],
      JobsOnChain_User_Info_ID,
      JobsOnChain_Company_Info_ID,
      JobsOnChain_JobPost_Info_ID,
      SystemProgram.programId,
      "owner"
    );

    const update_job_workflow_info_account_inst = new TransactionInstruction({
      programId: JobsOnChain_Workflow_Info_ID,
      keys: [
        { pubkey: owner, isSigner: true, isWritable: false },
        { pubkey: company_info_account, isSigner: false, isWritable: false },
        {
          pubkey: applicant_info_state_account[0],
          isSigner: false,
          isWritable: false,
        },
        { pubkey: jobpost_info_account[0], isSigner: false, isWritable: false },
        { pubkey: workflow_info_account[0], isSigner: false, isWritable: true },

        {
          pubkey: JobsOnChain_User_Info_ID,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: JobsOnChain_Company_Info_ID,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: JobsOnChain_JobPost_Info_ID,
          isSigner: false,
          isWritable: false,
        },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
      ],
      data: Buffer.from(Uint8Array.of(1, ...buffer)),
    });
    await sendTxUsingExternalSignature(
      [update_job_workflow_info_account_inst],
      connection,
      null,
      [],
      new PublicKey(owner),
      signTransaction
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const workflowInfoResult = await getWorkflowInfo(
      workflow_info_account[0],
      connection
    );
    console.log("workflowInfoResult => ", workflowInfoResult);
    return workflowInfoResult;
  } catch (err) {
    console.log("err => ", err);
    throw err;
  }
};

export const update_job_workflow_payment_info = async (owner, connection) => {
  try {
    const updateWorkflowInfo = {
      is_paid: true,
      paid_amount: new BN(100),
      paid_at: new BN(new Date().getTime()), //8 => timestamp in unix format
      last_updated_at: new BN(new Date().getTime()), //8 => timestamp in unix format
    };

    const company_seq_number = "CP1";
    const job_number = "JP1";

    const applicant_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(APPLICANT_STATE_ACCOUNT_PREFIX),
        new PublicKey(owner).toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    const applicant_info_state_account_exists = await connection.getAccountInfo(
      applicant_info_state_account[0]
    );

    if (!applicant_info_state_account_exists) {
      console.log("applicant_info_state_account not found");
      return;
    }
    console.log(
      " applicant_info_state_account => ",
      applicant_info_state_account[0].toBase58()
    );

    const company_info_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(COMPANY_STATE_ACCOUNT_PREFIX),
        Buffer.from(company_seq_number),
        applicant_info_state_account[0].toBuffer(),
      ],
      JobsOnChain_Company_Info_ID
    );
    const company_info_account_exists = await connection.getAccountInfo(
      company_info_account[0]
    );
    if (!company_info_account_exists) {
      console.log("company_info_account do not exists");
      return;
    }
    console.log(
      " company_info_account => ",
      company_info_account[0].toBase58()
    );

    const jobpost_info_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(JOBPOST_STATE_ACCOUNT_PREFIX),
        Buffer.from(job_number),
        company_info_account[0].toBuffer(),
      ],
      JobsOnChain_JobPost_Info_ID
    );
    const jobpost_info_account_exists = await connection.getAccountInfo(
      jobpost_info_account[0]
    );
    if (!jobpost_info_account_exists) {
      console.log("jobpost_info_account do not exists");
      return;
    }
    console.log(
      " jobpost_info_account => ",
      jobpost_info_account[0].toBase58()
    );

    const workflow_info_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(WORKFLOW_STATE_ACCOUNT_PREFIX),
        jobpost_info_account[0].toBuffer(),
      ],
      JobsOnChain_Workflow_Info_ID
    );

    const workflow_info_account_exists = await connection.getAccountInfo(
      workflow_info_account[0]
    );
    if (!workflow_info_account_exists) {
      console.log("workflow_info_account do not exists");
      return;
    }
    console.log(
      " workflow_info_account => ",
      workflow_info_account[0].toBase58()
    );
    const workflowInfoResultBefore = await getWorkflowInfo(
      workflow_info_account[0],
      connection
    );
    console.log("workflowInfoResultBefore => ", workflowInfoResultBefore);

    const updateJobApplyWorkflowInfo = new WorkflowInfoState({
      ...updateWorkflowInfo,
    });

    const subscriptionModifier = await getPayer();

    const buffer =
      WorkflowInfoState.serializeUpdateWorkflowPaymentInfoInstruction(
        updateJobApplyWorkflowInfo
      );

    const update_job_workflow_payment_info_account_inst =
      new TransactionInstruction({
        programId: JobsOnChain_Workflow_Info_ID,
        keys: [
          {
            pubkey: subscriptionModifier.publicKey,
            isSigner: true,
            isWritable: true,
          },
          { pubkey: owner, isSigner: false, isWritable: false },
          {
            pubkey: company_info_account[0],
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: applicant_info_state_account[0],
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: jobpost_info_account[0],
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: workflow_info_account[0],
            isSigner: false,
            isWritable: true,
          },

          {
            pubkey: JobsOnChain_User_Info_ID,
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: JobsOnChain_Company_Info_ID,
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: JobsOnChain_JobPost_Info_ID,
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: true,
          },
        ],
        data: Buffer.from(Uint8Array.of(2, ...buffer)),
      });
    console.log(connection, "--connection--");
    await sendAndConfirmTransaction(
      connection,
      new Transaction().add(update_job_workflow_payment_info_account_inst),
      [subscriptionModifier]
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const workflowInfoResult = await getWorkflowInfo(
      workflow_info_account[0],
      connection
    );
    console.log("workflowInfoResult => ", workflowInfoResult);
    return workflowInfoResult;
  } catch (err) {
    console.log("err => ", err);
    throw err;
  }
};

export const purchase_subscription_plan = async (
  provider,
  owner,
  connection,
  plan_type
) => {
  try {
    const company_seq_number = "CP1";

    const applicant_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(APPLICANT_STATE_ACCOUNT_PREFIX),
        new PublicKey(owner).toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    const applicant_info_state_account_exists = await connection.getAccountInfo(
      applicant_info_state_account[0]
    );

    if (!applicant_info_state_account_exists) {
      console.log("applicant_info_state_account not found");
      return;
    }
    console.log(
      " applicant_info_state_account => ",
      applicant_info_state_account[0].toBase58()
    );

    const company_info_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(COMPANY_STATE_ACCOUNT_PREFIX),
        Buffer.from(company_seq_number),
        applicant_info_state_account[0].toBuffer(),
      ],
      JobsOnChain_Company_Info_ID
    );
    const company_info_account_exists = await connection.getAccountInfo(
      company_info_account[0]
    );
    if (!company_info_account_exists) {
      console.log("company_info_account do not exists");
      return;
    }
    console.log(
      " company_info_account => ",
      company_info_account[0].toBase58()
    );

    const plan_type_details = SUBSCRIPTION_PLANS_PRICES[plan_type];

    if (!plan_type_details) {
      console.log("plan_type_details not found");
      return;
    }

    console.log(" plan_type_details => ", plan_type_details);

    if (plan_type_details.price) {
      const USDC_MINT_ID = new PublicKey(SOLANA_USDC_MINT_KEY_DEVNET);
      const usdcAccountExists = await findAssociatedTokenAccountPublicKey(
        owner,
        USDC_MINT_ID
      );
      if (!usdcAccountExists) {
        console.log(
          "USDC account not found in your wallet, Please load your wallet with USDC"
        );
        return;
      }
      console.log(usdcAccountExists.toBase58(), "---usdcAccountExists---");
      const payer = await getPayer();
      const payerUSDCAccount = await findAssociatedTokenAccountPublicKey(
        payer.publicKey,
        USDC_MINT_ID
      );
      console.log(payerUSDCAccount.toBase58(), "---payerUSDCAccount---");

      const transferResult = await transferCustomToken(
        provider,
        connection,
        plan_type_details.price,
        usdcAccountExists,
        payerUSDCAccount
      );
      if (!transferResult) {
        console.log("Transfer failed, Please try again");
        throw err;
      }

      console.log("transferResult => ", transferResult);
    }
    const updateSubscriptionPlanInfo = {
      subscription_plan: plan_type,
      subscription_purchased_on: new BN(
        plan_type_details.subscription_purchased_on
      ),
      subscription_valid_till: new BN(
        plan_type_details.subscription_valid_till
      ), //8 => timestamp in unix format
      company_seq_number: company_seq_number, //8 => timestamp in unix format
    };

    const updateCompanyInfoSubscriptionState = new CompanyInfoState({
      ...updateSubscriptionPlanInfo,
    });

    const subscriptionModifier = await getPayer();

    const buffer =
      CompanyInfoState.serializeUpdateCompanySubscriptionInfoInstruction(
        updateCompanyInfoSubscriptionState
      );

    const update_company_subscription_info_plan = new TransactionInstruction({
      programId: JobsOnChain_Company_Info_ID,
      keys: [
        {
          pubkey: subscriptionModifier.publicKey,
          isSigner: true,
          isWritable: true,
        },
        { pubkey: owner, isSigner: false, isWritable: false },
        { pubkey: company_info_account[0], isSigner: false, isWritable: true },
        {
          pubkey: applicant_info_state_account[0],
          isSigner: false,
          isWritable: false,
        },

        {
          pubkey: JobsOnChain_User_Info_ID,
          isSigner: false,
          isWritable: false,
        },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
      ],
      data: Buffer.from(Uint8Array.of(2, ...buffer)),
    });
    await sendAndConfirmTransaction(
      connection,
      new Transaction().add(update_company_subscription_info_plan),
      [subscriptionModifier]
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const companyInfoResult = await getCompanyInfo(
      company_info_account[0],
      connection
    );
    console.log("companyInfoResult => ", companyInfoResult);
    return true;
  } catch (err) {
    console.log("err => ", err);
    throw err;
  }
};

export const pay_and_reveal_user_details = async (
  provider,
  owner,
  connection,
  user_info_state_account,
  company_info_state_account,
  job_info_account
) => {
  let RECONCILING_AMOUNT = 0;
  try {
    //Check if applicant_info_state_account exists
    const applicant_info_state_account = [
      new PublicKey(user_info_state_account),
    ];

    const applicant_info_state_account_exists = await connection.getAccountInfo(
      applicant_info_state_account[0]
    );

    if (!applicant_info_state_account_exists) {
      const erroMessage = "applicant_info_state_account not found";
      console.log(erroMessage);
      return {
        status: false,
        message: erroMessage,
      };
    }
    // console.log(
    //   " applicant_info_state_account => ",
    //   applicant_info_state_account[0].toBase58()
    // );

    //Check if company_info_account exists
    const company_info_account = [new PublicKey(company_info_state_account)];
    const company_info_account_exists = await connection.getAccountInfo(
      company_info_account[0]
    );
    if (!company_info_account_exists) {
      const erroMessage = "company_info_account not found";
      console.log(erroMessage);
      return {
        status: false,
        message: erroMessage,
      };
    }
    // console.log(
    //   " company_info_account => ",
    //   company_info_account[0].toBase58()
    // );

    const company_info = await getCompanyInfo(
      company_info_account[0],
      connection
    );
    if (!company_info) {
      console.log("company_info not found");
      return {
        status: false,
        message: "company_info not found",
      };
    }

    //Check if jobpost_info_account exists
    const jobpost_info_account = [new PublicKey(job_info_account)];
    const jobpost_info_account_exists = await connection.getAccountInfo(
      jobpost_info_account[0]
    );
    if (!jobpost_info_account_exists) {
      console.log("jobpost_info_account do not exists");
      return {
        status: false,
        message: "jobpost_info_account do not exists",
      };
    }
    // console.log(
    //   " jobpost_info_account => ",
    //   jobpost_info_account[0].toBase58()
    // );

    //Check if workflow_info_account exists
    const workflow_info_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(WORKFLOW_STATE_ACCOUNT_PREFIX),
        jobpost_info_account[0].toBuffer(),
        applicant_info_state_account[0].toBuffer(),
      ],
      JobsOnChain_Workflow_Info_ID
    );

    const workflow_info_account_exists = await connection.getAccountInfo(
      workflow_info_account[0]
    );
    if (!workflow_info_account_exists) {
      console.log("workflow_info_account do not exists");
      return {
        status: false,
        message: "workflow_info_account do not exists",
      };
    }
    // console.log(
    //   " workflow_info_account => ",
    //   workflow_info_account[0].toBase58()
    // );

    //Check if contact_info_state_account of user exists
    const contact_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(CONTACT_STATE_ACCOUNT_PREFIX),
        applicant_info_state_account[0].toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    const contact_info_state_account_exists = await connection.getAccountInfo(
      contact_info_state_account[0]
    );

    if (!contact_info_state_account_exists) {
      console.log("contact_info_state_account do not exists");
      return {
        status: false,
        message: "Candidate contact details does not exists",
      };
    }

    console.log(company_info, "company_info");

    const plan_type_details =
      REVEAL_USER_DETAILS_PRICE[company_info.subscription_plan];
    if (!plan_type_details) {
      console.log("plan_type_details not found");
      return {
        status: false,
        message: "plan_type_details not found",
      };
    }
    console.log("plan_type_details => ", plan_type_details);
    if (plan_type_details.price) {
      RECONCILING_AMOUNT = plan_type_details.price;
      toast.info("Please wait while we process your payment");
      const transactionStatus = await payFromCompanyToPlatform(
        provider,
        owner,
        connection,
        plan_type_details.price
      );

      if (!transactionStatus || !transactionStatus.status) {
        console.log(transactionStatus.message || "Transaction failed");
        return {
          status: false,
          message: transactionStatus.message || "Transaction failed",
        };
      }

      console.log(transactionStatus.message || "Transaction success");
    }
    toast.info("Updating your payment status");
    const updateWorkflowInfo = {
      is_paid: true,
      paid_amount: new BN(plan_type_details.price),
      paid_at: new BN(new Date().getTime()), //8 => timestamp in unix format
      last_updated_at: new BN(new Date().getTime()), //8 => timestamp in unix format
    };

    const updateJobApplyWorkflowInfo = new WorkflowInfoState({
      ...updateWorkflowInfo,
    });

    const subscriptionModifier = await getPayer();

    const buffer =
      WorkflowInfoState.serializeUpdateWorkflowPaymentInfoInstruction(
        updateJobApplyWorkflowInfo
      );

    const update_job_workflow_payment_info_account_inst =
      new TransactionInstruction({
        programId: JobsOnChain_Workflow_Info_ID,
        keys: [
          {
            pubkey: subscriptionModifier.publicKey,
            isSigner: true,
            isWritable: true,
          },
          { pubkey: owner, isSigner: false, isWritable: false },
          {
            pubkey: company_info_account[0],
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: applicant_info_state_account[0],
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: jobpost_info_account[0],
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: workflow_info_account[0],
            isSigner: false,
            isWritable: true,
          },

          {
            pubkey: JobsOnChain_User_Info_ID,
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: JobsOnChain_Company_Info_ID,
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: JobsOnChain_JobPost_Info_ID,
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: true,
          },
        ],
        data: Buffer.from(Uint8Array.of(2, ...buffer)),
      });
    await sendAndConfirmTransaction(
      connection,
      new Transaction().add(update_job_workflow_payment_info_account_inst),
      [subscriptionModifier]
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      status: true,
      message: "Payment success updating successful",
    };
    // const workflowInfoResult = await getWorkflowInfo(
    //   workflow_info_account[0],
    //   connection
    // );
    // console.log("workflowInfoResult => ", workflowInfoResult);

    // if (workflowInfoResult.is_paid) {
    //   const userContantInfo = await getContactInfo(
    //     contact_info_state_account[0],
    //     connection
    //   );
    //   console.log("userContantInfo => ", userContantInfo);
    //   return userContantInfo;
    // }
    // return null;
  } catch (err) {
    console.log("err => ", err);
    await payFromPlatformToCompany(
      provider,
      owner,
      connection,
      RECONCILING_AMOUNT
    );
    // if(!txnStatus.status){
    // toast.error("Reconciling txn failed")
    toast.info(
      "In case of failure, Please send email to admin to reconcile your payment with transaction id or wallet address"
    );
    // }
    await new Promise((resolve) => setTimeout(resolve, 2000));

    throw err;
  }
};

export const reveal_user_details = async (
  owner,
  user_info_state_account,
  company_info_state_account,
  job_info_account,
  connection
) => {
  try {
    const candidate_pubkey = new PublicKey(
      "D3YCmJCTyx8CtSv39bwN46Aut6At9ucGNf6QFzhnVrHc"
    );
    // let company_seq_number = "CP2";
    // let job_number = "JP2";

    //Check if applicant_info_state_account exists
    const applicant_info_state_account = [
      new PublicKey(user_info_state_account),
    ];

    const applicant_info_state_account_exists = await connection.getAccountInfo(
      applicant_info_state_account[0]
    );

    if (!applicant_info_state_account_exists) {
      console.log("applicant_info_state_account not found");
      return;
    }
    console.log(
      " applicant_info_state_account => ",
      applicant_info_state_account[0].toBase58()
    );

    //Check if company_info_account exists
    const company_info_account = [new PublicKey(company_info_state_account)];
    // await PublicKey.findProgramAddress(
    //   [
    //     Buffer.from(COMPANY_STATE_ACCOUNT_PREFIX),
    //     Buffer.from(company_seq_number),
    //     applicant_info_state_account[0].toBuffer(),
    //   ],
    //   JobsOnChain_Company_Info_ID
    // );
    const company_info_account_exists = await connection.getAccountInfo(
      company_info_account[0]
    );
    if (!company_info_account_exists) {
      console.log("company_info_account do not exists");
      return;
    }
    console.log(
      " company_info_account => ",
      company_info_account[0].toBase58()
    );

    //Check if jobpost_info_account exists
    const jobpost_info_account = [new PublicKey(job_info_account)];
    // await PublicKey.findProgramAddress(
    //   [
    //     Buffer.from(JOBPOST_STATE_ACCOUNT_PREFIX),
    //     Buffer.from(job_number),
    //     company_info_account[0].toBuffer(),
    //   ],
    //   JobsOnChain_JobPost_Info_ID
    // );
    const jobpost_info_account_exists = await connection.getAccountInfo(
      jobpost_info_account[0]
    );
    if (!jobpost_info_account_exists) {
      console.log("jobpost_info_account do not exists");
      return;
    }
    console.log(
      " jobpost_info_account => ",
      jobpost_info_account[0].toBase58()
    );

    //Check if workflow_info_account exists
    const workflow_info_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(WORKFLOW_STATE_ACCOUNT_PREFIX),
        jobpost_info_account[0].toBuffer(),
        applicant_info_state_account[0].toBuffer(),
      ],
      JobsOnChain_Workflow_Info_ID
    );

    const workflow_info_account_exists = await connection.getAccountInfo(
      workflow_info_account[0]
    );
    if (!workflow_info_account_exists) {
      console.log("workflow_info_account do not exists");
      return;
    }
    console.log(
      " workflow_info_account => ",
      workflow_info_account[0].toBase58()
    );

    //Check if contact_info_state_account of user exists
    const contact_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(CONTACT_STATE_ACCOUNT_PREFIX),
        applicant_info_state_account[0].toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    const contact_info_state_account_exists = await connection.getAccountInfo(
      contact_info_state_account[0]
    );

    if (!contact_info_state_account_exists) {
      console.log("contact_info_state_account do not exists");
      return;
    }

    const workflowInfoResult = await getWorkflowInfo(
      workflow_info_account[0],
      connection
    );
    console.log("workflowInfoResult => ", workflowInfoResult);

    if (workflowInfoResult.is_paid) {
      const userContantInfo = await getContactInfo(
        contact_info_state_account[0],
        connection
      );
      console.log("userContantInfo => ", userContantInfo);
      return userContantInfo;
    } else {
      console.log(
        "You have not paid fee to see the details of => ",
        workflowInfoResult.user_pubkey.toBase58()
      );
      return null;
    }
  } catch (err) {
    console.log("err => ", err);
    throw err;
  }
};

export const fetchAllJobs = async (connection, company_info_account) => {
  try {
    let allJobsOfCompany;
    if (company_info_account) {
      allJobsOfCompany = await findAllJobsOfCompany(
        connection,
        company_info_account
      );
    } else {
      allJobsOfCompany = await findAllJobsOfCompany(connection);
    }

    if (allJobsOfCompany.status) {
      // for (let job of allJobsOfCompany.data) {
      //   console.log("job in all jobs => ", job);
      //   console.log("job => ", job.pubkey.toBase58());
      //   const jobPostInfo = await getJobPostInfo(job.pubkey, connection);
      //   console.log("jobPostInfo => ", jobPostInfo);
      //   if (jobPostInfo) {
      //     allJobs.push({
      //       pubkey: job.pubkey,
      //       parsedInfo: jobPostInfo,
      //       jobTitle: jobPostInfo.job_title,
      //     });
      //   }
      // }

      return allJobsOfCompany.data;
    }

    console.log("No Jobs found");
    return [];
  } catch (err) {
    console.log("err in fetchAllJobs => ", err);
    throw err;
  }
};

export const fetchAllCompanies = async (owner, connection) => {
  try {
    const allCompanies = [];
    const allCompaniesInfo = await findAllCompanyInfosOfUser(connection, owner);
    if (allCompaniesInfo.status) {
      for (let company of allCompaniesInfo.data) {
        const comapanyInfo = await getCompanyInfo(company.pubkey, connection);
        if (comapanyInfo) {
          allCompanies.push({
            pubkey: company.pubkey,
            parsedInfo: comapanyInfo,
            companyName: comapanyInfo.name,
          });
        }
      }
      return allCompanies;
    }

    console.log("No Company found");
    return [];
  } catch (err) {
    console.log("err in fetchAllJobs => ", err);
    throw err;
  }
};

export const fetchAllWorkflowOfJobPost = async (owner, connection) => {
  try {
    const job_info_pubkey = "CQr7mZ3SafhV1po7bQJT7DHXLJPAomfWQDjLBD2RW7eG";
    const allWorkflows = {
      [WORKFLOW_STATUSES[0]]: [],
      [WORKFLOW_STATUSES[1]]: [],
      [WORKFLOW_STATUSES[2]]: [],
      [WORKFLOW_STATUSES[3]]: [],
      [WORKFLOW_STATUSES[4]]: [],
    };
    const allWorkflowOfJobPost = await findAllWorkflowOfJobPost(
      connection,
      new PublicKey(job_info_pubkey)
    );
    if (allWorkflowOfJobPost.status) {
      for (let workflow of allWorkflowOfJobPost.data) {
        const workflowInfo = await getWorkflowInfo(workflow.pubkey, connection);
        if (workflowInfo) {
          allWorkflows[workflowInfo.status].push({
            ...workflowInfo,
            pubkey: workflow.pubkey,
          });
        }
      }
      return allWorkflows;
    }

    console.log("No Workflow found of job post");
    return [];
  } catch (err) {
    console.log("err in fetchAllJobs => ", err);
    throw err;
  }
};

export const fetchAllWorkflowOfUsers = async (owner, connection) => {
  try {
    const allWorkflows = {
      [WORKFLOW_STATUSES[0]]: [],
      [WORKFLOW_STATUSES[1]]: [],
      [WORKFLOW_STATUSES[2]]: [],
      [WORKFLOW_STATUSES[3]]: [],
      [WORKFLOW_STATUSES[4]]: [],
    };

    const applicant_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(APPLICANT_STATE_ACCOUNT_PREFIX),
        new PublicKey(owner).toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    const applicant_info_state_account_exists = await connection.getAccountInfo(
      applicant_info_state_account[0]
    );

    if (!applicant_info_state_account_exists) {
      console.log("applicant_info_state_account not found");
      return allWorkflows;
    }

    const allWorkflowOfApplicants = await findAllWorkflowOfApplicant(
      connection,
      applicant_info_state_account[0]
    );
    if (allWorkflowOfApplicants.status) {
      for (let workflow of allWorkflowOfApplicants.data) {
        const workflowInfo = await getWorkflowInfo(workflow.pubkey, connection);
        if (workflowInfo) {
          const companyInfo = await getCompanyInfo(
            workflowInfo.company_pubkey,
            connection
          );
          const jobInfo = await getJobPostInfo(
            workflowInfo.job_pubkey,
            connection
          );

          console.log(workflowInfo, "==>workflowInfo");

          if (workflowInfo.is_saved) {
            allWorkflows[WORKFLOW_STATUSES_enum.SAVED].push({
              ...workflowInfo,
              pubkey: workflow.pubkey,
              companyInfo,
              jobInfo,
            });
          }
          allWorkflows[workflowInfo.status].push({
            ...workflowInfo,
            pubkey: workflow.pubkey,
            companyInfo,
            jobInfo,
          });
        }
      }
      console.log("allWorkflows => ", allWorkflows);
      return allWorkflows;
    }

    console.log("No Workflow found of applicant");
    return [];
  } catch (err) {
    console.log("err in fetchAllJobs => ", err);
    throw err;
  }
};

export const fetchAllUsers = async (userType, connection) => {
  try {
    let allCandidates = await connection.getProgramAccounts(
      JobsOnChain_User_Info_ID,
      {
        filters: [
          {
            dataSize: UserCandidateInfoState_SIZE,
          },
        ],
      }
    );
    if (!allCandidates || !allCandidates.length) {
      console.log("No Candidate found");
      return {
        status: true,
        candidates: [],
      };
    }

    const candidates = [];
    for (let i = 0; i < allCandidates.length; i++) {
      const userInfo = UserCandidateInfoState.deserialize(
        allCandidates[i].account.data
      );
      if (userInfo && userInfo.user_type === userType) {
        candidates.push({
          ...userInfo,
          pubkey: allCandidates[i].pubkey,
        });
      }
    }
    return {
      status: true,
      candidates,
    };
  } catch (err) {
    console.log("err in fetchAllUsers => ", err);
    return {
      status: false,
      candidates: [],
    };
  }
};

export const fetchUserInfoAccount = async (
  owner,
  connection,
  includeParsedInfo
) => {
  try {
    const user_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(APPLICANT_STATE_ACCOUNT_PREFIX),
        new PublicKey(owner).toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    console.log("user_info_state_account => ", user_info_state_account);

    const user_info_state_account_exists = await connection.getAccountInfo(
      user_info_state_account[0]
    );

    if (!user_info_state_account_exists) {
      console.log("user_info_state_account not found");
      return null;
    }
    let userInfo = {
      pubkey: user_info_state_account[0],
    };
    if (includeParsedInfo) {
      userInfo.parsedInfo = await getUserInfo(
        user_info_state_account[0],
        connection
      );
    }
    return userInfo;
  } catch (err) {
    console.log("err in fetchAllJobs => ", err);
    throw err;
  }
};

export const payFromCompanyToPlatform = async (
  provider,
  owner,
  connection,
  amount
) => {
  try {
    if (!amount) {
      return {
        status: true,
      };
    }
    const USDC_MINT_ID = new PublicKey(SOLANA_USDC_MINT_KEY_DEVNET);
    const payerUSDCAccountExists = await findAssociatedTokenAccountPublicKey(
      owner,
      USDC_MINT_ID
    );
    if (!payerUSDCAccountExists) {
      const msg =
        "USDC account not found in your wallet, Please load your wallet with USDC";
      return {
        status: false,
        message: msg,
      };
    }
    console.log(
      payerUSDCAccountExists.toBase58(),
      "---payerUSDCAccountExists---"
    );
    const receiver = await getPayer();
    const receiverUSDCAccount = await findAssociatedTokenAccountPublicKey(
      receiver.publicKey,
      USDC_MINT_ID
    );
    console.log(receiverUSDCAccount.toBase58(), "---payerUSDCAccount---");

    const transferResult = await transferCustomToken(
      provider,
      connection,
      amount,
      payerUSDCAccountExists,
      receiverUSDCAccount
    );
    console.log("transferResult => ", transferResult);
    if (!transferResult || transferResult.status === false) {
      return {
        status: false,
        message: transferResult.error || "Transfer failed, Please try again",
      };
    }
    return {
      status: true,
      message: `Payment done successfully ${amount} with signature ${transferResult.signature}`,
    };
  } catch (err) {
    console.log("err in payFromCompanyToPlatform => ", err);
    return {
      status: false,
      message: err.message,
    };
  }
};

export const payFromPlatformToCompany = async (
  provider,
  owner,
  connection,
  amount
) => {
  try {
    if (!amount) {
      return {
        status: true,
      };
    }
    const USDC_MINT_ID = new PublicKey(SOLANA_USDC_MINT_KEY_DEVNET);
    const payerUSDCAccountExists = await findAssociatedTokenAccountPublicKey(
      owner,
      USDC_MINT_ID
    );
    if (!payerUSDCAccountExists) {
      const msg =
        "USDC account not found in your wallet, Please load your wallet with USDC";
      return {
        status: false,
        message: msg,
      };
    }
    console.log(
      payerUSDCAccountExists.toBase58(),
      "---payerUSDCAccountExists---"
    );
    const receiver = await getPayer();
    const receiverUSDCAccount = await findAssociatedTokenAccountPublicKey(
      receiver.publicKey,
      USDC_MINT_ID
    );
    console.log(receiverUSDCAccount.toBase58(), "---payerUSDCAccount---");

    const transferResult = await transferCustomToken(
      provider,
      connection,
      amount,
      receiverUSDCAccount,
      payerUSDCAccountExists
    );
    console.log("transferResult => ", transferResult);
    if (!transferResult || transferResult.status === false) {
      return {
        status: false,
        message: transferResult.error || "Transfer failed, Please try again",
      };
    }
    return {
      status: true,
      message: `Payment done successfully ${amount} with signature ${transferResult.signature}`,
    };
  } catch (err) {
    console.log("err in payFromCompanyToPlatform => ", err);
    return {
      status: false,
      message: err.message,
    };
  }
};
