import React from "react";
import { auth } from "../firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export default function Login() {
  const login = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  return (
    <div class="flex h-screen items-center justify-center">
      <button class="bg-blue-600 text-white px-6 py-3 rounded" onClick={login}>
        Iniciar sesión con Google
      </button>
    </div>
  );
}
