import { Navigate } from "react-router-dom";

function PrivateRoute({ children, roles }) {

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  /* NOT LOGGED IN */

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  /* ROLE RESTRICTION */

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute;