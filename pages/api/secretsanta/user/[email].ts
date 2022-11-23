import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../../lib/db";

async function handler(req:NextApiRequest,res:NextApiResponse) {
  const { email } = req.query;

  if (req.method === "GET") {

    const client = await connectToDatabase();

    const db = client.db();

    const listData = await db.collection('sslist').find( {"email" : email, "finalised": false} ).toArray();

    

    if (!listData) {
      res.status(404).json({message: "Can Not Find List!"});
      client.close();
      return;
    }
    
    res.status(200).json({message: 'Lists Found!', lists: listData});
    client.close();
  }
}

export default handler;