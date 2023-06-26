import dbConnect from "@/utils/dbConnect";
import Public from "@/models/Public";

export default async function handler(req, res) {
  if (!req.body) {
    res.redirect("/");
    return;
  }

  const { id, index } = JSON.parse(req.body);
  const query = { id: id };

  await dbConnect();
  let pub = await Public.findOne(query);

  if (pub) {
    let emails = pub.emails;
    emails.splice(index, 1);
    pub.emails = [...emails];

    pub.save();
    res.status(200).json({ answer: "User has been removed." });
  } else {
    res.redirect("/");
  }
}