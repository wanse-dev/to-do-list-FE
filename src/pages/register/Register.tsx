import "./Register.css";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import axiosInstance from "../../config/axios";

type RegisterFormInputs = {
  username: string;
  email: string;
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
      //   setStoredUser(response.data.data); CAMBIAR ESTA LINEA Y ADAPTARLA A FIREBASE
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
          className="text-input"
          placeholder="Enter email"
        />
        {errors.email && <span>{errors.email.message}</span>}

        <button type="submit" className="submit-button">
          Create user
        </button>
      </form>

      <Link to="/tasks">Continue without register any user</Link>
    </div>
  );
};
