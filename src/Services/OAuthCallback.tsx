"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setJwt } from "../Slices/JwtSlice";
import { setUser } from "../Slices/UserSlices";
import { jwtDecode } from "jwt-decode";


const OAuthCallback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
  const token = searchParams.get("token");

    if (token) {
      dispatch(setJwt(token));
      const decoded: any = jwtDecode(token);
      dispatch(setUser({ ...decoded, email: decoded.sub }));
      router.push("/");
    } else {
      router.push("/login");
    }
  }, [dispatch, router, searchParams]);

  return null;
};

export default OAuthCallback;
