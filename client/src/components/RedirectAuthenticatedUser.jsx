import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// A component to redirect authenticated and verified users away from certain routes (e.g., login or signup)
const RedirectAuthenticatedUser = ({ children }) => {
  const { user } = useSelector(state => state.user);

  if (user) return <Navigate to="/" replace />; // If the user is authenticated, redirect them to the home page

  return children; // If the user is not authenticated, render the child components (e.g., login or signup forms)
};

export default RedirectAuthenticatedUser;
