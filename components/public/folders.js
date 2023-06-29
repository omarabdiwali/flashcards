export default function Folders({ folder, show, preview }) {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    preview(folder.cards, folder.folder);
  }

  return (
    <a href={`/public/${folder.id}`} className={`flex rounded-xl cursor-pointer h-40 flex-col space-y-4 text-slate-300 py-3 px-4 text-black bg-slate-800 w-full`}>
      <div className="flex mx-3 h-12 space-x-4 grow-0">
        <div className="text-xl flex-1 m-auto overflow-y-scroll whitespace-nowrap font-bold text-slate-500">{folder.folder}</div>
        {show ? <button onClick={handleClick} className="flex-1 rounded-lg px-3 hover:bg-slate-900">Preview</button> : ""}
      </div>
      <div className="flex-1 text-lg">{folder.cards.length} {folder.cards.length == 1 ? "card" : "cards"}</div>
      <div className="flex space-x-5">
        <div className="overflow-y-scroll whitespace-nowrap flex-1">{folder.user}</div>
        <div className="flex-1 opacity-75">{folder.date.toString().substring(0, 10)}</div>
      </div>
    </a>
  )
}