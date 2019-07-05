declare var require: any;
declare const Buffer;

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import * as bip39 from 'bip39';
import * as hdkey from 'ethereumjs-wallet/hdkey';
//import * as keythereum from 'keythereum';
import { environment } from "../../environments/environment";
//import * as ethTx from '../token/eth-tx.js';
//import * as Driver from '../token/token-driver.js';
//import * as util from 'ethereumjs-util';
import { Storage } from '@ionic/storage';
import { CustomHttpService } from './custom-http.service';
// import * as base58 from 'bs58';
// import * as nacl from 'tweetnacl';

import * as rsa from '../token/rsa.js'

import { Http, Headers, HttpModule } from "@angular/http";

const  base58 =  require('bs58');
const nacl = require('tweetnacl');

import { BehaviorSubject } from 'rxjs';

var crypto = require('crypto');

const BN = require('bn.js');

// import * as BdbDriver from '../../token/token-driver';
const BdbDriver = require('../token/token-driver.js')
const bdbDriver = new BdbDriver(environment.DRIVER_URL, environment.DRIVER_ASSET_ID);

const covaAbi = require('../token/covaTokenAbi.json');
const EthDriver = require('../token/cova-driver.js');
// import * as covaAbi from '../../token/covaTokenAbi.json';
// import * as EthDriver from '../../token/cova-driver';
const ethDriver = new EthDriver(environment.RPC_URL, environment.COVA_ADDRESS, covaAbi);
const Web3 = require('web3');
const web3 = new Web3(environment.RPC_URL);


@Injectable({
  providedIn: 'root'
})

export class WalletService {

  private showBackground = new BehaviorSubject(false);
  currentBackground = this.showBackground.asObservable();

  constructor(private storage: Storage, private http: CustomHttpService, private http2: Http) {}

  changeBackground(flag: boolean) {
    this.showBackground.next(flag);
  }

  encrypt(text, pwd){
    var cipher = crypto.createCipher('aes-256-ctr', pwd)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
  }

  decrypt(text, pwd){
      var decipher = crypto.createDecipher('aes-256-ctr', pwd)
      var dec = decipher.update(text,'hex','utf8')
      dec += decipher.final('utf8');
      return dec;
  }

