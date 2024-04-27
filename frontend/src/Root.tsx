import { Outlet } from "react-router-dom";
import { Button } from "./components/ui/button";


export default function Root() {
  return (
    <>
      <main className="py-3">
        <Outlet />
      </main>
    </>
  )
}

