import Arweave = require('arweave');

const InitArweave = Arweave.init({
    host: "arweave.net",
    port: 1984,
    protocol: "http",
    timeout: 20000,
});


export default InitArweave;