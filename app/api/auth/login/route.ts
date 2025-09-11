import { NextResponse } from 'next/server';

// This is a mocked user database.
// In a real application, you would query a database.
const users = [
  { id: 'user-1', name: 'Alice', code: '12345' },
  { id: 'user-2', name: 'Bob', code: '67890' },
];

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ message: 'Code is required' }, { status: 400 });
    }

    const user = users.find((u) => u.code === code);

    if (!user) {
      return NextResponse.json({ message: 'Invalid code' }, { status: 401 });
    }

    // Don't send the code back to the client.
    const { code: _, ...userWithoutCode } = user;

    return NextResponse.json(userWithoutCode);
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
