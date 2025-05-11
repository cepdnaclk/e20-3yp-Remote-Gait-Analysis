import { Navigate } from "react-router-dom";

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

export default function RoleBasedRoute({ allowedRoles, children }) {
  const token = localStorage.getItem("token");
  const user = parseJwt(token);
  const roles = user?.roles || [];

  const hasAccess = token && roles.some(role => allowedRoles.includes(role));

  return hasAccess ? children : <Navigate to="/unauthorized" />;
}