  makeMenemonicWallet(useChinese: boolean = false): Observable<any> {
    // console.log("Make mnemonic");
    let wordlist = useChinese ? bip39.wordlists.chinese_simplified : null;
    let mnemonic = bip39.generateMnemonic(null, null, wordlist);
    let wallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic)).getWallet();
    let privateKey = wallet.getPrivateKeyString();
    let ethAddress = wallet.getAddressString();
    let bdbKeypair = this.getKeypair(bip39.mnemonicToSeed(mnemonic).slice(0, 32))
    
    mnemonic = this.encrypt(mnemonic, ethAddress);
    privateKey = this.encrypt(privateKey, ethAddress);
    bdbKeypair.privateKey = this.encrypt(bdbKeypair.privateKey, ethAddress);

    return of({
      mnemonic,
      eth_private_key: privateKey,
      eth_address: ethAddress,
      bdb_public_key: bdbKeypair.publicKey,
      bdb_private_key: bdbKeypair.privateKey
    });
  }

  getKeypair(seed) {
    const keyPair = seed !== null ? nacl.sign.keyPair.fromSeed(seed) : nacl.sign.keyPair()
    const publicKey = base58.encode(Buffer.from(keyPair.publicKey))
    const privateKey = base58.encode(Buffer.from(keyPair.secretKey.slice(0, 32)))
    return {
        publicKey,
        privateKey
    }
  }

  montuToCova(amount) {
    let amount_ = new BN(amount);
    let coef = new BN('1000000000000');
    return web3.utils.fromWei(amount_.mul(coef).toString(), 'ether');
  }

  covaToMontu(amount) {
    let amount_ = web3.utils.toWei(amount, 'ether');
    return amount_.toString().slice(0, -12);
  }


  async getBdbBalance() {
    let bdbPublicKey = await this.storage.get('bdb_public_key');
    return this.montuToCova(await bdbDriver.getBalance(bdbPublicKey));
  }

  async getEthBalance() {
    let ethAddess = await this.storage.get('eth_address');
    return ethDriver.getEtherBalance(ethAddess);
  }

  async getPhoneNoFromEthCustodian(to){
    const token = await this.storage.get('jwt-token');
    const temp = `Bearer ${token}`;
    let headers = new Headers();
    headers.append('Authorization', temp);
    let url = `${environment.api_server}/user/get-phn-by-eth-cred`;
    const data = {
      custodianEthAddress: to
    }
    const result = await this.http2.post(url, data, { headers: headers }).toPromise();
    return result.json().phone
  }

  async getSendable() {
    /*
    * Hacky solution to remove transfer restriction
    * TODO: refactor code!
    */
    const bdbPublicKey = await this.storage.get('bdb_public_key');
    const bdbBalance = await bdbDriver.getBalance(bdbPublicKey);
    return bdbBalance;
    
    /*
      const temp = `Bearer ${token}`;
      let headers = new Headers();
      headers.append('Authorization', temp);
      let url = `${environment.api_server}/user/get-min-balance`;
      const result = await this.http2.post(url, {}, { headers: headers }).toPromise();
      const bdbPublicKey = await this.storage.get('bdb_public_key');
      const bdbBalance = await bdbDriver.getBalance(bdbPublicKey);
      return bdbBalance - result.json().minBalance;
    */
  }

  async sendETH (to, amount, msg) {
    let ethAddess = await this.storage.get('eth_address');
    let _privateKey = this.decrypt(await this.storage.get('eth_private_key'), ethAddess);

    try {
      const result = await ethDriver.sendEther(to, amount, _privateKey.substring(2));
      
      // add to database
      const token = await this.storage.get('jwt-token');
      const temp = `Bearer ${token}`;
      let headers = new Headers();
      headers.append('Authorization', temp);
      let url = `${environment.api_server}/transfer/send-eth-address`;
      const data = {
        toAddress: to,
        message: msg,
        amount: amount,
        txHash: result.transactionHash,
      };
      const result2 = await this.http2.post(url, data, { headers: headers }).toPromise();
      // if (result2 && result2.status === 200) {
      //   return true
      // } else {
      //   return false;
      // }
      return {
        isSendable: true,
        isSent: true
      }
    }
    catch(e) {
      return {
        isSendable: true,
        isSent: false
      }
    }
  }

  async sendCova (to, amount, msg) {
    // console.log('Sending Cova: ',to, amount)
    let toPhone = await this.getPhoneNoFromEthCustodian(to);
    
    if(toPhone !== null){
      return await this.sendCovaPhone(toPhone, amount, msg);
    }
    
    let ethAddess = await this.storage.get('eth_address');
    let amount_ = parseInt(this.covaToMontu(amount));

    const sendable = await this.getSendable();
    if(sendable < amount_){
      return {
        isSendable: false,
        isSent: false
      }
    }
    const sender_keypair = {
        publicKey: await this.storage.get('bdb_public_key'),
        privateKey: this.decrypt(await this.storage.get('bdb_private_key'), ethAddess)
    };

    const txHash = await bdbDriver.transfer_tokens(sender_keypair, environment.CENTRAL_BDB_PUBLIC_KEY, amount_, {
      reason: 'SETTLEMENT',
      secretRecipinet: to
    });

    const token = await this.storage.get('jwt-token');
    const temp = `Bearer ${token}`;
    let headers = new Headers();
    headers.append('Authorization', temp);

    let url = `${environment.api_server}/tee/settle/${txHash}`;
    const result = await this.http2.post(url, {} ,{ headers: headers }).toPromise();

    if (result && result.status === 200) {
      // add to database
      url = `${environment.api_server}/transfer/send-cova-address`;
      const data = {
        toAddress: to,
        message: msg,
        amount: this.montuToCova(this.covaToMontu(amount)),
        txHash,
      };
      const result2 = await this.http2.post(url, data, { headers: headers }).toPromise();
      // if (result2 && result2.status === 200) {
      //   return true
      // } else {
      //   return false;
      // }
      return {
        isSendable: true,
        isSent: true
      }
    } else {
      return {
        isSendable: true,
        isSent: false
      }
    }
  }

  // receiver's phone number, amount to send, msg
  async sendETHPhone (to, amount, msg): Promise<any> {
    let ethAddess = await this.storage.get('eth_address');
    const _privateKey = this.decrypt(await this.storage.get('eth_private_key'), ethAddess); // sender's private key
    const token = await this.storage.get('jwt-token');

    // call localhost:3000/tee/getAddressToSend/:recipientPhoneNo
    // returns
    // {
    //     bdb_public_key: userEntry.custodianBdbPublicKey,
    //     eth_address: userEntry.custodianEthAddress
    // }

    let url = `${environment.api_server}/tee/getAddressToSend/${to}`;
    const result = await this.http2.get(url).toPromise();
    let d = result.json();
    // console.log("d ", d);
    const receipt = await ethDriver.sendEther(d['eth_address'], amount, _privateKey.substring(2));
    // console.log("receipt: ", receipt);

    url = `${environment.api_server}/transfer/send-eth`;
    const data = {
      to: to,
      message: msg,
      amount: amount,
      txHash: receipt.transactionHash,
    };

    const temp = `Bearer ${token}`;
    let headers = new Headers();
    headers.append('Authorization', temp);

    const result2 = await this.http2.post(url, data, { headers: headers }).toPromise();
    // console.log("result2: ", result2.status);

    if (result2 && result2.status === 200) {
      return {
        isSendable: true,
        isSent: true,
        verified_user: result.json().verified_user,
      };
    } else {
      return {
        isSendable: true,
        isSent: false,
        verified_user: result.json().verified_user,
      };
    }

    //
    // this.http.get(url)
    //           .subscribe(async (result) => {
    //             let d = await result.json();
    //             console.log("d: ", d);
    //             try {
    //               console.log("d[eth_address]: ", d['eth_address']);
    //               const receipt = await ethDriver.sendEther(d['eth_address'], amount, _privateKey.substring(2));
    //
    //               const url = `${environment.api_server}/transfer/send-eth`;
    //               const data = {
    //                 to: to,
    //                 message: msg,
    //                 amount: amount
    //               };
    //
    //               const temp = `Bearer ${token}`;
    //               this.http.post(url, data, temp)
    //                         .subscribe(result => {
    //                           // let d2 = await result.json();
    //                           return true;
    //                           // if (d && d.status == 200) {
    //                           //   return true;
    //                           // } else {
    //                           //   return false;
    //                           // }
    //                         });
    //             } catch (err) {
    //               console.log("Error in sendEthFromPhone", err.message);
    //               throw err;
    //             }
    //           });
  }

  async sendCovaPhone (to, amount, msg) {
    let ethAddess = await this.storage.get('eth_address');

    let amount_= parseInt(this.covaToMontu(amount));

    const sendable = await this.getSendable();
    if(sendable < amount_){
      return {
        isSendable: false,
        isSent: false,
        verified_user: null,
      };
    }

    const bdbKeypair = {
      publicKey: await this.storage.get('bdb_public_key'),
      privateKey: this.decrypt(await this.storage.get('bdb_private_key'), ethAddess)
    };
    // console.log("bdbKeyPair:", bdbKeypair);
    const token = await this.storage.get('jwt-token');

    // call localhost:3000/tee/getAddressToSend/:recipientPhoneNo
    // returns
    // {
    //     bdb_public_key: userEntry.custodianBdbPublicKey,
    //     eth_address: userEntry.custodianEthAddress
    // }

    let url = `${environment.api_server}/tee/getAddressToSend/${to}`;
    const result = await this.http2.get(url).toPromise();
    let d = result.json();
    // console.log("d ", d);
    const receipt = await bdbDriver.transfer_tokens(bdbKeypair, d['bdb_public_key'], amount_);
    // console.log("receipt: ", receipt);

    url = `${environment.api_server}/transfer/send-cova`;
    const data = {
      to: to,
      message: msg,
      amount: this.montuToCova(this.covaToMontu(amount)),
      txHash: receipt
    };

    const temp = `Bearer ${token}`;
    let headers = new Headers();
    headers.append('Authorization', temp);

    const result2 = await this.http2.post(url, data, { headers: headers }).toPromise();
    // console.log("result2: ", result2.status);

    if (result2 && result2.status === 200) {
      return {
        isSendable: true,
        isSent: true,
        verified_user: result.json().verified_user,
      };
    } else {
      return {
        isSendable: true,
        isSent: false,
        verified_user: result.json().verified_user,
      };
    }

    // call localhost:3000/tee/getAddressToSend/:recipientPhoneNo
    // returns
    // {
    //     bdb_public_key: userEntry.custodianBdbPublicKey,
    //     eth_address: userEntry.custodianEthAddress
    // }

    // const result = await bdbDriver.transfer_tokens({ publicKey: sender_keypair.publicKey, privateKey: sender_keypair.privateKey }, bdb_public_key, amount);
    // log tranaction here: call /send-cova api
    // return { result };
  }
 //lol
}
