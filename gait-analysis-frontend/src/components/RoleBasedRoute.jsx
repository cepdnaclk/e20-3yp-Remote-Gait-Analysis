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

  console.log("🔍 Decoded JWT:", user);

  // Extract role strings from authorities if roles are objects
  const roles = Array.isArray(user?.roles)
    ? user.roles.map(r => typeof r === "string" ? r : r.authority)
    : [user?.roles];
  // ✅ Log the decoded JWT and roles
  
  console.log("✅ Extracted roles:", roles);


  const hasAccess = token && roles.some(role => allowedRoles.includes(role));

  return hasAccess ? children : <Navigate to="/unauthorized" />;
}
