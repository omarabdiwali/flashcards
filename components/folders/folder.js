import { useSnackbar } from "notistack";
import { useState } from "react";
import { MdPublic, MdPublicOff } from "react-icons/md";
import FolderModal from "./folderModal";
import DeleteModal from "../deleteModal";

export default function Folder({ folder, index, deleteFolder }) {
  const [name, setName] = useState(folder.folder);
  const [pub, setPub] = useState(folder.public);
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

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  const makePublic = (e) => {
    e.preventDefault();
    e.stopPropagation();

    fetch("/api/public/allow", {
      method: "POST",
      body: JSON.stringify({ index: index })
    }).then(res => res.json()).then(data => {
      enqueueSnackbar(data.answer, { autoHideDuration: 3000, variant: "success" });
      setPub(true);
    }).catch(err => console.error(err));
  }

  const makePrivate = (e) => {
    e.preventDefault();
    e.stopPropagation();

    fetch("/api/public/remove", {
      method: "POST",
      body: JSON.stringify({ index: index })
    }).then(res => res.json()).then(data => {
      enqueueSnackbar(data.answer, { autoHideDuration: 3000, variant: "success" });
      setPub(false);
    }).catch(err => console.error(err));
  }


  return (
    <div onClick={() => window.location.href = `/folder/${index}`} className="border border-slate-700 border-2 cursor-pointer rounded-2xl xs:w-cardsmall sm:w-cardsmall md:w-cardfull xs:min-w-cardsmall sm:min-w-cardsmall bg-black">
      <div className="flex mx-5 flex-row space-x-4 my-5 max-h-12 h-12">
        <div className="flex-1 m-auto justify-center overflow-y-scroll font-semibold text-xl text-emerald-200">{name}</div>
        <button onClick={!pub ? makePublic : makePrivate} className="m-auto rounded-lg py-2 px-2 text-emerald-200 text-2xl cursor-pointer hover:bg-slate-900">{pub ? <MdPublic /> : <MdPublicOff />}</button>
      </div>
      <center>
        <div className="mx-3 h-body max-h-body text-blue-300 overflow-y-auto">
          <div>
            Number of Cards: {folder.cards.length}
          </div>
          <div>
            Created On: {folder.date.toString().substring(0, 10)}
          </div>
        </div>
        </center>
      <div onClick={handleClick} className="flex flex-row justify-center my-3 mx-2 h-12 max-h-12">
        <FolderModal flder={name} type="Update" button="Update" func={updateFolder} className="rounded-lg flex-1 hover:bg-slate-900" />
        <DeleteModal type={"Folder"} button={"Delete"} func={() => deleteFolder(name, index)} className="rounded-lg flex-1 hover:bg-slate-900" />
      </div>
    </div>
  )
}