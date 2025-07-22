import "./Login.css";
import { useState } from "react";
import { Link, Navigate } from "react-router";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { signIn } from "../../../firebase/auth";
import { useAuth } from "../../../contexts/authContext";
import { LuEye, LuEyeOff } from "react-icons/lu";

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
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: joiResolver(validationsSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();

  console.debug(auth);

  const onSubmit = async (data: RegisterFormInputs) => {
    setIsLoggingIn(true);
    try {
      await signIn(data.email, data.password);
      setError(null);
    } catch (err) {
      setError("Login failed. Check your credentials.");
      console.debug(err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (auth?.userLoggedIn) return <Navigate to="/" />;

  return (
    <div className="login">
      <h1>Log in</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("email")}
          autoComplete="current-email"
          className="text-input"
          placeholder="Enter email"
        />
        {errors.email && <span>{errors.email.message}</span>}

        <div className="password-wrapper">
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            className="text-input password-input"
            placeholder="Enter password"
          />
          <button
            type="button"
            className="toggle-password-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
          </button>
        </div>
        {errors.password && <span>{errors.password.message}</span>}

        <button type="submit" className="submit-button">
          {isLoggingIn ? "Loading..." : "Log in"}
        </button>
        {error && <span style={{ color: "red" }}>{error}</span>}
      </form>

      <Link to="/register">Don't have any user? Sign up</Link>
    </div>
  );
};
