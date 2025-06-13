import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import dbConnect from "@/utils/dbConnect";
import Users from "@/models/Users";
import Public from "@/models/Public";
import { renameSearchEntry } from "@/utils/searchService";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !req.body) {
    res.redirect("/");
    return;
  }

  const { id, folder } = JSON.parse(req.body);
  let query = { "cards.id": id }

  await dbConnect();
  let user = await Users.findOne(query);

  if (user) {
    let index = user.cards.findIndex(folder => folder.id === id);
    let pQuery = { id: id };
    let pub = await Public.findOne(pQuery);

    if (!pub) {
      res.status(200).json({ answer: "Changes have been made, page reloading!" });
      return;
    }

    const prevFolder = pub.folder;    
    pub.folder = folder;
    user.cards[index].folder = folder;

    user.save();
    pub.save();
    
    await renameSearchEntry(pub._id, prevFolder, folder, pub.public);
    res.status(200).json({ answer: "Folder has been updated." });
  } else {
    res.status(200).json({ answer: "Changes have been made, page reloading!" });
  }
}