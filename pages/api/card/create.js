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

  const { index, question, answer } = JSON.parse(req.body);
  let query = { email: profile.email };

  await dbConnect();
  let user = await Users.findOne(query);

  if (user) {
    let current = user.cards[index].cards;
    let id = user.cards[index].id;
    user.cards[index].cards = [...current, { question: question.toString(), answer: answer.toString() }];

    let pQuery = { id: id };
    let pFolder = await Public.findOne(pQuery);
    pFolder.cards = user.cards[index].cards;
    
    pFolder.save();
    user.save();
  }

  res.status(200).json({ answer: "Created card!" });
}