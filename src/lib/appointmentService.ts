import { connectToDatabase } from './mongodb';
import { ObjectId } from 'mongodb';

export async function createAppointment(appointmentData: {
    title: string;
    description: string;
    appointmentTime: string;
    appointmentDate: string;
    appointedTo: string;
    createdBy: string;
    currentStatus: string;
    appointmentWith: string;
    recordedMessage?: string;
}) {
    const db = await connectToDatabase();
    const appointmentsCollection = db.collection('appointments');
    const result = await appointmentsCollection.insertOne(appointmentData);
    return result.insertedId;
}

export async function getAppointmentsByUser(username: string) {
    const db = await connectToDatabase();
    const appointmentsCollection = db.collection('appointments');

    return appointmentsCollection.find({
        $or: [
            { appointmentWith: username },
        ],
        currentStatus: { $in: ['pending', 'approved'] }
    }).toArray();
}

export async function getScheduledAppointments(username: string) {
    const db = await connectToDatabase();
    const appointmentsCollection = db.collection('appointments');

    return appointmentsCollection.find({
        createdBy: username,
        currentStatus: { $ne: 'canceled' }  // Exclude canceled appointments
    })
        .sort({ appointmentDate: 1, appointmentTime: 1 }) // Sort by date and time
        .toArray();
}

export async function updateAppointmentStatus(appointmentId: string, status: string) {
    const db = await connectToDatabase();
    const appointmentsCollection = db.collection('appointments');
    const result = await appointmentsCollection.updateOne(
        { _id: new ObjectId(appointmentId) },
        { $set: { currentStatus: status } }
    );
    return result.modifiedCount > 0;
}

export async function deleteAppointment(appointmentId: string) {
    const db = await connectToDatabase();
    const appointmentsCollection = db.collection('appointments');
    const result = await appointmentsCollection.deleteOne({ _id: new ObjectId(appointmentId) });
    return result.deletedCount > 0;
}

