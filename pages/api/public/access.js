import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "@/utils/dbConnect";
import Public from "@/models/Public";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  let email;

  if (!req.body) {
    res.redirect("/");
    return;
  }

  if (session) {
    const profile = session.user;
    email = profile.email;
  }


  const { code } = JSON.parse(req.body);
  let query = { id: code };

  await dbConnect();
  let folder = await Public.findOne(query);

  if (folder) {
    if (folder.public || folder.email === email) {
      res.status(200).send({ folder: folder, answer: "Folder is public." });
    } else {
      res.status(200).send({ answer: "Folder is private." });
    }
  }
  
  else {
    res.status(200).send({ answer: "Can't find a folder with that ID." });
  }

}