import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import { modifySearchEntry } from "@/utils/searchService";
import dbConnect from "@/utils/dbConnect";
import Users from "@/models/Users";
import Public from "@/models/Public";

let crypto = require("crypto");

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !req.body) {
    res.redirect("/");
    return;
  }

  const profile = session.user;
  const { name } = JSON.parse(req.body);
  
  let query = { email: profile.email }
  let id = crypto.randomBytes(5).toString('hex');

  await dbConnect();

  let created = await Users.findOne({ "cards.id": id });

  while (created) {
    id = crypto.randomBytes(5).toString('hex');
    created = await Users.findOne({ "cards.id": id });
  }
  
  let folder = { id: id, folder: name.toString(), cards: [], date: new Date(), public: false };
  let user = await Users.findOne(query);
  let data;

  if (user) {
    user.cards.push(folder);
    user.save();
    data = { id: folder.id, user: user.name, emails: [profile.email], folder: folder.folder, cards: folder.cards, date: folder.date, public: folder.public };

    const createdFolder = await Public.create(data);
    await modifySearchEntry(createdFolder._id, createdFolder.folder, "add");
  }

  else {
    res.redirect("/");
    return;
  }

  res.status(200).json({ item: data, answer: `Created '${name}' folder!` });
}