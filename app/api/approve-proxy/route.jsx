// app/api/approve-proxy/route.js
import {getServerSession} from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDB } from '@/lib/mongodb';
import Proxy from '@/models/Proxy';

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);

    if(!session?.user?.email){
      return new Response(
        {message : 'Unauthorized'},
        { status: 401 }
      );
    }

    const { proxyId, status } = await req.json();

    if(!proxyId || !['accepted', 'rejected'].includes(status)){
      return new Response(
        {message : 'Invalid request. proxyId and valid status are required'},
        {status : 400}
      );
    }

    await connectToDB();

    // Only the recipient can update their own pending request.
    const updatedProxy = await Proxy.findOneAndUpdate(
      { 
        _id: proxyId,
        markedFor: session.user.email,
        status: 'pending', // Ensure only pending requests can be updated},
      },
      { $set : { status }},
      { new: true , runValidators : true } // Return updated proxy
    );

    if(!updatedProxy){
      return Response.json(
        {
          message : 'Proxy not found or you are not authorized to update this proxy',
        },
        { status : 404 }
      );
    }


    return Response.json(
    {
      message : `Proxy ${status} successfully`,
      proxy : updatedProxy,
    },
    { status : 200 }
    );
  } catch (err) {
    console.error('Error updating proxy status:', err);

    return Response.json(
      {message : 'Failed to update proxy status'},
      {status : 500}
    );
  }
}