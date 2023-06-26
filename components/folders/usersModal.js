import { enqueueSnackbar } from "notistack";
import { useCallback, useState } from "react"
import { BsPlus, BsPlusCircle, BsXLg } from "react-icons/bs";
import Users from "./users";

export default function UsersModal({ emails, className, add, remove }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState("")
  
  const autoFocusFn = useCallback(element => {
    if (element && open) {
      element.focus();
    }
  }, [open]);

  const removeEmail = (email) => {
    let index = emails.indexOf(email);
    emails.splice(index, 1);

    remove(email);
  }

  const updateData = (e) => {
    e.preventDefault();

    let userValue = user.trim();
    const pattern = /^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/;

    if (userValue.length == 0) return;

    if (!pattern.test(userValue)) {
      enqueueSnackbar("Email is not a Gmail account.", { autoHideDuration: 3000, variant: "info" });
      return;
    }

    if (emails.includes(userValue)) {
      enqueueSnackbar("Email already has access.", { autoHideDuration: 3000, variant: "info" });
      return;
    }

    add(userValue);
    emails.push(userValue);
    setUser("");
  }

  const revertData = () => {
    setUser("");
    setOpen(false);
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className={className}>
        Access
      </button>

      <div className={`cursor-auto ${!open ? "hidden" : ""} z-50`}>
        <div className={`absolute flex h-screen inset-0 z-50 transition-all duration-300 delay-150 ease-in-out ${!open ? "opacity-0 hidden" : "opacity-100"} w-full overflow-x-hidden overflow-y-auto md:inset-0 h-96 max-h-full`}>
          <div className="relative m-auto w-full max-w-2xl max-h-full">
            <div className="relative rounded-lg shadow bg-slate-700">
              <div className="flex text-2xl font-bold p-3 m-3">
                <div className="flex-1">Users</div>
                <button onClick={revertData} className="text-3xl text-slate-300"><BsXLg /></button>
              </div>
              <div className="flex flex-col mx-5">
                <div className="flex space-x-4">
                  <form className="flex-1" onSubmit={updateData}>
                    <input ref={autoFocusFn} type="text" className="w-full mb-5 rounded-lg text-black p-2" value={user} onChange={e => setUser(e.target.value)} />
                  </form>
                  <div className="mt-1">
                    <button onClick={updateData} className="text-3xl rounded-xl text-slate-700 hover:text-white bg-slate-400 hover:bg-slate-800"><BsPlus /></button>
                  </div>
                </div>
                <div className="mb-5">
                  {emails.length > 1 ? emails.slice(1).map((email, index) => {
                    return <Users key={index} email={email} remove={removeEmail} />
                  }): "No other users."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`ml-0 cursor-auto w-full opacity-25 absolute inset-0 z-10 bg-black ${!open ? "hidden" : ""}`}></div>
    </>
  )
}