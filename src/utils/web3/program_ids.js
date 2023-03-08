import { PublicKey } from "@solana/web3.js";

import { Keypair } from "@solana/web3.js";
import * as bs58 from "bs58";

export const getPayer = async () => {
  const payer = Keypair.fromSecretKey(
    bs58.decode(
      "fN3dx6VJGeavVgacLQxTnwsc3RKJnvkcQAPitPJJQmqjsyBaBCkP5h41NpzTEpa8N2Xt4vYBZFkbGbMPepmXh9R"
    )
  );
  console.log("payer.publicKey", payer.publicKey.toString());

  return payer;
};

export const JobsOnChain_Company_Info_ID= new PublicKey(
  "GywWffH4UJLzQbzzL2Vev4crTQuuhEiRsXFSkfrsvuDe"
)

export const JobsOnChain_User_Info_ID= new PublicKey(
  "CNnXFatV8KHh2oDi4mKa66sr4ParoRUAWWiBkG8R2aE1"
)

export const JobsOnChain_JobPost_Info_ID= new PublicKey(
  "88w7CBXNJWMZ9FTePZeZ41KUV1zTkdNg237RYVKk1tCg"
)

export const JobsOnChain_Workflow_Info_ID= new PublicKey(
  "HpbeowEJ2mQ3sryZsHmSE5nvpAj1MJ6ZixvRackkRKWo"
)

export const treasory_token_account = new PublicKey(
  "2ZdkFQn8368BTZEjob5NpLgWtMgF758n8Bj4CwAgsuqS" //devnet
  // "3iLXMXbRFkVX3xn8i2aotQ33qpi1tubKcLfMYMLyywze"
);
