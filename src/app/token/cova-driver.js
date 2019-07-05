let Web3 = require('web3');
let util = require('ethereumjs-util');
let tx = require('ethereumjs-tx');
let BN = require('bn.js');

class Driver {
    constructor(url, cova_address, cova_abi){
        this.web3 = new Web3(new Web3.providers.HttpProvider(url));
        this.cova_address = cova_address;
        this.cova_abi = cova_abi;
        this.contract = new this.web3.eth.Contract(this.cova_abi, this.cova_address);
    }

    async makeRawTransaction (_methodCallData, _privateKey, _gasPrice = 6, _gasLimit = 6000000) {
        let methodCallData = _methodCallData.encodeABI()
        let from = util.bufferToHex(util.privateToAddress('0x' + _privateKey))
        let txCount = await this.web3.eth.getTransactionCount(from)
        let rawTransaction = {
            "from": from,
            "nonce": this.web3.utils.toHex(txCount),
            "gasPrice": this.web3.utils.toHex(this.web3.utils.toWei(_gasPrice.toString(), 'gwei')),
            "gasLimit": this.web3.utils.toHex(_gasLimit),
            "to": this.cova_address,
            "data": methodCallData
        };
    
        const privateKeyBuffer = new Buffer(_privateKey, 'hex');
        let etx = new tx(rawTransaction);
        etx.sign(privateKeyBuffer);
        let serializedTx = etx.serialize();
        let reciept = await this.web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        return reciept
    }

    async sendCova(toAddress, fromPrivateKey, amount) {
        amount = this.web3.utils.toWei(amount, "ether")
        let txReciept = await this.makeRawTransaction(this.contract.methods.transfer(toAddress, amount), fromPrivateKey);
        return txReciept
    }

    async sendEther (_toAddress, _amount, _privateKey, _gasPrice = 6, _gasLimit = 21000) {
        let from = util.bufferToHex(util.privateToAddress('0x' + _privateKey))
        let txCount = await this.web3.eth.getTransactionCount(from)
        let rawTransaction = {
            "from": from,
            "nonce": this.web3.utils.toHex(txCount),
            "gasPrice": this.web3.utils.toHex(this.web3.utils.toWei(_gasPrice.toString(), 'gwei')),
            "gasLimit": this.web3.utils.toHex(_gasLimit),
            "to": _toAddress,
            "value": this.web3.utils.toHex(this.web3.utils.toWei(_amount, "ether"))
        };
        const privateKeyBuffer = new Buffer(_privateKey, 'hex');
        let etx = new tx(rawTransaction);
        etx.sign(privateKeyBuffer);
        let serializedTx = etx.serialize();
        let reciept = await this.web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        return reciept
    }


    async sendEtherAll (_toAddress, _privateKey, _gasPrice = 6, _gasLimit = 21000) {
        let from = util.bufferToHex(util.privateToAddress('0x' + _privateKey))
        let txCount = await this.web3.eth.getTransactionCount(from)
        let balance = new BN(await this.web3.eth.getBalance(from));
        let gas = new BN(21000);
        var gasPrice = new BN(this.web3.utils.toWei(_gasPrice.toString(), "gwei"));
        var cost = await gas.mul(gasPrice);
        var sendAmount = balance.sub(cost);
        // console.log(sendAmount.toString())
        let rawTransaction = {
            "from": from,
            "nonce": this.web3.utils.toHex(txCount),
            "gasPrice": this.web3.utils.toHex(gasPrice.toString()),
            "gasLimit": this.web3.utils.toHex(_gasLimit),
            "to": _toAddress,
            "value": this.web3.utils.toHex(sendAmount.toString())
        };

        const privateKeyBuffer = new Buffer(_privateKey, 'hex');
        let etx = new tx(rawTransaction);
        etx.sign(privateKeyBuffer);
        let serializedTx = etx.serialize();
        let reciept = await this.web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        return reciept
    }

    async getCovaBalance(address) {
        let balance = await this.contract.methods.balanceOf(address).call()
        return this.web3.utils.fromWei(balance, 'ether')
    }

    async getEtherBalance(address) {
        let balance = await this.web3.eth.getBalance(address)
        return this.web3.utils.fromWei(balance, 'ether'); 
    }
}

module.exports = Driver
