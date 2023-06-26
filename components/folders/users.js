import { BsXLg } from "react-icons/bs";

export default function Users({ email, remove }) {
  return (
    <div className="flex text-lg text-slate-700 mx-5 rounded-xl mt-3 space-x-5 bg-slate-400 h-12 max-h-12">
      <button onClick={() => remove(email)} className="mx-3 m-auto"><BsXLg /></button>
      <div className="flex-1 m-auto">{email}</div>
    </div>
  )
}