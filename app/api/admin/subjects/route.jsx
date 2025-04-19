import { connectToDB } from "@/lib/mongodb";
import Subject from '@/models/Subject';


export async function POST(req) {
    try {
        const body = await req.json();
        const { name, course, semester } = body;

        if (!name || !course || !semester) {
            return new Response(
                JSON.stringify({ error: 'All fields are required' }),
                { status: 400 }
            );
        }

        await connectToDB();

        const existingSubject = await Subject.findOne({ name, course, semester });

        if (existingSubject) {
            return new Response(
                JSON.stringify({ error: 'Subject already exists for this course and semester' }),
                { status: 400 }
            );
        }

        const newSubject = new Subject({ name, course, semester });
        await newSubject.save();

        return new Response(JSON.stringify({ message: 'Subject added successfully' }), {
            status: 200,
        });
    } catch (error) {
        console.error('API Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to add subject' }), {
            status: 500,
        });
    }
}



// GET Method (Fetch subjects)
export async function GET() {
    try {
      await connectToDB();
      const subjects = await Subject.find();
      return new Response(JSON.stringify(subjects), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to fetch subjects' }), { status: 500 });
    }
  }