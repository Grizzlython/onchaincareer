import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  Keypair,
  PublicKey,
  SystemProgram,

  //Transaction,
  TransactionInstruction,
  
} from "@solana/web3.js";
import { sendTxUsingExternalSignature } from "./externalwallet";
import { getOrCreateAssociatedAccount } from "./getOrCreateAssociatedAccount";
import { JobsOnChain_User_Info_ID, treasory_token_account, } from "./program_ids";
import {UserCandidateInfoState, ProjectInfoState, ContactInfoState, WorkExperienceInfoState, EducationInfoState,
ProjectInfoState_SIZE,
EducationInfoState_SIZE,
WorkExperienceInfoState_SIZE,
ContactInfoState_SIZE,

} from '../../utils/web3/struct_decoders/jobsonchain_user_info_decoder';
import { JobPostInfoState, JobPostInfoState_SIZE} from './struct_decoders/jobsonchain_jobpost_info_decoder';
import { WorkflowInfoState, WorkflowInfoState_SIZE} from './struct_decoders/jobsonchain_workflow_info_decoder';
import { CompanyInfoState, CompanyInfoState_SIZE} from './struct_decoders/jobsonchain_company_info_decoder';
import * as BufferLayout from "@solana/buffer-layout";
import {Buffer} from 'buffer';

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
export const getUserCandidateInfo = async (applicant_info_state_account, connection) => {
  const accountInfo = await connection.getAccountInfo(applicant_info_state_account);
  if (accountInfo === null) {
    return null;
  }
  const applicantInfo = UserCandidateInfoState.deserialize(accountInfo.data);
  return applicantInfo
}

export const getProjectInfo = async (project_info_state_account, connection) => {
  let projectExists = await connection.getAccountInfo(project_info_state_account)
  if(projectExists === null){
    return null;
  }
  const projectInfo = ProjectInfoState.deserialize(projectExists.data);
  return projectInfo
}

export const getContactInfo = async (contact_info_state_account, connection) => {
  let contactInfoExists = await connection.getAccountInfo(contact_info_state_account)
  if(contactInfoExists === null){
    return null;
  }
  const contactInfo = ContactInfoState.deserialize(contactInfoExists.data);
  return contactInfo
}

export const getEducationInfo = async (education_info_state_account, connection) => {
  let educationInfoExists = await connection.getAccountInfo(education_info_state_account)
  if(educationInfoExists === null){
    return null;
  }
  const educationInfo = EducationInfoState.deserialize(educationInfoExists.data);
  return educationInfo
}

export const getWorkExperienceInfo = async (work_experience_info_state_account, connection) => {
  let workExperienceInfoExists = await connection.getAccountInfo(work_experience_info_state_account)
  if(workExperienceInfoExists === null){
    return null;
  }
  const workExperienceInfo = WorkExperienceInfoState.deserialize(workExperienceInfoExists.data);
  return workExperienceInfo
}

export const findAllProjectsOfUser = async (user_info_state_account, connection) => {
  let projectsOfUser = await connection.getProgramAccounts(JobsOnChain_User_Info_ID,{
    filters:[
      {
        dataSize: ProjectInfoState_SIZE
      },
      {
        memcmp:{
          offset: 1,
          bytes: user_info_state_account.toString()
        }
      }
    ]
  });

  return projectsOfUser;
}

export const findAllEducationsOfUser = async (user_info_state_account, connection) => {
  let educationsOfUser = await connection.getProgramAccounts(JobsOnChain_User_Info_ID,{
    filters:[
      {
        dataSize: EducationInfoState_SIZE
      },
      {
        memcmp:{
          offset: 1,
          bytes: user_info_state_account.toString()
        }
      }
    ]
  });

  return educationsOfUser;
}

