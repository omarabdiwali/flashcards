import dbConnect from "@/utils/dbConnect";
import Public from "@/models/Public";

export default async function handler(req, res) {
  if (!req.body) {
    res.redirect('/');
    return;
  }
  
  const { search } = JSON.parse(req.body);
  await dbConnect();

  let publicFolders = await Public.find({ folder: { "$regex": search, "$options": "ix" }, public: true });
  
  if (publicFolders) {
    res.status(200).json({ folders: publicFolders });
  } else {
    res.status(200).json({ folders: [] });
  }
}