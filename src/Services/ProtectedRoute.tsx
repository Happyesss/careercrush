'use client'

import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import { redirect } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const token = useSelector((state: any) => state.jwt);

  useEffect(() => {
    if (!token) {
      redirect("/login");
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(decoded.accountType)) {
        redirect("/unauthorized");
        return;
      }
    } catch (error) {
      redirect("/login");
      return;
    }
  }, [token, allowedRoles]);

  if (!token) {
    return null;
  }

  try {
    const decoded: any = jwtDecode(token);
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(decoded.accountType)) {
      return null;
    }
  } catch (error) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
