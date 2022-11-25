import { InsertOneResult, UpdateResult } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/db";

async function handler(req:NextApiRequest,res:NextApiResponse) {
  if (req.method === "GET") {
    
    const { email } = req.query;

    const client = await connectToDatabase();

    const db = client.db();

    const userGiftList = await db.collection('giftlist').findOne({email: email});

    if (!userGiftList) {
      
      res.status(424).json({message: "No List Found"});
      client.close();
      return;
    }
    
    res.status(200).json({giftList: userGiftList});
  
    client.close();
  }
  else if (req.method === "POST") {
    const data = req.body;

    const { id, email, listItems } = data;

    const client = await connectToDatabase();

    const db = client.db();

    const existingList = await db.collection('giftlist').findOne({email: email});

    let result: InsertOneResult<Document> | UpdateResult;

    // Instead of using FindOneAndUpdate or Upsert, I conditionally choose to do either operation.

    if (existingList) {
      result = await db.collection('giftlist').updateOne({email:email}, { $set: {giftlist: listItems} }); 
      res.status(202).json({message: 'Gift List for User Updated!'});
    } else {
      result = await db.collection('giftlist').insertOne({
        userid: id,
        email: email,
        giftlist: listItems
      });
      res.status(201).json({message: 'Gift List for User Created!', giftlistid: result.insertedId.toString()});
    }
  
    client.close();
  }
}

export default handler;