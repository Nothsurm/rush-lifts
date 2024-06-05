import { Button } from "@/components/ui/button";
import { FaRegCalendarAlt } from "react-icons/fa";
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const formSchema = z.object({
  date: z.string().datetime(),
  exercise: z.string(),
  category: z.string(),
  weight: z.number({
    invalid_type_error: "Weight must be a number",
  }),
  sets: z.number({
    invalid_type_error: "Sets must be a number",
  }),
  reps: z.number({
    invalid_type_error: "Reps must be a number",
  })
})

export type WorkoutData = z.infer<typeof formSchema>


export default function Workout() {
  const [date, setDate] = useState<Date>()

  console.log(date);
  



  const form = useForm<WorkoutData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: "",
      exercise: "",
      category: "",
      weight: 0,
      sets: 0,
      reps: 0,
    },
  })

  function onSubmit(values: WorkoutData) {

  }

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <Dialog>
        <DialogTrigger>
          <Button className="bg-blue-500 hover:bg-blue-600">
            New Workout <span className="ml-1">+</span>
          </Button>
        </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a New Workout</DialogTitle>
            </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                              >
                                <FaRegCalendarAlt className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                                {...field}
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                    <div className="flex flex-row justify-between">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category:</FormLabel>
                            <FormControl>
                              <Input placeholder="Powerlifting" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="exercise"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Exercise:</FormLabel>
                            <FormControl>
                              <Input placeholder="Squats" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex flex-row justify-between">
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight:</FormLabel>
                          <FormControl>
                            <div className="flex flex-row gap-2">
                            <Input 
                              placeholder="150" 
                              {...field} 
                              className="w-[80px]"
                            />
                            <Select>
                              <SelectTrigger className="w-[80px]">
                                <SelectValue placeholder="KG" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value="KG">KG</SelectItem>
                                  <SelectItem value="LBS">LBS</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sets"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sets:</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="5" 
                              {...field} 
                              className="w-[60px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="reps"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reps:</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="10" 
                              {...field}
                              className="w-[60px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Add Workout
                  </Button>
                </form>
              </Form>
          </DialogContent>
        </Dialog>
    </div>
  )
}
