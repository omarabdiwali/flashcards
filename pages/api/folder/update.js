import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import dbConnect from "@/utils/dbConnect";
import Users from "@/models/Users";
import Public from "@/models/Public";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.redirect("/");
    return;
  }

  const profile = session.user;
  const { index, folder } = JSON.parse(req.body);
  let query = { email: profile.email }

  await dbConnect();
  let user = await Users.findOne(query);

  if (user) {
    user.cards[index].folder = folder;
    let id = user.cards[index].id;
    user.save();

    let pQuery = { id: id };
    
    let pub = await Public.findOne(pQuery);
    pub.folder = folder;
    pub.save()  
    
   res.status(200).json({ answer: "Folder has been updated." });
  }
}