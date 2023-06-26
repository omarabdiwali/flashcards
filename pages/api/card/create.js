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

  const { id, question, answer } = JSON.parse(req.body);
  let query = { "cards.id": id };

  await dbConnect();
  let user = await Users.findOne(query);

  if (user) {
    let index = user.cards.findIndex(folder => folder.id === id);
    let current = user.cards[index].cards;
    user.cards[index].cards = [...current, { question: question.toString(), answer: answer.toString() }];

    let pQuery = { id: id };
    let pFolder = await Public.findOne(pQuery);
    pFolder.cards = user.cards[index].cards;
    
    pFolder.save();
    user.save();
  }

  res.status(200).json({ answer: "Created card!" });
}