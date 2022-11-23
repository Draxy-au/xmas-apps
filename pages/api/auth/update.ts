import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/db";

async function handler(req:NextApiRequest,res:NextApiResponse) {
  if (req.method === "GET") {
    res.status(200).json({message: "um..."})
  }
  else if (req.method === "PATCH") {
    const data = req.body;

    const { username, email } = data;

    if (!username || username.trim().length < 2) {
      res.status(422).json({message: 'Invalid input - Username much be at least 2 characters.'})
      return;
    }

    const client = await connectToDatabase();

    const db = client.db();    

    const result = await db.collection('users').updateOne({email: email}, {$set:{username: username}});

    const newData = await db.collection('users').findOne({email: email});

    const newUsername = await newData.username;    

    res.status(201).json({message: 'Updated User!', newUsername: newUsername});
  
    client.close();
  }
}

export default handler;