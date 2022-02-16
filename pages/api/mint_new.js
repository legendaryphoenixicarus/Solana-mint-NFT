import { mintNft, SolanaNftMetadata } from '@tatumio/tatum-solana'
require('dotenv').config();

export default async function handler(req, res) {
  const body = req.body;
  console.log('body: ', body);

  // Both of these are required.
  if (!body.name) {
    return res.json({ data: 'Name not found' });
  }

  if (!body.image) {
    return res.json({ data: 'Uri not found' });
  }

  await mintNft(
    {
      from: `${process.env.FROM_KEY}`,
      fromPrivateKey:
        `${process.env.PRIVATE_KEY}`,
      to: `${process.env.TO_KEY}`,
      metadata: new SolanaNftMetadata(`${body.name}`, `${body.symbol}`, `${body.image}`, 0),
    }
  ).then(() => {
    return res.json({ data: `Successfully minted the NFT on ${process.env.TO_KEY}`});
  });

  res.json({ data: 'test'});
}
