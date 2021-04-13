import { MongoClient } from 'mongodb';
import { VercelRequest, VercelResponse } from '@vercel/node';

let cachedDb;

async function connectToDb() {
  if (cachedDb) {
    return cachedDb;
  }
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri, { useNewUrlParser: true });
  cachedDb = client;
  return await client.connect();
}

export default async (req: VercelRequest, res: VercelResponse) => {
  const db = await connectToDb();

  if (req.body.link) {
    const entry = await db
      .db('links_db')
      .collection('links_collection')
      .insertOne({ link: req.body.link });
    return res
      .status(201)
      .json({ short_link: `http://localhost:3000/r/${entry.insertedId}` });
  }

  res
    .status(409)
    .json({ error: 'no_link_found', errorDescription: 'No Link Found' });
};
