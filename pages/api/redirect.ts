import { MongoClient, ObjectID } from 'mongodb';
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
  const entry = await db
    .db('links_db')
    .collection('links_collection')
    .findOne({ _id: new ObjectID(req.query.id as string) });
  if (entry !== null) {
    return res.redirect(301, entry.link);
  }
  return res.redirect(301, '/');
};
