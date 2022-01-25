import Arweave = require('arweave');

// **** Production Arweave ****
// const InitArweave = Arweave.init({
//     host: 'arweave.net',
//     port: 443,
//     protocol: 'https'
// });


// **** Arlocal ****
const InitArweave = Arweave.init({
    host: '127.0.0.1',
    port: 1984,
    protocol: 'http'
});


export default InitArweave;