
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function GetUserWorkouts() {
    const [listings, setListings] = useState<any>(null)

    console.log(listings);
    

    const fetchWorkout = async () => {
        try {
            const res = await fetch(`/api/workouts/myWorkouts`)
            const data = await res.json()
            if (data.success === false) {
                toast.error(data.message)
                return
            } else {
                setListings(data)
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
        {listings?.map((listing: any) => (
            <div key={listing._id}>
                <p>{listing.exercise}</p>
                <p>{listing.reps}</p>
                <p>{listing.sets}</p>
                <p>{listing.weight}</p>
            </div>
        ))}
    </div>
  )
}
