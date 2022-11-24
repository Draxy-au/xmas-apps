import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    res
      .status(200)
      .json({ message: "Hello World" });
  }
}

export default handler;
