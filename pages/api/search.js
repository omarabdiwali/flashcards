import { getSearchValues } from "@/utils/searchService";

export default async function handler(req, res) {
  if (!req.body) {
    res.redirect('/');
    return;
  }
  
  const { search } = JSON.parse(req.body);
  let publicFolders = await getSearchValues(search);
  
  if (publicFolders) {
    res.status(200).json({ folders: publicFolders });
  } else {
    res.status(200).json({ folders: [] });
  }
}