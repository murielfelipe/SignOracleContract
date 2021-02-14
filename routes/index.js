var express = require('express');
const Web3 = require('web3');
var Tx = require('ethereumjs-tx').Transaction;
let contractAddress = "0x1FA2541251086A30976De6dD173328E49484fe37";
let abi = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "rate",
				"type": "uint256"
			}
		],
		"name": "setRate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "getRate",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
const app = new express();

function init() {
    const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
    web3.eth.getAccounts(console.log);
    let contractInstance = new web3.eth.Contract(abi, contractAddress);
    console.log("contractInstance");
    
    const account = '0xB139548D2d6e17617abB8cE44b4356C2Bf453C12';
    const privateKey = Buffer.from('85b3531226134b5974643eb8f8d68f3fe4a0a6ef45bd1b728ca1c3c3f8e470d2', 'hex');
    const _data = contractInstance.methods.setRate(450).encodeABI();
    console.log(_data);
    var rawTx = {};
    web3.eth.getTransactionCount(account).then(nonce => {
      rawTx = {
      nonce: nonce,
      gasPrice: '0x20000000000',
      gasLimit: '0x41409',
      to: contractAddress,
      value: 0,
      data: _data
    }
    let tx = new Tx(rawTx);
    tx.sign(privateKey);
    var serializedTx = tx.serialize();
    
    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
    .on('receipt', console.log);
    
    });
}

app.get("/", (req, res, next) => {
    init(res);
});


module.exports = app;
