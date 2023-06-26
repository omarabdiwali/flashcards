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

  const { id, index } = JSON.parse(req.body);
  let query = { "cards.id": id };

  await dbConnect();
  let user = await Users.findOne(query);

  if (user) {
    let newCards = user.cards;
    let folder = user.cards.findIndex(folder => folder.id === id);

    let cards = user.cards[folder].cards;
    
    cards.splice(index, 1);
    newCards[folder].cards = [...cards];
    user.cards = [...newCards];

    let pQuery = { id: id };
    let pFolder = await Public.findOne(pQuery);
    pFolder.cards = [...cards];
    
    pFolder.save();
    user.save();

    res.status(200).json({ answer: "Card has been deleted!" });
  } else {
    res.redirect("/");
  }
}