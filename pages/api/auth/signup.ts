import type { NextApiRequest, NextApiResponse } from "next";
import { hashPassword } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";

async function handler(req:NextApiRequest,res:NextApiResponse) {
  if (req.method === "POST") {
    const data = req.body;

    const { username, email, password } = data;

    if (!email || !email.includes('@')) {
      res.status(422).json({message: 'Invalid input - Please enter a valid email address.'})
      return;
    } else if (!password || password.trim().length < 6) {
      res.status(422).json({message: 'Invalid input - Password much be at least 6 characters.'})
      return;
    }

    const client = await connectToDatabase();

    const db = client.db();

    const existingUser = await db.collection('users').findOne({email: email});

    if (existingUser) {
      res.status(422).json({message: "Email already registered!"})
      client.close();
      return;
    }

    const hashedPassword = await hashPassword(password);

    await db.collection('users').insertOne({
      username: username,
      email: email,
      password: hashedPassword
    });

    res.status(201).json({message: 'Created User!'});
  
    client.close();
  }
}

export default handler;