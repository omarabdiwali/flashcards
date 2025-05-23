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
  
  const profile = session.user;

  const { id, index, question, answer } = JSON.parse(req.body);
  let query = { "cards.id": id };
  let card = { question: question, answer: answer };

  await dbConnect();
  let user = await Users.findOne(query);

  if (user) {
    let pQuery = { id: id };
    let pFolder = await Public.findOne(pQuery);

    if (!pFolder || pFolder.emails.includes(profile.email) == false) {
      res.status(200).json({ answer: "Changes have been made, page reloading!" });
      return;
    }

    let newCards = user.cards;
    let folder = user.cards.findIndex(folder => folder.id === id);
    let cards = user.cards[folder].cards;

    if (JSON.stringify(cards[index]) === JSON.stringify(card)) {
      cards.splice(index, 1);
      newCards[folder].cards = [...cards];
      
      user.cards = [...newCards];
      pFolder.cards = [...cards];
      
      pFolder.save();
      user.save();

      res.status(200).json({ answer: "Card has been deleted!" });
    }

    else {
      res.status(200).json({ answer: "Changes have been made, page reloading!" });
    }
    
  } else {
    res.status(200).json({ answer: "Changes have been made, page reloading!" });
  }
}