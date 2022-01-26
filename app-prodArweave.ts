import * as key from "./arweave-key-lvNDkdPnmY5e26mS2SqYW-u5B89ixGywoqT7c5vgaB8.json";
import InitArweave from "./arweave_components/initialize-arweave";
import * as fs from 'fs';

// instead of continuing to fight node-fetch, i came across this alternative that can just be imported
import fetch from 'cross-fetch';

const app = async () => {

    const delay = ms => new Promise(res => setTimeout(res, ms));

/* 
================================================
            WALLET KEY GENERATION
================================================
*/


// ****IMPORT EXISTING WALLET AND GET ADDRESS***
    const walletAddress = await InitArweave.wallets.jwkToAddress(key).then(address => {
        console.log("Wallet address: ", address);
        return(address);
    })

    
// ****GET WALLET BALANCE****
    const walletBalance = await InitArweave.wallets.getBalance(walletAddress);
    console.log("Wallet Balance:", InitArweave.ar.winstonToAr(walletBalance), "AR"); 
    // const walletBalance = await InitArweave.wallets.getBalance(WalletAddress);
    // console.log("Wallet balance:", InitArweave.ar.winstonToAr(walletBalance), "AR");

 /* 
================================================
            TRANSACTIONS
================================================
*/   
    
//  **** SENDING A FILE TO ARWEAVE STORAGE**** - READ HERE: https://github.com/ArweaveTeam/arweave-js#submit-a-transaction

// **** Base64 Encode ****

async function base64_encode(file) {
    const decode = Buffer.from(file, 'binary').toString('base64');
    return(decode);
}



// ****GET FILE****
    let data = fs.readFileSync("./storage/4.png");

    const encodedData = await base64_encode(data);

// **** CREATE TRANSACTION
    const tx = await InitArweave.createTransaction({ data: encodedData }, key);
    tx.addTag("Content-Type", 'image/png;base64');

    // const tx = "1dt4OLT3Kx_f7J3AwqmXbNseU8uK31zcj_XUbmYyuLI";

// **** SIGN TRANSACTION
    const signTx = await InitArweave.transactions.sign(tx, key);

// ****UPLOAD FILE****

//       ***** @DEV - THIS IS COMMENTED OUT - WE HAVE TRANSACTIONS ON ARWEAVE MAINNET TO PULL ****
    let uploader = await InitArweave.transactions.getUploader(tx);
    while (!uploader.isComplete) {
         await uploader.uploadChunk();
         console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
    }

    console.log("Transaction ID:", tx.id);

     // get status until success or failure.... NOTE: while testing, the confirmed property will just log as saying 'Pending'
     // until an upload to mine a block, which will put it on the local chain
    var success = false;
    var loops = 0;

    while (!success) {

        await delay(2000)

        let response = await InitArweave.transactions.getStatus(tx.id);

        console.log(response);

        // if there's an error, break out of the loop
        if(response.status >= 400)
        {
            break;
        }
        else if(response.status === 200 && response.confirmed?.number_of_confirmations >= 0)
        {
            success = true;
        }

        loops += 1;
    }

    console.log(`Upload confirmed: ${success}`);

//     if(success)
//     {
//         let decodedData = await getTransactionData(tx.id);
//         console.log(`\n\n--------------------------------------------\nDecoded data: ${decodedData}`);
//     }

//  }


// Get Transaction data
// NOTE: i'm getting errors that it's unable to get the chunk at offset -143884. so i tried a different
// function with calling what's in the arlocal api, and determined you can get the offset from tx/id/offset
// and then the chunk of data from chunk/offset (as a positive number, not negative)
// ...so I'm not sure why this passing in a negative here. anyway the other function is bringing back raw data
// async function getTransactionData(txId) {
//     console.log(`Transaction Id: ${txId}`);
//     await InitArweave.transactions.getData(tx.id).then(data => {
//         return(data);
//         // CjwhRE9DVFlQRSBodG1sPgo...
//     });
// }


// const transactionData = await getTransactionData(tx);
// console.log(transactionData);
// console.log(`\n\n--------------------------------------------\nDecoded data: ${data.toString()}`)



// async function getTransactionData2(txId) {
//     console.log(`Transaction Id: ${txId}`);
//     const offset = await fetch(`http://localhost:1984/tx/${txId}/offset`).then((res:any) => {
//         return res.json();
//     }).then((data) => {
//         return(data.offset);
//     });    
//     console.log(`Offset: ${offset}`);

//     const chunk:string = await fetch(`http://localhost:1984/chunk/${offset}`).then((res:any) => {
//         return res.json();
//     }).then((data) => {
//         return(data.chunk);
//     });
//     console.log(`chunk: ${chunk.substring(0,500)}...`);

//     const decode = Buffer.from(chunk, 'base64').toString('binary');
//     return decode;
// }

}

app();