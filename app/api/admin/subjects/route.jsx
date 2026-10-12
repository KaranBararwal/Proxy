import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { requireAdmin } from '@/lib/requireAdmin';
import { connectToDB } from "@/lib/mongodb";
import Subject from '@/models/Subject';


export async function POST(req) {
    const access = await requireAdmin();

    if (!access.authorized) {
        return NextResponse.json(
            { error: access.message },
            { status: access.status }
        );
    }

    try {
        const body = await req.json();
        
        const name = typeof body.name === 'string' ? body.name.trim() : '';
        const course = typeof body.course === 'string' ? body.course.trim() : '';
        const semester = typeof body.semester === 'string' ? body.semester.trim() : '';

        if (!name || !course || !semester) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        await connectToDB();

        const existingSubject = await Subject.findOne({
            name : { $regex : `^${escapeRegExp(name)}$`, $options : 'i' }, // case-insensitive match
            course : { $regex : `^${escapeRegExp(course)}$`, $options : 'i' }, // case-insensitive match
            semester : { $regex : `^${escapeRegExp(semester)}$`, $options : 'i' } // case-insensitive match
        });

        if (existingSubject) {
            return NextResponse.json(
                { error: 'Subject already exists for this course and semester' },
                { status: 409 }
            );
        }

        const newSubject = await Subject.create({
             name,
             course,
             semester,
            });

        return NextResponse.json(
            { 
                message: 'Subject added successfully',
                subject: newSubject,
            }, 
            {status: 201}
        );
    } catch (error) {
        console.error('CREATE SUBJECT Error:', error);
        return NextResponse.json(
            { error: 'Failed to add subject' },
            { status: 500 }
        );
    }
}

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters for regex
}


// GET Method (Fetch subjects)
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if(!session?.user){
            return NextResponse.json(
                {error : 'Please sign in to access this page'},
                {status : 401}
            );
        }

      await connectToDB();

      const subjects = await Subject.find()
        .sort({ course: 1, semester: 1, name: 1 })
        .lean();
        

      return NextResponse.json(subjects);
    } catch (error) {
      console.error('GET SUBJECTS ERROR:', error);

      return NextResponse.json(
        { error: 'Failed to fetch subjects'},
        {status: 500}
        ); 
    }
}