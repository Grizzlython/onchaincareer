export const WORKFLOW_STATUSES_enum = {
    SAVED: "saved",
    APPLIED: "applied",
    IN_PROGRESS: "in_progress",
    ACCEPTED: "accepted",
    REJECTED: "rejected",
    WITHDRAW: "withdraw"
}
export const WORKFLOW_STATUSES = [WORKFLOW_STATUSES_enum.ACCEPTED, WORKFLOW_STATUSES_enum.REJECTED, WORKFLOW_STATUSES_enum.WITHDRAW, WORKFLOW_STATUSES_enum.SAVED, WORKFLOW_STATUSES_enum.APPLIED, WORKFLOW_STATUSES_enum.IN_PROGRESS]
//saved => when candidate saves the job
//applied => when candidate applies for the job
//in_progress => when company move the job to in_progress
//accepted => when company accepts the candidate
//rejected => when company rejects the candidate

export const SUBSCRIPTION_PLANS_enum = {
    PAYNUSE : "paynuse",
    SIXMONTHS : "sixmonths",
    YEARLY : "yearly",
    FOREVER : "forever"
}

export const SUBSCRIPTION_PLANS = [SUBSCRIPTION_PLANS_enum.PAYNUSE, SUBSCRIPTION_PLANS_enum.SIXMONTHS, SUBSCRIPTION_PLANS_enum.YEARLY, SUBSCRIPTION_PLANS_enum.FOREVER]

export const SUBSCRIPTION_PLANS_PRICES = {
    [SUBSCRIPTION_PLANS_enum.PAYNUSE] : {
        price: 0,
        subscription_purchased_on: new Date().getTime(),
        subscription_valid_till: new Date().getTime(),
    },
    [SUBSCRIPTION_PLANS_enum.SIXMONTHS] : {
        price: 150,
        subscription_purchased_on: new Date().getTime(),
        subscription_valid_till: new Date().getTime()+6*30*24*60*60*1000,
    },
    [SUBSCRIPTION_PLANS_enum.YEARLY] : {
        price: 200,
        subscription_purchased_on: new Date().getTime(),
        subscription_valid_till: new Date().getTime()+12*30*24*60*60*1000,
    },
    [SUBSCRIPTION_PLANS_enum.FOREVER] : {
        price: 500,
        subscription_purchased_on: new Date().getTime(),
        subscription_valid_till: new Date().getTime()+100*12*30*24*60*60*1000,
    },
}
export const REVEAL_USER_DETAILS_PRICE = {
    [SUBSCRIPTION_PLANS_enum.PAYNUSE]:{
        price: 10,
    },
    [SUBSCRIPTION_PLANS_enum.SIXMONTHS]:{
        price: 0,
    },
    [SUBSCRIPTION_PLANS_enum.YEARLY]:{
        price: 0,
    },
    [SUBSCRIPTION_PLANS_enum.FOREVER]:{
        price: 0,
    }
}

export const SOLANA_USDC_MINT_KEY_MAINNET = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"

export const SOLANA_USDC_MINT_KEY_DEVNET = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"

export const SOLANA_USDC_MINT_KEY_LOCALHOST = "DxHG5wMJoecJDpiDJte622mdfV9BFwiaCZtv4kmBxV8v"

//paynuse => pay as you use
//sixmonths => 6 months
//yearly => 1 year
//forever => forever (lifetime) use