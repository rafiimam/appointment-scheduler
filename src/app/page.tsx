'use client';

import { useState } from 'react';
import { loginUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);  
    try {
      await loginUser(username, password);
      router.push('/dashboard');
    } catch (error) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);  
    }
  };
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Appointment Scheduler</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? (
              <div className={styles.loader}>Loading...</div>
            ) : (
              'Log In'
            )}
          </button>
        </form>
        <Link href="/register" className={styles.registerLink}>
          Register new account
        </Link>
      </main>
    </div>
  );
}
