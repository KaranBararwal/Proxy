import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Proxy from '@/models/Proxy';
import jwt from 'jsonwebtoken';

export async function DELETE(request, context) {
  try {
    await connectToDB();

    const id = context.params.id; // ✅ FIX: use context.params
    console.log('🧾 Deleting proxy with ID:', id);

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('⛔ Missing or malformed token');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ verify properly
    } catch (err) {
      console.error('❌ Invalid token:', err);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userEmail = decoded.user?.email;
    console.log('🧑‍💻 Authenticated user:', userEmail);

    const proxy = await Proxy.findById(id);
    if (!proxy) {
      return NextResponse.json({ error: 'Proxy not found' }, { status: 404 });
    }

    if (proxy.markedBy !== userEmail) {
      return NextResponse.json({ error: 'Not authorized to delete this proxy' }, { status: 403 });
    }

    await proxy.deleteOne();
    console.log('✅ Proxy deleted successfully');

    return NextResponse.json({ message: 'Proxy deleted successfully' });
  } catch (err) {
    console.error('❌ Error in DELETE /api/proxies/[id]:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}