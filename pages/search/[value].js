import CardList from "@/components/cards/cardList";
import Folders from "@/components/public/folders";
import Spinner from "@/components/spinner";
import Toolbar from "@/components/toolbar";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState, useCallback } from "react";

export default function Page() {
  const router = useRouter();
  const previewRef = useRef(null);

  const [folders, setFolders] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [search, setSearch] = useState("");

  const [curValue, setCurValue] = useState("");
  const [show, setShow] = useState(false);
  const [cards, setCards] = useState([]);
  const [prev, setPrev] = useState(true);

  const [fixed, setFixed] = useState(false);
  const [title, setTitle] = useState("");
  const [top, setTop] = useState("228px");
  const [run, setRun] = useState(true);

  const drawControlRef = useCallback(node => {
    if (node !== null && run) {
      let tp = `${node.offsetTop}px`;
      setTop(tp);
      setRun(false);
    }
  },[]);

  const getLocation = useCallback(
    e => {
      if (!e || !previewRef.current?.offsetTop) return;

      const window = e.currentTarget;
      let hgt = previewRef.current.offsetHeight;

      if (hgt > window.innerHeight) {
        if (window.scrollY - 15 > previewRef.current.offsetTop) {
          setFixed(true);
        } else {
          setFixed(false);
        }
      };
    }
  )

  const getLayout = useCallback(
    e => {
      if (!e) return;

      const window = e.currentTarget;

      if (window.innerWidth < 772) {
        setPrev(false);
      } else {
        setPrev(true);
      }
    }
  )

  useEffect(() => {
    if (window.innerWidth < 640) {
      setPrev(false);
    }
  }, [])

  useEffect(() => {
    window.addEventListener("resize", getLayout);
    return () => {
      window.addEventListener("resize", getLayout);
    }
  }, [getLayout]);

  useEffect(() => {
    window.addEventListener("scroll", getLocation);
    return () => {
      window.addEventListener("scroll", getLocation);
    }
  }, [getLocation]);

  useEffect(() => {
    if (!router.isReady) return;

    let search = router.query.value;
    setSearch(search);
    setCurValue(`'${search}'`);

    search = encodeURIComponent(search);
    search = search.replace(/%20/g, "+");
    
    history.replaceState({}, "Title", `/search/${search}`);
    
    search = search.replace(/\+/g, " ");
    search = decodeURIComponent(search);

    search = search.replace(/\\/g, String.raw`\\`);

    fetch('/api/search', {
      method: "POST",
      body: JSON.stringify({ search: search })
    }).then(res => res.json()).then(data => {
      if (data.folders.length > 0) {
        setTitle(data.folders[0].folder);
        setCards(data.folders[0].cards);
        setShow(true);
      }
      setFolders(data.folders);
      setCompleted(true);
    }).catch(err => console.error(err));

  }, [router.isReady])


  const handleChange = (e) => {
    setSearch(e.target.value);
  }

  const previewFolder = (crds, title) => {
    setCards(crds);
    setTitle(title);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    let removeSpaces = search.replace(/ /g, "");
    if (removeSpaces.length === 0) return;

    let searchValue = encodeURIComponent(search.trim());
    window.location.href = `/search/${searchValue}`;
  }

  return (
    <>
      <Head>
        <title>{`${curValue} Folders | FlashCards`}</title>
      </Head>
      
      <Toolbar />
      <center>
        <form onSubmit={handleSubmit}>
          <input placeholder="Search for folders..." value={search} onChange={handleChange} type="text" className="w-9/12 h-8 border border-2 focus:outline-none px-4 py-5 border-slate-700 bg-black rounded-2xl" />
        </form>
        {completed ? (
          <>
            <div className="text-3xl mt-6">
              {folders.length == 0 ? "No Results" : "Results"} for {curValue}
            </div>
            <div className={`flex font-bold mt-5 mx-6 text-2xl text-slate-400 ${folders.length == 0 ? "hidden" : ""}`}>
              <div>Folders</div>
            </div>
            <div ref={(el) => { drawControlRef(el); previewRef.current = el; }} className={`flex justify-end mt-5 space-x-5 ${!show ? "hidden" : ""}`}>
              <div className="flex flex-1 space-x-5 mr-5 pt-4 pb-7 space-y-5 flex-wrap rounded-lg mt-4">
                <div></div>
                {folders.map((folder, index) => {
                  return <Folders show={prev} preview={previewFolder} folder={folder} key={index} />;
                })}
              </div>

              <div className={`flex-1 ${!prev ? "hidden" : ""}`}></div>
              <div className={`flex-1 ${!prev ? "hidden" : ""}`}></div>
            </div>

            <div style={{ top: fixed ? 0 : top}} className={`flex flex-col justify-end bg-slate-800 mb-20 border-blue-400 rounded-lg max-h-full h-full min-h-full ${fixed ? "fixed mt-4" : `absolute mt-12`} right-0 w-1/2 mr-28 ${!show || !prev ? "hidden" : ""}`}>
              <div className="text-xl max-h-12 font-bold my-3">{title}</div>
              <div className="overflow-x-scroll h-full">
                {cards.length > 0 ? cards.map((card, index) => {
                return <CardList card={card} index={index} publicPage={true} key={index} />
              }) : "Folder is Empty."}
              </div>
            </div>
          </>
        ) : <Spinner />}
      </center>
    </>
  )
}