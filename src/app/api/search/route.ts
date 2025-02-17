import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";

  try {
    const db = await dbConnect();
    const collection = db.collection("laws");

    const results = await collection
      .find({ title: { $regex: query, $options: "i" } })
      .toArray();

    const response = NextResponse.json(results);

    response.headers.set('Access-Control-Allow-Origin', 'https://provincial-justice.vercel.app');  
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json(
      { error: "Failed to fetch data", details: errorMessage },
      { status: 500 }
    );
  }
}

