import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import dbConnect from "@/utils/dbConnect";
import Users from "@/models/Users";
import Public from "@/models/Public";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!req.body || !session) {
    res.redirect("/");
    return;
  }

  const { id } = JSON.parse(req.body);
  let query = { "cards.id": id };
 
  await dbConnect();
  let user = await Users.findOne(query);

  if (user) {
    let index = user.cards.findIndex(folder => folder.id === id);
    user.cards[index].public = false;
    let name = user.cards[index].folder;
    user.save();

    let pQuery = { id: id };
   
    let publicFolder = await Public.findOne(pQuery);
    publicFolder.public = false;
    publicFolder.save()

    res.status(200).json({ answer: `'${name}' folder is now private!` });    
  }
  
  else {
    res.redirect("/");
  }
}