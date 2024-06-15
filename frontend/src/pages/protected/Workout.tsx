
import GetUserWorkouts from "@/components/GetUserWorkouts";
import WorkoutModal from "@/components/WorkoutModal";


export default function Workout() {

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <WorkoutModal />
      <GetUserWorkouts />
    </div>
  )
}
