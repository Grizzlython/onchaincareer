import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

import {
  Keypair,
  SystemProgram,
  //Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { connection } from "../components/connection";
import { sendTxUsingExternalSignature } from "./externalwallet";
import { getOrCreateAssociatedAccount } from "../components/getOrCreateAssociatedAccount";
import { ProgramID, usdc_mint,platform_state_account, token_mint,owner_account } from "../components/ids";

const BN = require("bn.js");

export const claim_vesting = async (user) => {
  console.log("user",user.toString());


  const user_state_account = await PublicKey.findProgramAddress(
    [
      user.toBuffer(),
      platform_state_account.toBuffer(),
    ],
    ProgramID,  
  );
  console.log("user_state_account",user_state_account[0].toString());


  const user_sending_token_account = await getOrCreateAssociatedAccount(
    user,
    usdc_mint,
    user
  );

  const ower_token_account = await getOrCreateAssociatedAccount(
    owner_account,
    usdc_mint,
    owner_account
  );

  const user_reciving_token_account = await getOrCreateAssociatedAccount(
    user,
    token_mint,
    user
  );

  const PDA = await PublicKey.findProgramAddress(
    [
      Buffer.from("Private_selling"),
      platform_state_account.toBuffer(),
    ],
    ProgramID
  );
  console.log("pda",PDA[0].toString());
  

  const PDA_tokenAccount = await getOrCreateAssociatedAccount(
    PDA[0],
    token_mint,
    user
  );
  const user_pda_token_account = await getOrCreateAssociatedAccount(
    user_state_account[0],
    token_mint,
    user
  );

  const initUserIx = new TransactionInstruction({
    programId: ProgramID,
    keys: [
      { pubkey: user, isSigner: true, isWritable: false },
      {
        pubkey: user_state_account[0],
        isSigner: false,
        isWritable: true,
      },
      { pubkey: user_pda_token_account, isSigner: false, isWritable: true },

      {
        pubkey: platform_state_account,
        isSigner: false,
        isWritable: true,
      },
      { pubkey: PDA_tokenAccount, isSigner: false, isWritable: true },
      { pubkey: user_reciving_token_account, isSigner: false, isWritable: true },


      { pubkey: PDA[0], isSigner: false, isWritable: true },


      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },



    ],
    data: Buffer.from(Uint8Array.of(2)),
  });

  await sendTxUsingExternalSignature(
    [
      
      initUserIx
    ],
    connection,
    null,
    [],
    new PublicKey(user)
  );
  await new Promise((resolve) => setTimeout(resolve, 2000));


  console.log(`INIT platform successfully initialized \n`);
};



// let user = next_account_info(account_info_iter)?;
// let user_state_account = next_account_info(account_info_iter)?;
// let platform_state = next_account_info(account_info_iter)?;

// let pda_token_account = next_account_info(account_info_iter)?;
// let user_reciving_token_account = next_account_info(account_info_iter)?;

// let pda_account = next_account_info(account_info_iter)?;

// let token_program = next_account_info(account_info_iter)?;