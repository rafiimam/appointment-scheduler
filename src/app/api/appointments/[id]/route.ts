import { updateAppointmentStatus, deleteAppointment } from '@/lib/appointmentService';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { action } = await request.json();
    const id = params.id;

    if (!action || !['accept', 'decline', 'cancel'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    if (action === 'decline') {
      const deleted = await deleteAppointment(id);
      if (deleted) {
        return NextResponse.json({ 
          message: 'Appointment declined and deleted successfully' 
        });
      }
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    } else if (action === 'cancel') {
      const updated = await updateAppointmentStatus(id, 'canceled');
      if (updated) {
        return NextResponse.json({ 
          message: 'Appointment canceled successfully' 
        });
      }
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    } else {
      const updated = await updateAppointmentStatus(id, 'approved');
      if (updated) {
        return NextResponse.json({ 
          message: 'Appointment accepted successfully' 
        });
      }
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to process appointment` },
      { status: 500 }
    );
  }
}