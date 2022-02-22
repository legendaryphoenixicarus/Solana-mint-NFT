var web3 = require('@solana/web3.js');
var splToken = require('@solana/spl-token');
require('dotenv').config();

export default async function handler(req, res) {
  const body = req.body;
  console.log('body: ', body);

  // Connect to cluster
  var connection = new web3.Connection(
    process.env.QUICK_NODE_URL,
    'confirmed',
  );

  // Generate a new wallet keypair and airdrop SOL
  var fromWallet = web3.Keypair.generate();
  var fromAirdropSignature = await connection.requestAirdrop(
    fromWallet.publicKey,
    web3.LAMPORTS_PER_SOL,
  );
  //wait for airdrop confirmation
  await connection.confirmTransaction(fromAirdropSignature);

  //create new token mint
  let mint = await splToken.Token.createMint(
    connection,
    fromWallet,
    fromWallet.publicKey,
    null,
    9,
    splToken.TOKEN_PROGRAM_ID,
  );

  //get the token account of the fromWallet Solana address, if it does not exist, create it
  let fromTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
    fromWallet.publicKey,
  );

   // Generate a new wallet to receive newly minted token
   var toWallet = web3.Keypair.generate();

  //get the token account of the toWallet Solana address, if it does not exist, create it
  var toTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
    // toWallet.publicKey,
    process.env.TO_KEY
  );

  //minting 1 new token to the "fromTokenAccount" account we just returned/created
  await mint.mintTo(
    fromTokenAccount.address, //who it goes to
    fromWallet.publicKey, // minting authority
    [], // multisig
    1000000000, // how many
  );

  await mint.setAuthority(
    mint.publicKey,
    null,
    "MintTokens",
    fromWallet.publicKey,
    []
  )

  // Add token transfer instructions to transaction
  var transaction = new web3.Transaction().add(
    splToken.Token.createTransferInstruction(
      splToken.TOKEN_PROGRAM_ID,
      fromTokenAccount.address,
      toTokenAccount.address,
      fromWallet.publicKey,
      [],
      1,
    ),
  );

  // Sign transaction, broadcast, and confirm
  var signature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [fromWallet],
    {commitment: 'confirmed'},
  );
  console.log('SIGNATURE', signature);
}