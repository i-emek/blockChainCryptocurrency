/**
 * author: El Mehdi El Khayati
 * GitHub: Kaygi22
 * date: 18/10/2018
 * Description: this is my first try to set up a small blockchain app with JS
 */

const SHA256 = require("crypto-js/sha256");

class Block{

    constructor(index, timestamp, data, previousHash=''){
        /**
         * index: the position of the block if the chain
         * timestamp: when the block was created
         * data: the data ssociated to this block, it could be any type of data
         * previousHash: contains the link to the previous block
         * hash: is for hashing our block
         * nonce: for the difficulty of mining blocks
         */
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
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
        this.difficulty = 4;
    }

    /**
     * this is the genesis block, which is the first block of our blockChain
     */
    createGenesisBlock(){
        return new Block(0, "01/01/2018", "Genesis block", "0");
    }

    /**
     * returns the last block of our blockChain
     */
    getLastBlock(){
        return this.chain[this.chain.length -1];
    }
    /**
     * add a block to our blockChain
     */
    addBlock(newBlock){
        /**
         * First, we need to refer to the previousHash, which is in this case, the hash of the previous block
         * after that, we change the hash of the current block, why? 
         * because at every moment we change the data, we need ot change the hash.
         * and at the end, we push our block to the blockChain
         */
        newBlock.previousHash = this.getLastBlock().hash;
        newBlock.mineBlock(this.difficulty);
        //newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
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


console.log("Mining node 1 ...");
emekBlockChain.addBlock(new Block(1, "18/10/2018", {project: "BlockChain 1", language:"JS"}));

console.log("Mining node 2 ...");
emekBlockChain.addBlock(new Block(2, "17/10/2018", {project: "BlockChain 2", language:"JAVA"}));


