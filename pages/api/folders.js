import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
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
  let query = { email: profile.email };
  let data = { name: profile.name, email: profile.email, cards: [] };

  await dbConnect();
  let user = await Users.findOne(query);

  if (!user) {
    await Users.create(data).catch(err => console.error(err));
  }

  let owned = await Public.find({ "emails.0": profile.email });
  let pub = await Public.find({ emails: profile.email, "emails.0": { $ne: profile.email } }).select("-emails");
  let total = owned.reverse().concat(pub.reverse());
  
  if (total) {
    res.status(200).json({ folders: total });
  } else {
    res.status(200).json({ folders: [] });
  }
}