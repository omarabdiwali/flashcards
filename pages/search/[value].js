import Folders from "@/components/public/folders";
import Spinner from "@/components/spinner";
import Toolbar from "@/components/toolbar";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const [folders, setFolders] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [search, setSearch] = useState("");
  const [curValue, setCurValue] = useState("");

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

    fetch('/api/search', {
      method: "POST",
      body: JSON.stringify({ search: search })
    }).then(res => res.json()).then(data => {
      setFolders(data.folders);
      setCompleted(true);
    }).catch(err => console.error(err));

  }, [router.isReady])

  const handleChange = (e) => {
    setSearch(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    let removeSpaces = search.replace(/ /g, "");
    if (removeSpaces.length === 0) return;

    let searchValue = encodeURIComponent(search.trim());
    window.location.href = `/search/${searchValue}`;
  }

  if (completed && folders.length === 0) {
    return (
      <>
        <Head>
          <title>{`${curValue} Folders | FlashCards`}</title>
        </Head>
        <Toolbar />
        <center>
          <form onSubmit={handleSubmit}>
            <input value={search} onChange={handleChange} type="text" className="w-9/12 h-8 border border-2 focus:outline-none px-4 py-5 border-slate-700 bg-black rounded-2xl" />
          </form>
          
          <div className="text-3xl mt-6">
            No Results for {curValue}
          </div>
        </center>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{`${curValue} Folders | FlashCards`}</title>
      </Head>
      
      <Toolbar />
      <center>
        <form onSubmit={handleSubmit}>
          <input value={search} onChange={handleChange} type="text" className="w-9/12 h-8 border border-2 focus:outline-none px-4 py-5 border-slate-700 bg-black rounded-2xl" />
        </form>
        {completed ? (
          <>
            <div className="text-3xl mt-6">
              Results for {curValue}
            </div>
            <div className="flex m-auto space-x-5 pt-4 pb-7 space-y-5 px-5 flex-wrap rounded-lg mt-5">
              <div></div>
              {folders.map((folder, index) => {
                return <Folders folder={folder} key={index} />;
              })}
            </div>
          </>
        ) : <Spinner />}
      </center>
    </>
  )
}