import { useState } from "react";

export default function DeleteModal({ func, type, className, button }) {
  const [open, setOpen] = useState(false);

  const deleteItem = () => {
    func();
    setOpen(false)
  }
  return (
    <>
     <button onClick={() => setOpen(true)} className={className}>
        {button}
      </button>

      <div className={`cursor-auto ${!open ? "hidden" : ""} z-50`}>
        <div className={`fixed flex h-screen inset-0 z-50 transition-all duration-300 delay-150 ease-in-out ${!open ? "opacity-0 hidden" : "opacity-100"} w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-96 max-h-full`}>
          <div className="relative m-auto w-full max-w-2xl max-h-full">
            <div className="relative rounded-lg shadow bg-slate-300 bg-gray-700">
              <div className="text-2xl font-bold p-3 m-3">Delete {type}</div>
              <div className="text-lg mx-5">
                Are you sure? You can&apos;t undo this action afterwards.
              </div>
              <div className="flex justify-end p-6 space-x-2 rounded-b border-gray-600">
                <button className="text-black focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-red-600 hover:bg-red-700 focus:ring-red-800" onClick={deleteItem}>Delete</button>
                <button className="focus:ring-4 focus:outline-none rounded-lg border text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 bg-gray-700 text-gray-300 border-gray-500 hover:text-white hover:bg-gray-600 focus:ring-gray-600" onClick={() => setOpen(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`cursor-auto w-full opacity-25 fixed inset-0 z-10 bg-black ${!open ? "hidden" : ""}`}></div>
    </>
  )
}