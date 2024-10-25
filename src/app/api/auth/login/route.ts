import { getUserByUsername } from '@/lib/userService';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    const user = await getUserByUsername(username);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Return user data
    return NextResponse.json({
      id: user._id,
      username: user.username
    });
    
  } catch (error) {
    //console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to login' }, 
      { status: 500 }
    );
  }
}