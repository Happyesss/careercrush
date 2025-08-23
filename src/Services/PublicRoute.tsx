'use client'

import { useSelector } from "react-redux";
import { redirect } from "next/navigation";
import { useEffect } from "react";

interface PublicRouteProps {
  children: JSX.Element;
  restricted?: boolean; // If true, authenticated users will be redirected
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children, restricted = false }) => {
  const token = useSelector((state: any) => state.jwt);

  useEffect(() => {
    if (token && restricted) {
      redirect("/");
    }
  }, [token, restricted]);

  if (token && restricted) {
    return null;
  }

  return children;
};

export default PublicRoute;
