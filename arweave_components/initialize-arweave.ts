import Arweave = require('arweave');

const initArweave = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https"
});

initArweave();

export default initArweave;