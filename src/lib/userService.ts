import { connectToDatabase } from './mongodb';
import { ObjectId } from 'mongodb';

export async function createUser(username: string, email: string, password: string) {
  const db = await connectToDatabase();
  const usersCollection = db.collection('users');
  const result = await usersCollection.insertOne({ username, email, password });
  return result.insertedId;
}

export async function getUserByEmail(email: string) {
  const db = await connectToDatabase();
  const usersCollection = db.collection('users');
  return usersCollection.findOne({ email });
}

export async function getUserByUsername(username: string) {
  const db = await connectToDatabase();
  const usersCollection = db.collection('users');
  return usersCollection.findOne({ username });
}

export async function getUserById(id: string) {
  const db = await connectToDatabase();
  const usersCollection = db.collection('users');
  return usersCollection.findOne({ _id: new ObjectId(id) });
}

export async function searchUsers(searchTerm: string) {
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');
    return usersCollection.find({
      $or: [
        { username: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } }
      ]
    }).project({ password: 0 }).toArray(); // Exclude password from results
  }