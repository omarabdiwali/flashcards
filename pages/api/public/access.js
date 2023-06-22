import dbConnect from "@/utils/dbConnect";
import Public from "@/models/Public";

export default async function handler(req, res) {
  const { code } = JSON.parse(req.body);
  let query = { id: code };

  await dbConnect();
  let folder = await Public.findOne(query);

  if (folder) {
    if (folder.public) {
      res.status(200).send({ folder: folder, answer: "Folder is public." });
    } else {
      res.status(200).send({ answer: "Folder is private." });
    }
  }
  
  else {
    res.status(200).send({ answer: "Can't find a folder with that ID." });
  }

}