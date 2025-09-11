
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const formsDirectory = path.join(process.cwd(), 'data', 'forms');
    const files = await fs.readdir(formsDirectory);
    const formIds = files
      .filter((file) => file.endsWith('.json'))
      .map((file) => file.replace('.json', ''));
    return NextResponse.json(formIds);
  } catch (error) {
    console.error('Error reading forms directory:', error);
    return NextResponse.json({ error: 'Failed to load forms' }, { status: 500 });
  }
}
