// authUtils.jsx
import { jwtDecode } from "jwt-decode";

export const saveRoleFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    const role = decoded.role || decoded?.user?.role;
    console.log(role)
    if (role) {
      localStorage.setItem("userRole", role);
    }
  } catch (err) {
    console.error("Invalid token:", err);
  }
};


export const getUserRole = () => {
  return localStorage.getItem("userRole");
};


