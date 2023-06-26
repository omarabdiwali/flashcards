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

  const { id, cardIndex, question, answer, prQ, prA } = JSON.parse(req.body);
  let query = { "cards.id": id };
  let newCard = { question: question, answer: answer };
  let oldCard = { question: prQ, answer: prA };

  await dbConnect();
  let user = await Users.findOne(query);

  if (user) {
    let index = user.cards.findIndex(folder => folder.id === id);
    
    if (JSON.stringify(user.cards[index].cards[cardIndex]) === JSON.stringify(oldCard)) {
      user.cards[index].cards[cardIndex] = newCard;

      let folderCards = user.cards[index].cards;

      let pQuery = { id: id };
      let pFolder = await Public.findOne(pQuery);
      pFolder.cards = [...folderCards];
      
      pFolder.save();
      user.save();

      res.status(200).json({ answer: "Card has been updated!" });
    }

    else {
      res.status(200).json({answer: "Changes have been made, page reloading!"})
    }
    
  }

  else {
    res.redirect("/");
  }

}