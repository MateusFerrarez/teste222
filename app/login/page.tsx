import type { Metadata } from "next";
import { LoginForm } from "@/app/ui/login-form";

export const metadata: Metadata = {
  title: "Login - PSZ Manager",
};

export default function LoginPage() {
  return (
    <main className="login-scene">
      <div className="login-card">
        <div className="login-head">
          <h1 className="login-title">Entrar</h1>
          <p className="login-sub">Acesse sua conta para continuar</p>
        </div>
        <LoginForm />
        <p className="login-foot">
          Problemas para acessar? Contate o administrador do sistema.
        </p>
      </div>
    </main>
  );
}
