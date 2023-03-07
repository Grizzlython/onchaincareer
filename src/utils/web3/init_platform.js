import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,

  Transaction,
  TransactionInstruction,

} from "@solana/web3.js";
import { connection } from "../components/connection";
import { sendTxUsingExternalSignature } from "./externalwallet";
import { getOrCreateAssociatedAccount } from "../components/getOrCreateAssociatedAccount";
import { Solgames_UAC_ProgramID, Game_Info_ProgramID, treasory_token_account, usdc_mint, SOLG_token_mint, User_Fee_collector_ProgramId, SOLG_Token_Mint, ufc_state_account_stored, treasory_token_account_store, platform_state_account, game_info_state_account, Daily_Game_League_ProgramID, daily_league_platform_state_account, Game_Categories_ID, Collection_Info_ID, Solgames_User_Info_ID, JobsOnChain_User_Info_ID, JobsOnChain_Company_Info_ID, JobsOnChain_JobPost_Info_ID, JobsOnChain_Workflow_Info_ID, getPayer } from "../components/ids";

import * as BufferLayout from "@solana/buffer-layout";
import {Buffer} from 'buffer';
import { GameLeaguePlatform, PlayerLeagueState } from "./struct_decoders/game_league_decoder";
import { SolgamesUACState, UserNFTState } from "./struct_decoders/esr_uac_platform";
import { GameInfoPlatform } from "./struct_decoders/game_info_decoder";
import { GameCategoriesState } from "./struct_decoders/game_categories_state";
import { CollectionInfoState } from "./struct_decoders/collection_info_decoder";
import { UserInfoState } from "./struct_decoders/solgames_user_decoder";
import { ContactInfoState, EducationInfoState, EducationInfoState_SIZE, ProjectInfoState, ProjectInfoState_SIZE, UserCandidateInfoState, WorkExperienceInfoState, WorkExperienceInfoState_SIZE } from "./struct_decoders/jobsonchain_user_info_decoder";
import { CompanyInfoState, CompanyInfoState_SIZE } from "./struct_decoders/jobsonchain_company_info_decoder";
import { JobPostInfoState, JobPostInfoState_SIZE } from "./struct_decoders/jobsonchain_jobpost_info_decoder";
import { WorkflowInfoState, WorkflowInfoState_SIZE } from "./struct_decoders/jobsonchain_workflow_info_decoder";
import { REVEAL_USER_DETAILS_PRICE, SOLANA_USDC_MINT_KEY_LOCALHOST, SUBSCRIPTION_PLANS_PRICES, WORKFLOW_STATUSES } from "./struct_decoders/jobsonchain_constants_enum";
import { findAssociatedTokenAccountPublicKey } from "./associatedAccounts";
import { transferCustomToken } from "./transferCustomToken";
const BN = require("bn.js");

let nft_mint_key_string = "Fmky2DHEtiq5WmMUbVPwbFxt62DHE73eDDtxAc65p5xk"

let game_nft_key = "Cu2t8abJeEy1osdge6VouB5ox7G87VckeBhqBaoNowBU"
const LEAGUE_ID = 1669593600002;
console.log("LEAGUE_ID => ", LEAGUE_ID)
export const getSolgamesUACStateInfo = async (solgames_uac_state_account) => {
  const accountInfo = await connection.getAccountInfo(solgames_uac_state_account);
  if (accountInfo === null) {
    return null;
  }
  const solgamesUACStateInfo = SolgamesUACState.deserialize(accountInfo.data);
  return solgamesUACStateInfo
}

export const getUserNFTStateInfo = async (solgames_user_nft_state_account) => {
  const accountInfo = await connection.getAccountInfo(solgames_user_nft_state_account);
  if (accountInfo === null) {
    return null;
  }
  const userNFTStateInfo = UserNFTState.deserialize(accountInfo.data);

  return userNFTStateInfo
}
export const getGameInfoPlatformInfo = async (game_info_state_account) => {
  const accountInfo = await connection.getAccountInfo(game_info_state_account);
  if (accountInfo === null) {
    return null;
  }
  const gameInfoPlatformInfo = GameInfoPlatform.deserialize(accountInfo.data);
  return gameInfoPlatformInfo
}

export const getGameLeagueInfo = async (daily_league_platform_state_account) => {
  const accountInfo = await connection.getAccountInfo(daily_league_platform_state_account);
  if (accountInfo === null) {
    return null;
  }
  const gameLeagueInfo = GameLeaguePlatform.deserialize(accountInfo.data);

  return gameLeagueInfo
}

export const getGamePlayerInfo = async (player_league_state_account) => {
  const accountInfo = await connection.getAccountInfo(player_league_state_account);
  if (accountInfo === null) {
    return null;
  }
  const gamePlayerInfo = PlayerLeagueState.deserialize(accountInfo.data);
  return gamePlayerInfo
}

export const getGameCategoriesInfo = async (game_categories_state_account) => {
  const accountInfo = await connection.getAccountInfo(game_categories_state_account);
  if (accountInfo === null) {
    return null;
  }
  const gameCategoriesInfo = GameCategoriesState.deserialize(accountInfo.data);
  return gameCategoriesInfo
}

export const getCollectionInfo = async (collection_info_state_account) => {
  const accountInfo = await connection.getAccountInfo(collection_info_state_account);
  if (accountInfo === null) {
    return null;
  }
  const collectionInfo = CollectionInfoState.deserialize(accountInfo.data);
  return collectionInfo
}

export const getUserInfo = async (user_info_state_account) => {
  const accountInfo = await connection.getAccountInfo(user_info_state_account);
  if (accountInfo === null) {
    return null;
  }
  const userInfo = UserInfoState.deserialize(accountInfo.data);
  return userInfo
}

