import { useSnackbar } from "notistack";
import { useState, useEffect } from "react";
import { MdPublic, MdPublicOff, MdLink } from "react-icons/md";
import FolderModal from "./folderModal";
import DeleteModal from "../deleteModal";
import { useSession } from "next-auth/react";
import UsersModal from "./usersModal";

export default function Folder({ folder, deleteFolder }) {
  const [name, setName] = useState(folder.folder);
  const [pub, setPub] = useState(folder.public);
  const [disabled, setDisabled] = useState(false);
  const [creator, setCreator] = useState(false);
  const [emails, setEmails] = useState(folder.emails);
  const [newEmails, setNewEmails] = useState(folder.emails);
  const { enqueueSnackbar } = useSnackbar();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      setCreator(folder.emails);
    }
  }, [status])

  useEffect(() => {
    setEmails(newEmails);
  }, [newEmails])

  const removeEmail = (email) => {
    fetch("/api/folder/access/remove", {
      method: "POST",
      body: JSON.stringify({ id: folder.id, email: email })
    }).then(res => res.json()).then(data => enqueueSnackbar(data.answer, { autoHideDuration: 3000, variant: "success" }))
      .catch(err => console.error(err));
    
    let emls = [...emails];
    let index = emls.indexOf(email);
    emls.splice(index, 1);
    setNewEmails(emls);
  }

  const addEmail = (email) => {
    fetch("/api/folder/access/allow", {
      method: "POST",
      body: JSON.stringify({ id: folder.id, email: email })
    }).then(res => res.json()).then(data => enqueueSnackbar(data.answer, { autoHideDuration: 3000, variant: "success" }))
      .catch(err => console.error(err));

    setNewEmails(newEmails => [...newEmails, email]);
  }

  const updateFolder = (newName) => {
    fetch("/api/folder/update", {
      method: "POST",
      body: JSON.stringify({ id: folder.id, folder: newName })
    }).then(res => res.json()).then(data => {
      if (data.answer == "Folder has been updated.") {
        enqueueSnackbar(data.answer, { autoHideDuration: 3000, variant: "success" });
        setName(newName);
      } else {
        enqueueSnackbar(data.answer, { autoHideDuration: 3000, variant: "warning" });
        setTimeout(() => window.location.reload(), 1000);
      }
    }).catch(err => console.error(err));
  }

  const makePublic = (e) => {
    e.preventDefault();
    setDisabled(true);

    fetch("/api/public/allow", {
      method: "POST",
      body: JSON.stringify({ id: folder.id })
    }).then(res => res.json()).then(data => {
      enqueueSnackbar(data.answer, { autoHideDuration: 3000, variant: "success" });
      setPub(true);
      setDisabled(false);
    }).catch(err => console.error(err));
  }

  const makePrivate = (e) => {
    e.preventDefault();
    setDisabled(true);

    fetch("/api/public/remove", {
      method: "POST",
      body: JSON.stringify({ id: folder.id })
    }).then(res => res.json()).then(data => {
      enqueueSnackbar(data.answer, { autoHideDuration: 3000, variant: "success" });
      setPub(false);
      setDisabled(false);
    }).catch(err => console.error(err));
  }

  return (
    <div className="border flex flex-col justify-between border-slate-700 border-2 rounded-2xl xs:w-cardall sm:w-cardsmall md:w-cardsmall lg:w-cardfull xs:min-w-cardall sm:min-w-cardsmall md:min-w-cardsmall">
      <div className="flex mx-5 flex-row my-5 max-h-12 h-12 text-emerald-200">
        <div className="flex-1 max-h-12 whitespace-nowrap m-auto overflow-x-scroll font-semibold text-xl">{name}</div>
        <a href={`/public/${folder.id}/${folder.folder}`} className="my-auto rounded-lg py-2 px-2 text-2xl cursor-pointer hover:bg-slate-900"><MdLink /></a>
        {creator ? <button disabled={disabled} onClick={!pub ? makePublic : makePrivate} className="my-auto disabled:cursor-auto rounded-lg py-2 px-2 text-2xl cursor-pointer hover:bg-slate-900">{pub ? <MdPublic /> : <MdPublicOff />}</button> : ""}
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
      {creator ? (
        <>
          <div className="flex flex-row justify-center mx-2 h-12 max-h-12">
            <FolderModal flder={name} type="Update" button="Update" func={updateFolder} className="rounded-lg flex-1 hover:bg-slate-900" />
            <DeleteModal type={"Folder"} button={"Delete"} func={() => deleteFolder(name, folder.id)} className="rounded-lg flex-1 hover:bg-slate-900" />
          </div>
          <div className="flex justify-center mb-3 mx-2 h-12 max-h-12">
            <UsersModal id={folder.id} emails={emails} add={addEmail} remove={removeEmail} className="rounded-lg flex-1 hover:bg-slate-900" />
          </div>
        </>
      ) : (
          <div className="flex mx-2 h-12 my-3">
            <div className="flex-1 m-auto ml-5 text-lg tracking-wider justify-end opacity-60">SHARED</div>
            <DeleteModal type={"Folder"} button={"Leave"} func={() => {
              removeEmail(session.user.email);
              window.location.reload();
            }} className="rounded-lg flex-1 hover:bg-slate-900" />
          </div>
      )}
    </div>
  )
}