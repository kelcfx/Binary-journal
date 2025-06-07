'use client';

import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title:"Welcome to Your Trade Journal"
  };

export default function Login() {
    const { signIn } = useAuth();
    const backgroundStyle = {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/image/journal-background.jpg')`
      };

    return (
        <div>

            <main
                className="flex min-h-screen flex-col items-center justify-center bg-cover bg-center p-8 text-center text-white"
                style={backgroundStyle}
            >
                <h1 className="text-4xl font-bold text-white shadow-lg md:text-5xl" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                    Welcome to your Trading Journal
                </h1>

                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-200 md:text-xl" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
                    Becoming a better trader is handling your trade like a business. This is not quickbook but worth more than quickbook. Start today and document your journey. remember you can only be better.
                </p>

                <button
                    onClick={signIn}
                    className="mt-8 inline-flex items-center justify-center rounded-[30px] bg-[#4285F4] px-8 py-4 text-lg font-bold text-white shadow-md transition-all duration-300 ease-in-out hover:bg-[#357ae8] hover:shadow-lg hover:-translate-y-0.5"
                >
                    <Image
                        src="https://media.wired.com/photos/5926ffe47034dc5f91bed4e8/3:2/w_2560%2Cc_limit/google-logo.jpg"
                        alt="Google icon"
                        width={24}
                        height={24}
                        className="mr-4"
                    />
                    Sign In with Google
                </button>
            </main>
        </div>
    );
}