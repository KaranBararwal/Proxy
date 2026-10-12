import {NextResponse} from "next/server";
import {getServerSession} from "next-auth/next";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function getAuthenticatedUser() {
    const session = await getServerSession(authOptions);

    if(!session?.user?.email) {
        return { error: "Please sign in to continue.", status: 401 };
    }

    await connectToDB();

    const user = await User.findOne({
        email: session.user.email,
    })

    if(!user) {
        return { error: "User not found.", status: 404 };
    }

    return {user};
}

function escapeRegex(username){
    return username.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Checking if the username is available
export async function GET(req) {
    try{
        const result = await getAuthenticatedUser();

        if(result.error){
            return NextResponse.json(
                {message : result.error},
                {status : result.status}
            );
        }

        const username = req.nextUrl.searchParams.get('username')?.trim();

        if(!username || username.length < 3 || username.lenght > 30){
            return NextRepsone.json(
                {
                    available : false,
                    message : 'Username must be between 3 and 30 characters.'
                }
            );
        }

        const exitingUser = await User.findOne({
            username : {
                $regex: `^${escapeRegex(username)}$`,
                $options : 'i',
            },
            _id : { $ne : result.user._id},
        }).select('_id');

        return NextResponse.json({
            available : !exitingUser,
            message : exitingUser
                ? 'This username is already taken.'
                : 'Username is available.',
        });
    } catch(error) {
        console.error('Username availability check failed:', error);

        return NextResponse.json(
            { message : 'Unable to check username availability.' },
            {status : 500}
        );
    }
}

// Update the signed-in user's username 
export async function PATCH(req) {
    try{
        const result = await getAuthenticatedUser();

        if(result.error){
            return NextResponse.json(
                {message : result.error},
                {status : result.status}
            );
        }

        const body = await req.json();

        const username = typeof body.username === 'string' ? body.username.trim() : '';

        if(!/^[a-zA-Z0-9_]{3,30}$/.test(username)){
            return NextResponse.json({
                message : 
                    'Username must be 3–30 characters and contain only letters, numbers, and underscores.',
            },
            {status : 400}
        );
        }
        
        const existingUser = await User.findOne({
            username : {
                $regex : `^${escapeRegex(username)}$`,
                $options : 'i',
            },
            _id : {$ne : result.user._id},
        }).select('_id');

        if(existingUser){
            return NextResponse.json(
                {message : 'This username is already taken.'},
                {status : 409}
            );
        }

        result.user.username = username;
        await result.user.save();

        return NextResponse.json({
            message : 'Username updated successfully',
            username : result.user.username,
        });
    } catch (error){
        console.error('Username update failed:' , error);

        if(error.code === 11000){
            return NextResponse.json(
                {message : 'This username is already taken.'},
                {status : 409}
            );
        }

        return NextResponse.json(
            {message : 'Unable to update username. Please try again.'},
            {status : 500}
        );
    }
}