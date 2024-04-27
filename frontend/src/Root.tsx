import { Outlet } from "react-router-dom";


export default function Root() {
  return (
    <>
      <main className="py-3">
        <Outlet />
      </main>
    </>
  )
}

