import { enqueueSnackbar } from "notistack";
import { useState, useEffect, useCallback } from "react";

export default function CardModal({ cardQuestion, cardAnswer, className, func, type="Update", button="Update", index=null, listUpd=null }) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const autoFocusFn = useCallback(element => {
    if (element && open) {
      element.focus();
    }
  }, [open]);

  useEffect(() => {
    setQuestion(cardQuestion);
    setAnswer(cardAnswer)
  }, [cardQuestion, cardAnswer]);

  const updateData = () => {
    let questionValue = question.trim();
    let answerValue = answer.trim();

    if (questionValue.length === 0 || answerValue.length === 0) {
      enqueueSnackbar("Values cannot be empty.", { autoHideDuration: 3000, variant: "error" });
      return;
    }

    if (questionValue === cardQuestion && answerValue === cardAnswer) {
      enqueueSnackbar("Values are not changed.", { autoHideDuration: 3000, variant: "info" });
      return;
    }

    func(questionValue, answerValue, index);
    
    if (index !== null) {
      listUpd(questionValue, answerValue);
    }

    setQuestion(questionValue);
    setAnswer(answerValue);

    if (type === "Create") {
      setQuestion("");
      setAnswer("");
    }

    setOpen(false);
  }

  const revertData = () => {
    setQuestion(cardQuestion);
    setAnswer(cardAnswer);

    setOpen(false);
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className={className}>
        {button}
      </button>

      <div className="z-50">
        <div className={`fixed flex h-screen inset-0 z-50 transition-all duration-300 delay-150 ease-in-out ${!open ? "opacity-0 hidden" : "opacity-100"} w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-96 max-h-full`}>
          <div className="relative m-auto w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow bg-slate-300 dark:bg-gray-700">
              <div className="text-2xl font-bold p-3 m-3 dark:text-white">{type} Card</div>
              <div className="flex flex-col mx-5">
                <div className="dark:text-white">Question:</div>
                <textarea ref={autoFocusFn} className="rounded-lg text-black p-2" value={question} onChange={e => setQuestion(e.target.value)}></textarea>
              </div>
              <div className="flex flex-col mx-5">
                <div className="dark:text-white">Answer:</div>
                <textarea className="rounded-lg text-black p-2" value={answer} onChange={e => setAnswer(e.target.value)}></textarea>
              </div>
              <div className="flex items-center justify-end p-6 space-x-2 rounded-b dark:border-gray-600">
                <button className="bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={updateData}>{type}</button>
                <button className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600" onClick={revertData}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`cursor-auto w-full opacity-25 fixed inset-0 z-10 bg-black ${!open ? "hidden" : ""}`}></div>
    </>
  )

}