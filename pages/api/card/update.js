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
  const { index, cardIndex, question, answer } = JSON.parse(req.body);
  let query = { email: profile.email };
  let newCard = { question: question, answer: answer };

  await dbConnect();
  let user = await Users.findOne(query);

  if (user) {
    let newCards = user.cards;
    let folderCards = user.cards[index].cards;
    let id = user.cards[index].id;
    
    folderCards.splice(cardIndex, 1);
    folderCards.splice(cardIndex, 0, newCard);
    
    newCards[index].cards = [...folderCards];
    user.cards = [...newCards];

    let pQuery = { id: id };
    let pFolder = await Public.findOne(pQuery);
    pFolder.cards = [...folderCards];
    
    pFolder.save();
    user.save();

    res.status(200).json({ answer: "Card has been updated!" });
  }

  else {
    res.redirect("/");
  }

}