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

export const sell = async (user, amount) => {
  console.log("user",user.toString());

  //it is also a PDA for the user account
  // const user_state_account = await PublicKey.findProgramAddress(
  //   [
  //     user.toBuffer(),
  //     platform_state_account.toBuffer(),
  //   ],
  //   ProgramID,  
  // );
  // console.log("user_state_account",user_state_account[0].toString());


  let nft_mint_key_string = "6Aut6At9ucGNf6QFzhnVrHcD3YCmJCTyx8CtSv39bwN4"

  const nft_mint_key = new PublicKey(nft_mint_key_string)

  const user_state_account = await PublicKey.findProgramAddress(
    [
      nft_mint_key.toBuffer(),
    ],
    ProgramID,  
  );
  const initUserIx = new TransactionInstruction({
    programId: ProgramID,
    keys: [
      {
        pubkey: user_state_account[0],
        isSigner: false,
        isWritable: true,
      },

      {
        pubkey: user,
        isSigner: true,
        isWritable: false
      },
      { pubkey: nft_mint_key, isSigner: false, isWritable: false },
    ],
    data: Buffer.from(Uint8Array.of(1)),
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
//         let user_state_account = next_account_info(account_info_iter)?;

//         let platform_state = next_account_info(account_info_iter)?;
//         let user_sending_token_account = next_account_info(account_info_iter)?;

//         let user_reciving_token_account = next_account_info(account_info_iter)?;
//         let owner_recining_token_account = next_account_info(account_info_iter)?;

//         let pda_token_account = next_account_info(account_info_iter)?;
//         let pda_account = next_account_info(account_info_iter)?;

//         let token_program = next_account_info(account_info_iter)?;
//         let system_program = next_account_info(account_info_iter)?;