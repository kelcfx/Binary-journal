'use client';
import Login from "./auth/Login";
import Main from "./components/main";
import { useAuth } from "./context/AuthContext";


export default function Home() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <Main />
  );
}
