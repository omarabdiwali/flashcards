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

  const { id, question, answer } = JSON.parse(req.body);
  let query = { "cards.id": id };

  await dbConnect();
  let user = await Users.findOne(query);

  if (user) {
    let pQuery = { id: id };
    let pFolder = await Public.findOne(pQuery);

    if (!pFolder || pFolder.emails.includes(profile.email) == false) {
      res.status(200).json({ answer: "Changes have been made, page reloading!" });
      return;
    }

    let index = user.cards.findIndex(folder => folder.id === id);
    let current = user.cards[index].cards;
    
    user.cards[index].cards = [...current, { question: question.toString(), answer: answer.toString() }];
    pFolder.cards = user.cards[index].cards;
    
    pFolder.save();
    user.save();

    res.status(200).json({ answer: "Created card!" });
  } else {
    res.status(200).json({ answer: "Changes have been made, page reloading!" });
  }
}