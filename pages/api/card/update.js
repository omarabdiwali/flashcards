import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import dbConnect from "@/utils/dbConnect";
import Users from "@/models/Users";

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
    Users.findOne(query).then(user => {
      let newCards = user.cards;
      let folderCards = user.cards[index].cards;
      
      folderCards.splice(cardIndex, 1);
      folderCards.splice(cardIndex, 0, newCard);
      
      newCards[index].cards = [...folderCards];
      user.cards = [...newCards];
      user.save();
    }).catch(err => {
      console.error(err);
      res.status(400).json({error: err});
    })

    res.status(200).json({ answer: "Card has been updated!" });
  }

  else {
    res.redirect("/");
  }

}