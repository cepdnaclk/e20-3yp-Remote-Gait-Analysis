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
  // ✅ Log the decoded JWT and roles
  console.log("🔍 Decoded JWT:", user);
  const roles = Array.isArray(user?.roles) ? user.roles : [user?.roles];
  console.log("✅ Extracted roles:", roles);


  const hasAccess = token && roles.some(role => allowedRoles.includes(role));

  return hasAccess ? children : <Navigate to="/unauthorized" />;
}
