export default function handler(req, res) {
  const body = req.body
  console.log('body: ', body)

  // Both of these are required.
  if (!body.name) {
    return res.json({ data: 'Name not found' })
  }

  // Found the name.
  res.json({ data: `${body.name}` });
}
