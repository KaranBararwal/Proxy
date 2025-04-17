// app/api/proxies/[id]/status/route.js

import { connectToDB } from '@/utils/db'
import Proxy from '@/models/Proxy'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    })
  }

  const { id } = params
  const { newStatus } = await req.json()

  if (!['accepted', 'rejected'].includes(newStatus)) {
    return new Response(JSON.stringify({ error: 'Invalid status' }), {
      status: 400,
    })
  }

  try {
    await connectToDB()

    const proxy = await Proxy.findById(id)

    if (!proxy) {
      return new Response(JSON.stringify({ error: 'Proxy not found' }), {
        status: 404,
      })
    }

    // Only the markedFor person can update
    if (proxy.markedFor !== session.user.name) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
      })
    }

    proxy.status = newStatus
    await proxy.save()

    return new Response(JSON.stringify(proxy), { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'Something went wrong' }), {
      status: 500,
    })
  }
}