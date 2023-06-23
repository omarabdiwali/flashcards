export default function Folders({ folder }) {
  return (
    <div onClick={() => window.location.href = `/public/${folder.id}`} className="flex rounded-xl cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 duration-300 hover:scale-110 h-60 flex-col space-y-4 border border-2 py-3 px-4 border-slate-700">
      <div className="text-2xl font-bold dark:text-slate-400">{folder.folder}</div>
      <div className="flex-1 text-lg">{folder.cards.length} {folder.cards.length == 1 ? "card" : "cards"}</div>
      <div className="flex space-x-5">
        <div className="flex-1">{folder.user}</div>
        <div className="opacity-75">{folder.date.toString().substring(0, 10)}</div>
      </div>
    </div>
  )
}