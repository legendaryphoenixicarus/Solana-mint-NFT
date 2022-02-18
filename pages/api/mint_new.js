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

  if (!body.symbol) {
    return res.json({ data: 'Symbol not found' });
  }

  const response = await mintNft(
    {
      from: `${process.env.FROM_KEY}`,
      fromPrivateKey:
        `${process.env.PRIVATE_KEY}`,
      to: `${process.env.TO_KEY}`,
      metadata: new SolanaNftMetadata(`${body.name}`, `${body.symbol}`, `${body.image}`, 0),
    }
  );

  res.json({ data: response.txId });
}
