import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AuthLandingPage() {
  return (
    <Tabs className="mt-2">
        <TabsList className="w-full">
            <TabsTrigger value="account">Dashboard</TabsTrigger>
            <TabsTrigger value="password">Profile</TabsTrigger>
            <TabsTrigger value="password">My Workouts</TabsTrigger>
            <TabsTrigger value="password">Following</TabsTrigger>
            <TabsTrigger value="password">Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="account">Make changes to your account here.</TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  )
}
