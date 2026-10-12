import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

export async function requireAdmin(){
    const session = await getServerSession(authOptions);

    if(!session?.user){
        return {
            authorized : false,
            status : 401,
            message : 'Please Sign in to access this page'
        };
    }

    if(session.user.role !== 'admin'){
        return {
            authorized : false,
            status : 403,
            message : 'You do not have permission to access this page'
        };
    }

    return {
        authorized : true,
        session,
    };
}