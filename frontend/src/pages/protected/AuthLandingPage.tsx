import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Dashboard from "./Dashboard"
import Profile from "./Profile"
import Workout from "./Workout"

export default function AuthLandingPage() {
  return (
    <Tabs className="mt-4">
        <TabsList className="w-full flex flex-wrap gap-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="workout">My Workouts</TabsTrigger>
            <TabsTrigger value="password">Following</TabsTrigger>
            <TabsTrigger value="password">Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <Dashboard />
        </TabsContent>
        <TabsContent value="profile">
          <Profile />
        </TabsContent>
        <TabsContent value="workout">
          <Workout />
        </TabsContent>
    </Tabs>
  )
}
