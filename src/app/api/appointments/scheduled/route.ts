import { NextResponse } from 'next/server';
import { getScheduledAppointments } from '@/lib/appointmentService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    const appointments = await getScheduledAppointments(username);
    return NextResponse.json(appointments);
  } catch (error) {
    //console.error('Error fetching scheduled appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scheduled appointments' },
      { status: 500 }
    );
  }
}