import ReactDOM from 'react-dom/client'
import Root from './Root.tsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"

// Redux
import { Provider } from 'react-redux'
import { persistor, store} from './redux/store.ts'

// Pages
import ErrorPage from './errorPage.tsx'
import Home from './pages/Home.tsx'
import Register from './pages/auth/Register.tsx'
import { Toaster } from 'sonner'
import Login from './pages/auth/Login.tsx'
import { PersistGate } from 'redux-persist/integration/react'


const router = createBrowserRouter([
  {
    path: "/", element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "/register", element: <Register /> },
      { path: "/login", element: <Login /> },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <Toaster visibleToasts={1} position='top-right' richColors/>
      <RouterProvider router={router} />
    </PersistGate>
  </Provider>
)
