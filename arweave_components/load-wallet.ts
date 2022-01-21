import Arweave = require('arweave');
import initArweave from "./initialize-arweave";
import * as dotenv from "dotenv";

const loadWallet => {

initArweave.wallets.jwkToAddress(`${process.env.ARWEAVE_PKEY}`).then((address) => {
    console.log(address);
    })
};

loadWallet();

export default loadWallet;