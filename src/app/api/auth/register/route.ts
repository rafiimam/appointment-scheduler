import { createUser } from '@/lib/userService';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user in database
    const userId = await createUser(username, email, hashedPassword);
    
    return NextResponse.json({ 
      id: userId,
      email,
      username 
    }, { status: 201 });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}