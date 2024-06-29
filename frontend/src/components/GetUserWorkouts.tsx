
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import Loader from './Loader';

export default function GetUserWorkouts() {
    const [listings, setListings] = useState<any>(null)
    const [loading, setLoading] = useState<Boolean>(false)

    console.log(listings);
    

    const fetchWorkout = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/workouts/myWorkouts`)
            const data = await res.json()
            if (data.success === false) {
                toast.error(data.message)
                setLoading(false)
                return
            } else {
                setListings(data)
                setLoading(false)
            }
        } catch (error: any) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        fetchWorkout()
    }, [])

    
  return (
    <div className='mt-10'>
        { loading ? (
            <>
                <Loader />
            </>
        ) : (
            listings?.map((listing: any) => (
                <div key={listing._id}>
                    <p>{listing.exercise}</p>
                    <p>{listing.reps}</p>
                    <p>{listing.sets}</p>
                    <p>{listing.weight}</p>
                </div>
            ))
        )}
    </div>
  )
}
