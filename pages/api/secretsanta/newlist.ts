import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/db";

async function handler(req:NextApiRequest,res:NextApiResponse) {
  if (req.method === "POST") {
    const data = req.body;

    const { id, email, listname } = data;

    const client = await connectToDatabase();

    const db = client.db();

    const existingList = await db.collection('sslist').findOne({listname: listname});

    if (existingList) {
      res.status(422).json({message: "List already registered!"})
      client.close();
      return;
    }

    const result = await db.collection('sslist').insertOne({
      userid: id,
      email: email,
      listname: listname
    });

    

    res.status(201).json({message: 'Created List!', listname: listname, listid: result.insertedId.toString()});
  
    client.close();
  }
}

export default handler;