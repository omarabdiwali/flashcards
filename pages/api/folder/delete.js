import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import dbConnect from "@/utils/dbConnect";
import Users from "@/models/Users";
import Public from "@/models/Public";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !req.body) {
    res.redirect("/");
    return;
  }

  const { id, folder } = JSON.parse(req.body);
  let query = { "cards.id": id };

  await dbConnect();
  let user = await Users.findOne(query);

  if (user) {
    let index = user.cards.findIndex(folder => folder.id === id);
    let current = user.cards;
    current.splice(index, 1);

    let pQuery = { id: id };
    await Public.findOneAndDelete(pQuery);
    
    user.cards = current;
    user.save();
    
    res.status(200).json({ answer: `Deleted '${folder}' folder!` });
  }

  else {
    res.redirect("/");
  }
}