import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://rafiimam:rafiimam@appoinment.oqxap.mongodb.net/?retryWrites=true&w=majority&appName=appoinment';

let client: MongoClient | null = null;

export async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB');
  }
  return client.db('appointment-scheduler');
}

export async function closeDatabaseConnection() {
  if (client) {
    await client.close();
    client = null;
    console.log('Disconnected from MongoDB');
  }
}