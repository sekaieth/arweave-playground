import Arweave = require('arweave');

// **** Arlocal ****
const InitArlocal = Arweave.init({
    host: '127.0.0.1',
    port: 1984,
    protocol: 'http'
});


export default InitArlocal;