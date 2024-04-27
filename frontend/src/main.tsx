import ReactDOM from 'react-dom/client'
import Root from './Root.tsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"

// Redux
import { Provider } from 'react-redux'
import store from './redux/store.ts'

// Pages
import ErrorPage from './errorPage.tsx'
import Home from './pages/Home.tsx'
import Register from './pages/auth/Register.tsx'

const router = createBrowserRouter([
  {
    path: "/", element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "/register", element: <Register /> },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
