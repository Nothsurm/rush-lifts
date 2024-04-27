import ReactDOM from 'react-dom/client'
import Root from './Root.tsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import ErrorPage from './errorPage.tsx'
import Home from './pages/Home.tsx'

const router = createBrowserRouter([
  {
    path: "/", element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true, element: <Home />,
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router} />
)
