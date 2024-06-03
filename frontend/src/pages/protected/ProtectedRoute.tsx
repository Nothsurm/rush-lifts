import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function PrivateRoute() {
    const { verified } = useSelector((state: any) => state.auth)
    const { currentUser } = useSelector((state: any) => state.auth)
    
  return verified && currentUser ? <Outlet /> : <Navigate to='/login' replace /> 
}