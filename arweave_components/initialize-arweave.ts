import Arweave = require('arweave');

const InitArweave = Arweave.init({
    host: "localhost",
    port: 1984,
    protocol: "http",
});


export default InitArweave;