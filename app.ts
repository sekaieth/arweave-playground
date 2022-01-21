import loadWallet from "./arweave_components/load-wallet";

const app = () => {

    const wallet = loadWallet();
    console.log(wallet);
};

app();