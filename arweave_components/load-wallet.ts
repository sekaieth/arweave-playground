import Arweave = require('arweave');
import InitArweave from "./initialize-arweave";
import * as key from "../arweave-key-lvNDkdPnmY5e26mS2SqYW-u5B89ixGywoqT7c5vgaB8.json";
import * as dotenv from "dotenv";

const loadWallet = () => {

InitArweave.wallets.jwkToAddress(key).then((address) => {
    return(address)
})
     // Get wallet balance


};

loadWallet();

export default loadWallet;