import ReactDOM from 'react-dom/client'
import Root from './Root.tsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import { Toaster } from 'sonner'

// Redux
import { Provider } from 'react-redux'
import { persistor, store} from './redux/store.ts'
import { PersistGate } from 'redux-persist/integration/react'

// Pages
import ErrorPage from './errorPage.tsx'
import Home from './pages/Home.tsx'
import Register from './pages/auth/Register.tsx'
import Login from './pages/auth/Login.tsx'
import ProtectedRoute from './pages/protected/ProtectedRoute.tsx'
import Dashboard from './pages/protected/Dashboard.tsx'
import AuthLandingPage from './pages/AuthLandingPage.tsx'
import ForgotPassword from './pages/auth/ForgotPassword.tsx'
import ResetPassword from './pages/auth/ResetPassword.tsx'


const router = createBrowserRouter([
  {
    path: "/", element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/register", element: <Register /> },
      { path: "/login", element: <Login /> },
      { path: "/forgotPassword", element: <ForgotPassword /> },
      { path: "/resetPassword/:token", element: <ResetPassword /> },
      
      {/* PROTECTED ROUTE */},
      { path: "/authenticated", element: <ProtectedRoute/>,
        errorElement: <ErrorPage />,
        children: [
          { path: "home", element: <AuthLandingPage />}
        ], 
      }
    ]
  },
  {
    index: true, element: <Home />
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
