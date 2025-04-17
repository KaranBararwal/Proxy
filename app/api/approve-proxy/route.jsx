// app/api/approve-proxy/route.js
import { connectToDB } from '@/lib/mongodb';
import Proxy from '@/models/Proxy';

export async function PATCH(req) {
  try {
    const { proxyId, status } = await req.json();
    await connectToDB();

    // Find the proxy and update the status
    const updatedProxy = await Proxy.findByIdAndUpdate(
      proxyId,
      { status },
      { new: true } // Return updated proxy
    );

    if (status === 'accepted') {
      // Update the markedBy user's proxy count
      // Optionally, update their record or stats
    }

    return new Response(
      JSON.stringify({ message: `Proxy ${status} successfully`, proxy: updatedProxy }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Error updating proxy status' }), { status: 500 });
  }
}