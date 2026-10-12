// app/api/proxies/[id]/status/route.js

import mongoose from 'mongoose'
import { connectToDB } from '@/lib/mongodb'
import Proxy from '@/models/Proxy'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function PATCH(req, { params }) {
  let dbSession;

  try{
  const session = await getServerSession(authOptions)

  if (!session?.user?.name) {
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  let body;
  try{
    body = await req.json();
  } catch {
    return Response.json(
      { error: 'Invalid JSON' },
      { status: 400 }
    );
  }

  const {newStatus} = body ?? {};


  if (!['accepted', 'rejected'].includes(newStatus)) {
    return Response.json(
      { error: 'Invalid status' },
      { status: 400 }
    );
  }

  const { id } = await params;

  if(!mongoose.isValidObjectId(id)){
    return Response.json(
      { error: 'Invalid proxy ID' },
      { status: 400 }
    );
  }


    await connectToDB()

    const filter = {
      _id: id,
      markedFor: session.user.name,
      status: 'pending',
    };

    // rejecting a request does not affect cometing requests 
    if(newStatus === 'rejected'){
      const updatedProxy = await Proxy.findOneAndUpdate(
        filter,
        {$set: {status: 'rejected'}},
        {new: true, runValidators: true}
      );

      if(!updatedProxy){
        return Response.json(
          { error: 'Proxy not found, already processed, or you are not authorized to update it' },
          { status: 404 }
        );
      }

      return Response.json(updatedProxy, { status: 200 });
    }

    // Accepting a request requires checking for competing requests and rejecting them
    dbSession = await mongoose.startSession();
    let updatedProxy = null;

    await dbSession.withTransaction(async () => {
        updatedProxy = await Proxy.findOneAndUpdate(
          filter,
          { $set: { status: 'accepted' } },
          { 
            new: true,
            runValidators: true,
            session: dbSession,
       }
      );

      if(!updatedProxy){
          const error = new Error('Proxy is no longer pending');
          error.code = 'PROXY_NOT_PENDING';
          throw error;
      }

      await Proxy.updateMany(
        {
          _id: { $ne: updatedProxy._id },
          markedFor: session.user.name,
          subject: updatedProxy.subject,
          date: updatedProxy.date,
          status: 'pending',
        },
        { $set: { status: 'rejected' } },
        { session: dbSession }
      );
    });

    return Response.json(updatedProxy, { status: 200 });
  }catch (err) {
    if(err.code === 'PROXY_NOT_PENDING'){
      return Response.json(
        { error: 'Proxy not found, already processed, or you are not authorized to update it' },
        { status: 404 }
      );
  }

  console.error('Error updating proxy status:', err);

  return Response.json(
    { error: 'Something went wrong while updating the proxy status' },
    { status: 500 }
  );
  } finally {
    if (dbSession) {
      await dbSession.endSession();
    }
  }
}