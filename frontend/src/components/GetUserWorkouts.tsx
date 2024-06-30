
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import Loader from './Loader';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { format } from "date-fns"

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
    <div className='mt-10 flex flex-row flex-wrap gap-4'>
        { loading ? (
            <>
                <Loader />

            </>
        ) : (
            listings?.map((listing: any) => (
                <div key={listing._id} className='max-w-xl'>
                    <Card>
                        <CardHeader>
                            <CardTitle>{listing.exercise.toUpperCase()}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <p>Weight:</p><p>{listing.weight}KG</p>
                            </div>
                            <div className="flex gap-2">
                                <p>Sets:</p><p>{listing.sets}</p>
                            </div>
                            <div className="flex gap-2">
                                <p>Reps:</p><p>{listing.reps}</p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <div className="flex gap-2">
                                <p>Date:</p><p>{format(listing.createdAt, "PPP")}</p>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            ))
        )}
    </div>
  )
}
