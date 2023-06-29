import { useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";
import { BsPlusSquare, BsArrowRightShort, BsArrowLeftShort, BsPlusCircle } from "react-icons/bs";
import CardModal from "./cardModal";
import DeleteModal from "../deleteModal";
import CardList from "./cardList";

export default function Card({ cards, access, id }) {
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

  const movePage = () => {
    if (pageNumber > Math.ceil(cards.length / length) && pageNumber > 1) {
      setPageNumber(pageNumber - 1);
      setPageStart(pageStart - length);
      setPageEnd(pageEnd - length);
    }
  }

  const changeCard = (type) => {
    if (type == "back") {
      setIndex(index - 1);
    } else {
      setIndex(index + 1);
    }
  }

  const deleteCard = (deleteIndex = null) => {
    if (deleteIndex === null) {
      deleteIndex = index;
    }

    fetch("/api/card/delete", {
      method: "POST",
      body: JSON.stringify({ id: id, index: deleteIndex, question: cards[deleteIndex].question, answer: cards[deleteIndex].answer })
    }).then(res => res.json())
      .then(data => {
        if (data.answer === "Card has been deleted!") {
          enqueueSnackbar(data.answer, { autoHideDuration: 3000, variant: "success" })
        } else {
          enqueueSnackbar(data.answer, { autoHideDuration: 3000, variant: "warning" });
          setTimeout(() => window.location.reload(), 1500);
        }
      })
      .catch(err => console.error(err));
        
    cards.splice(deleteIndex, 1);
    
    if (deleteIndex === cards.length && deleteIndex === index) {
      setIndex(deleteIndex - 1);
    } else if (deleteIndex === index) {
      setQues(cards[deleteIndex].question);
      setAns(cards[deleteIndex].answer);
    }
    
    setCardLength(cards.length);
    setPages(Math.ceil(cards.length / 5));
    movePage();
  }

  const create = (q, a) => {
    let card = { id: id, question: q, answer: a };

    fetch("/api/card/create", {
      method: "POST",
      body: JSON.stringify(card)
    }).then(res => res.json()).then(data => {
      enqueueSnackbar(data.answer, { autoHideDuration: 3000, variant: "success" });
    }).catch(err => console.error(err));

    if (cards.length == 0) {
      setQues(q);
      setAns(a);
      setIndex(0);
    }

    cards.push({question: q, answer: a});
    setCardLength(cards.length);
    setPages(Math.ceil(cards.length / 5));
  }

  const update = (q, a, updateIndex = null) => {    
    if (updateIndex === null || updateIndex === index) {
      setQues(q);
      setAns(a);

      updateIndex = index;
    }

    fetch("/api/card/update", {
      method: "POST",
      body: JSON.stringify({ id: id, cardIndex: updateIndex, question: q, answer: a, prQ: cards[updateIndex].question, prA: cards[updateIndex].answer })
    }).then(res => res.json()).then(data => {
      if (data.answer === "Card has been updated!") {
        enqueueSnackbar(data.answer, { autoHideDuration: 3000, variant: "success" });
      } else {
        enqueueSnackbar(data.answer, { autoHideDuration: 3000, variant: "warning" });
        setTimeout(() => window.location.reload(), 1500);
      }
    }).catch(err => console.error(err));

    cards[updateIndex].question = q;
    cards[updateIndex].answer = a;
    
    setClicked(false);
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

  if (cards.length == 0) {
    return (
      <div className="flex h-full">
        <div className="flex flex-col space-y-5 m-auto">
          <div className="text-2xl">Folder Is Empty</div>
          {access ? <CardModal className="cursor-pointer bg-white enabled:hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded shadow" type={"Create"} cardQuestion={""} cardAnswer={""} func={create} button={"Add Card"} /> : ""}
        </div>
      </div>
    )
  }

  if (page === "list") {
    return (
      <>
        <div className="flex flex-row w-full mb-8">
          <button onClick={() => setPage("cards")} className={`flex-1 ml-4 mr-2 disabled:opacity-60 disabled:cursor-auto cursor-pointer bg-black text-white border border-2 border-slate-700 font-semibold rounded shadow`}>
            Cards
          </button>
          <button disabled className={`flex-1 mr-4 ml-2 disabled:cursor-auto cursor-pointer bg-slate-400 text-gray-800 font-semibold py-2 rounded shadow`}>
            List
          </button>
        </div>
        <div className={`flex ${!access ? "justify-end" : ""}`}>
          {access ? (
            <div className="mx-7 flex-1">
              <CardModal className="text-2xl" type={"Create"} button={<BsPlusCircle />} cardQuestion={""} cardAnswer={""} func={create} />
            </div>
          ) : ""}
          <div className="flex mb-5 mr-4 text-sm justify-end space-x-3">
            <button className="disabled:opacity-60" onClick={prevPage} disabled={pageNumber === 1}><BsArrowLeftShort /></button>
            <div>{pageNumber} of {pages}</div>
            <button className="disabled:opacity-60" onClick={nextPage} disabled={pageNumber === pages}><BsArrowRightShort /></button>
            <div className="">•</div>
            <div>Showing</div>
            <select value={length} onChange={changeLength} className="text-white bg-black">
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <div>cards per page</div>
          </div>
        </div>
        {cards.slice(pageStart, pageEnd).map((card, index) => {
          let key = pageStart + index;
          return (<CardList update={update} publicPage={!access} deleteItem={deleteCard} card={card} index={key} key={key} />)
        })}
      </>
    )
  }

  return (
    <>
      <div className="flex flex-row w-full">
        <button disabled className={`flex-1 ml-4 mr-2 disabled:cursor-auto cursor-pointer bg-slate-400 text-gray-800 font-semibold rounded shadow`}>
          Cards
        </button>
        <button onClick={() => setPage("list")} className={`flex-1 mr-4 ml-2 disabled:opacity-60 disabled:cursor-auto cursor-pointer bg-black text-white border border-2 border-slate-700 font-semibold py-2 rounded shadow`}>
          List
        </button>
      </div>
      <div className={`mt-10 select-none m-auto flex flex-col w-96 bg-white rounded-lg`}>
        <div className="flex flex-row text-black m-3">
          <div className="flex-1 mt-2">
            {index + 1} / {cardLength}
          </div>
          {access ? <CardModal className="mr-3 mt-2 text-black text-2xl transition ease-in-out delay-150 hover:-translate-y-1 duration-300 hover:scale-110" type={"Create"} button={<BsPlusSquare />} cardQuestion={""} cardAnswer={""} func={create} /> : ""}
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
          {access ? (
            <div className="flex space-x-2">
              <div className="flex-1">
                <DeleteModal type="Card" button="Delete" func={deleteCard} className="w-full cursor-pointer bg-white enabled:hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded shadow" />
              </div>
              <div className="flex-1">
                <CardModal className="w-full cursor-pointer bg-white enabled:hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded shadow" type={"Update"} cardQuestion={cards[index].question} cardAnswer={cards[index].answer} func={update} />
              </div>
            </div>
          ) : ""}
          <div className="flex space-x-2">
            <button onClick={() => changeCard("back")} disabled={index == 0} className='flex-1 disabled:opacity-60 disabled:cursor-auto cursor-pointer bg-white enabled:hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded shadow'>Back</button>
            <button onClick={() => changeCard("next")} disabled={index + 1 == cardLength} className="flex-1 disabled:opacity-60 disabled:cursor-auto cursor-pointer bg-white enabled:hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded shadow">Next</button>
          </div>
        </div>
      </div>
    </>
  )
}