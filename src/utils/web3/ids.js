import { PublicKey } from "@solana/web3.js";

import { Keypair } from "@solana/web3.js";
import * as bs58 from "bs58";

export const getPayer = async () => {
    const payer = Keypair.fromSecretKey(
        bs58.decode(
            "cRDi6UnWMgbG8cGvZECzWwkcBgHqNmRuBX9YDZR7Gjr8YE8FERKUsWgnA8h23kf1aHsMUza2rtU8cm1NQnDVgfq"
        )
        //localhost_solg: "28qpKyGX1p4h8Bh6R5ZndVq54tdnNqg5PQX2yEmwWGtBUA6JKZJ5E3e1QpkBfGzkj3eTGeFgK8xs1QUX3NGXkunh"
    );
    console.log("payer.publicKey ==> ",payer.publicKey.toString());

    return payer;
}

export const Solgames_UAC_ProgramID = new PublicKey(
    "DnPnsoRjMiHCAfaye1mMdiuXYA4gdwpCTQTmqqvznr6w" //devnet
    // "7KcMSpfQiePs5jRJanfBwDextCtPmFG5sMTUUEV4Nxm9" //localhost
);

export const Daily_Game_League_ProgramID = new PublicKey(
    "FXBGBTBaDCXwRGEGeQ3Thw2DHJR5BVtM8tKNq6VXybHT"
)

export const Game_Info_ProgramID = new PublicKey(
    "3BrUQHz5UF9ZpPgxt4p4e4a4qfUkFeaRQCJnPMvSFj6o"
)

export const ProgramID = new PublicKey(
    "Eu5xK9QwfihAz167JEQT4VbbtTvLt5Co66kY1aTs5xJX"
);

export const Game_Categories_ID = new PublicKey(
    "4BZoRf2DcjnVxqXfYBP8wSeTdvFPXRRT4oAJHr3booJ4"
);

export const Collection_Info_ID = new PublicKey(
    "DSJVXt8QBtCsbqZn4T79kfUTN4hNwHLbX57oMdStzMg2"
);

export const Solgames_User_Info_ID = new PublicKey(
    "3zQeSVLBjvHcVnkqaYdu5zTxLDTHSidZHpHQfrAcoxAY"
)

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

export const platform_state_account  = new PublicKey(
    "CFukUJoXFcy53PzhUPLxyCBv7pmHqdkqqkbqxn23iGz1" // state account which will generated once for SolgamesUACProgram
    //PDA => 4dcNWyNVwTfoBrAjDS8cqw5t3B3FinpkM6GkHWaLiAaL
    //PDA token account => CzViCxJa2dUYmnavybwTxK3p9fPf7eSAm7B12J8VHNWH
);

export const platform_user_nft_state_account = new PublicKey(
"FnxZEXYnphy83UR9vfZGNxyzDAaWWQu4SLVTZ5hwsTyW" 
    // Above address is same as PDA of the user nft state account
    //corresponding pda_token_account => 2tdTkrJuppCZz5FjiszxzGtjuu9eDxLPkouqpKUbTh9W
)

export const treasory_token_account = new PublicKey(
    "2ZdkFQn8368BTZEjob5NpLgWtMgF758n8Bj4CwAgsuqS" //devnet
    // "3iLXMXbRFkVX3xn8i2aotQ33qpi1tubKcLfMYMLyywze"
)

//This account will be generated once for game_daily_league_program on daily basis for each game respectively
//This address act as unique league id and will be used to generate player_league_state_account for each gameplay against each game respectively
export const daily_league_platform_state_account = new PublicKey(
    "3x1qYKfDSJkQexWzwnU27NxkMjZ6kqdW7AqpKejF9Nuf" //corresponding pda_token_account => HJFLuNT99JVrD8qUnGjKTxZPAK7DViRcsGAkzWSHDQo9
) 

export const usdc_mint  = new PublicKey(
    "C4L2SwMeKGZw1eQFgytw5CCydDtWxaiA31DJdcNQGCNW"
);


//it's SOLG token mint address on local
export const SOLG_token_mint  = new PublicKey(
    "F5QjKQdHXy7WzBxtPxpasQ34vGtGGsidrYJwqmXyQ82x" //devnet
);

export const token_mint  = new PublicKey(
    "DxHG5wMJoecJDpiDJte622mdfV9BFwiaCZtv4kmBxV8v"
);

export const owner_account  = new PublicKey(
    "D3YCmJCTyx8CtSv39bwN46Aut6At9ucGNf6QFzhnVrHc"
);


export const User_Fee_collector_ProgramId = new PublicKey(
    "5AhLrFUnP9d8JrHmFExrWuhuerMEXTzZJKgtdW1dKbsr"
);



export const ufc_state_account_stored = new PublicKey(
    "Cu2t8abJeEy1osdge6VouB5ox7G87VckeBhqBaoNowBU"
)



//state account for a game generated once for game_info_program
//This will be generated once when developer will upload the game to the Solgames platform
//Later game_info_state_account will be used to create game_daily_league_state_account on daily basis
export const game_info_state_account = new PublicKey(
"G8YRUzssrDgHA7sv7H3TSmNVWm6Vifwvk6ic6hDCMgMe" 
)



//player_league_state_account => EKPfTcPQ6ykM1CHbqWc1oqsBLfc5X54b9fZ5kTSLx7Ty
//player_league_state_account_key => 9AzKKn7hqgXJpeA97N3fCY2SWdgCQvsPWHFF7oHLFAoY
//esr_usc_program_id 9eQ1ePhvDQTRrnrJLqnC1dS8kXjGeN7eBkQf4dZw7e2T
//esr_uac_state_account C55qYs3eW4hQufCBbLZbiyVF97tCkZxiDeC8AnutP7yt
//esr_uac_pda 4u4zS8DG9cEJqugzTQzv6K2b6DmiV7HEAWAw7iExmi4m
//esr_uac_pda_token_account  6pz6ZRjG8r7RTQkr8KeBMxo4UvBbB7RLpM3JjFi9RKtk
//ower_token_account BLbNVq4PwGuN17Q5CTVpnMJCjrF83kWbHss4cg3Yu9PD
//user_account 3hGX9LE1fVm7kMgugxxTyqcvGBT6z12L6WgL5vw7i6MD