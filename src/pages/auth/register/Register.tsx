import "./Register.css";
import { useNavigate } from "react-router";
import { useCallback, useState } from "react";
import { Link, Navigate } from "react-router";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { createUser } from "../../../firebase/auth";
import { useAuth } from "../../../contexts/authContext";
import axiosInstance from "../../../config/axios";

type RegisterFormInputs = {
  username: string;
  email: string;
  password: string;
};

const validationsSchema = Joi.object<RegisterFormInputs>({
  username: Joi.string().required().messages({
    "string.empty": "Username is required",
  }),
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

export const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: joiResolver(validationsSchema),
  });

  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const auth = useAuth();

  console.debug(auth);

  const handleRegister = useCallback(async () => {
    if (!isRegistering) {
      setIsRegistering(true);
      await createUser(email, password);
    }
  }, [isRegistering, email, password]);

  if (auth?.userLoggedIn) return <Navigate to="/" />;

  const onSubmit = async (data: RegisterFormInputs) => {
    const sendData = {
      username: data.username,
      email: data.email,
    };
    try {
      const response = await axiosInstance.post(
        "http://localhost:3000/api/users",
        sendData
      );
      console.debug("User created:", response.data);
      navigate("/tasks");
    } catch (error) {
      console.debug("Error creating user:", error);
    }
  };

  return (
    <div className="register">
      <h1>Register a new user</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("username")}
          className="text-input"
          placeholder="Enter username"
        />
        {errors.username && <span>{errors.username.message}</span>}

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

        <button
          type="submit"
          className="submit-button"
          onClick={handleRegister}
        >
          Create user
        </button>
      </form>

      <Link to="/login">Already have a user? Login</Link>
    </div>
  );
};
