import type { NextApiRequest, NextApiResponse } from "next";
import { string } from "yup";
import { connectToDatabase } from "../../../../../lib/db";

async function handler(req:NextApiRequest,res:NextApiResponse) {
  const { email } = req.query;

  if (req.method === "GET") {

    const client = await connectToDatabase();

    const db = client.db();

    const listData = await db.collection('sslist').find( {"finalised": true} ).toArray();

    

    if (!listData) {
      res.status(404).json({message: "Can Not Find List!"});
      client.close();
      return;
    }

    listData.filter(item => {
      let found = false;
      item.listitems.forEach((nameemail: {name: string, email: string}) => {
        if (nameemail.email === email) {
          found = true;          
        }        
      })
      return found;
    })
    
    res.status(200).json({message: 'Lists Found!', lists: listData});
    client.close();
  }
}

export default handler;