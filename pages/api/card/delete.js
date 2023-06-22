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
  const { folder, index } = JSON.parse(req.body);
  let query = { email: profile.email };

  await dbConnect();
  let user = await Users.findOne(query);

  if (user) {
    let newCards = user.cards;
    let cards = user.cards[folder].cards;
    let id = user.cards[folder].id;
    
    cards.splice(index, 1);
    newCards[folder].cards = [...cards];
    user.cards = [...newCards];

    let pQuery = { id: id };
    let pFolder = await Public.findOne(pQuery);

    if (pFolder) {
      pFolder.cards = [...cards];
      pFolder.save();
    }

    user.save();

    res.status(200).json({ answer: "Card has been deleted!" });
  } else {
    res.redirect("/");
  }
}