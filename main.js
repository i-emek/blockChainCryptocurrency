/**
 * author: El Mehdi El Khayati
 * GitHub: Kaygi22
 * date: 18/10/2018
 * Description: this is my first try to set up a small blockchain cryptoCrrency app with JS
 */

const SHA256 = require("crypto-js/sha256");

class Transaction{
    constructor(fromAdress, toAdress, amount){
        this.fromAdress = fromAdress;
        this.toAdress = toAdress;
        this.amount = amount;
    }
}

class Block{

    constructor(timestamp, transactions, previousHash=''){
        /**
         * timestamp: when the block was created
         * transactions: the transactions associated to this block, it could be any type of data
         * previousHash: contains the link to the previous block
         * hash: is for hashing our block
         * nonce: for the difficulty of mining blocks
         */
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = '';
        this.nonce = 0;
    }

    calculateHash(){
        /**
         * to use the hash fucntion SHA256, you should import crypto-js library, 
         * run the command in your text editor terminal
         * npm install --save crypto-js
         */

         return SHA256(this.index + this.timestamp + this.previousHash + JSON.stringify(this.data) + this.nonce).toString();

        
    }

    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty) !== Array(difficulty+1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("mined block: " + this.hash);
    }


}

class blockChain{
    constructor(){
        /**
         * the constructor intialize our block's array with the genesis block.
         * By increasing difficulty, we can secure adding blocks, we control
         * the process of adding new blocks, 
         * This technique is called the proof-of-work
         */
        let initialBlock = this.createGenesisBlock();
        initialBlock.hash = initialBlock.calculateHash();
        this.chain = [initialBlock];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    /**
     * this is the genesis block, which is the first block of our blockChain
     */
    createGenesisBlock(){
        return new Block("01/01/2018", "Genesis block", "0");
    }

    /**
     * returns the last block of our blockChain
     */
    getLastBlock(){
        return this.chain[this.chain.length -1];
    }

    minePendingTransactions(mineRewardAdress){
        /**
         * ifsuccesfuly mined block, send me the rexard to the mineRewardAdress
         */
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log("Block mined!");
        this.chain.push(block);

        this.pendingTransactions= [
            new Transaction(null, mineRewardAdress, this.miningReward),
        ];
    }


    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

     /**
     * In fact, the cryptoCurrencies don't store your balance.
     * If you want ot chekc your balance, the system go throw all your transactions
     * and calculate your balance.
     */

    getBalanceOfAdress(balanceAdress){

        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(balanceAdress === trans.toAdress){
                    balance += trans.amount;
                }
                if(balanceAdress === trans.fromAdress){
                    balance -= trans.amount;
                }
            }
        }
        
        return balance;
    }

    /**
     * With this method, we will check if the chain is valid or not. 
     * So we will throw into the whole blocks, and check if the previousHash equal to the hash
     * of the previous block, if not, the method will return false.
     */
    isChainValid(){
        for(let i=1; i<this.chain.length; i++){
            const currenBlock = this.chain[i];
            const previousBlock = this.chain[i-1];
            if(currenBlock.hash !== currenBlock.calculateHash()){
                return false;
            }

            if(currenBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

// Fun time, let's try it

let emekBlockChain = new blockChain();

emekBlockChain.createTransaction(new Transaction('emekAdress', 'haaAdress', 100));
emekBlockChain.createTransaction(new Transaction('haaAdress', 'emekAdress', 50));

console.log("\n starting the miner ...");

emekBlockChain.minePendingTransactions('ihAdress');

console.log("The balance of ihAdress is : " + emekBlockChain.getBalanceOfAdress('ihAdress'));

console.log("\n starting the miner again ...");

emekBlockChain.minePendingTransactions('ihAdress');

console.log("The balance of ihAdress is : " + emekBlockChain.getBalanceOfAdress('ihAdress'));




