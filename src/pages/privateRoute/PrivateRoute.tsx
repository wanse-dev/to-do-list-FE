import { Navigate } from "react-router";
import { useAuth } from "../../contexts/authContext";

type PrivateRouteProps = {
  component: React.FC;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
}) => {
  const auth = useAuth();
  if (auth?.userLoggedIn === null) return <div>Loading...</div>;
  return auth?.userLoggedIn ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;
