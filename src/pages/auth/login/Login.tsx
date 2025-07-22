import "./Login.css";
import { useCallback, useState } from "react";
import { Link, Navigate } from "react-router";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { signIn } from "../../../firebase/auth";
import { useAuth } from "../../../contexts/authContext";

type RegisterFormInputs = {
  email: string;
  password: string;
};

const validationsSchema = Joi.object<RegisterFormInputs>({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Invalid email format",
      "string.empty": "Email is required",
    }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

export const Login = () => {
  const {
    register,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: joiResolver(validationsSchema),
  });

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();

  console.debug(auth);

  const handleLogin = useCallback(async () => {
    try {
      if (!isLoggingIn) {
        setIsLoggingIn(true);
        await signIn(email, password);
        setError(null);
      }
    } catch (err: any) {
      setError("Login failed. Check your credentials.");
      console.debug(err);
    } finally {
      setIsLoggingIn(false);
    }
  }, [password, email, isLoggingIn]);

  if (auth?.userLoggedIn) return <Navigate to="/" />;

  return (
    <div className="login">
      <h1>Log in</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <input
          {...register("email")}
          autoComplete="current-email"
          className="text-input"
          placeholder="Enter email"
          onBlur={(e) => setEmail(e.target.value)}
        />
        {errors.email && <span>{errors.email.message}</span>}

        <input
          {...register("password")}
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          className="text-input"
          placeholder="Enter password"
          onBlur={(e) => setPassword(e.target.value)}
        />
        {errors.password && <span>{errors.password.message}</span>}

        <button type="button" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? "Ocultar" : "Mostrar"}
        </button>

        <button type="submit" className="submit-button" onClick={handleLogin}>
          {isLoggingIn ? "Iniciando..." : "Log in"}
        </button>
        {error && <span style={{ color: "red" }}>{error}</span>}
      </form>

      <Link to="/register">Don't have any user? Sign up</Link>
    </div>
  );
};
