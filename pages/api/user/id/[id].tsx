import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../../lib/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { id } = req.query;

    const client = await connectToDatabase();

    const db = client.db();

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id as string) });

    if (!user) {
      res.status(204);
      return null;
    }

    res
      .status(201)
      .json({ id: user._id, email: user.email, username: user.username });

    client.close();
  }
}

export default handler;
