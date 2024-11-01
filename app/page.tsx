"use client"
import React, { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import toast  from 'react-hot-toast';

// Simulated seat data

type initialSeat={
id:number,
  status:'Available' | 'Pending' | 'Booked'
  class:string
}
const statusColors = {
  Available: "bg-green-500 hover:bg-green-600",
  Booked: "bg-red-500",
  Pending: "bg-yellow-500"
}
const SERVER_URL=process.env.NEXT_PUBLIC_SERVER_URL;

export default function DetailedSeatBookingDashboard() {
  console.log("c1")
  const [seats, setSeats] = useState<initialSeat[] | []>([]);
  const [selectedSeats, setSelectedSeats] = useState<number>()
  const [clickedSeat, setClickedSeat] = useState<initialSeat | null>(null)
  const {data:session}=useSession();

  const handleSeatClick = (seat:initialSeat) => {
    setClickedSeat(seat)
    if (seat.status === 'Available') {
        setSelectedSeats(seat.id);
    }
    else if(seat.status==='Booked'){
      toast.error("Seat is Already Booked");
    }
    else{
      toast.error("Seat is underProcessing....")
    }

  }
  const handleBooking=async()=>{
    console.log("handleBooking");
    const data=await fetch(`${SERVER_URL}/seat/${selectedSeats}/user/${session?.user.id}`,{
      method:'POST'
    });
    if(data.ok){
      toast.success("Seat Booked");
      fetchData();
    }
    else{
      toast.error("Seat is taken")
    }

  }

  useEffect(()=>{

    fetchData();
  },[]);

  const fetchData=async()=>{
    const data=await fetch(`${SERVER_URL}/seatsData`);
    if(!data.ok){
      console.log("error");
         return;

    }
    const seatsResponse=await data.json();
    const seats=seatsResponse.data;
    console.log("seats",seats);
    setSeats(seats);
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Detailed Seat Booking Dashboard</h1>
      
      <div className="flex gap-4 mb-6">
        <Badge variant="secondary" className="bg-green-500 text-white">Available</Badge>
        <Badge variant="secondary" className="bg-red-500 text-white">Booked</Badge>
        <Badge variant="secondary" className="bg-yellow-500 text-white">Pending</Badge>
      </div>
      
      <div className="grid grid-cols-5 gap-4 mb-6">
        {seats.map((seat) => (
          <Card 
            key={seat.id} 
            className={`${statusColors[seat.status]} cursor-pointer transition-colors }`}
            onClick={() => handleSeatClick(seat)}
          >
            <CardContent className="p-4 text-center">
              <span className="text-lg font-semibold text-black">{seat.id}</span>
              <span className="sr-only">{seat.status}</span>
            </CardContent>
          </Card>
        ))}
      </div>

  <div>
  
  {
    clickedSeat?.status==='Available' && <div className='mt-2'>
    <Button onClick={handleBooking} >Book</Button>
  </div>
  }

  </div>
      {clickedSeat  &&(
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Seat Details</h2>
          <Card>
            <CardContent className="p-4">
              <p><strong>Seat ID:</strong> {clickedSeat.id}</p>
              <p><strong>Status:</strong> {clickedSeat.status}</p>
              <p><strong>Class:</strong> {clickedSeat.class}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}