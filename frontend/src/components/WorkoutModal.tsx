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


export default function WorkoutModal() {
    const [date, setDate] = useState<Date>()
    const [val, setVal] = useState<any>([])
  
    console.log(date);
    
  
    const handleAdd = () => {
        const abc = [...val, []]
        setVal(abc)
    }

    const handleRemove = () => {
        const deleteVal = [...val]
        deleteVal.splice(0,1)
        setVal(deleteVal)
    }
  
    const handleSubmit = (e: any) => {
        e.preventDefault()
        console.log('submitted');
        
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
                <form onSubmit={handleSubmit} className="space-y-6">
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
                            />
                        </PopoverContent>
                    </Popover>
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col gap-2">
                            <Label>Category:</Label>
                            <Input placeholder="Powerlifting" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Exercise:</Label>
                            <Input placeholder="Squats"/>
                        </div>
                    </div>
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col gap-2">
                            <Label>Weight:</Label>
                            <div className="flex flex-row gap-2">
                                <Input 
                                    placeholder="150"  
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
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Sets:</Label>
                            <Input 
                                placeholder="5" 
                                className="w-[60px]"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Reps:</Label>
                            <Input 
                                placeholder="10" 
                                className="w-[60px]"
                            />
                        </div>
                    </div>
                    {val.map(() => {
                    return (
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-row gap-2">
                                <Input 
                                    placeholder="150" 
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
                            <Input 
                                placeholder="5" 
                                className="w-[60px]"
                            />
                            <Input 
                                placeholder="10" 
                                className="w-[60px]"
                            />
                        </div>
                        )
                    })}
                    <div className="flex flex-row justify-around">
                        <Button onClick={() => handleAdd()} className="text-sm">
                            <div className="flex flex-row items-center gap-2">
                                <p>Add</p>
                                <span className="text-lg cursor-pointer">+</span>
                            </div>
                        </Button>
                        <Button onClick={() => handleRemove()} className="text-sm">
                            <div className="flex flex-row items-center gap-2">
                                <p>Remove</p>
                                <span className="text-lg cursor-pointer">-</span>
                            </div>
                        </Button>
                    </div>
                    <Button 
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 mt-10"
                    >
                        Add Workout
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    </div>
  )
}
