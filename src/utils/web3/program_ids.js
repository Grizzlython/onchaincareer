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
  "5FdvtwDvDqDRduCBbYiX3Csi1pSreKLgSYZWDrAL5DC3"
)

export const JobsOnChain_User_Info_ID= new PublicKey(
  "HPRDNuy9QZqkeCRpnN1JqxJZgnX3sKPLnJKaJGVQNVCG"
)

export const JobsOnChain_JobPost_Info_ID= new PublicKey(
  "BiZCx5pKofnQ2YQRGReTNpt2L8icS8ZBgUsaq3sgjDYa"
)

export const JobsOnChain_Workflow_Info_ID= new PublicKey(
  "HtoJF8LiD7yWFbZnYiturhvtpVTETXC4PLEHQYK4fqMd"
)

export const treasory_token_account = new PublicKey(
  "2ZdkFQn8368BTZEjob5NpLgWtMgF758n8Bj4CwAgsuqS" //devnet
  // "3iLXMXbRFkVX3xn8i2aotQ33qpi1tubKcLfMYMLyywze"
);
