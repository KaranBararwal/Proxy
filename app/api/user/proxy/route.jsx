// app/api/user/proxy/route.js

import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
    try {
        const { subject } = await req.json();
        const userId = 'USER_ID'; // get the logged in user ID here (e.g from session)

        await connectToDB();

        // save the proxy marking to the user's record
        const user = await User.findById(userId);
        user.proxies.push({ subject });
        await user.save();

        return new Response(JSON.stringify({ message : 'Proxy marked successfully'}) , {status:200});

    } catch (error) {
        return new Response(JSON.stringify({ message : 'Failed to mark proxy'}) , {status:500}); 
    }
}




