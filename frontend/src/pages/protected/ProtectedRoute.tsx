import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function PrivateRoute() {
    const { currentUser } = useSelector((state: any) => state.auth)
    
  return currentUser.verified ? <Outlet /> : <Navigate to='/login' replace /> 
}