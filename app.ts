//import * as key from "./arweave-key-lvNDkdPnmY5e26mS2SqYW-u5B89ixGywoqT7c5vgaB8.json";
import InitArweave from "./arweave_components/initialize-arweave";
import * as fs from 'fs';

// instead of continuing to fight node-fetch, i came across this alternative that can just be imported
import fetch from 'cross-fetch';

const app = async () => {

    const delay = ms => new Promise(res => setTimeout(res, ms));
    
    // generate wallet
    const generatedKey = await InitArweave.wallets.generate();

    // get address from the wallet
    const walletAddress = await InitArweave.wallets.jwkToAddress(generatedKey);

    // mint 1 AR to that wallet address
    const res = await fetch(`http://localhost:1984/mint/${walletAddress}/1000000000000`);
    if (res.status >= 400) {
        throw new Error("Bad response from server");
    }

    // get and show wallet address
    const walletBalance = await InitArweave.wallets.getBalance(walletAddress);
    console.log("Wallet balance:", InitArweave.ar.winstonToAr(walletBalance), "AR");
    
    // Send a file to Arweave storage - READ HERE: https://github.com/ArweaveTeam/arweave-js#submit-a-transaction
    let data = fs.readFileSync("./storage/4.png");

    // create transaction
    const tx = await InitArweave.createTransaction({ data: data }, generatedKey);
    tx.addTag("Content-Type", 'images/math-doge');

    // sign transaction
    await InitArweave.transactions.sign(tx, generatedKey);

    // upload file
    let uploader = await InitArweave.transactions.getUploader(tx);
    while (!uploader.isComplete) {
         await uploader.uploadChunk();
         console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
    }

    console.log(tx.id);

    // get status until success or failure.... NOTE: while testing, the confirmed property will just log as saying 'Pending'
    // until you go to http://localhost:1894/mine to mine a block, which will put it on the local chain
    var success = false;
    var loops = 0;

    while (!success) {

        await delay(700)

        // after 3 loops, i'm throwing a call to 'mine' in here, just to simulate waiting for a block to be mined to verify the transaction
        if(loops == 3)
        {
            fetch('http://localhost:1984/mine');
        }

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

    if(success)
    {
        let decodedData = await getTransactionData2(tx.id);
        console.log(`\n\n--------------------------------------------\nDecoded data: ${decodedData.substring(0, 500)}...`);
    }

 }


// Get Transaction data
// NOTE: i'm getting errors that it's unable to get the chunk at offset -143884. so i tried a different
// function with calling what's in the arlocal api, and determined you can get the offset from tx/id/offset
// and then the chunk of data from chunk/offset (as a positive number, not negative)
// ...so I'm not sure why this passing in a negative here. anyway the other function is bringing back raw data
async function getTransactionData(txId) {
    console.log(`Transaction Id: ${txId}`);
    await InitArweave.transactions.getData(txId).then(data => {
        console.log(data);
        // CjwhRE9DVFlQRSBodG1sPgo...
    });
}

async function getTransactionData2(txId) {
    console.log(`Transaction Id: ${txId}`);
    const offset = await fetch(`http://localhost:1984/tx/${txId}/offset`).then((res:any) => {
        return res.json();
    }).then((data) => {
        return(data.offset);
    });    
    console.log(`Offset: ${offset}`);

    const chunk:string = await fetch(`http://localhost:1984/chunk/${offset}`).then((res:any) => {
        return res.json();
    }).then((data) => {
        return(data.chunk);
    });
    console.log(`chunk: ${chunk.substring(0,500)}...`);

    const decode = Buffer.from(chunk, 'base64').toString('binary');
    return decode;
}


app();