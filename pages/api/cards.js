import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import dbConnect from "@/utils/dbConnect";
import Users from "@/models/Users";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !req.body) {
    res.redirect("/");
    return;
  }

  const profile = session.user;
  const { index } = JSON.parse(req.body);
  let query = { email: profile.email };

  await dbConnect();
  let user = await Users.findOne(query);

  if (user) {
    res.status(200).json({ cards: user.cards[index] });
  } else {
    res.redirect("/");
  }
}