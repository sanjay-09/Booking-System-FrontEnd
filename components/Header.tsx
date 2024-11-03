import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button"
import { useEffect } from "react";
import Link from "next/link";
import { Sofa } from 'lucide-react'

const Header=()=>{
    const {data:session,status}=useSession();
    console.log("data",session); 

    useEffect(()=>{
        console.log("status11",status);
        if(status==='unauthenticated'){
            signIn();
        }

    },[status]);



    return(
        <header className="w-full py-4 px-4 sm:px-6 lg:px-8 bg-background shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 text-2xl font-extrabold">
            <Sofa className="w-8 h-8 text-primary" />
            <span className="text-black">
              BookYourSeat
            </span>
          </Link>
          {
            session?.user ? <Button onClick={()=>{signOut()}}>
            SignOut
           
          </Button>:
         <Button 
         asChild
       onClick={()=>{signIn()}}
       >
        SignIn
        
       </Button>
          }
        </div>
      </header>
    )
}
export default Header;
