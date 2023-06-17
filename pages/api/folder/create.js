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
  const { name } = JSON.parse(req.body);
  
  let query = { email: profile.email }
  let folder = { folder: name.toString(), cards: [], date: new Date() };

  await dbConnect();
  let user = await Users.findOne(query);

  if (user) {
    Users.findOne(query).then(user => {
      user.cards.push(folder);
      user.save();
    }).catch(err => {
      console.error(err);
      res.status(400).json({error: err});
    })
  }

  else {
    res.redirect("/");
  }

  res.status(200).json({ answer: `Created '${name}' folder!` });
}