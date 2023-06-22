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
  const { index } = JSON.parse(req.body);

  let query = { email: profile.email };
  await dbConnect();

  let user = await Users.findOne(query);

  if (user) {
    user.cards[index].public = true;
    let pFolder = user.cards[index];
    user.save();

    let pQuery = { id: pFolder.id };
    let publicFolder = await Public.findOne(pQuery);
    
    publicFolder.public = true;
    publicFolder.save()

    res.status(200).json({ answer: `'${pFolder.folder}' folder is now public!` });    
  }
  
  else {
    res.redirect("/");
  }
}