"use client";

import { useActionState, useState } from "react";
import { login } from "@/app/actions/auth";
import { EyeIcon, EyeOffIcon } from "@/app/ui/icons";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} className="login-form">
      <div className="login-fields">
        <div className="field">
          <label htmlFor="email" className="field-label">
            E-mail<span className="required">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={state?.email}
            className="input"
          />
        </div>

        <div className="field">
          <label htmlFor="password" className="field-label">
            Senha<span className="required">*</span>
          </label>
          <div className="input-affix-wrap">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              className="input"
            />
            <button
              type="button"
              className="affix-btn"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        <div className="login-extras">
          <label className="login-remember">
            <input type="checkbox" name="remember" defaultChecked />
            Lembrar usuário
          </label>
          {/* Placeholder until a password-reset flow exists. */}
          <span className="login-forgot">Esqueci minha senha</span>
        </div>
      </div>

      {state?.error && (
        <p role="alert" className="login-error">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn btn-primary lg block">
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
