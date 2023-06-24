import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { BsArrowRightShort, BsArrowLeftShort } from "react-icons/bs";
import CardList from "../cards/cardList";
import CardPage from "../cards/cardPage";
import { SnackbarProvider } from "notistack";
import Spinner from "../spinner";

export default function Card({ cards, creator, date, title, email, id }) {
  const { data: session, status } = useSession();

  const [clicked, setClicked] = useState(false);
  const [index, setIndex] = useState(0);
  const [ques, setQues] = useState();
  const [ans, setAns] = useState();
  const [cardLength, setCardLength] = useState(0);
  const [page, setPage] = useState("cards");
 
  const [pageNumber, setPageNumber] = useState(1);
  const [pageStart, setPageStart] = useState(0);
  const [pageEnd, setPageEnd] = useState(5);
  const [length, setLength] = useState(5);
  const [pages, setPages] = useState(1);
  const [folderIndex, setFolderIndex] = useState();

  useEffect(() => {
    if (cards.length > 0) {
      setQues(cards[index].question);
      setAns(cards[index].answer);
      setCardLength(cards.length);
      setPages(Math.ceil(cards.length / 5));
    }
  }, [cards, index]);

  useEffect(() => {
    if (!isNaN(index)) {
      setClicked(false);
    }
  }, [index])

  const changeLength = (e) => {
    setLength(e.target.value);
    setPageNumber(1);
    setPageStart(0);
    setPageEnd(e.target.value);
    setPages(Math.ceil(cards.length / e.target.value));
  }

  const changeCard = (type) => {
    if (type == "back") {
      setIndex(index - 1);
    } else {
      setIndex(index + 1);
    }
  }

  const prevPage = () => {
    setPageEnd(pageStart);
    setPageStart(pageStart - length);
    setPageNumber(pageNumber - 1);
  }

  const nextPage = () => {
    setPageStart(pageEnd);
    setPageEnd(pageEnd + length);
    setPageNumber(pageNumber + 1);
  }

  if (status === "authenticated" && session.user.email === email) {
    fetch("/api/public/location", {
      method: "POST",
      body: JSON.stringify({ id: id })
    }).then(res => res.json()).then(data => {
      setFolderIndex(data.index);
    }).catch(err => console.error(err));

    return (
      <SnackbarProvider preventDuplicate>
        {!isNaN(folderIndex) ? <CardPage index={folderIndex} /> : <Spinner />}
      </SnackbarProvider>
    )
  }

  if (cards.length == 0) {
    return (
      <div className="flex h-full">
        <div className="flex flex-col space-y-5 m-auto">
          <div className="text-2xl">Folder Is Empty</div>
        </div>
      </div>
    )
  }

  if (page === "list") {
    return (
      <>
        <div className="flex text-xl font-bold m-5">
          <div className="flex-1">{title} / By: {creator}</div>
          <div>Created on: {date}</div>
        </div>
        <div className="flex flex-row w-full mb-8">
          <button onClick={() => setPage("cards")} className={`flex-1 ml-4 mr-2 disabled:opacity-60 disabled:cursor-auto cursor-pointer bg-black text-white border border-2 border-slate-700 font-semibold rounded shadow`}>
            Cards
          </button>
          <button disabled className={`flex-1 mr-4 ml-2 disabled:cursor-auto cursor-pointer bg-slate-400 text-gray-800 font-semibold py-2 rounded shadow`}>
            List
          </button>
        </div>
        <div className="flex mb-5 mr-4 justify-end space-x-3">
          <button className="disabled:opacity-60" onClick={prevPage} disabled={pageNumber === 1}><BsArrowLeftShort /></button>
          <div>{pageNumber} of {pages}</div>
          <button className="disabled:opacity-60" onClick={nextPage} disabled={pageNumber === pages}><BsArrowRightShort /></button>
          <div className="">•</div>
          <div>Showing</div>
          <select value={length} onChange={changeLength} className="bg-black">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          <div>cards per page</div>
        </div>
        {cards.slice(pageStart, pageEnd).map((card, index) => {
          let key = pageStart + index;
          return (<CardList publicPage={true} card={card} index={key} key={key} />)
        })}
      </>
    )
  }

  return (
  <>
    {status !== "loading" ? (
      <>
        <div className="flex text-xl font-bold m-5">
          <div className="flex-1">{title} / By: {creator}</div>
          <div>Created on: {date}</div>
        </div>
      
        <div className="flex flex-row w-full">
          <button disabled className={`flex-1 ml-4 mr-2 disabled:cursor-auto cursor-pointer bg-slate-400 text-gray-800 font-semibold rounded shadow`}>
            Cards
          </button>
          <button onClick={() => setPage("list")} className={`flex-1 mr-4 ml-2 disabled:opacity-60 disabled:cursor-auto cursor-pointer bg-black text-white border border-2 border-slate-700 font-semibold py-2 rounded shadow`}>
            List
          </button>
        </div>
        <div className={`mt-10 m-auto flex flex-col w-1/3 h-1/2 bg-white rounded-lg`}>
          <div className="flex flex-row justify-center text-black m-3">
            {index + 1} / {cardLength}
          </div>
          <div onClick={() => setClicked(!clicked)} className="cursor-pointer justify-center flex flex-row my-auto h-52 min-h-48 text-2xl font-bold text-black overflow-y-auto">
            <div className="w-full my-auto mx-5">
              <center>
                <div>
                  {!clicked ? ques : ans}
                </div>
              </center>
            </div>
          </div>
          <div className="justify-center flex flex-col my-2 mx-2 space-y-2">
            <div className="flex space-x-2">
              <button onClick={() => changeCard("back")} disabled={index == 0} className='flex-1 disabled:opacity-60 disabled:cursor-auto cursor-pointer bg-white enabled:hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded shadow'>Back</button>
              <button onClick={() => changeCard("next")} disabled={index + 1 == cardLength} className="flex-1 disabled:opacity-60 disabled:cursor-auto cursor-pointer bg-white enabled:hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded shadow">Next</button>
            </div>
          </div>
        </div>
      </>
      ) : <Spinner />}
    </>
  )
}