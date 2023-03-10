import { AccountLayout, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import {FAILED_TO_FIND_ACCOUNT, INVALID_ACCOUNT_OWNER} from './helpers/ErrorHandling'
import { COMMITMENT } from './helpers/connection';

export const getAccountInfo = async(
    account,
    connection
) => {
    let accountPub = new PublicKey(account);
    const info = await connection.getAccountInfo(accountPub, COMMITMENT);

    if(info === null){
      throw Error(FAILED_TO_FIND_ACCOUNT);
    }

    if (!info.owner.equals(TOKEN_PROGRAM_ID)) {
      throw Error(INVALID_ACCOUNT_OWNER);
    }
    
    if (info.data.length !== AccountLayout.span) {
      throw Error('Invalid account size');
    }
}