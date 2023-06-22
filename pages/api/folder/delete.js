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
  let query = { email: profile.email };

  await dbConnect();
  let user = await Users.findOne(query);

  if (user) {
    let current = user.cards;
    let id = user.cards[index].id;
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