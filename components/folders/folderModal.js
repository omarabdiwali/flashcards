import { enqueueSnackbar } from "notistack";
import { useEffect, useCallback, useState } from "react"

export default function FolderModal({ flder, func, type, button, className }) {
  const [open, setOpen] = useState(false);
  const [folder, setFolder] = useState("")
  
  const autoFocusFn = useCallback(element => {
    if (element && open) {
      element.focus();
    }
  }, [open]);

  useEffect(() => {
    setFolder(flder);
  }, [flder]);

  const updateData = () => {
    let folderValue = folder.trim();
    
    if (folderValue.length === 0) {
      enqueueSnackbar("Value cannot be empty.", { autoHideDuration: 3000, variant: "error" });
      return;
    }

    if (folderValue === flder) {
      enqueueSnackbar("Value is not changed.", { autoHideDuration: 3000, variant: "info" });
      return;
    }

    func(folderValue);
    setFolder(folderValue);
    setOpen(false);
  }

  const revertData = () => {
    setFolder(flder);
    setOpen(false);
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className={className}>
        {button}
      </button>

      <div className={`cursor-auto ${!open ? "hidden" : ""} z-50`}>
        <div className={`absolute flex h-screen inset-0 z-50 transition-all duration-300 delay-150 ease-in-out ${!open ? "opacity-0 hidden" : "opacity-100"} w-full overflow-x-hidden overflow-y-auto md:inset-0 h-96 max-h-full`}>
          <div className="relative m-auto w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow bg-slate-700">
              <div className="text-2xl font-bold p-3 m-3">{type} Folder</div>
              <div className="flex flex-col mx-5">
                <div>Name:</div>
                <input ref={autoFocusFn} type="text" className="rounded-lg text-black p-2" value={folder} onChange={e => setFolder(e.target.value)} />
              </div>
              <div className="flex items-center justify-end p-6 space-x-2 rounded-b border-gray-600">
                <button className="focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800" onClick={updateData}>{type}</button>
                <button className="focus:ring-4 focus:outline-none rounded-lg border text-sm font-medium px-5 py-2.5 focus:z-10 bg-gray-700 text-gray-300 border-gray-500 hover:text-white hover:bg-gray-600 focus:ring-gray-600" onClick={revertData}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`ml-0 cursor-auto w-full opacity-25 absolute inset-0 z-10 bg-black ${!open ? "hidden" : ""}`}></div>
    </>
  )
}