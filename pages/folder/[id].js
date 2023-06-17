import CardPage from "@/components/cards/cardPage";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getCookie, hasCookie } from "cookies-next";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import Spinner from "@/components/spinner";
import Toolbar from "@/components/toolbar";

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [approved, setApproved] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (hasCookie("folders")) {
      let numFolders = Number(getCookie("folders"));
      let isNumber = isNaN(router.query.id);

      if (!isNumber && Number(router.query.id) < numFolders) {
        setApproved(true);
        setCompleted(true)
      } else {
        setCompleted(true);
      }
    } else {
      setCompleted(true);
    }

  }, [router.query.id])

  if (completed && status !== 'loading') {
    if (!approved || !session) {
      window.location.href = "/";
    } 
  }

  return (
    <SnackbarProvider preventDuplicate>
      {status === "authenticated" ? <Toolbar /> : ""}
      {completed && status === 'authenticated' ? <CardPage index={router.query.id} /> : 
      !completed || status === "loading" ? (<Spinner />) : ""}
    </SnackbarProvider>
  )
}