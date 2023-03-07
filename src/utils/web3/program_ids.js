import { PublicKey } from "@solana/web3.js";

import { Keypair } from "@solana/web3.js";
import * as bs58 from "bs58";

export const getPayer = async () => {
  const payer = Keypair.fromSecretKey(
    bs58.decode(
      "cRDi6UnWMgbG8cGvZECzWwkcBgHqNmRuBX9YDZR7Gjr8YE8FERKUsWgnA8h23kf1aHsMUza2rtU8cm1NQnDVgfq"
    )
  );
  console.log("payer.publicKey", payer.publicKey.toString());

  return payer;
};

export const JobsOnChain_Company_Info_ID= new PublicKey(
  "FcizG1TyTSR3mgGMEDGvojwoQQZyX5RVkTdkivL8Fxzi"
)

export const JobsOnChain_User_Info_ID= new PublicKey(
  "A5TeEjBBFBSwJc6XGDjwD33wo5rZokC7hjAvMosmiF2i"
)

export const JobsOnChain_JobPost_Info_ID= new PublicKey(
  "MHvhkM4AfHJRKEKtcNtx2k7GyHnXG3MQdGQLdnoB7Y9"
)

export const JobsOnChain_Workflow_Info_ID= new PublicKey(
  "J75gFMUDkYEiSAvMYv5dkfRiHxHkyMADcSVr8PL3PBoo"
)

export const treasory_token_account = new PublicKey(
  "2ZdkFQn8368BTZEjob5NpLgWtMgF758n8Bj4CwAgsuqS" //devnet
  // "3iLXMXbRFkVX3xn8i2aotQ33qpi1tubKcLfMYMLyywze"
);
