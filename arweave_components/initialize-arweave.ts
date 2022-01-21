import Arweave = require('arweave');

const InitArweave = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https",
});


export default InitArweave;