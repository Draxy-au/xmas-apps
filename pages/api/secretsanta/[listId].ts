import { ObjectId } from "mongodb"
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/db";

async function handler(req:NextApiRequest,res:NextApiResponse) {
  const { listId } = req.query;

  if (typeof listId === "string")
  {
    const oListId = new ObjectId(listId);

    if (req.method === "GET") {

      const client = await connectToDatabase();

      const db = client.db();

      const listData = await db.collection('sslist').findOne({"_id":oListId});

      

      if (!listData) {
        res.status(404).json({message: "Can Not Find List!"});
        client.close();
        return;
      }
      
        

      res.status(200).json({message: 'List Found!', list: listData});
      client.close();
    }
    else if (req.method === "PATCH") {
      
      const client = await connectToDatabase();

      const db = client.db();

      const data = req.body;

      const { listitems, finalised = false, assignments } = data;

      const result = await db.collection('sslist').updateOne({"_id":oListId},{$set:{"listitems": listitems, finalised: finalised, assignments: assignments}});

      res.status(201).json({message: 'Updated List!'});
  
      client.close();
    }
  }
}

export default handler;