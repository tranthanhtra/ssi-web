import { create } from 'ipfs-http-client'
// const IPFS = require('ipfs-http-client');


// connect to the default API address http://localhost:5001
// const client = create()

// connect to a different API
// export const ipfs = create({ url: "http://10.0.2.2:5001/api/v0"});

// connect using a URL
// export const ipfs = create(new URL('http://10.0.2.2:5001'));
export const ipfs = create({host: '10.0.2.2', port: '5001', protocol: 'http', apiPath: '/ipfs/api/v0'});
// call Core API methods



