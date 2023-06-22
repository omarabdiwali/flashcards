import { useEffect, useState } from "react";
import CardModal from "./cardModal"
import DeleteModal from "../deleteModal";

export default function CardList({ card, index, update=null, deleteItem=null, publicPage=false }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    setQuestion(card.question);
    setAnswer(card.answer);
  }, [card]);

  const updateList = (q, a) => {
    setQuestion(q);
    setAnswer(a);
  }

  return (
    <div className="flex mb-7 flex-col border border-2 border-slate-700 divide-y mx-10 rounded-xl p-5 space-y-5">
      <div className="flex-1 flex flex-col">
        <div className="flex">
          <div className="flex-1 text-slate-700 font-extrabold mb-2">Question</div>
          {!publicPage ? (
            <div className={`flex space-x-3 justify-end`}>
              <CardModal listUpd={updateList} index={index} className="text-slate-400" type={"Update"} cardQuestion={question} cardAnswer={answer} func={update} />
              <DeleteModal type="Card" button="Delete" func={() => deleteItem(index)} className="text-slate-400" />
          </div>
          ) : ""}
        </div>
        <div className="">{question}</div>
      </div>
      <div className="flex-1 flex flex-col pt-4">
        <div className="text-slate-700 font-extrabold mb-2">Answer</div>
        <div className="">{answer}</div>
      </div>
    </div>
  )
}