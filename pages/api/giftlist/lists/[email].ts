import { InsertOneResult, UpdateResult } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../../lib/db";

async function handler(req:NextApiRequest,res:NextApiResponse) {
  if (req.method === "GET") {
    
    const { email } = req.query;

    const client = await connectToDatabase();

    const db = client.db();

    const userGiftLists = await db.collection('giftlist').find({email: {$ne: email}}).toArray();

    if (!userGiftLists) {
      
      res.status(424).json({message: "No Lists Found"});
      client.close();
      return;
    }
    
    res.status(200).json({giftLists: userGiftLists});
  
    client.close();
  }  
}

export default handler;