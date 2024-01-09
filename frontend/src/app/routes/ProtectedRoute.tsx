import React from "react";
import {Navigate, RouteProps} from "react-router";
import {useSelector} from "react-redux";
import {RootState} from "../store";


interface ProtectedRouteProps {
    children: RouteProps["children"]
}

export function ProtectedRoute(props:ProtectedRouteProps) {
    const { children } = props
    const isLogin = useSelector((state: RootState) => state.auth.isLogin)
    return isLogin ? <>{ children }</> : <Navigate to="/login" />;
}