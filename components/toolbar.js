import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function Toolbar() {
  const { data: session, status } = useSession();
  
  return (
    <nav>
      <div className={`my-5 flex flex-row text-black m-3 h-8`}>
        <div onClick={() => window.location.href = "/"} className="cursor-pointer text-xl text-slate-400 font-extrabold">
          FlashCards
        </div>
        <div className={`flex flex-row flex-1 justify-end ${status === "loading" ? "hidden" : ""}`}>
          <button onClick={() => status === "authenticated" ? signOut() : signIn('google')} className="cursor-pointer mx-4 bg-slate-900 text-white font-semibold px-5 rounded shadow">
            {status === "authenticated" ? "Sign Out" : "Sign In"}
          </button>
        </div>
      </div>
    </nav>
  )
}