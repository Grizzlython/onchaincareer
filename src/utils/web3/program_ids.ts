import { PublicKey } from "@solana/web3.js";

import { Keypair } from "@solana/web3.js";
import * as bs58 from "bs58";

export const getPayer = async () => {
    const payer = Keypair.fromSecretKey(
        bs58.decode(
            "EZiYDawUFJs3EccJxuVFf6c7ZCtYLDqDe5fERkjec1yyMURFeSX53ctdYA9yA3v9QeKau1dTYkjXZf4EeduDfjq"
        )
    );
    console.log("payer.publicKey",payer.publicKey.toString());

    return payer;
}


export const JobsOnChain_Company_Info_ID= new PublicKey(
    "7LCJNYnEsDowNuvzuE7zU7NRMDcJTZVww7JUxy6wzScA"
)

export const JobsOnChain_User_Info_ID= new PublicKey(
    "7YcLfcHdPNu8CQZHXxx4tv14ixmb6PgEShXsg3GSnbKH"
)

export const JobsOnChain_JobPost_Info_ID= new PublicKey(
    "BCnQorAXBjyGWnG3ibpPgqpWSvveg3c7cB8s72c86u1P"
)

export const JobsOnChain_Workflow_Info_ID= new PublicKey(
    "2jyMuUyTEwyKeENJyoRgP5MYZ7pi4SpiwEBvDUKmk3m2"
)

export const treasory_token_account = new PublicKey(
    "2ZdkFQn8368BTZEjob5NpLgWtMgF758n8Bj4CwAgsuqS" //devnet
    // "3iLXMXbRFkVX3xn8i2aotQ33qpi1tubKcLfMYMLyywze"
)
