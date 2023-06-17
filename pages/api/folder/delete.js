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
  const { index, folder } = JSON.parse(req.body);
  let query = { email: profile.email };

  await dbConnect();
  let user = await Users.findOne(query);

  if (user) {
    Users.findOne(query).then(user => {
      let current = user.cards;
      current.splice(index, 1);
      user.cards = current;
      user.save()
    }).catch(err => {
      console.error(err);
      res.status(400).json({ error: err });
    })

    res.status(200).json({ answer: `Deleted '${folder}' folder!` });
  }

  else {
    res.redirect("/");
  }
}