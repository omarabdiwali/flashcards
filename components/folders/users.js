import { BsXLg } from "react-icons/bs";

export default function Users({ email, remove }) {
  return (
    <div className="flex text-lg text-black mx-5 rounded-xl mt-3 space-x-5 bg-slate-400 h-12 max-h-12">
      <button onClick={() => remove(email)} className="mx-3 m-auto"><BsXLg /></button>
      <div className="overflow-x-scroll pr-4 whitespace-nowrap flex-1 m-auto">{email}</div>
    </div>
  )
}