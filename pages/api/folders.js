import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import dbConnect from "@/utils/dbConnect";
import Users from "@/models/Users";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.redirect("/");
    return;
  }

  const profile = session.user;
  let query = { email: profile.email };
  let data = { name: profile.name, email: profile.email, cards: [] };

  await dbConnect();
  let user = await Users.findOne(query);

  if (user) {
    res.status(200).json({ folders: user.cards });
  } else {
    Users.create(data).then(user => {
      res.status(200).json({ folders: user.cards });
    }).catch(err => console.error(err));
  }
}