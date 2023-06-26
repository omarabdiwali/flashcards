import { useEffect, useState } from "react"
import { BsFolderPlus } from "react-icons/bs";
import { enqueueSnackbar } from "notistack";
import Folder from "./folder";
import Spinner from "../spinner";
import FolderModal from "./folderModal";
import { useSession } from "next-auth/react";

export default function FolderPage() {
  const [folders, setFolders] = useState([]);
  const [completed, setCompleted] = useState(false);
  const { data: session, status } = useSession();
  
  useEffect(() => {
    if (status === "loading") return;
    fetch("/api/folders").then(res => res.json())
    .then(data => {
      let folders = data.folders;
      folders.sort((folder, folder1) => (folder1.emails[0] === session.user.email && folder.emails[0] !== session.user.email) ? 1 : (folder.emails[0] === session.user.email && folder1.emails[0] !== session.user.email) ? -1 : 0);
      setFolders(folders);
      setCompleted(true);
    }).catch(err => console.error(err));
  }, [status])

  const createFolder = (folder) => {
    fetch("/api/folder/create", {
      method: "POST",
      body: JSON.stringify({ name: folder })
    }).then(res => res.json()).then(data => {
      enqueueSnackbar(data.answer, { autoHideDuration: 3000, variant: "success" });
      window.location.reload();
    }).catch(err => console.error(err));
  }

  const deleteFolder = (name, id) => {
    fetch("/api/folder/delete", {
      method: "POST",
      body: JSON.stringify({ id: id, folder: name })
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
      <div className="flex mx-3 my-6 justify-end">
        <FolderModal type="Create" button={<BsFolderPlus />} func={createFolder} flder={""} className="mr-7 cursor-pointer text-2xl transition ease-in-out delay-150 hover:-translate-y-1 duration-300 hover:scale-110" />
      </div>
      {!completed ? <Spinner /> : ""}
      <div className={`flex m-auto space-x-5 pt-4 pb-7 space-y-5 px-5 flex-wrap rounded-lg mt-5`}>
        <div></div>
        {folders.map((folder, index) => {
          return (
            <Folder key={index} folder={folder} deleteFolder={deleteFolder} />
          )
        })}
      </div>
    </>
  )
}