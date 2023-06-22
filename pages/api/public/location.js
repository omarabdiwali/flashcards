import dbConnect from "@/utils/dbConnect";
import Users from "@/models/Users";
import Public from "@/models/Public";

export default async function handler(req, res) {
  const { id } = JSON.parse(req.body);

  let query = { "cards.id": id };
  await dbConnect();

  let user = await Users.findOne(query);

  if (user) {
    let index = user.cards.findIndex(folder => folder.id === id);
    res.status(200).json({ index: index });    
  }
  
  else {
    res.redirect("/");
  }
}
