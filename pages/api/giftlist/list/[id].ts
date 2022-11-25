import { InsertOneResult, UpdateResult } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../../lib/db";

async function handler(req:NextApiRequest,res:NextApiResponse) {
  if (req.method === "GET") {
    
    const { id } = req.query;

    const client = await connectToDatabase();

    const db = client.db();

    const userGiftList = await db.collection('giftlist').findOne({userid: id});

    if (!userGiftList) {
      
      res.status(424).json({message: "No List Found"});
      client.close();
      return;
    }
    
    res.status(200).json({giftList: userGiftList});
  
    client.close();
  }  
}

export default handler;