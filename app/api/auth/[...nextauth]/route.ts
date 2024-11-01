import NextAuth, { DefaultSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google";

console.log("client",process.env.GOOGLE_CLIENT_ID)

declare module "next-auth" {
    interface Session {
        user: {
            id: string
        } & DefaultSession["user"]
    }
  }
const handler=NextAuth({
    providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID ?? "",
          clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        }),
       
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks:{
        async signIn(params){
           try{
            console.log("in sign in----->")
            console.log("params",params.user.email);
            console.log("NEXT_PUBLIC_SERVER_URL",process.env.NEXT_PUBLIC_SERVER_URL);
            if(!params.user.email){
                return false;
            }
            const isUserPresent=await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/user/${params.user.email}`);
            if(!isUserPresent.ok){
                return false;
            }
            console.log("daat---")
            const isUser=await isUserPresent.json();
            if(isUser.email){
                return true;
            }
        await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users`,{
            method:'POST',
            headers: {
                "Content-Type": "application/json",  // Set the content type
              },
            body:JSON.stringify({
                email:params.user.email,
                name:params.user.name 
            })

        })
        return true;
           }
           catch(err){
            console.log(err)
            return true;

           }

        },
        async session({session}){
            try{
                const isUserPresent=await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/user/${session.user?.email}`);
            if(!isUserPresent.ok){
                throw new Error("Error from the server")

            }
            const isUser=await isUserPresent.json();
            console.log(isUser)
            if(!isUser.email){
                return session ;
            }
            //@ts-ignore
            session.user.id=isUser.id
            return session;
            }
            catch(err:any){
                return session
               
            }

        }
    }
    

})

export {handler as GET,handler as POST}

