import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const client = await connectToDatabase();

    const db = client.db();

    const users = await db.collection("users").find().toArray();

    if (!users) {
      res.status(200)
      .json({ message: "No users" });
    }

    res
      .status(200)
      .json({ message: "Hello" });

    client.close();
  }
}

export default handler;