export const getUserCandidateInfo = async (applicant_info_state_account) => {
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

export const findAllCompanyInfosOfUser = async (connection,user_info_state_account) => {
  try{
    const filters = [
      {
        dataSize: CompanyInfoState_SIZE
      }
    ]

    //if user_info_state_account is not null, then filter by user_info_state_account else return all company infos
    if(user_info_state_account){
      filters.push({
        memcmp:{
          offset: 2,
          bytes: user_info_state_account.toString()
        }
      })
    }

    let companyInfosOfUser = await connection.getProgramAccounts(JobsOnChain_Company_Info_ID,{
      filters
    });
    return {
      status: true,
      data:companyInfosOfUser
    }
  }catch(err){
    console.log(err)
    return {
      status: false,
      message: err
    }
  }
  
}

export const findAllJobsOfCompany = async (connection, company_info_account) => {
  try{

    const filters =[
      {
        dataSize: JobPostInfoState_SIZE
      }]

    //if company_info_account is not null, then filter by company_info_account else return all jobs
    if(company_info_account){
      filters.push({
        memcmp:{
          offset: 34,
          bytes: company_info_account.toString()
        }
      })
    }

    let allJobsOfCompany = await connection.getProgramAccounts(JobsOnChain_JobPost_Info_ID,{
        filters
    });
  
    return {
      status: true,
      data: allJobsOfCompany
    }
  }catch(err){
    console.log(err)
    return {
      status: false,
      message: err
    }
  }

}

export const findAllWorkflowOfApplicant = async (connection, applicant_info_state_account) => {
  try{

    const filters = [
      {
        dataSize: WorkflowInfoState_SIZE
      }
    ]

    //if applicant_info_state_account is not null, then filter by applicant_info_state_account else return all workflow
    if(applicant_info_state_account){
      filters.push({
        memcmp:{
          offset: 66,
          bytes: applicant_info_state_account.toString()
        }
      })
    }

    let allWorkflowOfApplicant = await connection.getProgramAccounts(JobsOnChain_Workflow_Info_ID,{
      filters
    });
  
    return {
      status: true,
      data: allWorkflowOfApplicant
    }
  }catch(err){
    console.log(err)
    return {
      status: false,
      message: err
    }
  }
}

export const findAllWorkflowOfJobPost = async (connection,jobpost_info_account) => {
  try{

    const filters = [{
      dataSize: WorkflowInfoState_SIZE
    }]

    //if jobpost_info_account is not null, then filter by jobpost_info_account else return all workflow
    if(jobpost_info_account){
      filters.push({
        memcmp:{
          offset: 98,
          bytes: jobpost_info_account.toString()
        }
      })
    }

    let allWorkflowOfJobs = await connection.getProgramAccounts(JobsOnChain_Workflow_Info_ID,{
      filters
    });
  
    return {
      status: true,
      data: allWorkflowOfJobs
    }
  }catch(err){
    console.log(err)
    return {
      status: false,
      message: err
    }
  }
}

export const getCompanyInfo = async (company_info_account, connection) => {
  let companyInfoAccountExists = await connection.getAccountInfo(company_info_account)
  if(companyInfoAccountExists === null){
    return null;
  }
  const companyStateInfo = CompanyInfoState.deserialize(companyInfoAccountExists.data);
  return companyStateInfo
}
export const getJobPostInfo = async (jobpost_info_account, connection) => {
  let jobPostExists = await connection.getAccountInfo(jobpost_info_account)
  if(jobPostExists === null){
    return null;
  }
  const jobPostInfo = JobPostInfoState.deserialize(jobPostExists.data);
  return jobPostInfo
}

export const getWorkflowInfo = async (workflow_info_account, connection) => {
  let workflowExists = await connection.getAccountInfo(workflow_info_account)
  if(workflowExists === null){
    return null;
  }
  const workflowInfo = WorkflowInfoState.deserialize(workflowExists.data);
  return workflowInfo
}


function platform_init_INSTRUCTION(amount, convenience_fee) {
  const layout = BufferLayout.struct([
    BufferLayout.u8("instruction"),
    BufferLayout.ns64("amount"),
    BufferLayout.u8("convenience_fee"),
  ])
    const data = Buffer.alloc(layout.span);
    layout.encode({instruction:0, amount, convenience_fee}, data)
    return data;
}




export const init_solgames_rewards_platform_from_admin = async (owner, amount) => {
  const convenience_fee = 3;
  const solgames_uac_state_account = new Keypair();

  const solgames_uac_pda = await PublicKey.findProgramAddress(
    [
      Buffer.from("solgames_uac_program"),
      solgames_uac_state_account.publicKey.toBuffer(),
    ],
    Solgames_UAC_ProgramID
  );
  
  console.log("solgames_uac_pda",solgames_uac_pda[0].toString());

  const ower_token_account = await getOrCreateAssociatedAccount(
    owner,
    SOLG_token_mint,
    owner
  );
  console.log("ower_token_account",ower_token_account.toString());
  const solgames_uac_pda_token_account = await getOrCreateAssociatedAccount(
    solgames_uac_pda[0],
    SOLG_token_mint,
    owner
  );

  console.log("solgames_uac_pda_token_account ", solgames_uac_pda_token_account.toBase58())
  console.log(amount, "amount");
  console.log(convenience_fee, "convenience_fee");
  const initEscrowIx = new TransactionInstruction({
    programId: Solgames_UAC_ProgramID,
    keys: [
      {
        pubkey: solgames_uac_state_account.publicKey,
        isSigner: false,
        isWritable: true,
      },
      { pubkey: owner, isSigner: true, isWritable: false },
      { pubkey: ower_token_account, isSigner: false, isWritable: true },
      { pubkey: solgames_uac_pda[0], isSigner: false, isWritable: true },

      { pubkey: solgames_uac_pda_token_account, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
      { pubkey: treasory_token_account, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    
    data: platform_init_INSTRUCTION(amount, convenience_fee),
  });

  const resultSignature = await sendTxUsingExternalSignature(
    [initEscrowIx],
    connection,
    null,
    [solgames_uac_state_account],
    new PublicKey(owner)
  );
  await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(resultSignature,'---resultSignature--')
  console.log(
    solgames_uac_state_account.publicKey.toString(),
    "*******platform account account ..."
  );
  //  //console.log(tempXTokenAccountKeypair.publicKey.toString(), "*******temp account ...");
  //  console.log("****amount =", amount);

  console.log(`INIT platform successfully initialized \n`);
};

export const init_nft_usage_tracker_program = async (owner) => {  
  const nft_mint_owner = owner;
  
  const nft_mint_key = new PublicKey(nft_mint_key_string);

  const candy_machine_key = nft_mint_key //this is just for testing, TODO: fetch the candy machine id from solana rpc of the nft_mint_key

  const solgames_uac_state_account = platform_state_account;


  console.log("nft_mint_key  => ",nft_mint_key.toBase58());

  //This address will also act as PDA for the user/nft_mint_owner
  const solgames_user_nft_state_account = await PublicKey.findProgramAddress(
    [
      Buffer.from("solgames_user_nft_state"),
      nft_mint_owner.toBuffer(),
      nft_mint_key.toBuffer(),
      solgames_uac_state_account.toBuffer()
    ],
    Solgames_UAC_ProgramID
  );
  console.log("solgames_user_nft_state_account  => ",solgames_user_nft_state_account[0].toBase58());

  const solgames_uac_pda = await PublicKey.findProgramAddress(
    [
      Buffer.from("solgames_uac_program"),
      solgames_uac_state_account.toBuffer(),
    ],
    Solgames_UAC_ProgramID
  );
  console.log("solgames_uac_pda",solgames_uac_pda[0].toString());

  const solgames_user_nft_state_account_pda_token_account = await getOrCreateAssociatedAccount(
    solgames_user_nft_state_account[0],
    SOLG_token_mint,
    owner
  );

  console.log('--solgames_user_nft_state_account_pda_token_account--', solgames_user_nft_state_account_pda_token_account.toBase58())

  

  const solgames_uac_pda_token_account = await getOrCreateAssociatedAccount(
    solgames_uac_pda[0],
    SOLG_token_mint,
    owner
  );

  console.log('---solgames_uac_pda_token_account---', solgames_uac_pda_token_account.toBase58())

  const init_nft_usage_tracker_account = new TransactionInstruction({
    programId: Solgames_UAC_ProgramID,
    keys: [
      { pubkey: nft_mint_owner,isSigner: true,isWritable: false},
      { pubkey: nft_mint_key, isSigner: false, isWritable: true },
      { pubkey: solgames_user_nft_state_account[0], isSigner: false, isWritable: true },
      { pubkey: solgames_user_nft_state_account_pda_token_account, isSigner: false, isWritable: true },
      { pubkey: solgames_uac_state_account, isSigner: false, isWritable: true },
      { pubkey: solgames_uac_pda[0], isSigner: false, isWritable: true },
      { pubkey: solgames_uac_pda_token_account, isSigner: false, isWritable: true },
      { pubkey: candy_machine_key, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    data: Buffer.from(Uint8Array.of(1
      ))
  });
  
  await sendTxUsingExternalSignature(
    [init_nft_usage_tracker_account],
    connection,
    null,
    [],
    new PublicKey(nft_mint_owner)
  );
  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log(
    solgames_user_nft_state_account[0].toString(),
    "*******user account account ..."
  );
  console.log(`INIT user account successfully initialized \n`);
};
export const recharge_nft = async (owner, amount) => {
  const recharge_amount = amount;
  const solgames_uac_state_account = platform_state_account;
  
  const nft_mint_owner = owner;
  
  const nft_mint_key = new PublicKey(nft_mint_key_string)

  const user_solg_token_account = await getOrCreateAssociatedAccount(
    owner,
    SOLG_token_mint,
    owner
  );
  //This address will also act as PDA for the user/nft_mint_owner
  const solgames_user_nft_state_account = await PublicKey.findProgramAddress(
    [
      Buffer.from("solgames_user_nft_state"),
      nft_mint_owner.toBuffer(),
      nft_mint_key.toBuffer(),
      solgames_uac_state_account.toBuffer()
    ],
    Solgames_UAC_ProgramID
  );

  const solgames_user_nft_state_account_pda_token_account = await getOrCreateAssociatedAccount(
    solgames_user_nft_state_account[0],
    SOLG_token_mint,
    owner
  );  

  const solgames_uac_pda = await PublicKey.findProgramAddress(
    [
      Buffer.from("solgames_uac_program"),
      solgames_uac_state_account.toBuffer(),
    ],
    Solgames_UAC_ProgramID
  );

  const solgames_uac_pda_token_account = await getOrCreateAssociatedAccount(
    solgames_uac_pda[0],
    SOLG_token_mint,
    owner
  );

  const init_nft_usage_tracker_account = new TransactionInstruction({
    programId: Solgames_UAC_ProgramID,
    keys: [
      { pubkey: nft_mint_owner,isSigner: true,isWritable: false},
      { pubkey: nft_mint_key, isSigner: false, isWritable: true },
      { pubkey: solgames_user_nft_state_account[0], isSigner: false, isWritable: true },
      { pubkey: solgames_user_nft_state_account_pda_token_account, isSigner: false, isWritable: true },
      { pubkey: user_solg_token_account, isSigner: false, isWritable: true },
      { pubkey: solgames_uac_state_account, isSigner: false, isWritable: true },
      { pubkey: solgames_uac_pda[0], isSigner: false, isWritable: true },
      { pubkey: solgames_uac_pda_token_account, isSigner: false, isWritable: true },
      { pubkey: treasory_token_account, isSigner: false, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    data: Buffer.from(Uint8Array.of(2,
      ...new BN(recharge_amount).toArray("le", 8),
      ))
  });
  // return
  await sendTxUsingExternalSignature(
    [init_nft_usage_tracker_account],
    connection,
    null,
    [],
    new PublicKey(owner)
  );
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const userNFTStateInfo = await getUserNFTStateInfo(solgames_user_nft_state_account[0]);
  console.log("userNFTStateInfo =>", userNFTStateInfo);
  try{
    const userNFTPDATokenBalance = await connection.getTokenAccountBalance(solgames_user_nft_state_account_pda_token_account);
    console.log("userNFTPDATokenBalance =>", userNFTPDATokenBalance.value.uiAmount);
  }catch(err){
    console.log("Not a valid token account or generic error");
    console.log(err)
  }
  };

export const save_new_game_info = async (owner, amount) => {
  const game_fee = amount;
  
  const game_owner = owner;
  
  const game_nft_key_publickey = new PublicKey(game_nft_key);
  const ACCOUNT_SEED = game_nft_key_publickey.toString().slice(0, 32);

  //This address will also act as PDA for the user/game_owner
  const game_info_account = await PublicKey.createWithSeed(game_owner,ACCOUNT_SEED,Game_Info_ProgramID);
  const game_info_account_exist = await connection.getAccountInfo(game_info_account);
  console.log(game_info_account_exist,'--game_info_account_exist--')
  if(game_info_account_exist != null){
    const gameInfoPlatformInfo = await getGameInfoPlatformInfo(game_info_account);
    console.log("gameInfoPlatformInfo => ", gameInfoPlatformInfo);
    alert("Game info account already exist")
    return
  }

  const new_game_info = new TransactionInstruction({
    programId: Game_Info_ProgramID,
    keys: [
      { pubkey: game_owner,isSigner: true,isWritable: false},
      { pubkey: game_nft_key_publickey, isSigner: false, isWritable: true },
      { pubkey: game_info_account, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
    ],
    data: Buffer.from(Uint8Array.of(0,
      ...new BN(game_fee).toArray("le", 8),
      ))
  });
  // return
  await sendTxUsingExternalSignature(
    [new_game_info],
    connection,
    null,
    [],
    new PublicKey(owner)
  );
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const gameInfoPlatformInfo = await getGameInfoPlatformInfo(game_info_account);
  console.log("gameInfoPlatformInfo => ", gameInfoPlatformInfo);
}

export const update_game_info = async (owner, amount) => {
  const game_fee = amount;
  
  const game_owner = owner;
  
  const game_nft_key_publickey = new PublicKey(game_nft_key);
  const ACCOUNT_SEED = game_nft_key_publickey.toString().slice(0, 32);

  //This address will also act as PDA for the user/game_owner
  const game_info_account = await PublicKey.createWithSeed(game_owner,ACCOUNT_SEED,Game_Info_ProgramID);
  const game_info_account_exist = await connection.getAccountInfo(game_info_account);
  if(game_info_account_exist === null){
    alert("Game info account not found")
    return
  }
  console.log("game info account  => ",game_info_account.toBase58());

  const update_game_info = new TransactionInstruction({
    programId: Game_Info_ProgramID,
    keys: [
      { pubkey: game_owner,isSigner: true,isWritable: false},
      { pubkey: game_nft_key_publickey, isSigner: false, isWritable: true },
      { pubkey: game_info_account, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
    ],
    data: Buffer.from(Uint8Array.of(2,
      ...new BN(game_fee).toArray("le", 8),
      ))
  });
  // return
  await sendTxUsingExternalSignature(
    [update_game_info],
    connection,
    null,
    [],
    new PublicKey(owner)
  );
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const gameInfoPlatformInfo = await getGameInfoPlatformInfo(game_info_account);
  console.log("gameInfoPlatformInfo => ", gameInfoPlatformInfo);
}

export const add_categories_of_game = async (owner) => {
  const game_nft_key_publickey = new PublicKey(game_nft_key);
  const game_category_state_account = await PublicKey.findProgramAddress(
    [
      Buffer.from("game_categories_account"),
      game_nft_key_publickey.toBuffer(),
    ],
    Game_Categories_ID
  );
  console.log(" game_category_state_account => ", game_category_state_account[0].toBase58())

  // const game_info_account_exist = await connection.getAccountInfo(game_info_account);
  // if(game_info_account_exist === null){
  //   alert("Game info account not found")
  //   return
  // }
  // console.log("game info account  => ",game_info_account.toBase58());

  const categories = {
    "any_category_game": 0,
    "platform_game": 0,
    "shooter_game": 1,
    "fighting_game": 1,
    "stealth_game": 1,
    "rhythm_game": 1,
    "battle_royale_game": 1,
    "action_adventure_game": 1,
    "survival_horror_game": 1,
    "text_adventure_game": 1,
    "graphic_adventure_game": 1,
    "visual_novel_game": 1,
    "interactive_movie_game": 1,
    "adventure_3d_game": 1,
    "puzzle_game": 1,
    "reveal_the_picture_game": 1,
    "rpg_game": 1,
    "action_rpg_game": 1,
    "tactical_rpg_game": 1,
    "simulation_game": 1,
    "life_simulation_game": 1,
    "vehicle_simulation_game": 1,
    "strategy_game": 1,
    "sports_game": 1,
    "car_racing_game": 1,
    "bike_racing_game": 1,
    "aeroplane_racing_game": 1,
    "boat_racing_game": 1,
    "board_game": 1,
    "horror_game": 1,
    "party_game": 1,
    "trivia_game": 1,
    "typing_game": 1,
    "art_game": 1,
    "casual_game": 1,
    "fitness_game": 1,
    "education_game": 1,
    "adventure_game": 1,
    "sandbox": 1,
    "creative": 1,
    "open_world": 1,
    "scientific_game": 1
  }

  console.log(new TextEncoder().encode(categories.name),'---new TextEncoder().encode(categories.name)--')

  const add_game_category = new TransactionInstruction({
    programId: Game_Categories_ID,
    keys: [
      { pubkey: owner,isSigner: true,isWritable: false},
      { pubkey: game_category_state_account[0], isSigner: false, isWritable: true },
      { pubkey: game_nft_key_publickey, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
    ],
    data: Buffer.from(Uint8Array.of(0,
        categories.any_category_game,
        categories.platform_game,
        categories.shooter_game,
        categories.fighting_game,
        categories.stealth_game,
        categories.rhythm_game,
        categories.battle_royale_game,
        categories.action_adventure_game,
        categories.survival_horror_game,
        categories.text_adventure_game,
        categories.graphic_adventure_game,
        categories.visual_novel_game,
        categories.interactive_movie_game,
        categories.adventure_3d_game,
        categories.puzzle_game,
        categories.reveal_the_picture_game,
        categories.rpg_game,
        categories.action_rpg_game,
        categories.tactical_rpg_game,
        categories.simulation_game,
        categories.life_simulation_game,
        categories.vehicle_simulation_game,
        categories.strategy_game,
        categories.sports_game,
        categories.car_racing_game,
        categories.bike_racing_game,
        categories.aeroplane_racing_game,
        categories.boat_racing_game,
        categories.board_game,
        categories.horror_game,
        categories.party_game,
        categories.trivia_game,
        categories.typing_game,
        categories.art_game,
        categories.casual_game,
        categories.fitness_game,
        categories.education_game,
        categories.adventure_game,
        categories.sandbox,
        categories.creative,
        categories.open_world,
        categories.scientific_game
      ))
  });
  // return
  await sendTxUsingExternalSignature(
    [add_game_category],
    connection,
    null,
    [],
    new PublicKey(owner)
  );
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const gameCategoryInfo = await getGameCategoriesInfo(game_category_state_account[0]);
  console.log("gameCategoryInfo => ", gameCategoryInfo);
}

export const update_categories_of_game = async (owner) => {
  const game_nft_key_publickey = new PublicKey(game_nft_key);
  const game_category_state_account = await PublicKey.findProgramAddress(
    [
      Buffer.from("game_categories_account"),
      game_nft_key_publickey.toBuffer(),
    ],
    Game_Categories_ID
  );
  console.log(" game_category_state_account => ", game_category_state_account[0].toBase58())

  // const game_info_account_exist = await connection.getAccountInfo(game_info_account);
  // if(game_info_account_exist === null){
  //   alert("Game info account not found")
  //   return
  // }
  // console.log("game info account  => ",game_info_account.toBase58());

  const categories = {
    "any_category_game": 1,
    "platform_game": 1,
    "shooter_game": 1,
    "fighting_game": 1,
    "stealth_game": 1,
    "rhythm_game": 1,
    "battle_royale_game": 1,
    "action_adventure_game": 1,
    "survival_horror_game": 1,
    "text_adventure_game": 1,
    "graphic_adventure_game": 1,
    "visual_novel_game": 1,
    "interactive_movie_game": 1,
    "adventure_3d_game": 1,
    "puzzle_game": 1,
    "reveal_the_picture_game": 1,
    "rpg_game": 1,
    "action_rpg_game": 1,
    "tactical_rpg_game": 1,
    "simulation_game": 1,
    "life_simulation_game": 1,
    "vehicle_simulation_game": 1,
    "strategy_game": 1,
    "sports_game": 1,
    "car_racing_game": 1,
    "bike_racing_game": 1,
    "aeroplane_racing_game": 1,
    "boat_racing_game": 1,
    "board_game": 1,
    "horror_game": 1,
    "party_game": 1,
    "trivia_game": 1,
    "typing_game": 1,
    "art_game": 1,
    "casual_game": 1,
    "fitness_game": 1,
    "education_game": 1,
    "adventure_game": 1,
    "sandbox": 1,
    "creative": 1,
    "open_world": 1,
    "scientific_game": 1
  }

  const update_game_category = new TransactionInstruction({
    programId: Game_Categories_ID,
    keys: [
      { pubkey: owner,isSigner: true,isWritable: false},
      { pubkey: game_category_state_account[0], isSigner: false, isWritable: true },
      { pubkey: game_nft_key_publickey, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
    ],
    data: Buffer.from(Uint8Array.of(1,
        categories.any_category_game,
        categories.platform_game,
        categories.shooter_game,
        categories.fighting_game,
        categories.stealth_game,
        categories.rhythm_game,
        categories.battle_royale_game,
        categories.action_adventure_game,
        categories.survival_horror_game,
        categories.text_adventure_game,
        categories.graphic_adventure_game,
        categories.visual_novel_game,
        categories.interactive_movie_game,
        categories.adventure_3d_game,
        categories.puzzle_game,
        categories.reveal_the_picture_game,
        categories.rpg_game,
        categories.action_rpg_game,
        categories.tactical_rpg_game,
        categories.simulation_game,
        categories.life_simulation_game,
        categories.vehicle_simulation_game,
        categories.strategy_game,
        categories.sports_game,
        categories.car_racing_game,
        categories.bike_racing_game,
        categories.aeroplane_racing_game,
        categories.boat_racing_game,
        categories.board_game,
        categories.horror_game,
        categories.party_game,
        categories.trivia_game,
        categories.typing_game,
        categories.art_game,
        categories.casual_game,
        categories.fitness_game,
        categories.education_game,
        categories.adventure_game,
        categories.sandbox,
        categories.creative,
        categories.open_world,
        categories.scientific_game
      ))
  });
  // return
  await sendTxUsingExternalSignature(
    [update_game_category],
    connection,
    null,
    [],
    new PublicKey(owner)
  );
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const gameCategoryInfo = await getGameCategoriesInfo(game_category_state_account[0]);
  console.log("gameCategoryInfo => ", gameCategoryInfo);
}

export const create_game_daily_league_cpi = async (owner) => {
  
  const solgames_uac_state_account = platform_state_account;

  const daily_league_platform_state_account = await PublicKey.findProgramAddress(
    [
      Buffer.from("daily_league_program"),
      Buffer.from(LEAGUE_ID.toString()),
      game_info_state_account.toBuffer(),
    ],
    Solgames_UAC_ProgramID
  );
  console.log('daily_league_platform_state_account ', daily_league_platform_state_account[0].toBase58());

  const daily_league_pda_token_account = await getOrCreateAssociatedAccount(
    daily_league_platform_state_account[0],
    SOLG_token_mint,
    owner
  );
  console.log('daily_league_pda_token_account ', daily_league_pda_token_account.toBase58());

  const createDailyLeagueViaCPI = new TransactionInstruction({
    programId: Solgames_UAC_ProgramID,
    keys: [
      { pubkey: owner, isSigner: true, isWritable: true },
      {
        pubkey: solgames_uac_state_account,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: daily_league_platform_state_account[0],
        isSigner: false,
        isWritable: true,
      },
      { pubkey: daily_league_pda_token_account, isSigner: false, isWritable: true },
      { pubkey: Daily_Game_League_ProgramID, isSigner: false, isWritable: false },
      {
        pubkey: game_info_state_account,
        isSigner: false,
        isWritable: true,
      },

      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    
    data: Buffer.from(Uint8Array.of(3,
      ...new BN(LEAGUE_ID).toArray("le", 8),
      )),
  });

  await sendTxUsingExternalSignature(
    [createDailyLeagueViaCPI],
    connection,
    null,
    [],
    new PublicKey(owner)
  );
  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log(`CPI Daily League platform successfully initialized \n`);
  const gameLeagueInfoAfter = await getGameLeagueInfo(daily_league_platform_state_account[0]);
  console.log("gameLeagueInfoAfter =>", gameLeagueInfoAfter);
}
export const create_game_daily_league = async (owner) => {
  const daily_league_platform_state_account = new Keypair();

  const daily_league_pda = await PublicKey.findProgramAddress(
    [
      Buffer.from("daily_league_program"),
      Buffer.from(LEAGUE_ID.toString()),
      game_info_state_account.toBuffer(),
      daily_league_platform_state_account.publicKey.toBuffer(),
    ],
    Daily_Game_League_ProgramID
  );
  console.log('daily_league_platform_state_account ', daily_league_platform_state_account.publicKey.toBase58());
  console.log("daily_league_pda",daily_league_pda[0].toString());

  const daily_league_pda_token_account = await getOrCreateAssociatedAccount(
    daily_league_pda[0],
    SOLG_token_mint,
    owner
  );

  // console.log("solgames_uac_pda_token_account ", solgames_uac_pda_token_account.toBase58())
  console.log("LEAGUE_ID => ", LEAGUE_ID);
  const dailyLeagueProgram = new TransactionInstruction({
    programId: Daily_Game_League_ProgramID,
    keys: [
      { pubkey: owner, isSigner: true, isWritable: true },
      {
        pubkey: daily_league_platform_state_account.publicKey,
        isSigner: false,
        isWritable: true,
      },
      { pubkey: daily_league_pda[0], isSigner: false, isWritable: true },
      { pubkey: daily_league_pda_token_account, isSigner: false, isWritable: true },
      {
        pubkey: game_info_state_account,
        isSigner: false,
        isWritable: true,
      },

      { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
    ],
    
    data: Buffer.from(Uint8Array.of(0,
      ...new BN(LEAGUE_ID).toArray("le", 8),
      )),
  });

  await sendTxUsingExternalSignature(
    [dailyLeagueProgram],
    connection,
    null,
    [daily_league_platform_state_account],
    new PublicKey(owner)
  );
  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log(`Daily League platform successfully created \n`);
}

export const update_game_daily_league = async (owner) => {
  const players_joined = 200;
  const players_competed = 100;
  const reward_to_winners = 40000*Math.pow(10,9);
  const rewards_to_developer = 10000*Math.pow(10,9);
  const rewards_to_platform = 800*Math.pow(10,9);
  const daily_league_pda = await PublicKey.findProgramAddress(
    [
      Buffer.from("daily_league_program"),
      Buffer.from(LEAGUE_ID),
      game_info_state_account.toBuffer(),
      daily_league_platform_state_account.toBuffer(),
    ],
    Daily_Game_League_ProgramID
  );
  console.log('daily_league_platform_state_account ', daily_league_platform_state_account.toBase58());
  console.log("daily_league_pda",daily_league_pda[0].toString());

  // console.log("solgames_uac_pda_token_account ", solgames_uac_pda_token_account.toBase58())
  console.log("LEAGUE_ID => ", LEAGUE_ID);
  const updateDailyLeagueProgram = new TransactionInstruction({
    programId: Daily_Game_League_ProgramID,
    keys: [
      { pubkey: owner, isSigner: true, isWritable: true },
      {
        pubkey: daily_league_platform_state_account,
        isSigner: false,
        isWritable: true,
      }
    ],
    
    data: Buffer.from(Uint8Array.of(1,
      ...new BN(players_joined).toArray("le", 8),
      ...new BN(players_competed).toArray("le", 8),
      ...new BN(reward_to_winners).toArray("le", 8),
      ...new BN(rewards_to_developer).toArray("le", 8),
      ...new BN(rewards_to_platform).toArray("le", 8),
      )),
  });

  await sendTxUsingExternalSignature(
    [updateDailyLeagueProgram],
    connection,
    null,
    [],
    new PublicKey(owner)
  );
  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log(`Updated: Daily League platform successfully \n`);
}

export const update_game_daily_league_cpi = async (owner) => {
  const players_joined = 200;
  const players_competed = 100;
  const reward_to_winners = 40000*Math.pow(10,9);
  const rewards_to_developer = 10000*Math.pow(10,9);
  const rewards_to_platform = 800*Math.pow(10,9);
  const solgames_uac_state_account = platform_state_account;
  const updateDailyLeagueProgram = new TransactionInstruction({
    programId: Solgames_UAC_ProgramID,
    keys: [
      { pubkey: owner, isSigner: true, isWritable: true },
      {
        pubkey: solgames_uac_state_account,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: daily_league_platform_state_account,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: Daily_Game_League_ProgramID,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: game_info_state_account,
        isSigner: false,
        isWritable: false,
      }
    ],
    
    data: Buffer.from(Uint8Array.of(8,
      ...new BN(players_joined).toArray("le", 8),
      ...new BN(players_competed).toArray("le", 8),
      ...new BN(reward_to_winners).toArray("le", 8),
      ...new BN(rewards_to_developer).toArray("le", 8),
      ...new BN(rewards_to_platform).toArray("le", 8),
      )),
  });

  await sendTxUsingExternalSignature(
    [updateDailyLeagueProgram],
    connection,
    null,
    [],
    new PublicKey(owner)
  );
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const gameLeagueInfo = await getGameLeagueInfo(daily_league_platform_state_account);
  console.log("gameLeagueInfo =>", gameLeagueInfo);


  console.log(`Updated: Daily League platform successfully \n`);
}

export const compete_daily_player_league_state = async(owner, score) =>{

  const player_pda_seed = "player_league_state"
   //it is also a PDA for the player account
   const player_state_account = await PublicKey.findProgramAddress(
    [
      Buffer.from(player_pda_seed),
      daily_league_platform_state_account.toBuffer(),
      owner.toBuffer(),
    ],
    Daily_Game_League_ProgramID 
  );

  console.log("player_state_account", player_state_account[0].toString())
  
  const updatePlayerLeagueState = new TransactionInstruction({
    programId: Daily_Game_League_ProgramID,
    keys: [
      { pubkey: owner, isSigner: true, isWritable: true },
      { pubkey: player_state_account[0], isSigner: false, isWritable: true },
      { pubkey: daily_league_platform_state_account, isSigner: false, isWritable: false }
    ],
    
    data: Buffer.from(Uint8Array.of(3,
      ...new BN(score).toArray("le", 8),
      )),
  });

  await sendTxUsingExternalSignature(
    [updatePlayerLeagueState],
    connection,
    null,
    [],
    new PublicKey(owner)
  );
  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log(`Updated: Player Daily League platform successfully \n`);
}

export const init_daily_player_league_state_cpi = async(owner) =>{
  const nft_mint_owner = owner;
  const nft_mint_key = new PublicKey(nft_mint_key_string)
  const solgames_uac_state_account = platform_state_account;

  const solgames_user_nft_state_account = await PublicKey.findProgramAddress(
    [
      Buffer.from("solgames_user_nft_state"),
      nft_mint_owner.toBuffer(),
      nft_mint_key.toBuffer(),
      solgames_uac_state_account.toBuffer()
    ],
    Solgames_UAC_ProgramID
  );

  const player_pda_seed = "player_league_state"
   //it is also a PDA for the player account
   const player_league_state_account = await PublicKey.findProgramAddress(
    [
      Buffer.from(player_pda_seed),
      daily_league_platform_state_account.toBuffer(),
      solgames_user_nft_state_account[0].toBuffer()
    ],
    Solgames_UAC_ProgramID 
  );

  console.log("player_league_state_account", player_league_state_account[0].toString());
  console.log("daily_league_platform_state_account ",daily_league_platform_state_account.toString());

  const playGameState = new TransactionInstruction({
    programId: Solgames_UAC_ProgramID,
    keys: [
      { pubkey: nft_mint_owner, isSigner: true, isWritable: true},
      { pubkey: nft_mint_key, isSigner: false, isWritable: true },
      { pubkey: solgames_uac_state_account, isSigner: false, isWritable: true },
      { pubkey: solgames_user_nft_state_account[0], isSigner: false, isWritable: true },
      // { pubkey: solgames_user_nft_state_account_pda_token_account, isSigner: false, isWritable: true },
      // { pubkey: candy_machine_key, isSigner: false, isWritable: true },
      { pubkey: player_league_state_account[0], isSigner: false, isWritable: true },
      { pubkey: daily_league_platform_state_account, isSigner: false, isWritable: true },
      { pubkey: Daily_Game_League_ProgramID, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    
    data: Buffer.from(Uint8Array.of(4)),
  });

  await sendTxUsingExternalSignature(
    [playGameState],
    connection,
    null,
    [],
    new PublicKey(owner)
  );
  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log(`Initiated: Player Daily League platform successfully => `, player_league_state_account[0]);
  const playerLeagueInfo = await getGamePlayerInfo(player_league_state_account[0]);
  console.log("playerLeagueInfo =>", playerLeagueInfo);
}


export const compete_daily_player_league_state_cpi = async(owner) =>{
  const nft_mint_owner = owner;
  
  const nft_mint_key = new PublicKey(nft_mint_key_string)

  const solgames_uac_state_account = platform_state_account;

  /*
   * Find nft_mint_owner and nft_mint_key from the player_league_state_account 
   */

  const solgames_user_nft_state_account = await PublicKey.findProgramAddress(
    [
      Buffer.from("solgames_user_nft_state"),
      nft_mint_owner.toBuffer(), //find from the player_league_state_account 
      nft_mint_key.toBuffer(), //find from the player_league_state_account 
      solgames_uac_state_account.toBuffer()
    ],
    Solgames_UAC_ProgramID
  );

  const solgames_user_nft_state_account_pda_token_account = await getOrCreateAssociatedAccount(
    solgames_user_nft_state_account[0],
    SOLG_token_mint,
    owner
  );

  console.log("solgames_user_nft_state_account_pda_token_account =>", solgames_user_nft_state_account_pda_token_account.toBase58())

  const player_pda_seed = "player_league_state"
   //it is also a PDA for the player account
  const player_league_state_account = await PublicKey.findProgramAddress(
    [
      Buffer.from(player_pda_seed),
      daily_league_platform_state_account.toBuffer(),
      solgames_user_nft_state_account[0].toBuffer()
    ],
    Solgames_UAC_ProgramID 
  );

  const player_league_state_account_token_account = await getOrCreateAssociatedAccount(
    player_league_state_account[0],
    SOLG_token_mint,
    owner
  )

  const league_platform_data = await getGameLeagueInfo(daily_league_platform_state_account);
  console.log("league_platform_data =>", league_platform_data.game_league_pda_token_account_pubkey.toString())
  const game_league_pda_token_account_pubkey = league_platform_data.game_league_pda_token_account_pubkey
  // console.log("solgames_uac_pda_token_account ", solgames_uac_pda_token_account.toBase58())
  const competeGameLeague = new TransactionInstruction({
    programId: Solgames_UAC_ProgramID,
    keys: [
      { pubkey: nft_mint_owner, isSigner: true, isWritable: true},
      { pubkey: nft_mint_key, isSigner: false, isWritable: true },
      { pubkey: solgames_uac_state_account, isSigner: false, isWritable: true },
      { pubkey: solgames_user_nft_state_account[0], isSigner: false, isWritable: true },
      { pubkey: solgames_user_nft_state_account_pda_token_account, isSigner: false, isWritable: true },
      { pubkey: player_league_state_account[0], isSigner: false, isWritable: true },
      { pubkey: player_league_state_account_token_account, isSigner: false, isWritable: true },
      { pubkey: daily_league_platform_state_account, isSigner: false, isWritable: true },
      { pubkey: new PublicKey(game_league_pda_token_account_pubkey), isSigner: false, isWritable: true },
      { pubkey: Daily_Game_League_ProgramID, isSigner: false, isWritable: false },
      { pubkey: SOLG_token_mint, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      // { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    
    data: Buffer.from(Uint8Array.of(6
      )),
  });

  await sendTxUsingExternalSignature(
    [competeGameLeague],
    connection,
    null,
    [],
    new PublicKey(owner)
  );
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const playerLeagueInfo = await getGamePlayerInfo(player_league_state_account[0]);
  console.log("playerLeagueInfo =>", playerLeagueInfo);

  const userNFTInfo = await getUserNFTStateInfo(solgames_user_nft_state_account[0]);
  console.log("userNFTInfo =>", userNFTInfo);
}

export const claim_daily_player_league_reward_cpi = async(owner) =>{
  const nft_mint_owner = owner;
  
  const nft_mint_key = new PublicKey(nft_mint_key_string)

  const user_solg_token_account = await getOrCreateAssociatedAccount(
    new PublicKey(owner),
    SOLG_token_mint,
    owner
    )
 console.log(user_solg_token_account.toBase58())
 return
 const solgames_uac_state_account = platform_state_account;

  /*
   * Find nft_mint_owner and nft_mint_key from the player_league_state_account 
   */

  const solgames_user_nft_state_account = await PublicKey.findProgramAddress(
    [
      Buffer.from("solgames_user_nft_state"),
      nft_mint_owner.toBuffer(), //find from the player_league_state_account 
      nft_mint_key.toBuffer(), //find from the player_league_state_account 
      solgames_uac_state_account.toBuffer()
    ],
    Solgames_UAC_ProgramID
  );

  const solgames_user_nft_state_account_pda_token_account = await getOrCreateAssociatedAccount(
    solgames_user_nft_state_account[0],
    SOLG_token_mint,
    owner
  );

  console.log("solgames_user_nft_state_account_pda_token_account =>", solgames_user_nft_state_account_pda_token_account.toBase58())

  const player_pda_seed = "player_league_state"
   //it is also a PDA for the player account
  const player_league_state_account = await PublicKey.findProgramAddress(
    [
      Buffer.from(player_pda_seed),
      daily_league_platform_state_account.toBuffer(),
      solgames_user_nft_state_account[0].toBuffer()
    ],
    Solgames_UAC_ProgramID 
  );

  const player_league_state_account_token_account = await getOrCreateAssociatedAccount(
    player_league_state_account[0],
    SOLG_token_mint,
    owner
  )

  const league_platform_data = await getGameLeagueInfo(daily_league_platform_state_account);
  console.log("league_platform_data =>", league_platform_data.game_league_pda_token_account_pubkey.toString())
  const game_league_pda_token_account_pubkey = league_platform_data.game_league_pda_token_account_pubkey
  // console.log("solgames_uac_pda_token_account ", solgames_uac_pda_token_account.toBase58())
  const competeGameLeague = new TransactionInstruction({
    programId: Solgames_UAC_ProgramID,
    keys: [
      { pubkey: nft_mint_owner, isSigner: true, isWritable: true},
      { pubkey: nft_mint_key, isSigner: false, isWritable: true },
      { pubkey: user_solg_token_account, isSigner: false, isWritable: true },
      { pubkey: solgames_uac_state_account, isSigner: false, isWritable: true },
      { pubkey: solgames_user_nft_state_account[0], isSigner: false, isWritable: true },
      { pubkey: player_league_state_account[0], isSigner: false, isWritable: true },
      { pubkey: player_league_state_account_token_account, isSigner: false, isWritable: true },
      { pubkey: daily_league_platform_state_account, isSigner: false, isWritable: true },
      { pubkey: Daily_Game_League_ProgramID, isSigner: false, isWritable: false },
      { pubkey: SOLG_token_mint, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      // { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    
    data: Buffer.from(Uint8Array.of(7
      )),
  });

  await sendTxUsingExternalSignature(
    [competeGameLeague],
    connection,
    null,
    [],
    new PublicKey(owner)
  );
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const playerLeagueInfo = await getGamePlayerInfo(player_league_state_account[0]);
  console.log("playerLeagueInfo =>", playerLeagueInfo);

  const userNFTInfo = await getUserNFTStateInfo(solgames_user_nft_state_account[0]);
  console.log("userNFTInfo =>", userNFTInfo);
}


export const update_daily_player_league_state_score_cpi = async(owner) =>{
  const score = 800.99*Math.pow(10,9)
  
  const solgames_uac_state_account = platform_state_account;


  /*
   * Find nft_mint_owner and nft_mint_key from the (player_league_state_account => will be fetched from the url)
   */
  const player_state_account_hardcoded = new PublicKey("EKPfTcPQ6ykM1CHbqWc1oqsBLfc5X54b9fZ5kTSLx7Ty"); //(player_league_state_account => will be fetched from the url)
  if(player_state_account_hardcoded == null){
    console.log("player_state_account_hardcoded is null")
    alert("No player_state_account_hardcoded found")
    return
  }
  const player_league_state_account = player_state_account_hardcoded
  const playerStateInfo = await getGamePlayerInfo(player_state_account_hardcoded);
  const nft_mint_owner = playerStateInfo.nft_mint_owner;
  const nft_mint_key = playerStateInfo.nft_mint_key;
  
  const solgames_user_nft_state_account = await PublicKey.findProgramAddress(
    [
      Buffer.from("solgames_user_nft_state"),
      nft_mint_owner.toBuffer(), //find from the player_league_state_account 
      nft_mint_key.toBuffer(), //find from the player_league_state_account 
      solgames_uac_state_account.toBuffer()
    ],
    Solgames_UAC_ProgramID
  );
  console.log("solgames_user_nft_state_account ",solgames_user_nft_state_account[0].toBase58())
  
  const league_platform_data = await getGameLeagueInfo(daily_league_platform_state_account);
  console.log("league_platform_data =>", league_platform_data.game_league_pda_token_account_pubkey.toString())
  // console.log("solgames_uac_pda_token_account ", solgames_uac_pda_token_account.toBase58())
  const competeGameLeague = new TransactionInstruction({
    programId: Solgames_UAC_ProgramID,
    keys: [
      { pubkey: owner, isSigner: true, isWritable: true},
      { pubkey: solgames_uac_state_account, isSigner: false, isWritable: true },
      { pubkey: solgames_user_nft_state_account[0], isSigner: false, isWritable: true },
      { pubkey: player_league_state_account, isSigner: false, isWritable: true },
      { pubkey: daily_league_platform_state_account, isSigner: false, isWritable: true },
      { pubkey: Daily_Game_League_ProgramID, isSigner: false, isWritable: false },
    ],
    
    data: Buffer.from(Uint8Array.of(5,
      ...new BN(score).toArray("le", 16),
      )),
  });

  await sendTxUsingExternalSignature(
    [competeGameLeague],
    connection,
    null,
    [],
    new PublicKey(owner)
  );
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const playerLeagueInfo = await getGamePlayerInfo(player_league_state_account);
  console.log("playerLeagueInfo =>", playerLeagueInfo);

}

export const reward_to_winner = async(owner) =>{
  const LEAGUE_POSITION = 900
  const WINNER_REWARD = 10*Math.pow(10,9)

  /*
   * game_info_state_account -> will be fetched for each game
    * so we can find all the game_info_state_account for a particular game
    * const game_info_accounts = await connection.getParsedProgramAccounts(Game_Info_ProgramID)
    * console.log("game_info_accounts =>", game_info_accounts)  
   */

  /* 
   * daily_league_platform_state_account -> will be generated for each game_info_state_account using the below combination
   Buffer.from("daily_league_program"),
      Buffer.from(LEAGUE_ID.toString()),
      game_info_state_account.toBuffer(),
  */

/* Fetch all the player_league_state_account for the each leagues
 * const player_league_state_accounts = await connection.getParsedProgramAccounts(Daily_Game_League_ProgramID,{
  filters: [
    {
      dataSize: 130, // number of bytes i.e. total size of PlayerLeagueState struct
    },
    {
      memcmp: {
        offset: 1, // number of bytes
        bytes: new PublicKey("GUabFeNoQuBPbSKqPg9MbzsutjycytnutFLVg6Z2Px8w"), // base58 encoded string of daily_league_platform_state_account
      },
    },
  ],
})
 */
/*
 * 1. Fetch the top players based on the number of participants i.e player_league_state_account with is_compete = true
 * 2. Find the league position based on the sorting on the score for the players competed from step 1
 * 3. Run the algorithm to find the reward for the winner -> most probably it will be a probability based algorithm or arithmetic progression
 * 4. Keep track of league position and reward for each player
 * 5.  For each player_league_state_account parse the below items 
   * 1. nft_mint_owner
   * 2. nft_mint_key
   * 3. player_league_state_token_account
*/

  const nft_mint_owner = new PublicKey("GUabFeNoQuBPbSKqPg9MbzsutjycytnutFLVg6Z2Px8w"); //will fetch from the player_league_state_account
  
  const nft_mint_key = new PublicKey(nft_mint_key_string) //will fetch from the player_league_state_account

  const solgames_uac_state_account = platform_state_account; //will fetch from the saved addresses

  /* Fetching solgames_user_nft_staet_account based on the above parsed info */
  const solgames_user_nft_state_account = await PublicKey.findProgramAddress(
    [
      Buffer.from("solgames_user_nft_state"),
      nft_mint_owner.toBuffer(),
      nft_mint_key.toBuffer(),
      solgames_uac_state_account.toBuffer()
    ],
    Solgames_UAC_ProgramID
  ); //will be dynamically generated 
  console.log("solgames_user_nft_state_account =>", solgames_user_nft_state_account[0].toBase58())
  
  // const solgames_user_nft_state_account_pda_token_account = await getOrCreateAssociatedAccount(
  //   solgames_user_nft_state_account[0],
  //   SOLG_token_mint,
  //   owner
  // ); //will be dynamically generated

  // console.log("solgames_user_nft_state_account_pda_token_account =>", solgames_user_nft_state_account_pda_token_account.toBase58())

  const player_pda_seed = "player_league_state"
   
   //Already fetched on the above steps
   //it is also a PDA for the player account
  const player_league_state_account = await PublicKey.findProgramAddress(
    [
      Buffer.from(player_pda_seed),
      daily_league_platform_state_account.toBuffer(),
      solgames_user_nft_state_account[0].toBuffer()
    ],
    Solgames_UAC_ProgramID 
  );
  console.log("player_league_state_account", player_league_state_account[0].toString())
  //Already fetched on the above steps
  const player_league_state_token_account = await getOrCreateAssociatedAccount(
    player_league_state_account[0],
    SOLG_token_mint,
    owner
  );
  console.log("player_league_state_token_account", player_league_state_token_account.toBase58())

  //will be fetched from the daily_league_platform_state_account
  const league_platform_data = await getGameLeagueInfo(daily_league_platform_state_account); 
  const daily_league_pda_token_account_pubkey = league_platform_data.game_league_pda_token_account_pubkey

//   const solgamesUACStateInfo = await getSolgamesUACStateInfo(solgames_uac_state_account);
//   console.log("solgamesUACStateInfo => ", solgamesUACStateInfo);

//   const gameInfoPlatformInfo = await getGameInfoPlatformInfo(game_info_state_account);
//   console.log("gameInfoPlatformInfo => ", gameInfoPlatformInfo);

//   const gamePlayerInfo = await getGamePlayerInfo(player_league_state_account[0]);
//   console.log("gamePlayerInfo =>", gamePlayerInfo);

//   const userNFTStateInfo = await getUserNFTStateInfo(solgames_user_nft_state_account[0]);
//   console.log("userNFTStateInfo =>", userNFTStateInfo);

//   const gameLeagueInfo = await getGameLeagueInfo(daily_league_platform_state_account);
//   console.log("gameLeagueInfo =>", gameLeagueInfo);


// const game_info_accounts = await connection.getParsedProgramAccounts(Game_Info_ProgramID)
// console.log("game_info_accounts =>", game_info_accounts)


// const daily_game_league_program_accounts = await connection.getParsedProgramAccounts(Daily_Game_League_ProgramID,{
//   filters: [
//     {
//       dataSize: 130, // number of bytes
//     },
//     {
//       memcmp: {
//         offset: 1, // number of bytes
//         bytes: new PublicKey("GUabFeNoQuBPbSKqPg9MbzsutjycytnutFLVg6Z2Px8w"), // base58 encoded string of mint owner
//       },
//       memcmp: {
//         offset: 33, // number of bytes
//         bytes: new PublicKey("Fmky2DHEtiq5WmMUbVPwbFxt62DHE73eDDtxAc65p5xk"), // base58 encoded string of mint key
//       },
//     },
//   ],
// })
// console.log("daily_game_league_program_accounts =>", daily_game_league_program_accounts)

// daily_game_league_program_accounts.forEach(account => {
//   console.log(" Game League Program new row START")
//   console.log("account.publicKey.toBase58() =>", account.pubkey.toBase58())
//   console.log("account.account.data =>", account.account.data)
//   console.log("account.account.owner =>", account.account.owner.toBase58())
//   console.log("account.account.executable =>", account.account.executable)
//   console.log("account.account.lamports =>", account.account.lamports)
//   console.log("account.account.rentEpoch =>", account.account.rentEpoch)
//   console.log("Game League Program new row END")
// })

// const solgames_uac_accounts = await connection.getParsedProgramAccounts(Solgames_UAC_ProgramID, {
//   filters: [
//     {
//       dataSize: 130, // number of bytes
//     },
//     {
//       memcmp: {
//         offset: 1, // number of bytes
//         bytes: new PublicKey("GUabFeNoQuBPbSKqPg9MbzsutjycytnutFLVg6Z2Px8w"), // base58 encoded string of mint owner
//       },
//       memcmp: {
//         offset: 33, // number of bytes
//         bytes: new PublicKey("Fmky2DHEtiq5WmMUbVPwbFxt62DHE73eDDtxAc65p5xk"), // base58 encoded string of mint key
//       },
//     },
//   ],
// })
// console.log("solgames_uac_accounts =>", solgames_uac_accounts)

// solgames_uac_accounts.forEach(account => {
//   console.log("Solgames UAC Program new row START")
//   console.log("account.publicKey.toBase58() =>", account.pubkey.toBase58())
//   console.log("account.account.data =>", account.account.data)
//   console.log("account.account.owner =>", account.account.owner.toBase58())
//   console.log("account.account.executable =>", account.account.executable)
//   console.log("account.account.lamports =>", account.account.lamports)
//   console.log("account.account.rentEpoch =>", account.account.rentEpoch)
//   console.log("Solgames UAC Program new row END")
// })

  const competeGameLeague = new TransactionInstruction({
    programId: Solgames_UAC_ProgramID,
    keys: [
      { pubkey: owner, isSigner: true, isWritable: true},
      { pubkey: solgames_uac_state_account, isSigner: false, isWritable: true },
      { pubkey: solgames_user_nft_state_account[0], isSigner: false, isWritable: true },
      { pubkey: player_league_state_account[0], isSigner: false, isWritable: true },
      { pubkey: player_league_state_token_account, isSigner: false, isWritable: true },
      { pubkey: daily_league_platform_state_account, isSigner: false, isWritable: true },
      { pubkey: new PublicKey(daily_league_pda_token_account_pubkey), isSigner: false, isWritable: true },
      { pubkey: Daily_Game_League_ProgramID, isSigner: false, isWritable: false },
      { pubkey: game_info_state_account, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: SOLG_token_mint, isSigner: false, isWritable: false },
    ],
    
    data: Buffer.from(Uint8Array.of(9,
      ...new BN(LEAGUE_POSITION).toArray("le", 8),
      ...new BN(WINNER_REWARD).toArray("le", 8),
      )),
  });

  await sendTxUsingExternalSignature(
    [competeGameLeague],
    connection,
    null,
    [],
    new PublicKey(owner)
  );
  await new Promise((resolve) => setTimeout(resolve, 2000));

}

export const reward_to_developer = async(owner) =>{
  const LEAGUE_POSITION = 900
  const WINNER_REWARD = 10*Math.pow(10,9)

  /*
   * game_info_state_account -> will be fetched for each game
    * so we can find all the game_info_state_account for a particular game
    * const game_info_accounts = await connection.getParsedProgramAccounts(Game_Info_ProgramID)
    * console.log("game_info_accounts =>", game_info_accounts)  
   */

  /* 
   * daily_league_platform_state_account -> will be generated for each game_info_state_account using the below combination
   Buffer.from("daily_league_program"),
      Buffer.from(LEAGUE_ID.toString()),
      game_info_state_account.toBuffer(),
  */

/* Fetch all the player_league_state_account for the each leagues
 * const player_league_state_accounts = await connection.getParsedProgramAccounts(Daily_Game_League_ProgramID,{
  filters: [
    {
      dataSize: 130, // number of bytes i.e. total size of PlayerLeagueState struct
    },
    {
      memcmp: {
        offset: 1, // number of bytes
        bytes: new PublicKey("GUabFeNoQuBPbSKqPg9MbzsutjycytnutFLVg6Z2Px8w"), // base58 encoded string of daily_league_platform_state_account
      },
    },
  ],
})
 */
/*
 * 1. Fetch the top players based on the number of participants i.e player_league_state_account with is_compete = true
 * 2. Find the league position based on the sorting on the score for the players competed from step 1
 * 3. Run the algorithm to find the reward for the winner -> most probably it will be a probability based algorithm or arithmetic progression
 * 4. Keep track of league position and reward for each player
 * 5.  For each player_league_state_account parse the below items 
   * 1. nft_mint_owner
   * 2. nft_mint_key
   * 3. player_league_state_token_account
*/

  const nft_mint_owner = new PublicKey("GUabFeNoQuBPbSKqPg9MbzsutjycytnutFLVg6Z2Px8w"); //will fetch from the player_league_state_account
  
  const nft_mint_key = new PublicKey(nft_mint_key_string) //will fetch from the player_league_state_account

  const solgames_uac_state_account = platform_state_account; //will fetch from the saved addresses

  /* Fetching solgames_user_nft_staet_account based on the above parsed info */
  const solgames_user_nft_state_account = await PublicKey.findProgramAddress(
    [
      Buffer.from("solgames_user_nft_state"),
      nft_mint_owner.toBuffer(),
      nft_mint_key.toBuffer(),
      solgames_uac_state_account.toBuffer()
    ],
    Solgames_UAC_ProgramID
  ); //will be dynamically generated 
  console.log("solgames_user_nft_state_account =>", solgames_user_nft_state_account[0].toBase58())
  
  // const solgames_user_nft_state_account_pda_token_account = await getOrCreateAssociatedAccount(
  //   solgames_user_nft_state_account[0],
  //   SOLG_token_mint,
  //   owner
  // ); //will be dynamically generated

  // console.log("solgames_user_nft_state_account_pda_token_account =>", solgames_user_nft_state_account_pda_token_account.toBase58())

  const player_pda_seed = "player_league_state"
   
   //Already fetched on the above steps
   //it is also a PDA for the player account
  const player_league_state_account = await PublicKey.findProgramAddress(
    [
      Buffer.from(player_pda_seed),
      daily_league_platform_state_account.toBuffer(),
      solgames_user_nft_state_account[0].toBuffer()
    ],
    Solgames_UAC_ProgramID 
  );
  console.log("player_league_state_account", player_league_state_account[0].toString())
  //Already fetched on the above steps
  const player_league_state_token_account = await getOrCreateAssociatedAccount(
    player_league_state_account[0],
    SOLG_token_mint,
    owner
  );
  console.log("player_league_state_token_account", player_league_state_token_account.toBase58())

  //will be fetched from the daily_league_platform_state_account
  const league_platform_data = await getGameLeagueInfo(daily_league_platform_state_account); 
  const daily_league_pda_token_account_pubkey = league_platform_data.game_league_pda_token_account_pubkey

  const competeGameLeague = new TransactionInstruction({
    programId: Solgames_UAC_ProgramID,
    keys: [
      { pubkey: owner, isSigner: true, isWritable: true},
      { pubkey: solgames_uac_state_account, isSigner: false, isWritable: true },
      { pubkey: solgames_user_nft_state_account[0], isSigner: false, isWritable: true },
      { pubkey: player_league_state_account[0], isSigner: false, isWritable: true },
      { pubkey: player_league_state_token_account, isSigner: false, isWritable: true },
      { pubkey: daily_league_platform_state_account, isSigner: false, isWritable: true },
      { pubkey: new PublicKey(daily_league_pda_token_account_pubkey), isSigner: false, isWritable: true },
      { pubkey: Daily_Game_League_ProgramID, isSigner: false, isWritable: false },
      { pubkey: game_info_state_account, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: SOLG_token_mint, isSigner: false, isWritable: false },
    ],
    
    data: Buffer.from(Uint8Array.of(9,
      ...new BN(LEAGUE_POSITION).toArray("le", 8),
      ...new BN(WINNER_REWARD).toArray("le", 8),
      )),
  });

  await sendTxUsingExternalSignature(
    [competeGameLeague],
    connection,
    null,
    [],
    new PublicKey(owner)
  );
  await new Promise((resolve) => setTimeout(resolve, 2000));

}


export const add_collection_info = async (owner) => {
  const collectionInfo = {
    candy_machine_pubkey: "HfgBfsSWS9zRD3wr2DNhWk2bbumut77XM7E8vJfYLkjQ",
    collection_pubkey: "EKPfTcPQ6ykM1CHbqWc1oqsBLfc5X54b9fZ5kTSLx7Ty",
    collection_image_uri: "collection_image_uri",
    collection_name: "collection_name",
    collection_description: "collection_description"
  }
  const {candy_machine_pubkey, collection_pubkey, collection_image_uri, collection_name, collection_description} = collectionInfo;

  const collection_info_state_account = await PublicKey.findProgramAddress(
    [
      Buffer.from("collection_info_account"),
      new PublicKey(candy_machine_pubkey).toBuffer(),
    ],
    Collection_Info_ID
  );
  console.log(" collection_info_state_account => ", collection_info_state_account[0].toBase58())

  const newCollectionInfo = new CollectionInfoState({
    is_initialized: true,
    collection_image_uri,
    collection_name,
    collection_description
  })

  const buffer = CollectionInfoState.serializeSaveCollectionInfoInstruction(newCollectionInfo);

  const add_collection_info = new TransactionInstruction({
    programId: Collection_Info_ID,
    keys: [
      { pubkey: owner,isSigner: true,isWritable: false},
      { pubkey: collection_info_state_account[0], isSigner: false, isWritable: true },
      { pubkey: new PublicKey(candy_machine_pubkey), isSigner: false, isWritable: true },
      { pubkey: new PublicKey(collection_pubkey), isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
    ],
    data: Buffer.from(Uint8Array.of(0, ...buffer)),
  });
  await sendTxUsingExternalSignature(
    [add_collection_info],
    connection,
    null,
    [],
    new PublicKey(owner)
  );
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const collectionInfoResult = await getCollectionInfo(collection_info_state_account[0]);
  console.log("collectionInfoResult => ", collectionInfoResult);
}

export const update_collection_info = async (owner) => {
  const collectionInfo = {
    collection_image_uri: "update2_collection_image_uri",
    collection_name: "update2_collection_name",
    collection_description: "collection_description_2"
  }
  const {collection_image_uri, collection_name, collection_description} = collectionInfo;
  const candy_machine_pubkey = "HfgBfsSWS9zRD3wr2DNhWk2bbumut77XM7E8vJfYLkjQ"
  const collection_info_state_account = await PublicKey.findProgramAddress(
    [
      Buffer.from("collection_info_account"),
      new PublicKey(candy_machine_pubkey).toBuffer(),
    ],
    Collection_Info_ID
  );
  console.log(" collection_info_state_account => ", collection_info_state_account[0].toBase58())

  const updateCollectionInfo = new CollectionInfoState({
    collection_image_uri,
    collection_name,
    collection_description
  })

  const buffer = CollectionInfoState.serializeUpdateCollectionInfoInstruction(updateCollectionInfo);

  const update_collection_info = new TransactionInstruction({
    programId: Collection_Info_ID,
    keys: [
      { pubkey: owner,isSigner: true,isWritable: false},
      { pubkey: collection_info_state_account[0], isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
    ],
    data: Buffer.from(Uint8Array.of(1, ...buffer)),
  });
  await sendTxUsingExternalSignature(
    [update_collection_info],
    connection,
    null,
    [],
    new PublicKey(owner)
  );
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const collectionInfoResult = await getCollectionInfo(collection_info_state_account[0]);
  console.log("collectionInfoResult => ", collectionInfoResult);
}

export const add_user_info = async (owner) => {
  const userInfo = {
    is_initialized: true, //1
    is_player: true, //1
    is_creator: true, //1
    is_game_developer: false, //1
    username: "blocksan", //32
    name: "Sandeep Ghosh", //32
    image_uri: "https://dummy.org", //128
    cover_image_uri: "https://dummy.org", //128
    bio: "lorem ipsum", //512
    linkedin_handle: "https://dummy.org", //128
    twitter_handle: "https://dummy.org", //128
    instagram_handle: "https://dummy.org", //128
    github_handle: "https://dummy.org", //128
    discord_handle: "https://dummy.org", //128
    twitch_handle: "https://dummy.org" 
  }

  const {
    is_initialized,
    owner_pubkey,
    is_player,
    is_creator,
    is_game_developer,
    username,
    name,
    image_uri,
    cover_image_uri,
    bio,
    linkedin_handle,
    twitter_handle,
    instagram_handle,
    github_handle,
    discord_handle,
    twitch_handle
  } = userInfo;

  const user_info_state_account = await PublicKey.findProgramAddress(
    [
      Buffer.from("solgames_user_account"),
      new PublicKey(owner).toBuffer(),
    ],
    Solgames_User_Info_ID
  );
  console.log(" user_info_state_account => ", user_info_state_account[0].toBase58())

  const newUserInfo = new UserInfoState({
    is_initialized: true,
    ...userInfo
  })

  const buffer = UserInfoState.serializeSaveUserInfoInstruction(newUserInfo);

  const user_collection_info = new TransactionInstruction({
    programId: Solgames_User_Info_ID,
    keys: [
      { pubkey: owner,isSigner: true,isWritable: false},
      { pubkey: user_info_state_account[0], isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
    ],
    data: Buffer.from(Uint8Array.of(0, ...buffer)),
  });
  await sendTxUsingExternalSignature(
    [user_collection_info],
    connection,
    null,
    [],
    new PublicKey(owner)
  );
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const userInfoResult = await getUserInfo(user_info_state_account[0]);
  console.log("userInfoResult => ", userInfoResult);
}

export const update_user_info = async (owner) => {
  const userInfo = {
    is_player: false, //1
    is_creator: true, //1
    is_game_developer: false, //1
    username: "updated_blocksan", //32
    name: "Solgames", //32
    image_uri: "https://dummy.org", //128
    cover_image_uri: "https://dummy.org", //128
    bio: "lorem ipsum", //512
    linkedin_handle: "https://dummy.org", //128
    twitter_handle: "https://dummy.org", //128
    instagram_handle: "https://dummy.org", //128
    github_handle: "https://dummy.org", //128
    discord_handle: "https://dummy.org", //128
    twitch_handle: "https://dummy.org" 
  }

  const {
    owner_pubkey,
    is_player,
    is_creator,
    is_game_developer,
    username,
    name,
    image_uri,
    cover_image_uri,
    bio,
    linkedin_handle,
    twitter_handle,
    instagram_handle,
    github_handle,
    discord_handle,
    twitch_handle
  } = userInfo;

  const user_info_state_account = await PublicKey.findProgramAddress(
    [
      Buffer.from("solgames_user_account"),
      new PublicKey(owner).toBuffer(),
    ],
    Solgames_User_Info_ID
  );
  console.log(" user_info_state_account => ", user_info_state_account[0].toBase58())

  const newUserInfo = new UserInfoState({
    ...userInfo
  })

  const buffer = UserInfoState.serializeUpdateUserInfoInstruction(newUserInfo);

  const user_collection_info = new TransactionInstruction({
    programId: Solgames_User_Info_ID,
    keys: [
      { pubkey: owner,isSigner: true,isWritable: false},
      { pubkey: user_info_state_account[0], isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
    ],
    data: Buffer.from(Uint8Array.of(1, ...buffer)),
  });
  await sendTxUsingExternalSignature(
    [user_collection_info],
    connection,
    null,
    [],
    new PublicKey(owner)
  );
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const userInfoResult = await getUserInfo(user_info_state_account[0]);
  console.log("userInfoResult => ", userInfoResult);
}


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

export const add_applicant_info = async (owner) => {
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
  console.log("buffer => ", buffer)
  console.log("buffer.length => ", buffer.length)
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
    new PublicKey(owner)
  );
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const userCandidateInfoResult = await getUserCandidateInfo(applicant_info_state_account[0]);
  console.log("userCandidateInfoResult => ", userCandidateInfoResult);
}

export const update_applicant_info = async (owner) => {
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
    new PublicKey(owner)
  );
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const userCandidateInfoResult = await getUserCandidateInfo(applicant_info_state_account[0]);
  console.log("userCandidateInfoResult => ", userCandidateInfoResult);
}

export const add_project_info = async (owner, connection) => {
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
      new PublicKey(owner)
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

export const update_project_info = async (owner, connection) => {
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
      new PublicKey(owner)
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

export const add_contact_info = async (owner, connection) => {
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
      new PublicKey(owner)
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

export const update_contact_info = async (owner, connection) => {
  try{
    console.log("owner => ", owner.toBase58());
    const contactInfo = {
      email:"updated email again", //64
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
      new PublicKey(owner)
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

export const add_education_info = async (owner, connection) => {
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
  
    const educationsOfUser = await findAllEducationsOfUser(applicant_info_state_account[0], connection);

    if(educationsOfUser && educationsOfUser.length > 0){
      educationInfo.education_number = 'E'+(educationsOfUser.length+1);
    }else{
      educationInfo.education_number = 'E1';
    }

    const addEducationInfo = new EducationInfoState({
      ...educationInfo
    })

    console.log("addEducationInfo js => ", addEducationInfo)
  
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
      new PublicKey(owner)
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

export const add_work_experience_info = async (owner, connection) => {
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
      new PublicKey(owner)
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

export const update_work_experience_info = async (owner, connection) => {
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
      new PublicKey(owner)
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

export const add_company_info = async (owner, connection) => {
  try{
    const companyInfo = {
      username:"user name", //32
      name:"name ", //64
      logo_uri:"logo uri", //128
      domain:"domain ", //64
      company_type:"company_type", //8 "product, service, both"
      company_size:"company_size", //8 "small, medium, large"
      company_stage:"company_stage", //32
      funding_amount:  "10000", //8
      funding_currency:"SOLG", //8 
      image_uri:"image_uri", //128
      cover_image_uri:"cover_image_uri", //128
      founded_in:"founded_in", //8
      employee_size: "1000", //8
      address:"address", //512
      description:"description",// 1024
      website:"website", //128
      linkedin:"linkedin",//128 
      twitter:"twitter", //128 
      facebook:"facebook", //128
      instagram:"instagram", //128
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
  
    const companyInfosOfUser = await findAllCompanyInfosOfUser(connection,applicant_info_state_account[0]);
    console.log("companyInfosOfUser => ", companyInfosOfUser)
    if(companyInfosOfUser.status && companyInfosOfUser.data.length > 0){
      companyInfo.company_seq_number = 'CP'+(companyInfosOfUser.data.length+1);
    }else{
      companyInfo.company_seq_number = 'CP1';
    }

    const addcompanyInfo = new CompanyInfoState({
      ...companyInfo
    })
  
    const buffer = CompanyInfoState.serializeSaveCompanyInfoInstruction(addcompanyInfo);
    
    const company_info_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(COMPANY_STATE_ACCOUNT_PREFIX),
        Buffer.from(companyInfo.company_seq_number),
        applicant_info_state_account[0].toBuffer()
      ],
      JobsOnChain_Company_Info_ID
    );

    console.log(" company_info_account => ", company_info_account[0].toBase58());

    const company_info_account_exists = await connection.getAccountInfo(company_info_account[0]);

    if(company_info_account_exists){
      console.log("company_info_account already exists");
      return;
    }
        
    const add_company_info_ins = new TransactionInstruction({
      programId: JobsOnChain_Company_Info_ID,
      keys: [
        { pubkey: owner,isSigner: true,isWritable: false},
        { pubkey: company_info_account[0], isSigner: false, isWritable: true },
        { pubkey: applicant_info_state_account[0], isSigner: false, isWritable: false },
        { pubkey: JobsOnChain_User_Info_ID, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
      ],
      data: Buffer.from(Uint8Array.of(0, ...buffer)),
    });
    await sendTxUsingExternalSignature(
      [add_company_info_ins],
      connection,
      null,
      [],
      new PublicKey(owner)
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const companyInfoResult = await getCompanyInfo(company_info_account[0], connection);
    console.log("companyInfoResult => ", companyInfoResult);
    return companyInfoResult
  }catch(err){
    console.log("err => ", err)
    throw err
  }
}

export const update_company_info = async (owner, connection) => {
  try{
    const companyInfo = {
      archived: false,
      username:"update user name", //32
      name:"update name ", //64
      logo_uri:"logo uri", //128
      domain:"domain ", //64
      company_type:"company_type", //8 "product, service, both"
      company_size:"company_size", //8 "small, medium, large"
      company_stage:"company_stage", //32
      funding_amount:  "10000", //8
      funding_currency:"SOLG", //8 
      image_uri:"image_uri", //128
      cover_image_uri:"cover_image_uri", //128
      founded_in:"founded_in", //8
      employee_size: "1000", //8
      address:"address", //512
      description:"description",// 1024
      website:"website", //128
      linkedin:"linkedin",//128 
      twitter:"twitter", //128 
      facebook:"facebook", //128
      instagram:"instagram", //128
      company_seq_number:"CP1"
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
  

    const updateCompanyInfo = new CompanyInfoState({
      ...companyInfo
    })
  
    const buffer = CompanyInfoState.serializeUpdateCompanyInfoInstruction(updateCompanyInfo);
    const company_info_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(COMPANY_STATE_ACCOUNT_PREFIX),
        Buffer.from(companyInfo.company_seq_number),
        applicant_info_state_account[0].toBuffer()
      ],
      JobsOnChain_Company_Info_ID
    );

    console.log(" company_info_account => ", company_info_account[0].toBase58());

    const company_info_account_exists = await connection.getAccountInfo(company_info_account[0]);

    if(!company_info_account_exists){
      console.log("company_info_account do not exists");
      return;
    }
        
    const update_company_info_ins = new TransactionInstruction({
      programId: JobsOnChain_Company_Info_ID,
      keys: [
        { pubkey: owner,isSigner: true,isWritable: false},
        { pubkey: company_info_account[0], isSigner: false, isWritable: true },
        { pubkey: applicant_info_state_account[0], isSigner: false, isWritable: false },
        { pubkey: JobsOnChain_User_Info_ID, isSigner: false, isWritable: false },
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
    const companyInfoResult = await getCompanyInfo(company_info_account[0], connection);
    console.log("companyInfoResult => ", companyInfoResult);
    return companyInfoResult
  }catch(err){
    console.log("err => ", err)
    throw err
  }
}

export const update_company_subscription_info = async (owner, connection) => {
  try{
    const companyInfo = {
      subscription_plan : "paynuse", //8
      subscription_purchased_on: new BN(new Date().getTime()), //10
      subscription_valid_till: new BN(new Date().getTime()), //10
      company_seq_number:"CP1"
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
  

    const updateCompanyInfo = new CompanyInfoState({
      ...companyInfo
    })
  
    const buffer = CompanyInfoState.serializeUpdateCompanyInfoInstruction(updateCompanyInfo);
    const company_info_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(COMPANY_STATE_ACCOUNT_PREFIX),
        Buffer.from(companyInfo.company_seq_number),
        applicant_info_state_account[0].toBuffer()
      ],
      JobsOnChain_Company_Info_ID
    );

    console.log(" company_info_account => ", company_info_account[0].toBase58());

    const company_info_account_exists = await connection.getAccountInfo(company_info_account[0]);

    if(!company_info_account_exists){
      console.log("company_info_account do not exists");
      return;
    }
        
  const subscriptionModifier = await getPayer();
    const update_company_info_ins = new TransactionInstruction({
      programId: JobsOnChain_Company_Info_ID,
      keys: [
        { pubkey: subscriptionModifier,isSigner: true,isWritable: false},
        { pubkey: owner,isSigner: false,isWritable: false},
        { pubkey: company_info_account[0], isSigner: false, isWritable: true },
        { pubkey: applicant_info_state_account[0], isSigner: false, isWritable: false },
        { pubkey: JobsOnChain_User_Info_ID, isSigner: false, isWritable: false },
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
    const companyInfoResult = await getCompanyInfo(company_info_account[0], connection);
    console.log("companyInfoResult => ", companyInfoResult);
    return companyInfoResult
  }catch(err){
    console.log("err => ", err)
    throw err
  }
}

export const add_jobpost_info = async (owner, connection) => {
  try{
    const jobPostInfo = {
      job_title:"job_title", //128
      short_description:"short_description",//256
      long_description:"long_description",//1024
      category: ["category 1","category 2"],//32*4+10+10 //category is an array of job category like Frontend Developer
      job_type:"job_type", //16 full-time, part-time, contract, internship",
      currency_type:"currency_type", //8 fiat, crypto
      currency:"currency", //8 USD, ETH, BTC, etc
      min_salary: new BN(10000), //8 u64
      max_salary: new BN(50000), //8 u64
      experience_in_months: new BN(100),//8 u64
      skills: ["Coding","painting"], //64*10+10+10 // ReactJs, NodeJs, etc
      qualification:"qualification", //512
      job_location_type:"job_location_type", //32
      country:"country", //64
      city:"city", //64
    }

    const company_seq_number = "CP2"
  
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
  

    const company_info_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(COMPANY_STATE_ACCOUNT_PREFIX),
        Buffer.from(company_seq_number),
        applicant_info_state_account[0].toBuffer()
      ],
      JobsOnChain_Company_Info_ID
    );
    const company_info_account_exists = await connection.getAccountInfo(company_info_account[0]);
    if(!company_info_account_exists){
      console.log("company_info_account do not exists");
      return;
    }
    console.log(" company_info_account => ", company_info_account[0].toBase58());


    const allJobsOfCompany = await findAllJobsOfCompany(connection,company_info_account[0]);
    
    console.log("allJobsOfCompany => ", allJobsOfCompany)

    if(allJobsOfCompany.status && allJobsOfCompany.data.length > 0){
      jobPostInfo.job_number = 'JP'+(allJobsOfCompany.data.length+1);
    }else{
      jobPostInfo.job_number = 'JP1';
    }

    
    const jobpost_info_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(JOBPOST_STATE_ACCOUNT_PREFIX),
        Buffer.from(jobPostInfo.job_number),
        company_info_account[0].toBuffer()
      ],
      JobsOnChain_JobPost_Info_ID
    );
    const jobpost_info_account_exists = await connection.getAccountInfo(jobpost_info_account[0]);
    if(jobpost_info_account_exists){
      console.log("jobpost_info_account already exists");
      return;
    }
    console.log(" jobpost_info_account => ", jobpost_info_account[0].toBase58());


    const newJobPostInfo = new JobPostInfoState({
      ...jobPostInfo
    })
  
    const buffer = JobPostInfoState.serializeAddJobPostInfoInstruction(newJobPostInfo);
    
    const add_jobpost_info_ins = new TransactionInstruction({
      programId: JobsOnChain_JobPost_Info_ID,
      keys: [
        { pubkey: owner,isSigner: true,isWritable: false},
        { pubkey: company_info_account[0], isSigner: false, isWritable: false },
        { pubkey: applicant_info_state_account[0], isSigner: false, isWritable: false },
        { pubkey: jobpost_info_account[0], isSigner: false, isWritable: true },
        { pubkey: JobsOnChain_User_Info_ID, isSigner: false, isWritable: false },
        { pubkey: JobsOnChain_Company_Info_ID, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
      ],
      data: Buffer.from(Uint8Array.of(0, ...buffer)),
    });
    await sendTxUsingExternalSignature(
      [add_jobpost_info_ins],
      connection,
      null,
      [],
      new PublicKey(owner)
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const jobPostInfoResult = await getJobPostInfo(jobpost_info_account[0], connection);
    console.log("jobPostInfoResult => ", jobPostInfoResult);
    return jobPostInfoResult
  }catch(err){
    console.log("err => ", err)
    throw err
  }
}

export const update_jobpost_info = async (owner, connection) => {
  try{
    const jobPostInfo = {
      archived: false,
      job_title:"updated job_title", //128
      short_description:"updated short_description",//256
      long_description:"long_description",//1024
      category: ["category 1","category 2"],//32*4+10+10 //category is an array of job category like Frontend Developer
      job_type:"job_type", //16 full-time, part-time, contract, internship",
      currency_type:"currency_type", //8 fiat, crypto
      currency:"currency", //8 USD, ETH, BTC, etc
      min_salary: new BN(10000), //8 u64
      max_salary: new BN(50000), //8 u64
      experience_in_months: new BN(100),//8 u64
      skills: ["Coding","painting"], //64*10+10+10 // ReactJs, NodeJs, etc
      qualification:"qualification", //512
      job_location_type:"job_location_type", //32
      country:"country", //64
      city:"city", //64
      job_number:"JP1"
    }

    const company_seq_number = "CP1"
  
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
  

    const company_info_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(COMPANY_STATE_ACCOUNT_PREFIX),
        Buffer.from(company_seq_number),
        applicant_info_state_account[0].toBuffer()
      ],
      JobsOnChain_Company_Info_ID
    );
    const company_info_account_exists = await connection.getAccountInfo(company_info_account[0]);
    if(!company_info_account_exists){
      console.log("company_info_account do not exists");
      return;
    }
    console.log(" company_info_account => ", company_info_account[0].toBase58());


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
        company_info_account[0].toBuffer()
      ],
      JobsOnChain_JobPost_Info_ID
    );
    const jobpost_info_account_exists = await connection.getAccountInfo(jobpost_info_account[0]);
    if(!jobpost_info_account_exists){
      console.log("jobpost_info_account do not exists");
      return;
    }
    console.log(" jobpost_info_account => ", jobpost_info_account[0].toBase58());


    const newJobPostInfo = new JobPostInfoState({
      ...jobPostInfo
    })
  
    const buffer = JobPostInfoState.serializeUpdateJobPostInfoInstruction(newJobPostInfo);
    
    const update_jobpost_info_ins = new TransactionInstruction({
      programId: JobsOnChain_JobPost_Info_ID,
      keys: [
        { pubkey: owner,isSigner: true,isWritable: false},
        { pubkey: company_info_account[0], isSigner: false, isWritable: false },
        { pubkey: applicant_info_state_account[0], isSigner: false, isWritable: false },
        { pubkey: jobpost_info_account[0], isSigner: false, isWritable: true },
        { pubkey: JobsOnChain_User_Info_ID, isSigner: false, isWritable: false },
        { pubkey: JobsOnChain_Company_Info_ID, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
      ],
      data: Buffer.from(Uint8Array.of(1, ...buffer)),
    });
    await sendTxUsingExternalSignature(
      [update_jobpost_info_ins],
      connection,
      null,
      [],
      new PublicKey(owner)
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const jobPostInfoResult = await getJobPostInfo(jobpost_info_account[0], connection);
    console.log("jobPostInfoResult => ", jobPostInfoResult);
    return jobPostInfoResult
  }catch(err){
    console.log("err => ", err)
    throw err
  }
}

export const add_job_workflow_info = async (owner, connection) => {
  try{
    const applyJobWorkflowInfo = {
      status:"applied" , //16 => 'saved' or 'applied' or 'in_progress' or 'accepted' or 'rejected' or 'withdraw'
      job_applied_at: new BN(new Date().getTime()), //8 => timestamp in unix format
      last_updated_at: new BN(new Date().getTime()), //8 => timestamp in unix format
    }

    const company_seq_number = "CP2"
    const job_number = "JP2"
  
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
  

    const company_info_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(COMPANY_STATE_ACCOUNT_PREFIX),
        Buffer.from(company_seq_number),
        applicant_info_state_account[0].toBuffer()
      ],
      JobsOnChain_Company_Info_ID
    );
    const company_info_account_exists = await connection.getAccountInfo(company_info_account[0]);
    if(!company_info_account_exists){
      console.log("company_info_account do not exists");
      return;
    }
    console.log(" company_info_account => ", company_info_account[0].toBase58());

    const jobpost_info_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(JOBPOST_STATE_ACCOUNT_PREFIX),
        Buffer.from(job_number),
        company_info_account[0].toBuffer()
      ],
      JobsOnChain_JobPost_Info_ID
    );
    const jobpost_info_account_exists = await connection.getAccountInfo(jobpost_info_account[0]);
    if(!jobpost_info_account_exists){
      console.log("jobpost_info_account do not exists");
      return;
    }
    console.log(" jobpost_info_account => ", jobpost_info_account[0].toBase58());

    const workflow_info_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(WORKFLOW_STATE_ACCOUNT_PREFIX),
        jobpost_info_account[0].toBuffer()
      ],
      JobsOnChain_Workflow_Info_ID
    );

    const workflow_info_account_exists = await connection.getAccountInfo(workflow_info_account[0]);
    if(workflow_info_account_exists){
      console.log("workflow_info_account already exists");
      return;
    }
    console.log(" workflow_info_account => ", workflow_info_account[0].toBase58());


    const newJobApplyWorkflowInfo = new WorkflowInfoState({
      ...applyJobWorkflowInfo
    })
  
    const buffer = WorkflowInfoState.serializeApplyJobWorkflowInfoInstruction(newJobApplyWorkflowInfo);
    
    const apply_job_workflow_info_account_inst = new TransactionInstruction({
      programId: JobsOnChain_Workflow_Info_ID,
      keys: [
        { pubkey: owner,isSigner: true,isWritable: false},
        { pubkey: company_info_account[0], isSigner: false, isWritable: false },
        { pubkey: applicant_info_state_account[0], isSigner: false, isWritable: false },
        { pubkey: jobpost_info_account[0], isSigner: false, isWritable: false },
        { pubkey: workflow_info_account[0], isSigner: false, isWritable: true},
        
        { pubkey: JobsOnChain_User_Info_ID, isSigner: false, isWritable: false },
        { pubkey: JobsOnChain_Company_Info_ID, isSigner: false, isWritable: false },
        { pubkey: JobsOnChain_JobPost_Info_ID, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
      ],
      data: Buffer.from(Uint8Array.of(0, ...buffer)),
    });
    await sendTxUsingExternalSignature(
      [apply_job_workflow_info_account_inst],
      connection,
      null,
      [],
      new PublicKey(owner)
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const workflowInfoResult = await getWorkflowInfo(workflow_info_account[0], connection);
    console.log("workflowInfoResult => ", workflowInfoResult);
    return workflowInfoResult
  }catch(err){
    console.log("err => ", err)
    throw err
  }
}

export const update_job_workflow_info = async (owner, connection) => {
  try{
    const updateWorkflowInfo = {
      archived: false, //1 => true or false
      status:"in_progress" , //16 => 'saved' or 'applied' or 'in_progress' or 'accepted' or 'rejected' or 'withdraw'
      last_updated_at: new BN(new Date().getTime()), //8 => timestamp in unix format
    }

    const company_seq_number = "CP2"
    const job_number = "JP2"
  
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
  

    const company_info_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(COMPANY_STATE_ACCOUNT_PREFIX),
        Buffer.from(company_seq_number),
        applicant_info_state_account[0].toBuffer()
      ],
      JobsOnChain_Company_Info_ID
    );
    const company_info_account_exists = await connection.getAccountInfo(company_info_account[0]);
    if(!company_info_account_exists){
      console.log("company_info_account do not exists");
      return;
    }
    console.log(" company_info_account => ", company_info_account[0].toBase58());

    const jobpost_info_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(JOBPOST_STATE_ACCOUNT_PREFIX),
        Buffer.from(job_number),
        company_info_account[0].toBuffer()
      ],
      JobsOnChain_JobPost_Info_ID
    );
    const jobpost_info_account_exists = await connection.getAccountInfo(jobpost_info_account[0]);
    if(!jobpost_info_account_exists){
      console.log("jobpost_info_account do not exists");
      return;
    }
    console.log(" jobpost_info_account => ", jobpost_info_account[0].toBase58());

    const workflow_info_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(WORKFLOW_STATE_ACCOUNT_PREFIX),
        jobpost_info_account[0].toBuffer()
      ],
      JobsOnChain_Workflow_Info_ID
    );

    const workflow_info_account_exists = await connection.getAccountInfo(workflow_info_account[0]);
    if(!workflow_info_account_exists){
      console.log("workflow_info_account do not exists");
      return;
    }
    console.log(" workflow_info_account => ", workflow_info_account[0].toBase58());


    const updateJobApplyWorkflowInfo = new WorkflowInfoState({
      ...updateWorkflowInfo
    })
  
    const buffer = WorkflowInfoState.serializeUpdateWorkflowInfoInstruction(updateJobApplyWorkflowInfo);
    
    const update_job_workflow_info_account_inst = new TransactionInstruction({
      programId: JobsOnChain_Workflow_Info_ID,
      keys: [
        { pubkey: owner,isSigner: true,isWritable: false},
        { pubkey: company_info_account[0], isSigner: false, isWritable: false },
        { pubkey: applicant_info_state_account[0], isSigner: false, isWritable: false },
        { pubkey: jobpost_info_account[0], isSigner: false, isWritable: false },
        { pubkey: workflow_info_account[0], isSigner: false, isWritable: true},
        
        { pubkey: JobsOnChain_User_Info_ID, isSigner: false, isWritable: false },
        { pubkey: JobsOnChain_Company_Info_ID, isSigner: false, isWritable: false },
        { pubkey: JobsOnChain_JobPost_Info_ID, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
      ],
      data: Buffer.from(Uint8Array.of(1, ...buffer)),
    });
    await sendTxUsingExternalSignature(
      [update_job_workflow_info_account_inst],
      connection,
      null,
      [],
      new PublicKey(owner)
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const workflowInfoResult = await getWorkflowInfo(workflow_info_account[0], connection);
    console.log("workflowInfoResult => ", workflowInfoResult);
    return workflowInfoResult
  }catch(err){
    console.log("err => ", err)
    throw err
  }
}

export const update_job_workflow_payment_info = async (owner, connection) => {
  try{
    const updateWorkflowInfo = {
      is_paid: true,
      paid_amount: new BN(100),
      paid_at: new BN(new Date().getTime()), //8 => timestamp in unix format
      last_updated_at: new BN(new Date().getTime()), //8 => timestamp in unix format
    }

    const company_seq_number = "CP1"
    const job_number = "JP1"
  
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
  

    const company_info_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(COMPANY_STATE_ACCOUNT_PREFIX),
        Buffer.from(company_seq_number),
        applicant_info_state_account[0].toBuffer()
      ],
      JobsOnChain_Company_Info_ID
    );
    const company_info_account_exists = await connection.getAccountInfo(company_info_account[0]);
    if(!company_info_account_exists){
      console.log("company_info_account do not exists");
      return;
    }
    console.log(" company_info_account => ", company_info_account[0].toBase58());

    const jobpost_info_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(JOBPOST_STATE_ACCOUNT_PREFIX),
        Buffer.from(job_number),
        company_info_account[0].toBuffer()
      ],
      JobsOnChain_JobPost_Info_ID
    );
    const jobpost_info_account_exists = await connection.getAccountInfo(jobpost_info_account[0]);
    if(!jobpost_info_account_exists){
      console.log("jobpost_info_account do not exists");
      return;
    }
    console.log(" jobpost_info_account => ", jobpost_info_account[0].toBase58());

    const workflow_info_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(WORKFLOW_STATE_ACCOUNT_PREFIX),
        jobpost_info_account[0].toBuffer()
      ],
      JobsOnChain_Workflow_Info_ID
    );

    const workflow_info_account_exists = await connection.getAccountInfo(workflow_info_account[0]);
    if(!workflow_info_account_exists){
      console.log("workflow_info_account do not exists");
      return;
    }
    console.log(" workflow_info_account => ", workflow_info_account[0].toBase58());
    const workflowInfoResultBefore = await getWorkflowInfo(workflow_info_account[0], connection);
    console.log("workflowInfoResultBefore => ", workflowInfoResultBefore);

    const updateJobApplyWorkflowInfo = new WorkflowInfoState({
      ...updateWorkflowInfo
    })

    const subscriptionModifier = await getPayer()
  
    const buffer = WorkflowInfoState.serializeUpdateWorkflowPaymentInfoInstruction(updateJobApplyWorkflowInfo);
    
    const update_job_workflow_payment_info_account_inst = new TransactionInstruction({
      programId: JobsOnChain_Workflow_Info_ID,
      keys: [
        { pubkey: subscriptionModifier.publicKey, isSigner: true, isWritable: true },
        { pubkey: owner,isSigner: false,isWritable: false},
        { pubkey: company_info_account[0], isSigner: false, isWritable: false },
        { pubkey: applicant_info_state_account[0], isSigner: false, isWritable: false },
        { pubkey: jobpost_info_account[0], isSigner: false, isWritable: false },
        { pubkey: workflow_info_account[0], isSigner: false, isWritable: true},
        
        { pubkey: JobsOnChain_User_Info_ID, isSigner: false, isWritable: false },
        { pubkey: JobsOnChain_Company_Info_ID, isSigner: false, isWritable: false },
        { pubkey: JobsOnChain_JobPost_Info_ID, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
      ],
      data: Buffer.from(Uint8Array.of(2, ...buffer)),
    });
    console.log(connection,'--connection--')
    await sendAndConfirmTransaction(
      connection,
      new Transaction().add(update_job_workflow_payment_info_account_inst),
      [subscriptionModifier],
    )
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const workflowInfoResult = await getWorkflowInfo(workflow_info_account[0], connection);
    console.log("workflowInfoResult => ", workflowInfoResult);
    return workflowInfoResult
  }catch(err){
    console.log("err => ", err)
    throw err
  }
}

export const purchase_subscription_plan = async (provider,owner, connection, plan_type) => {
  try{

    const company_seq_number = "CP2"
  
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
  

    const company_info_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(COMPANY_STATE_ACCOUNT_PREFIX),
        Buffer.from(company_seq_number),
        applicant_info_state_account[0].toBuffer()
      ],
      JobsOnChain_Company_Info_ID
    );
    const company_info_account_exists = await connection.getAccountInfo(company_info_account[0]);
    if(!company_info_account_exists){
      console.log("company_info_account do not exists");
      return;
    }
    console.log(" company_info_account => ", company_info_account[0].toBase58());

    
    const plan_type_details = SUBSCRIPTION_PLANS_PRICES[plan_type];

    if(!plan_type_details){
      console.log("plan_type_details not found");
      return;
    }

    console.log(" plan_type_details => ", plan_type_details)

    if(plan_type_details.price){
      const USDC_MINT_ID = new PublicKey(SOLANA_USDC_MINT_KEY_LOCALHOST);
      const usdcAccountExists = await findAssociatedTokenAccountPublicKey(owner, USDC_MINT_ID);
      if(!usdcAccountExists){
        console.log("USDC account not found in your wallet, Please load your wallet with USDC");
        return;
      }

      const payer = await getPayer();
      const payerUSDCAccount = await findAssociatedTokenAccountPublicKey(payer.publicKey, USDC_MINT_ID);

      const transferResult = await transferCustomToken(provider, connection, plan_type_details.price, usdcAccountExists, payerUSDCAccount);
      if(!transferResult){
        console.log("Transfer failed, Please try again");
        return;
      }

      console.log("transferResult => ", transferResult);
    }
    const updateSubscriptionPlanInfo = {
      subscription_plan: plan_type,
      subscription_purchased_on: new BN(plan_type_details.subscription_purchased_on),
      subscription_valid_till: new BN(plan_type_details.subscription_valid_till), //8 => timestamp in unix format
      company_seq_number: company_seq_number, //8 => timestamp in unix format
    }


    const updateCompanyInfoSubscriptionState = new CompanyInfoState({
      ...updateSubscriptionPlanInfo
    })

    const subscriptionModifier = await getPayer()
  
    const buffer = CompanyInfoState.serializeUpdateCompanySubscriptionInfoInstruction(updateCompanyInfoSubscriptionState);
    
    const update_company_subscription_info_plan = new TransactionInstruction({
      programId: JobsOnChain_Company_Info_ID,
      keys: [
        { pubkey: subscriptionModifier.publicKey, isSigner: true, isWritable: true },
        { pubkey: owner,isSigner: false,isWritable: false},
        { pubkey: company_info_account[0], isSigner: false, isWritable: true },
        { pubkey: applicant_info_state_account[0], isSigner: false, isWritable: false },
        
        { pubkey: JobsOnChain_User_Info_ID, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
      ],
      data: Buffer.from(Uint8Array.of(2, ...buffer)),
    });
    await sendAndConfirmTransaction(
      connection,
      new Transaction().add(update_company_subscription_info_plan),
      [subscriptionModifier],
    )
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const companyInfoResult = await getCompanyInfo(company_info_account[0], connection);
    console.log("companyInfoResult => ", companyInfoResult);
    return companyInfoResult
  }catch(err){
    console.log("err => ", err)
    throw err
  }
}

export const pay_and_reveal_user_details = async (provider,owner, connection, plan_type) => {
  try{
    const candidate_pubkey = new PublicKey("D3YCmJCTyx8CtSv39bwN46Aut6At9ucGNf6QFzhnVrHc")
    let company_seq_number = "CP2";
    let job_number = "JP2"

    //Check if applicant_info_state_account exists
    const applicant_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(APPLICANT_STATE_ACCOUNT_PREFIX),
        candidate_pubkey.toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    const applicant_info_state_account_exists = await connection.getAccountInfo(applicant_info_state_account[0]);

    if(!applicant_info_state_account_exists){
      console.log("applicant_info_state_account not found");
      return;
    }
    console.log(" applicant_info_state_account => ", applicant_info_state_account[0].toBase58())
  
    //Check if company_info_account exists
    const company_info_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(COMPANY_STATE_ACCOUNT_PREFIX),
        Buffer.from(company_seq_number),
        applicant_info_state_account[0].toBuffer()
      ],
      JobsOnChain_Company_Info_ID
    );
    const company_info_account_exists = await connection.getAccountInfo(company_info_account[0]);
    if(!company_info_account_exists){
      console.log("company_info_account do not exists");
      return;
    }
    console.log(" company_info_account => ", company_info_account[0].toBase58());

    //Check if jobpost_info_account exists
    const jobpost_info_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(JOBPOST_STATE_ACCOUNT_PREFIX),
        Buffer.from(job_number),
        company_info_account[0].toBuffer()
      ],
      JobsOnChain_JobPost_Info_ID
    );
    const jobpost_info_account_exists = await connection.getAccountInfo(jobpost_info_account[0]);
    if(!jobpost_info_account_exists){
      console.log("jobpost_info_account do not exists");
      return;
    }
    console.log(" jobpost_info_account => ", jobpost_info_account[0].toBase58());

    //Check if workflow_info_account exists
    const workflow_info_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(WORKFLOW_STATE_ACCOUNT_PREFIX),
        jobpost_info_account[0].toBuffer()
      ],
      JobsOnChain_Workflow_Info_ID
    );

    const workflow_info_account_exists = await connection.getAccountInfo(workflow_info_account[0]);
    if(!workflow_info_account_exists){
      console.log("workflow_info_account do not exists");
      return;
    }
    console.log(" workflow_info_account => ", workflow_info_account[0].toBase58());

    //Check if contact_info_state_account of user exists
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

    const plan_type_details = REVEAL_USER_DETAILS_PRICE[plan_type];
    if(!plan_type_details){
      console.log("plan_type_details not found");
      return;
    }
    if(plan_type_details.price){
      const USDC_MINT_ID = new PublicKey(SOLANA_USDC_MINT_KEY_LOCALHOST);
      const usdcAccountExists = await findAssociatedTokenAccountPublicKey(owner, USDC_MINT_ID);
      if(!usdcAccountExists){
        console.log("USDC account not found in your wallet, Please load your wallet with USDC");
        return;
      }

      const payer = await getPayer();
      const payerUSDCAccount = await findAssociatedTokenAccountPublicKey(payer.publicKey, USDC_MINT_ID);

      const transferResult = await transferCustomToken(provider, connection, plan_type_details.price, usdcAccountExists, payerUSDCAccount);
      if(!transferResult){
        console.log("Transfer failed, Please try again");
        return;
      }

      console.log("transferResult => ", transferResult);
    }
    const updateWorkflowInfo = {
      is_paid: true,
      paid_amount: new BN(plan_type_details.price),
      paid_at: new BN(new Date().getTime()), //8 => timestamp in unix format
      last_updated_at: new BN(new Date().getTime()), //8 => timestamp in unix format
    }


    const updateJobApplyWorkflowInfo = new WorkflowInfoState({
      ...updateWorkflowInfo
    })

    const subscriptionModifier = await getPayer()
  
    const buffer = WorkflowInfoState.serializeUpdateWorkflowPaymentInfoInstruction(updateJobApplyWorkflowInfo);
    
    const update_job_workflow_payment_info_account_inst = new TransactionInstruction({
      programId: JobsOnChain_Workflow_Info_ID,
      keys: [
        { pubkey: subscriptionModifier.publicKey, isSigner: true, isWritable: true },
        { pubkey: owner,isSigner: false,isWritable: false},
        { pubkey: company_info_account[0], isSigner: false, isWritable: false },
        { pubkey: applicant_info_state_account[0], isSigner: false, isWritable: false },
        { pubkey: jobpost_info_account[0], isSigner: false, isWritable: false },
        { pubkey: workflow_info_account[0], isSigner: false, isWritable: true},
        
        { pubkey: JobsOnChain_User_Info_ID, isSigner: false, isWritable: false },
        { pubkey: JobsOnChain_Company_Info_ID, isSigner: false, isWritable: false },
        { pubkey: JobsOnChain_JobPost_Info_ID, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
      ],
      data: Buffer.from(Uint8Array.of(2, ...buffer)),
    });
    await sendAndConfirmTransaction(
      connection,
      new Transaction().add(update_job_workflow_payment_info_account_inst),
      [subscriptionModifier],
    )
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const workflowInfoResult = await getWorkflowInfo(workflow_info_account[0], connection);
    console.log("workflowInfoResult => ", workflowInfoResult);

    if(workflowInfoResult.is_paid){
      const userContantInfo = await getContactInfo(contact_info_state_account[0], connection);
      console.log("userContantInfo => ", userContantInfo);
      return userContantInfo;
    }
    return null

  }catch(err){
    console.log("err => ", err)
    throw err
  }
}

export const reveal_user_details = async (owner, connection) => {
  try{
    const candidate_pubkey = new PublicKey("D3YCmJCTyx8CtSv39bwN46Aut6At9ucGNf6QFzhnVrHc")
    let company_seq_number = "CP2";
    let job_number = "JP2"

    //Check if applicant_info_state_account exists
    const applicant_info_state_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(APPLICANT_STATE_ACCOUNT_PREFIX),
        candidate_pubkey.toBuffer(),
      ],
      JobsOnChain_User_Info_ID
    );

    const applicant_info_state_account_exists = await connection.getAccountInfo(applicant_info_state_account[0]);

    if(!applicant_info_state_account_exists){
      console.log("applicant_info_state_account not found");
      return;
    }
    console.log(" applicant_info_state_account => ", applicant_info_state_account[0].toBase58())
  
    //Check if company_info_account exists
    const company_info_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(COMPANY_STATE_ACCOUNT_PREFIX),
        Buffer.from(company_seq_number),
        applicant_info_state_account[0].toBuffer()
      ],
      JobsOnChain_Company_Info_ID
    );
    const company_info_account_exists = await connection.getAccountInfo(company_info_account[0]);
    if(!company_info_account_exists){
      console.log("company_info_account do not exists");
      return;
    }
    console.log(" company_info_account => ", company_info_account[0].toBase58());

    //Check if jobpost_info_account exists
    const jobpost_info_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(JOBPOST_STATE_ACCOUNT_PREFIX),
        Buffer.from(job_number),
        company_info_account[0].toBuffer()
      ],
      JobsOnChain_JobPost_Info_ID
    );
    const jobpost_info_account_exists = await connection.getAccountInfo(jobpost_info_account[0]);
    if(!jobpost_info_account_exists){
      console.log("jobpost_info_account do not exists");
      return;
    }
    console.log(" jobpost_info_account => ", jobpost_info_account[0].toBase58());

    //Check if workflow_info_account exists
    const workflow_info_account = await PublicKey.findProgramAddress(
      [
        Buffer.from(WORKFLOW_STATE_ACCOUNT_PREFIX),
        jobpost_info_account[0].toBuffer()
      ],
      JobsOnChain_Workflow_Info_ID
    );

    const workflow_info_account_exists = await connection.getAccountInfo(workflow_info_account[0]);
    if(!workflow_info_account_exists){
      console.log("workflow_info_account do not exists");
      return;
    }
    console.log(" workflow_info_account => ", workflow_info_account[0].toBase58());

    //Check if contact_info_state_account of user exists
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

    const workflowInfoResult = await getWorkflowInfo(workflow_info_account[0], connection);
    console.log("workflowInfoResult => ", workflowInfoResult);

    if(workflowInfoResult.is_paid){
      const userContantInfo = await getContactInfo(contact_info_state_account[0], connection);
      console.log("userContantInfo => ", userContantInfo);
      return userContantInfo;
    }else{
      console.log("You have not paid fee to see the details of => ", workflowInfoResult.user_pubkey.toBase58());
      return null
    }

  }catch(err){
    console.log("err => ", err)
    throw err
  }
}

export const fetchAllJobs = async (owner, connection) => {
  try{
    const allJobs = []
    const allJobsOfCompany = await findAllJobsOfCompany(connection);
    if(allJobsOfCompany.status){
      for(let job of allJobsOfCompany.data){
        console.log("job => ", job.pubkey.toBase58())
        const jobPostInfo = await getJobPostInfo(job.pubkey, connection);
        console.log("jobPostInfo => ", jobPostInfo)
        if(jobPostInfo){
          allJobs.push({
            pubkey: job.pubkey,
            parsedInfo: jobPostInfo,
            jobTitle: jobPostInfo.job_title,
          })
        }
      }
      console.log("allJobs => ", allJobs)
      return allJobs
    }
    
    console.log("No Jobs found");
    return []
    
  }catch(err){
    console.log("err in fetchAllJobs => ", err)
    throw err
  }
}

export const fetchAllCompanies = async (owner, connection) => {
  try{
    
    const allCompanies = []
    const allCompaniesInfo = await findAllCompanyInfosOfUser(connection);
    if(allCompaniesInfo.status){
      for(let company of allCompaniesInfo.data){
        const comapanyInfo = await getCompanyInfo(company.pubkey, connection);
        console.log("comapanyInfo => ", comapanyInfo)
        if(comapanyInfo){
          allCompanies.push({
            pubkey: company.pubkey,
            parsedInfo: comapanyInfo,
            companyName: comapanyInfo.name
          })
        }
      }
      console.log("allCompanies => ", allCompanies)
      return allCompanies
    }
    
    console.log("No Company found");
    return []
    
  }catch(err){
    console.log("err in fetchAllJobs => ", err)
    throw err
  }
}

export const fetchAllWorkflowOfJobPost = async (owner, connection) => {
  try{
    const job_info_pubkey = "CQr7mZ3SafhV1po7bQJT7DHXLJPAomfWQDjLBD2RW7eG";
    const allWorkflows = {
      [WORKFLOW_STATUSES[0]] : [],
      [WORKFLOW_STATUSES[1]] : [],
      [WORKFLOW_STATUSES[2]] : [],
      [WORKFLOW_STATUSES[3]] : [],
      [WORKFLOW_STATUSES[4]] : [],
      [WORKFLOW_STATUSES[5]] : [],
    }
    const allWorkflowOfJobPost = await findAllWorkflowOfJobPost(connection, new PublicKey(job_info_pubkey));
    if(allWorkflowOfJobPost.status){
      for(let workflow of allWorkflowOfJobPost.data){
        const workflowInfo = await getWorkflowInfo(workflow.pubkey, connection);
        if(workflowInfo){
          allWorkflows[workflowInfo.status].push({
            ...workflowInfo,
            pubkey: workflow.pubkey,
          })
        }
      }
      console.log("allWorkflows => ", allWorkflows)
      return allWorkflows
    }

    console.log("No Workflow found of job post");
    return []

  }catch(err){
    console.log("err in fetchAllJobs => ", err)
    throw err
  }
}

export const fetchAllWorkflowOfUsers = async (owner, connection) => {
  try{
    
    const allWorkflows = {
      [WORKFLOW_STATUSES[0]] : [],
      [WORKFLOW_STATUSES[1]] : [],
      [WORKFLOW_STATUSES[2]] : [],
      [WORKFLOW_STATUSES[3]] : [],
      [WORKFLOW_STATUSES[4]] : [],
      [WORKFLOW_STATUSES[5]] : [],
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
      return allWorkflows
    }

    const allWorkflowOfApplicants = await findAllWorkflowOfApplicant(connection, applicant_info_state_account[0]);
    if(allWorkflowOfApplicants.status){
      for(let workflow of allWorkflowOfApplicants.data){
        const workflowInfo = await getWorkflowInfo(workflow.pubkey, connection);
        if(workflowInfo){
          allWorkflows[workflowInfo.status].push({
            ...workflowInfo,
            pubkey: workflow.pubkey,
          })
        }
      }
      console.log("allWorkflows => ", allWorkflows)
      return allWorkflows
    }

    console.log("No Workflow found of applicant");
    return []

  }catch(err){
    console.log("err in fetchAllJobs => ", err)
    throw err
  }
}




// export const fetchAppliedApplicantInfo = async (owner, connection) => {
//   try{
//     const job_info_pubkey = "CQr7mZ3SafhV1po7bQJT7DHXLJPAomfWQDjLBD2RW7eG",

//     const allAppliedApplicants = []
//     const allAppliedApplicantsInfo = await findAllAppliedApplicants(connection);
//     if(allAppliedApplicantsInfo.status){
//       for(let applicant of allAppliedApplicantsInfo.data){
//         const applicantInfo = await getApplicantInfo(applicant.pubkey, connection);
//         console.log("applicantInfo => ", applicantInfo)
//         if(applicantInfo){
//           allAppliedApplicants.push({
//             pubkey: applicant.pubkey,
//             parsedInfo: applicantInfo,
//             applicantName: applicantInfo.name
//           })
//         }
//       }
//       console.log("allAppliedApplicants => ", allAppliedApplicants)
//       return allAppliedApplicants
//     }
    
//     console.log("No Applicant found");
//     return []
//   }catch(err){
//     console.log("err in fetchAppliedApplicantInfo => ", err)
//     throw err
//   }
// }