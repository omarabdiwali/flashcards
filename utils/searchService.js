import dbConnect from "@/utils/dbConnect";
import Search from "@/models/Search";
import Public from "@/models/Public";

const tokenize = (title) => {
  let normalizedTitle = title.toString().toLowerCase();
  let unique = new Set(normalizedTitle.match(/([^_\W][']*)+/g))
  return Array.from(unique);
}

const sortByFreq = (vals) => {
  const freqMap = new Map();
  for (const item of vals) {
    freqMap.set(item, (freqMap.get(item) || 0) + 1);
  }
  return Array.from(freqMap.keys())
  .sort((a, b) => freqMap.get(b) - freqMap.get(a));
}

const getUniqueWords = (a, b) => {
  const setA = new Set(a);
  const setB = new Set(b);
  const onlyInA = [];
  const onlyInB = [];

  for (const word of a) {
    if (!setB.has(word)) onlyInA.push(word);
  }

  for (const word of b) {
    if (!setA.has(word)) onlyInB.push(word);
  }

  return [onlyInA, onlyInB];
}

const fetchSearchEntries = async (ids, search) => {
  await dbConnect();
  const sortedIds = sortByFreq(ids);
  const unique = new Set();
  const searchValues = [];

  for (const id of sortedIds) {
    try {
      const entry = await Public.findById(id).select("-emails"); 
      if (!entry) continue;

      const uniqueKey = entry._id.toString();
      if (unique.has(uniqueKey)) continue;

      searchValues.push(entry);
      unique.add(uniqueKey);
    } catch (error) {
      console.log(`Error fetching ${id}:`, error);
    }
  }

  const partialMatches = await Public.find({ 
    _id: { "$nin": Array.from(unique) }, 
    folder: { "$regex": search, "$options": "i" }, 
    public: true 
  }).select("-emails");

  return searchValues.concat(partialMatches);
}

const addSingleEntry = async (id, word, value=false) => {
  await dbConnect();
  let tokenDoc = await Search.findOne({ word });
  if (!tokenDoc) {
    const data = { word: word, matches: new Map().set(id, value) };
    await Search.create(data);
  } else {
    tokenDoc.matches.set(id, value);
    tokenDoc.save();
  }
}

const removeSingleEntry = async (id, word) => {
  await dbConnect();
  let tokenDoc = await Search.findOne({ word });
  if (tokenDoc) {
    tokenDoc.matches.delete(id);
    if (tokenDoc.matches.size == 0) await tokenDoc.deleteOne();
    else tokenDoc.save();
  }
}

export const getSearchValues = async (search) => {
  await dbConnect();
  const words = tokenize(search);
  const objectIds = [];

  for (const word of words) {
    let tokenDoc = await Search.findOne({ word });
    if (!tokenDoc) continue;
    let entries = Array.from(tokenDoc.matches);
    entries = entries.filter(([_, value]) => value === true).map(([key]) => key);
    Array.prototype.push.apply(objectIds, entries);
  }

  return await fetchSearchEntries(objectIds, search);
}

export const modifySearchEntry = async (id, title, type) => {
  await dbConnect();
  const words = tokenize(title);
  for (const word of words) {
    type == "add" ? await addSingleEntry(id, word) : await removeSingleEntry(id, word);
  }
}

export const renameSearchEntry = async (id, previous, current, visible) => {
  await dbConnect();
  const prevTitle = tokenize(previous);
  const currentTitle = tokenize(current);
  const [removal, addition] = getUniqueWords(prevTitle, currentTitle);

  for (const word of removal) {
    await removeSingleEntry(id, word);
  }
  
  for (const word of addition) {
    await addSingleEntry(id, word, visible);
  }
}

export const modifySearchVisibility = async (id, title, visible) => {
  await dbConnect();
  const words = tokenize(title);

  for (const word of words) {
    await addSingleEntry(id, word, visible);
  }
}