import { connectToDB } from '@/lib/mongodb';
import Proxy from '@/models/Proxy';
import {getServerSession} from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function DELETE(request, {params}) {
  try {
    const session = await getServerSession(authOptions);

    if(!session?.user?.email){
      return new Response(
        JSON.stringify({ error: 'Not authenticated'}),
        { status: 401 }
      );
    }

    await connectToDB();

    const {id} = await params;

    const proxy = await Proxy.findById(id);

    if(!proxy){
      return new Response(
        JSON.stringify({error: 'Proxy not found'}),
        { status: 404 }
      );
    }

    // Only the person who created the proxy can delete it
    if (proxy.markedBy !== session.user.email) {
      return new Response(
        JSON.stringify({ 
          error: 'Not authorized to delete this proxy' 
        }),
        { status: 403 }
      );
    }

    await Proxy.findByIdAndDelete(id);

    return new Response(
      JSON.stringify({ 
        message: 'Proxy deleted successfully'
      }),
      { status: 200 }
    );
 } catch (err) {
    console.error('❌ Error in DELETE /api/proxies/[id]:', err);
    return new Response(
      JSON.stringify({ 
      error: 'Failed to delete proxy' }),
      { status: 500 }
    );
  }
}