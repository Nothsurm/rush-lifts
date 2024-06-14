import { Button } from "@/components/ui/button";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoAddSharp } from "react-icons/io5";
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
} from "@/components/ui/form"
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
import { Label } from "./ui/label";
import { toast } from "sonner";


export default function WorkoutModal() {
    const [date, setDate] = useState<Date>()
    const [formData, setFormData] = useState<any>('')
    const [loading, setLoading] = useState(false)
  
    console.log(formData);

    console.log(date);
    
    
    
  
    /*const handleAdd = () => {
        const abc = [...val, []]
        setVal(abc)
    }

    const handleRemove = () => {
        const deleteVal = [...val]
        deleteVal.splice(0,1)
        setVal(deleteVal)
    }*/
  
    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setLoading(true)
        try {
            const result = await fetch('/api/workouts/createWorkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    },
                body: JSON.stringify(formData)
            });
            const data = await result.json()
            if (data.success === false) {
                toast.error(data.message);
                setLoading(false);
                return;
            } else {
                setLoading(false)
                toast.success(data.message)
            }
        } catch (error: any) {
            toast.error(error.message)
        }
        
    }

    const handleChange = (e: any) => {
        setFormData({
            ...formData, [e.target.id]: e.target.value
        })
    }


  return (
    <div>
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
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-row justify-between items-center">
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
                                id="date"
                                />
                            </PopoverContent>
                        </Popover>
                        <div className="flex flex-col gap-2">
                            <Label>Exercise:</Label>
                            <Input 
                                placeholder="Squats"
                                id="exercise"
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col gap-2">
                            <Label>Weight(KG):</Label>
                            <Input 
                                placeholder="150"  
                                className="w-[80px]"
                                id="weight"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Sets:</Label>
                            <Input 
                                placeholder="5" 
                                className="w-[60px]"
                                id="sets"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Reps:</Label>
                            <Input 
                                placeholder="10" 
                                className="w-[60px]"
                                id="reps"
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <Button 
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 mt-10"
                        disabled={loading}
                    >
                        {loading ? (
                            <p>Adding Workout...</p>
                        ) : (
                            <p>Add Workout</p>
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    </div>
  )
}
