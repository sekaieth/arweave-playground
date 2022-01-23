import * as key from "./arweave-key-lvNDkdPnmY5e26mS2SqYW-u5B89ixGywoqT7c5vgaB8.json";
import InitArweave from "./arweave_components/initialize-arweave";
import * as fs from 'fs';


const app = async () => {

    const delay = ms => new Promise(res => setTimeout(res, ms));

    // Get Wallet Address
    const wallet = await InitArweave.wallets.generate().then((key) => {
        console.log("wallet address:", key.n);
        return(key.n);
    });


    // Get Wallet Balance
    const walletBalance = await InitArweave.wallets.getBalance(wallet);
    console.log("Wallet balance:", InitArweave.ar.winstonToAr(walletBalance), "AR");


    // Send a file to Arweave storage - READ HERE: https://github.com/ArweaveTeam/arweave-js#submit-a-transaction
    let data = fs.readFileSync("./storage/4.png");

    const tx = await InitArweave.createTransaction({ data: data }, key);
    tx.addTag("Content-Type", 'images/math-doge');

    await InitArweave.transactions.sign(tx, key);

    let uploader = await InitArweave.transactions.getUploader(tx);

    while (!uploader.isComplete) {
        await uploader.uploadChunk();
        console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
    }

    console.log(tx.id);


    
    const response = await InitArweave.transactions.getStatus(tx.id).then(res => {
        return(res);
    })

    await response.confirmed;
    console.log(response);


    // let tx = "1dt4OLT3Kx_f7J3AwqmXbNseU8uK31zcj_XUbmYyuLI"

    // Get Transaction data
    await InitArweave.transactions.getData(tx.id, {
        decode: true,
        string: true,
    }).then(data => {

    })    
 }




app();