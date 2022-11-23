import { Db, MongoClient } from "mongodb"

export async function connectToDatabase() {
  const dbclient = await MongoClient.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_DATABASE}.pf4uebr.mongodb.net/?retryWrites=true&w=majority`);

  return dbclient;
}

export async function userExists(db:Db, userTable: string, user: { email: string | undefined;}) {
  const result = await db.collection(userTable).findOne({email: user.email});
  if (result) {
    return result;
  }
  return null;
}

