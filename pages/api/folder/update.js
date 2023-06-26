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
  let query = { "cards.id": id }

  await dbConnect();
  let user = await Users.findOne(query);

  if (user) {
    let index = user.cards.findIndex(folder => folder.id === id);
    user.cards[index].folder = folder;
    user.save();

    let pQuery = { id: id };
    
    let pub = await Public.findOne(pQuery);
    pub.folder = folder;
    pub.save()  
    
   res.status(200).json({ answer: "Folder has been updated." });
  }
}