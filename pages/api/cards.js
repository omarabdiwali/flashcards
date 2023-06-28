import dbConnect from "@/utils/dbConnect";
import Public from "@/models/Public";

export default async function handler(req, res) {
  if (!req.body) {
    res.redirect("/");
    return;
  }
  
  const { id } = JSON.parse(req.body);

  let query = { id: id };
  await dbConnect();

  let pubFolder = await Public.findOne(query);

  if (pubFolder) {
    res.status(200).json({ folder: pubFolder});    
  } else {
    res.redirect("/");
  }
}
