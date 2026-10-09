// app/api/proxies/[id]/status/route.js

import { connectToDB } from '@/utils/db'
import Proxy from '@/models/Proxy'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function PATCH(req, { params }) {
  try{
  const session = await getServerSession(authOptions)

  if (!session?.user?.name) {
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { id } = await params;
  const { newStatus } = await req.json()

  if (!['accepted', 'rejected'].includes(newStatus)) {
    return Response.json(
      { error: 'Invalid status' },
      { status: 400 }
    );
  }

    await connectToDB()
     // Update only if this user is the recipient and the request is still pending.
    const updatedProxy = await Proxy.findOneAndUpdate(
      {
        _id : id,
        markedFor : session.user.name,
        status : 'pending',
      },
      {
        $set : { status : newStatus },
      },
      {
        new : true,
        runValidators : true,
      }
    );

      if (!updatedProxy) {
        return Response.json(
          { 
            error: 'Proxy not found, already processed, or you are not authorized to update it'
          },
          { status: 404 }
        );
      }

      return Response.json(updatedProxy, { status: 200 });
  }
    catch (err) {
    console.error('Error updating proxy status:',err);

    return Response.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}