import { connectToDB } from "@/lib/mongodb";
import Subject from '@/models/Subject';


export async function POST(req) {
    try {
        const body = await req.json(); // ✅ Assign to 'body'
        console.log("Received body:", body);

        const { name } = body;

        if (!name || name.trim() === '') {
            return new Response(
                JSON.stringify({ error: 'Subject name is required' }),
                { status: 400 }
            );
        }

        await connectToDB();
        const existingSubject = await Subject.findOne({ name });

        if (existingSubject) {
            return new Response(
                JSON.stringify({ error: 'Subject already exists' }),
                { status: 400 }
            );
        }

        const newSubject = new Subject({ name });
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