export const findAllWorkExperiencesOfUser = async (user_info_state_account, connection) => {
  let workExperiencesOfUser = await connection.getProgramAccounts(JobsOnChain_User_Info_ID,{
    filters:[
      {
        dataSize: WorkExperienceInfoState_SIZE
      },
      {
        memcmp:{
          offset: 1,
          bytes: user_info_state_account.toString()
        }
      }
    ]
  });

  return workExperiencesOfUser;
}
const CONTACT_STATE_ACCOUNT_PREFIX = "socials";
const PROJECTS_STATE_ACCOUNT_PREFIX = "project";
const EDUCATION_STATE_ACCOUNT_PREFIX = "education";
const APPLICANT_STATE_ACCOUNT_PREFIX = "applicant";
const WORK_EXPERIENCE_STATE_ACCOUNT_PREFIX = "work_experience";


export const add_user_info = async (owner, connection, signTransaction) => {
  const applicantInfo = {
    username:"blocksan",
    name:"Sandeep Ghosh",
    address: "Metaverse",
    image_uri:"https://dummy.org",
    bio:"applicant bio",
    skills: ["Developer","Speaker"],
    designation:"Developer",
    current_employment_status:"Startup",
    can_join_in:"never",
    user_type:"recruiter",
    is_company_profile_complete: false,
    is_overview_complete: true,
    is_projects_complete: false,
    is_contact_info_complete: true,
    is_education_complete: false,
    is_work_experience_complete: false,    
  }
  const applicant_info_state_account = await PublicKey.findProgramAddress(
    [
      Buffer.from(APPLICANT_STATE_ACCOUNT_PREFIX),
      new PublicKey(owner).toBuffer(),
    ],
    JobsOnChain_User_Info_ID
  );
  console.log(" applicant_info_state_account => ", applicant_info_state_account[0].toBase58())

  const newApplicantInfo = new UserCandidateInfoState({
    ...applicantInfo
  })

  const buffer = UserCandidateInfoState.serializeSaveApplicantInfoInstruction(newApplicantInfo);
  const applicant_info = new TransactionInstruction({
    programId: JobsOnChain_User_Info_ID,
    keys: [
      { pubkey: owner,isSigner: true,isWritable: false},
      { pubkey: applicant_info_state_account[0], isSigner: false, isWritable: true },
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
  const userCandidateInfoResult = await getUserCandidateInfo(applicant_info_state_account[0], connection);
  console.log("userCandidateInfoResult => ", userCandidateInfoResult);
  return userCandidateInfoResult;
}

export const update_user_info = async (owner, connection, signTransaction) => {
  const applicantInfo = {
    username:"updated blocksan",
    name:"Sandeep Ghosh",
    address: "Metaverse",
    image_uri:"https://dummy.org",
    bio:"applicant bio",
    skills: ["Developer","Speaker"],
    designation:"Developer",
    current_employment_status:"Startup",
    can_join_in:"never",
    user_type:"recruiter",
    is_company_profile_complete: false,
    is_overview_complete: true,
    is_projects_complete: false,
    is_contact_info_complete: true,
    is_education_complete: false,
    is_work_experience_complete: false,  
  }

  const applicant_info_state_account = await PublicKey.findProgramAddress(
    [
      Buffer.from(APPLICANT_STATE_ACCOUNT_PREFIX),
      new PublicKey(owner).toBuffer(),
    ],
    JobsOnChain_User_Info_ID
  );
  console.log(" applicant_info_state_account => ", applicant_info_state_account[0].toBase58())

  const newApplicantInfo = new UserCandidateInfoState({
    ...applicantInfo
  })

  const buffer = UserCandidateInfoState.serializeUpdateApplicantInfoInstruction(newApplicantInfo);
  const applicant_info = new TransactionInstruction({
    programId: JobsOnChain_User_Info_ID,
    keys: [
      { pubkey: owner,isSigner: true,isWritable: false},
      { pubkey: applicant_info_state_account[0], isSigner: false, isWritable: true },
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
  const userCandidateInfoResult = await getUserCandidateInfo(applicant_info_state_account[0], connection);
  console.log("userCandidateInfoResult => ", userCandidateInfoResult);
}

export const add_project_info = async (owner, connection, signTransaction) => {
  try{
    console.log("owner => ", owner.toBase58());
    const projectInfo = {
      archived: false,
      project_name:"project",
      project_description:"Sandeep Ghosh",
      project_image_uris:["https://dummy.org"],
      project_link:"applicant bio",
      project_skills: ["Developer","Speaker"],
      project_start_date:new Date().getTime().toString(),
      project_end_date:new Date().getTime().toString(),
      project_status:"Completed", 
    } as ProjectInfoState
  
    const applicant_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(APPLICANT_STATE_ACCOUNT_PREFIX),
        new PublicKey(owner).toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    const applicant_info_state_account_exists = await connection.getAccountInfo(applicant_info_state_account[0]);

    if(!applicant_info_state_account_exists){
      console.log("applicant_info_state_account not found");
      return;
    }
    console.log(" applicant_info_state_account => ", applicant_info_state_account[0].toBase58())

    const projectsOfUser = await findAllProjectsOfUser(applicant_info_state_account[0], connection);

    if(projectsOfUser && projectsOfUser.length > 0){
      projectInfo.project_number = 'P'+(projectsOfUser.length+1);
    }else{
      projectInfo.project_number = 'P1';
    }
  
    const newProjectInfo = new ProjectInfoState({
      ...projectInfo
    })
  

    const buffer = ProjectInfoState.serializeAddProjectInfoInstruction(newProjectInfo);
    
    const project_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(PROJECTS_STATE_ACCOUNT_PREFIX),
        Buffer.from(projectInfo.project_number),
        applicant_info_state_account[0].toBuffer()
      ],
      JobsOnChain_User_Info_ID
    );

    const project_info_state_account_exists = await connection.getAccountInfo(project_info_state_account[0]);

    if(project_info_state_account_exists){
      console.log("project_info_state_account already exists");
      return;
    }
    
    console.log(" project_info_state_account => ", project_info_state_account[0].toBase58());
    
    const add_project_info = new TransactionInstruction({
      programId: JobsOnChain_User_Info_ID,
      keys: [
        { pubkey: owner,isSigner: true,isWritable: false},
        { pubkey: applicant_info_state_account[0], isSigner: false, isWritable: false },
        { pubkey: project_info_state_account[0], isSigner: false, isWritable: true },
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
    const projectInfoResult = await getProjectInfo(project_info_state_account[0], connection);
    console.log("projectInfoResult => ", projectInfoResult);
    return projectInfoResult
  }catch(err){
    console.log("err => ", err)
    throw err
  }
}

export const update_project_info = async (owner, connection, signTransaction) => {
  try{
    console.log("owner => ", owner.toBase58());
    const projectInfo = {
      archived: true,
      project_name:"updated project",
      project_description:"Sandeep Ghosh",
      project_image_uris:["https://dummy.org"],
      project_link:"applicant bio",
      project_skills: ["Developer","Speaker"],
      project_start_date:new Date().getTime().toString(),
      project_end_date:new Date().getTime().toString(),
      project_status:"Completed",
      project_number:"P5", 
    }
  
    const applicant_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(APPLICANT_STATE_ACCOUNT_PREFIX),
        new PublicKey(owner).toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    const applicant_info_state_account_exists = await connection.getAccountInfo(applicant_info_state_account[0]);

    if(!applicant_info_state_account_exists){
      console.log("applicant_info_state_account not found");
      return;
    }
    console.log(" applicant_info_state_account => ", applicant_info_state_account[0].toBase58())
  
    const updatedProjectInfo = new ProjectInfoState({
      ...projectInfo
    })
  

    const buffer = ProjectInfoState.serializeUpdateProjectInfoInstruction(updatedProjectInfo);
    
    const project_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(PROJECTS_STATE_ACCOUNT_PREFIX),
        Buffer.from(projectInfo.project_number),
        applicant_info_state_account[0].toBuffer()
      ],
      JobsOnChain_User_Info_ID
    );

    const project_info_state_account_exists = await connection.getAccountInfo(project_info_state_account[0]);

    if(!project_info_state_account_exists){
      console.log("project_info_state_account do not exists");
      return;
    }
    const projectInfoBeforeUpdate = await getProjectInfo(project_info_state_account[0], connection);
    console.log("projectInfoBeforeUpdate => ", projectInfoBeforeUpdate);
        
    const update_project_info = new TransactionInstruction({
      programId: JobsOnChain_User_Info_ID,
      keys: [
        { pubkey: owner,isSigner: true,isWritable: false},
        { pubkey: applicant_info_state_account[0], isSigner: false, isWritable: false },
        { pubkey: project_info_state_account[0], isSigner: false, isWritable: true },
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
    const projectInfoResult = await getProjectInfo(project_info_state_account[0], connection);
    console.log("projectInfoResult => ", projectInfoResult);
    return projectInfoResult
  }catch(err){
    console.log("err => ", err)
    throw err
  }
}

export const add_contact_info = async (owner, connection, signTransaction) => {
  try{
    console.log("owner => ", owner.toBase58());
    const contactInfo = {
      email:"email", //64
      phone:"phone", //16
      resume_uri:"resume_uri",//128
      github:"github link", //128
      linkedin:"linkedin link",//128 
      twitter:"twitter link", //128
      dribble:"dribble link", //128
      behance:"behance link", //128
      twitch:"twitch link",  //128
      solgames:"solgames link", //128
      facebook:"facebook link", //128
      instagram:"instagram link", //128
      website:"website link", //128
    }
  
    const applicant_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(APPLICANT_STATE_ACCOUNT_PREFIX),
        new PublicKey(owner).toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    const applicant_info_state_account_exists = await connection.getAccountInfo(applicant_info_state_account[0]);

    if(!applicant_info_state_account_exists){
      console.log("applicant_info_state_account not found");
      return;
    }
    console.log(" applicant_info_state_account => ", applicant_info_state_account[0].toBase58())
  
    const newContactInfo = new ContactInfoState({
      ...contactInfo
    })
  
    const buffer = ContactInfoState.serializeAddContactInfoInstruction(newContactInfo);
    
    const contact_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(CONTACT_STATE_ACCOUNT_PREFIX),
        applicant_info_state_account[0].toBuffer()
      ],
      JobsOnChain_User_Info_ID
    );

    const contact_info_state_account_exists = await connection.getAccountInfo(contact_info_state_account[0]);

    if(contact_info_state_account_exists){
      console.log("contact_info_state_account already exists");
      return;
    }
    
    console.log(" contact_info_state_account => ", contact_info_state_account[0].toBase58());
    
    const add_contact_info = new TransactionInstruction({
      programId: JobsOnChain_User_Info_ID,
      keys: [
        { pubkey: owner,isSigner: true,isWritable: false},
        { pubkey: applicant_info_state_account[0], isSigner: false, isWritable: false },
        { pubkey: contact_info_state_account[0], isSigner: false, isWritable: true },
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
    const contactInfoResult = await getContactInfo(contact_info_state_account[0], connection);
    console.log("contactInfoResult => ", contactInfoResult);
    return contactInfoResult
  }catch(err){
    console.log("err => ", err)
    throw err
  }
}

export const update_contact_info = async (owner, connection, signTransaction) => {
  try{
    console.log("owner => ", owner.toBase58());
    const contactInfo = {
      email:"updated email", //64
      phone:"updated phone", //16
      resume_uri:"updated resume_uri",//128
      github:"updated github link", //128
      linkedin:"linkedin link",//128 
      twitter:"twitter link", //128
      dribble:"dribble link", //128
      behance:"behance link", //128
      twitch:"twitch link",  //128
      solgames:"solgames link", //128
      facebook:"facebook link", //128
      instagram:"instagram link", //128
      website:"website link", //128
    }
  
    const applicant_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(APPLICANT_STATE_ACCOUNT_PREFIX),
        new PublicKey(owner).toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    const applicant_info_state_account_exists = await connection.getAccountInfo(applicant_info_state_account[0]);

    if(!applicant_info_state_account_exists){
      console.log("applicant_info_state_account not found");
      return;
    }
    console.log(" applicant_info_state_account => ", applicant_info_state_account[0].toBase58())
  
    const updateContactInfo = new ContactInfoState({
      ...contactInfo
    })
  
    const buffer = ContactInfoState.serializeUpdateContactInfoInstruction(updateContactInfo);
    
    const contact_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(CONTACT_STATE_ACCOUNT_PREFIX),
        applicant_info_state_account[0].toBuffer()
      ],
      JobsOnChain_User_Info_ID
    );

    const contact_info_state_account_exists = await connection.getAccountInfo(contact_info_state_account[0]);

    if(!contact_info_state_account_exists){
      console.log("contact_info_state_account do not exists");
      return;
    }
    
    console.log(" contact_info_state_account => ", contact_info_state_account[0].toBase58());
    
    const update_contact_info = new TransactionInstruction({
      programId: JobsOnChain_User_Info_ID,
      keys: [
        { pubkey: owner,isSigner: true,isWritable: false},
        { pubkey: applicant_info_state_account[0], isSigner: false, isWritable: false },
        { pubkey: contact_info_state_account[0], isSigner: false, isWritable: true },
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
    const contactInfoResult = await getContactInfo(contact_info_state_account[0], connection);
    console.log("contactInfoResult => ", contactInfoResult);
    return contactInfoResult
  }catch(err){
    console.log("err => ", err)
    throw err
  }
}

export const add_education_info = async (owner, connection, signTransaction) => {
  try{
    console.log("owner => ", owner.toBase58());
    const educationInfo = {
        school_name:"school_name", //128
        degree:"degree", //64
        field_of_study:"field_of_study", //64
        start_date:"start_date", //64
        end_date:"end_data", //64
        grade:"grade", //64
        activities:["activities"], //64*10 //640+10+10 ~700
        subjects:["subjects 1","subjects 2"], //64*10 //640+10+10 ~700
        description:"description", //1024
        is_college: true, //1 //if true then school_name is college name
        is_studying: false, //1
        certificate_uris: ["uri 1","uri 2"] //128*5 //640+5+5 ~650
    } as EducationInfoState
  
    const applicant_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(APPLICANT_STATE_ACCOUNT_PREFIX),
        new PublicKey(owner).toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    const applicant_info_state_account_exists = await connection.getAccountInfo(applicant_info_state_account[0]);

    if(!applicant_info_state_account_exists){
      console.log("applicant_info_state_account not found");
      return;
    }
    console.log(" applicant_info_state_account => ", applicant_info_state_account[0].toBase58())
  
    const educationsOfUser = await findAllEducationsOfUser(applicant_info_state_account[0], connection);

    if(educationsOfUser && educationsOfUser.length > 0){
      educationInfo.education_number = 'E'+(educationsOfUser.length+1);
    }else{
      educationInfo.education_number = 'E1';
    }

    const addEducationInfo = new EducationInfoState({
      ...educationInfo
    })
  
    const buffer = EducationInfoState.serializeAddEducationInfoInstruction(addEducationInfo);
    
    const education_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(EDUCATION_STATE_ACCOUNT_PREFIX),
        Buffer.from(educationInfo.education_number),
        applicant_info_state_account[0].toBuffer()
      ],
      JobsOnChain_User_Info_ID
    );

    const education_info_state_account_exists = await connection.getAccountInfo(education_info_state_account[0]);

    if(education_info_state_account_exists){
      console.log("education_info_state_account already exists");
      return;
    }
        
    const add_education_info_ins = new TransactionInstruction({
      programId: JobsOnChain_User_Info_ID,
      keys: [
        { pubkey: owner,isSigner: true,isWritable: false},
        { pubkey: applicant_info_state_account[0], isSigner: false, isWritable: false },
        { pubkey: education_info_state_account[0], isSigner: false, isWritable: true },
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
    const educationInfoResult = await getEducationInfo(education_info_state_account[0], connection);
    console.log("educationInfoResult => ", educationInfoResult);
    return educationInfoResult
  }catch(err){
    console.log("err => ", err)
    throw err
  }
}
export const update_education_info = async (owner, connection, signTransaction) => {
  try{
    console.log("owner => ", owner.toBase58());
    const educationInfo = {
      school_name:"updated school_name", //128
      degree:"updated degree", //64
      field_of_study:"field_of_study", //64
      start_date:"start_date", //64
      end_date:"end_data", //64
      grade:"grade", //64
      activities:["activities"], //64*10 //640+10+10 ~700
      subjects:["subjects 1","subjects 2"], //64*10 //640+10+10 ~700
      description:"description", //1024
      is_college: true, //1 //if true then school_name is college name
      is_studying: false, //1
      certificate_uris: ["uri 1","uri 2"], //128*5 //640+5+5 ~650
      education_number: 'E1'
    }
  
    const applicant_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(APPLICANT_STATE_ACCOUNT_PREFIX),
        new PublicKey(owner).toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    const applicant_info_state_account_exists = await connection.getAccountInfo(applicant_info_state_account[0]);

    if(!applicant_info_state_account_exists){
      console.log("applicant_info_state_account not found");
      return;
    }
    console.log(" applicant_info_state_account => ", applicant_info_state_account[0].toBase58())
  
    const updateEducationInfo = new EducationInfoState({
      ...educationInfo
    })
  
    const buffer = EducationInfoState.serializeUpdateEducationInfoInstruction(updateEducationInfo);
    
    const education_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(EDUCATION_STATE_ACCOUNT_PREFIX),
        Buffer.from(educationInfo.education_number),
        applicant_info_state_account[0].toBuffer()
      ],
      JobsOnChain_User_Info_ID
    );

    const education_info_state_account_exists = await connection.getAccountInfo(education_info_state_account[0]);

    if(!education_info_state_account_exists){
      console.log("education_info_state_account do not exists");
      return;
    }
        
    const update_education_info_ins = new TransactionInstruction({
      programId: JobsOnChain_User_Info_ID,
      keys: [
        { pubkey: owner,isSigner: true,isWritable: false},
        { pubkey: applicant_info_state_account[0], isSigner: false, isWritable: false },
        { pubkey: education_info_state_account[0], isSigner: false, isWritable: true },
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
    const educationInfoResult = await getEducationInfo(education_info_state_account[0], connection);
    console.log("educationInfoResult => ", educationInfoResult);
    return educationInfoResult
  }catch(err){
    console.log("err => ", err)
    throw err
  }
}

export const add_work_experience_info = async (owner, connection, signTransaction) => {
  try{
    console.log("owner => ", owner.toBase58());
    const workExperience = {
      archived:false,//1
      company_name:"company_name",//64 
      designation:"designation",//128 
      is_currently_working_here: false,//1 
      start_date: new Date().getTime().toString(), //64 
      end_date:new Date().getTime().toString(),//64 
      description:"description",//512 
      location:"location",//256 
      website:"website url",//128
    } as WorkExperienceInfoState
  
    const applicant_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(APPLICANT_STATE_ACCOUNT_PREFIX),
        new PublicKey(owner).toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    const applicant_info_state_account_exists = await connection.getAccountInfo(applicant_info_state_account[0]);

    if(!applicant_info_state_account_exists){
      console.log("applicant_info_state_account not found");
      return;
    }
    console.log(" applicant_info_state_account => ", applicant_info_state_account[0].toBase58())
  
    const workExperiencesOfUser = await findAllWorkExperiencesOfUser(applicant_info_state_account[0], connection);

    if(workExperiencesOfUser && workExperiencesOfUser.length > 0){
      workExperience.work_experience_number = 'W'+(workExperiencesOfUser.length+1);
    }else{
      workExperience.work_experience_number = 'W1';
    }

    const addWorkExperience = new WorkExperienceInfoState({
      ...workExperience
    })
  
    const buffer = WorkExperienceInfoState.serializeAddWorkExperienceInfoInstruction(addWorkExperience);
    
    const work_experience_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(WORK_EXPERIENCE_STATE_ACCOUNT_PREFIX),
        Buffer.from(workExperience.work_experience_number),
        applicant_info_state_account[0].toBuffer()
      ],
      JobsOnChain_User_Info_ID
    );

    console.log(" work_experience_info_state_account => ", work_experience_info_state_account[0].toBase58());

    const work_experience_info_state_account_exists = await connection.getAccountInfo(work_experience_info_state_account[0]);

    if(work_experience_info_state_account_exists){
      console.log("work_experience_info_state_account already exists");
      return;
    }
        
    const add_work_experience_info_ins = new TransactionInstruction({
      programId: JobsOnChain_User_Info_ID,
      keys: [
        { pubkey: owner,isSigner: true,isWritable: false},
        { pubkey: applicant_info_state_account[0], isSigner: false, isWritable: false },
        { pubkey: work_experience_info_state_account[0], isSigner: false, isWritable: true },
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
    const workExperienceInfoResult = await getWorkExperienceInfo(work_experience_info_state_account[0], connection);
    console.log("workExperienceInfoResult => ", workExperienceInfoResult);
    return workExperienceInfoResult
  }catch(err){
    console.log("err => ", err)
    throw err
  }
}

export const update_work_experience_info = async (owner, connection, signTransaction) => {
  try{
    console.log("owner => ", owner.toBase58());
    const workExperience = {
      archived:false,//1
      company_name:"update company_name",//64 
      designation:"designation",//128 
      is_currently_working_here: false,//1 
      start_date: new Date().getTime().toString(), //64 
      end_date:new Date().getTime().toString(),//64 
      description:"description",//512 
      location:"location",//256 
      website:"website url",//128
      work_experience_number:"W3"
    }
  
    const applicant_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(APPLICANT_STATE_ACCOUNT_PREFIX),
        new PublicKey(owner).toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    const applicant_info_state_account_exists = await connection.getAccountInfo(applicant_info_state_account[0]);

    if(!applicant_info_state_account_exists){
      console.log("applicant_info_state_account not found");
      return;
    }
    console.log(" applicant_info_state_account => ", applicant_info_state_account[0].toBase58())
  
    const work_experience_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(WORK_EXPERIENCE_STATE_ACCOUNT_PREFIX),
        Buffer.from(workExperience.work_experience_number),
        applicant_info_state_account[0].toBuffer()
      ],
      JobsOnChain_User_Info_ID
    );

    const work_experience_info_state_account_exists = await connection.getAccountInfo(work_experience_info_state_account[0]);
    if(!work_experience_info_state_account_exists){
      console.log("work_experience_info_state_account do not exists");
      return;
    }

    const updateWorkExperience = new WorkExperienceInfoState({
      ...workExperience
    })
  
    const buffer = WorkExperienceInfoState.serializeUpdateWorkExperienceInfoInstruction(updateWorkExperience);
    
    const update_work_experience_info_ins = new TransactionInstruction({
      programId: JobsOnChain_User_Info_ID,
      keys: [
        { pubkey: owner,isSigner: true,isWritable: false},
        { pubkey: applicant_info_state_account[0], isSigner: false, isWritable: false },
        { pubkey: work_experience_info_state_account[0], isSigner: false, isWritable: true },
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
    const workExperienceInfoResult = await getWorkExperienceInfo(work_experience_info_state_account[0], connection);
    console.log("workExperienceInfoResult => ", workExperienceInfoResult);
    return workExperienceInfoResult
  }catch(err){
    console.log("err => ", err)
    throw err
  }
}