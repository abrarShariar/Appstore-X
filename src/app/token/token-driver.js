let driver = require('bigchaindb-driver');

class Driver {
    constructor(url, asset_id){
        this.bdb = new driver.Connection(url)
        this.asset_id = asset_id;
    }

    async getTransaction(txId) {
        return await this.bdb.getTransaction(txId)
    }

    async getBalance(user_public_key){
        try {
            const list_unspent = await this.bdb.listOutputs(user_public_key, 'false')
            let sum = 0;
            for (let i = 0; i < list_unspent.length; i++) {
                let tx = await this.bdb.getTransaction(list_unspent[i].transaction_id)
                if(tx.asset.id == this.asset_id || tx.id == this.asset_id){
                    let tx_amount = parseInt(tx.outputs[list_unspent[i].output_index].amount)
                    sum += tx_amount
                }
            }
            return sum;
        }
        catch(e){
            return Promise.reject(e)
        }
    }

    async transfer_tokens(sender_keypair, recipient_public_key, amount, info = null) {
        let amount_int = parseInt(amount);
        try {
            if(amount === 0){
                Promise.reject(new Error('Can not transfer 0 amount'))
            }
            
            const list_unspent = await this.bdb.listOutputs(sender_keypair.publicKey, 'false')
            let sum = 0
            let list_inputs = []
            let list_outputs = []
            let senders_share = 0

            for (let i = 0; i < list_unspent.length; i++) {
                let tx = await this.bdb.getTransaction(list_unspent[i].transaction_id)
                if(tx.asset.id == this.asset_id || tx.id == this.asset_id){
                    let tx_amount = parseInt(tx.outputs[list_unspent[i].output_index].amount)
                    list_inputs.push({
                        tx: tx,
                        output_index: list_unspent[i].output_index
                    })
                    sum += tx_amount
                }
            }

            if(sum < amount_int){
                return Promise.reject(new Error('Not enough balance to transfer'))
            }

            senders_share = sum - amount_int;

            if (senders_share > 0) {
                list_outputs.push(driver.Transaction.makeOutput(
                    driver.Transaction
                    .makeEd25519Condition(sender_keypair.publicKey),
                    senders_share.toString()))
            }

            list_outputs.push(driver.Transaction.makeOutput(
                driver.Transaction
                .makeEd25519Condition(recipient_public_key),
                amount_int.toString()))

            let bdb_metadata = {
                type: 'TRANSFER',
                from: sender_keypair.publicKey,
                to: recipient_public_key
            }
            
            if(info !== null){
                bdb_metadata.info = info
            }

            const createTranfer = driver.Transaction
                .makeTransferTransaction(
                    list_inputs,
                    list_outputs,
                    bdb_metadata
                )
            
            let signArgs = [createTranfer]
            for(let p = 0; p < list_inputs.length; p++){
                signArgs.push(sender_keypair.privateKey)
            }

            const signedTransfer = driver.Transaction
                .signTransaction.apply(null, signArgs)

            const ttx =  await this.bdb.postTransactionCommit(signedTransfer)

            return ttx.id;
        }
        catch(e){
            return Promise.reject(e)
        }
    }

    async multi_transfer_tokens(sender_keypair, recipient_public_key_amount_array, info = null) {
        try {
            const list_unspent = await this.bdb.listOutputs(sender_keypair.publicKey, 'false')
            let sum = 0
            let list_inputs = []
            let list_outputs = []
            let senders_share = 0
            for (let i = 0; i < list_unspent.length; i++) {
                let tx = await this.bdb.getTransaction(list_unspent[i].transaction_id)
                if(tx.asset.id == this.asset_id || tx.id == this.asset_id){
                    let tx_amount = parseInt(tx.outputs[list_unspent[i].output_index].amount)
                    list_inputs.push({
                        tx: tx,
                        output_index: list_unspent[i].output_index
                    })
                    sum += tx_amount
                }
            }

            let amount = 0;
            for (let i = 0; i < recipient_public_key_amount_array.length; i++){
                let recipient_public_key_amount = recipient_public_key_amount_array[i]
                amount += recipient_public_key_amount.amount;
                
                list_outputs.push(driver.Transaction.makeOutput(
                    driver.Transaction
                    .makeEd25519Condition(recipient_public_key_amount.recipient_public_key),
                    recipient_public_key_amount.amount.toString()))
            }

            if(amount === 0){
                Promise.reject(new Error('Can not transfer 0 amount'))
            }

            if(sum < amount){
                return Promise.reject(new Error('Not enough balance to transfer'))
            }

            senders_share = sum - amount;

            if (senders_share > 0) {
                list_outputs.push(driver.Transaction.makeOutput(
                    driver.Transaction
                    .makeEd25519Condition(sender_keypair.publicKey),
                    senders_share.toString()))
            }

            

            let bdb_metadata = {
                type: 'MULTI_TRANSFER',
                from: sender_keypair.publicKey,
                to: recipient_public_key_amount_array,
            }
            
            if(info !== null){
                bdb_metadata.info = info
            }

            const createTranfer = driver.Transaction
                .makeTransferTransaction(
                    list_inputs,
                    list_outputs,
                    bdb_metadata
                )

            let signArgs = [createTranfer]
            for(let p = 0; p < list_inputs.length; p++){
                signArgs.push(sender_keypair.privateKey)
            }

            const signedTransfer = driver.Transaction
                .signTransaction.apply(null, signArgs)

            const ttx =  await this.bdb.postTransactionCommit(signedTransfer)
            return ttx.id;
        }
        catch(e){
            return Promise.reject(e)
        }
    }

    async transfer_everything(sender_keypair, recipient_public_key, info) {
        try {
            const list_unspent = await this.bdb.listOutputs(sender_keypair.publicKey, 'false')
            let sum = 0
            let list_inputs = []
            let list_outputs = []

            for (let i = 0; i < list_unspent.length; i++) {
                let tx = await this.bdb.getTransaction(list_unspent[i].transaction_id)
                if(tx.asset.id == this.asset_id || tx.id == this.asset_id){
                    let tx_amount = parseInt(tx.outputs[list_unspent[i].output_index].amount)
                    list_inputs.push({
                        tx: tx,
                        output_index: list_unspent[i].output_index
                    })
                    sum += tx_amount
                }
            }
            
            if(sum === 0){
                Promise.reject(new Error('Can not transfer 0 amount'))
            }

            list_outputs.push(driver.Transaction.makeOutput(
                driver.Transaction
                .makeEd25519Condition(recipient_public_key),
                sum.toString()))

            let bdb_metadata = {
                type: 'TRANSFER',
                from: sender_keypair.publicKey,
                to: recipient_public_key
            }
            
            if(info !== null){
                bdb_metadata.info = info
            }

            const createTranfer = driver.Transaction
                .makeTransferTransaction(
                    list_inputs,
                    list_outputs,
                    bdb_metadata
                )
            
            let signArgs = [createTranfer]
            for(let p = 0; p < list_inputs.length; p++){
                signArgs.push(sender_keypair.privateKey)
            }

            const signedTransfer = driver.Transaction
                .signTransaction.apply(null, signArgs)

            const ttx =  await this.bdb.postTransactionCommit(signedTransfer)

            return ttx.id;
        }
        catch(e){
            return Promise.reject(e)
        }
    }
}

module.exports = Driver
