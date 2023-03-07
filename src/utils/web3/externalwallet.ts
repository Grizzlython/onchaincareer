import { Transaction } from "@solana/web3.js"
export const COMMITMENT = "singleGossip"; 
export const sendTxUsingExternalSignature = async(
    instructions,
    connection,
    feePayer,
    signersExceptWallet,
    wallet,  //this is a public key
    signTransaction
) => {

    let tx = new Transaction();
    tx.add(...instructions);
    tx.recentBlockhash = (await connection.getRecentBlockhash("max")).blockhash;
    tx.setSigners(
            ...(feePayer
            ? [(feePayer).publicKey, wallet] //change user
            : [wallet]), //change user
            ...signersExceptWallet.map(s => s.publicKey)
    );

    signersExceptWallet.forEach(acc => {
        tx.partialSign(acc);
    });

    const signedTransaction = await signTransaction(tx);
    try{
        const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
            skipPreflight: true,
            preflightCommitment: COMMITMENT
        });
        console.log(signature,'----signature----')
        return signature
    }catch(err){
        console.log(err,'----err in transaction----');
        throw err
    }

}