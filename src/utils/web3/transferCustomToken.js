 import * as splToken from '@solana/spl-token'
 import {Transaction} from '@solana/web3.js'

  const createTransferTransaction = async (ownerPubkey, connection, fromCustomTokenAccountPubkey, toCustomTokenAccountPubkey, tokenToTransferLamports) => {

    let transaction = new Transaction().add(
      splToken.Token.createTransferInstruction(
        splToken.TOKEN_PROGRAM_ID,
        fromCustomTokenAccountPubkey,
        toCustomTokenAccountPubkey,
        ownerPubkey,
        [],
        tokenToTransferLamports,
      )
    );
    transaction.feePayer =  ownerPubkey;
    console.log('Getting recent blockhash');
    transaction.recentBlockhash = (
      await connection.getRecentBlockhash()
    ).blockhash;
    return transaction;
  };


  export const transferCustomToken = async(provider, connection, tokenToTransfer, fromCustomTokenAccountPubkey, toCustomTokenAccountPubkey)=>{
      
    if(tokenToTransfer <= 0){
        return {status: false, error: "You can not transfer, Token to transfer should be greater than 0."}
    }
    const tokenToTransferLamports = tokenToTransfer * 1000000 //USDC on devnet and mainnet has 6 decimals
    const transaction = await createTransferTransaction(provider.publicKey,connection, fromCustomTokenAccountPubkey, toCustomTokenAccountPubkey, tokenToTransferLamports);
    if (transaction) {
        try {
        let signed = await provider.signTransaction(transaction);
        console.log('Got signature, submitting transaction');
        let signature = await connection.sendRawTransaction(signed.serialize());
        console.log(
            'Submitted transaction ' + signature + ', awaiting confirmation'
        );
        await connection.confirmTransaction(signature);
        console.log('Transaction ' + signature + ' confirmed');
        return {status: true, signature}
        } catch (e) {
        console.warn(e);
        console.log('Error: ' + e.message);
        return {status: false, error: e.message}
        }
    }
    return {
        status: false,
        error: "No transaction found"
    }
  }
