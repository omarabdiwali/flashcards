import { useEffect, useState } from "react"
import { setCookie } from "cookies-next";
import { BsFolderPlus } from "react-icons/bs";
import { enqueueSnackbar } from "notistack";
import Folder from "./folder";
import Spinner from "../spinner";
import FolderModal from "./folderModal";

export default function FolderPage() {
  const [folders, setFolders] = useState([]);
  const [completed, setCompleted] = useState(false);
  
  useEffect(() => {
    fetch("/api/folders").then(res => res.json())
    .then(data => {
      setFolders(data.folders);
      setCompleted(true);
      setCookie("folders", `${data.folders.length}`);
    }).catch(err => console.error(err));
  }, [])

  const createFolder = (folder) => {
    fetch("/api/folder/create", {
      method: "POST",
      body: JSON.stringify({ name: folder })
    }).then(res => res.json()).then(data => {
      enqueueSnackbar(data.answer, { autoHideDuration: 3000, variant: "success" });
      window.location.reload();
    }).catch(err => console.error(err));
  }

  const deleteFolder = (name, index) => {
    fetch("/api/folder/delete", {
      method: "POST",
      body: JSON.stringify({ index: index, folder: name })
    }).then(res => res.json()).then(data => {
      enqueueSnackbar(data.answer, { autoHideDuration: 3000, variant: "success" });
      window.location.reload();
    }).catch(err => {
      console.error(err);
    })
  }

  if (completed && folders.length == 0) {
    return (
      <div className="flex h-screen">
        <div className="flex flex-col space-y-5 m-auto">
          <div className="text-2xl">No Folders Available</div>
          <FolderModal type="Create" button={"Add Folder"} func={createFolder} flder={""} className="cursor-pointer bg-white enabled:hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded shadow" />
        </div>
      </div>
    )
  }
  
  return (
    <>
      <div className="flex">
        <div className="flex-1 font-bold text-white mx-3 my-6 text-3xl font-bold">Folders</div>
        <FolderModal type="Create" button={<BsFolderPlus />} func={createFolder} flder={""} className="mr-7 text-white cursor-pointer text-2xl transition ease-in-out delay-150 hover:-translate-y-1 duration-300 hover:scale-110" />
      </div>
      {!completed ? <Spinner /> : ""}
      <div className={`flex m-auto space-x-5 pt-4 pb-7 space-y-5 px-5 flex-wrap rounded-lg mt-5`}>
        <div></div>
        {folders.map((folder, index) => {
          return (
            <Folder key={index} folder={folder} index={index} deleteFolder={deleteFolder} />
          )
        })}
      </div>
    </>
  )
}