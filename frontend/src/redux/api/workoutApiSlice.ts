import { apiSlice } from './apiSlice.js';
import { WORKOUT_URL } from '../constants.js';

export const workoutApiSlice = apiSlice.injectEndpoints ({
    endpoints: (builder) => ({
        createWorkout: builder.mutation({
            query: (data) => ({
                url: `${WORKOUT_URL}/createWorkout`,
                method: 'POST',
                body: data,
            }),
        }),
    })
})

export const {
    useCreateWorkoutMutation
} = workoutApiSlice