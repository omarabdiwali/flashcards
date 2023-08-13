import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import dbConnect from "@/utils/dbConnect";
import Public from "@/models/Public";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!req.body) {
    res.redirect("/");
    return;
  }
  
  const { id } = JSON.parse(req.body);
  let access = false;

  let query = { id: id };
  await dbConnect();

  let pubFolder = await Public.findOne(query);

  if (pubFolder) {
    if (session) {
      let email = session.user.email;
      access = pubFolder.emails.includes(email);
    }
    
    res.status(200).json({ name: pubFolder.folder, date: pubFolder.date, cards: pubFolder.cards, user: pubFolder.user, access: access });    
  } else {
    res.redirect("/");
  }
}
