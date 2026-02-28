import { NextRequest, NextResponse } from "next/server";
import User from '@/src/models/user';
import { connectToDatabase } from "@/src/lib/mongodb";

export async function POST(request: NextRequest) {

    try {
        await connectToDatabase();
        console.log('Database connected successfull');


        const body = await request.json()
        console.log("REGISTER BODY: ", body);

        const {name, email, password, phone} = body;

        if(!name || !email || !password) {
            return NextResponse.json(
                {error: 'Name, email and password are required'},
                {status: 400}
            )
        }

       const existingUser = await User.findOne({email});
       if(existingUser) {
        return new Response(JSON.stringify(
            {error: 'Email already registered'}),{status: 400});
    }
    
    
    const user = await User.create({name, email, password, phone});
     
    console.log("user created", user);

    return new Response(JSON.stringify({message: 'User created successfully'}), {status: 201})
    } catch (error: any) {
         console.error('Registration error:', error)
          return new Response(JSON.stringify(
                {error: error.message || "Server error"}
            ), {status: 500})
         }
         
    }