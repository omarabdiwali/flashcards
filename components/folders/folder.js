import { useSnackbar } from "notistack";
import { useState } from "react";
import FolderModal from "./folderModal";
import DeleteModal from "../deleteModal";

export default function Folder({ folder, index, deleteFolder }) {
  const [name, setName] = useState(folder.folder);
  const { enqueueSnackbar } = useSnackbar();

  const updateFolder = (newName) => {
    fetch("/api/folder/update", {
      method: "POST",
      body: JSON.stringify({ index: index, folder: newName })
    }).then(res => res.json()).then(data => {
      enqueueSnackbar(data.answer, { autoHideDuration: 3000, variant: "success" });
      setName(newName);
    }).catch(err => console.error(err));
  }

  return (
    <div className="border border-slate-700 border-2 cursor-pointer rounded-2xl xs:w-cardsmall sm:w-cardsmall md:w-cardfull xs:min-w-cardsmall sm:min-w-cardsmall bg-black">
      <div onClick={() => window.location.href = `/folder/${index}`} className="flex flex-row justify-center space-x-4 my-5 max-h-12 h-12">
        <div className="h-12 overflow-y-scroll font-semibold text-2xl sm:text-lg text-emerald-200">{name}</div>
      </div>
      <center>
        <div onClick={() => window.location.href = `/folder/${index}`} className="mx-3 h-body max-h-body text-blue-300 overflow-y-auto">
          <div>
            Number of Cards: {folder.cards.length}
          </div>
          <div>
            Created On: {folder.date.toString().substring(0, 10)}
          </div>
        </div>
        </center>
      <div className="flex flex-row justify-center my-3 mx-2 h-12 max-h-12">
        <FolderModal flder={name} type="Update" button="Update" func={updateFolder} className="rounded-lg flex-1 hover:bg-slate-900" />
        <DeleteModal type={"Folder"} button={"Delete"} func={() => deleteFolder(name, index)} className="rounded-lg flex-1 hover:bg-slate-900" />
      </div>
    </div>
  )
}