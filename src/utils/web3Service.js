const Web3 = require("web3");

const web3 = new Web3(window.ethereum);

const ERC20TransferABI = [
    {
        constant: false,
        inputs: [
            {
                name: "_to",
                type: "address",
            },
            {
                name: "_value",
                type: "uint256",
            },
        ],
        name: "transfer",
        outputs: [
            {
                name: "",
                type: "bool",
            },
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        constant: true,
        inputs: [
            {
                name: "_owner",
                type: "address",
            },
        ],
        name: "balanceOf",
        outputs: [
            {
                name: "balance",
                type: "uint256",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [
            {
                name: "signature",
                type: "bytes",
            },
            {
                name: "hash",
                type: "bytes32",
            },
        ],
        name: "verifySingleSignOn",
        outputs: [
            {
                name: "email",
                type: "string",

            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [
            {
                name: "signature",
                type: "bytes",
            },
            {
                name: "hash",
                type: "bytes32",
            },
        ],
        name: "verify",
        outputs: [
            {
                name: "isValid",
                type: "bool",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [
            {
                name: "_name",
                type: "string",
            },
            {
                name: "_dateOfBirth",
                type: "uint64",
            },
            {
                name: "_socialID",
                type: "string",
            },
            {
                name: "_nationality",
                type: "string",
            },
            {
                name: "_email",
                type: "string",
            },
            {
                name: "_phoneNumber",
                type: "string",
            },
            {
                name: "_owner",
                type: "address",
            },
        ],
        name: "store",
        outputs: [{
            name: "succeed",
            type: "bool",
        },],
        stateMutability: "payable",
        type: "function",
    },
]


export const Web3Service = {
    signMessage: async (message, account, callback) => {
        const hash = Web3.utils.sha3(message);
        console.log(hash);
        await web3.eth.sign(hash, account, (e, signature) => {
            console.log(signature);
            callback(hash, signature);
        }).then(res => console.log(res))
            .catch(err => console.log(err));
    },

    verifyCertificate: (certificate, signature, address, callback) => {
        const hash = Web3.utils.sha3(certificate);
        console.log(hash);
        try {
            const contract = new web3.eth.Contract(ERC20TransferABI, address);
            contract.methods.verify(signature, hash).call(function (err, isValid) {
                console.log(isValid);
                callback(isValid);
            });
        } catch (err) {
            console.log(err);
        }
    },

    signup: (name, dateOfBirth, socialId, nationality, email, phoneNumber, walletAddress, account, callback) => {
        try {
            const contract = new web3.eth.Contract(ERC20TransferABI, "0x5fbdb2315678afecb367f032d93f642f64180aa3");
            const data = contract.methods.store(name, dateOfBirth, socialId, nationality, email, phoneNumber, walletAddress).encodeABI();

            web3.eth.sendTransaction({
                from: account,
                to: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
                data: data,
                value: 0,
                gas: 500000,
                gasPrice: 5e9,
            })
            callback("0x5fbdb2315678afecb367f032d93f642f64180aa3");
            // contract.methods.store(name, dateOfBirth, socialId, nationality, email, phoneNumber, walletAddress).send({from: account}, function (err, succeed) {
            //     console.log(succeed);
            // });
        } catch (err) {
            console.log(err);
        }
    }
}
