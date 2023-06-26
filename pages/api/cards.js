import dbConnect from "@/utils/dbConnect";
import Users from "@/models/Users";

export default async function handler(req, res) {
  if (!req.body) {
    res.redirect("/");
    return;
  }
  
  const { id } = JSON.parse(req.body);

  let query = { "cards.id": id };
  await dbConnect();

  let user = await Users.findOne(query);

  if (user) {
    let index = user.cards.findIndex(folder => folder.id === id);
    res.status(200).json({ cards: user.cards[index] });    
  } else {
    res.redirect("/");
  }
}
