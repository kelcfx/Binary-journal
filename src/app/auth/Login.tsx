'use client';

import { useAuth } from '../context/AuthContext';

export default function Login() {
    const { signIn } = useAuth();

    return (
        <div>
            <h1>Please sign to start using your journal and continue monitoring your progress</h1>
            <button onClick={signIn} className='mt-4'>Sign in with Google</button>
        </div>
    );
}