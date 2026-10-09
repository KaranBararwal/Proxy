// app/api/mark-proxy/route.js

import {getServerSession} from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDB } from '@/lib/mongodb';
import Proxy from '@/models/Proxy';


export async function POST(req) {
  try {

    //verify the logged in user
    const session = await getServerSession(authOptions);

    if(!session?.user?.email){
      return new Response(
        JSON.stringify({ message : 'Unathorized' }),
        {
          status: 401,
          headers : {'Content-Type' : 'application/json'}
        }
      );
    }


    // Read the Proxy details from the request body
    const { subject, date, markedFor } = await req.json(); 

    if(!subject || !date || !markedFor){
      return new Response(
        JSON.stringify({ message : 'Subject, date, and markedFor are required' }),
        {
          status : 400,
          headers : {'Content-Type' : 'application/json'},
        }
      );
    }

    await connectToDB();

    // Derive markedBy from the authenticated user's session
    const newProxy = new Proxy({
      subject,
      date,
      markedBy : session.user.email,
      markedFor,
      status: 'pending',
    });

    await newProxy.save();

    return new Response(
      JSON.stringify({ message: 'Proxy marked successfully' }),
      { 
        status: 201,
        headers : {'Content-Type' : 'application/json'}
      }
    );
  } catch (err) {
    console.error('Error in mark-proxy route:', err); // 🟢 Logs actual error

    return new Response(
      JSON.stringify({ message: 'Error marking proxy' }),
      { 
        status: 500,
        headers : {'Content-Type' : 'application/json'},
      }
    );
  }
}