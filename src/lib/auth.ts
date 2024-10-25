// Define a type for user data
interface UserData {
  id: string;
  email: string;
  username: string;
}

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }
    
    // Map MongoDB _id to id and include username
    const completeUserData: UserData = {
      id: data.id.toString(),
      email: data.email,
      username: data.username
    };
    
    //console.log('Login Response:', completeUserData);
    localStorage.setItem('currentUser', JSON.stringify(completeUserData));
    
    return completeUserData;
  } catch (error) {
    //console.error('Error logging in:', error);
    throw error;
  }
};

export const getCurrentUser = (): UserData | null => {
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) return null;
  
  try {
    const userData = JSON.parse(userStr) as UserData;
    return userData;
  } catch (error) {
    //console.error('Error parsing user data:', error);
    return null;
  }
};

export const registerUser = async (username: string, email: string, password: string) => {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    return data;
  } catch (error) {
    //console.error('Error registering:', error);
    throw error;
  }
};