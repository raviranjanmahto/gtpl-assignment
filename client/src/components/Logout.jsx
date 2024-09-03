import { useNavigate } from "react-router-dom";

import { useLogoutUserMutation } from "../state/api/userApi";
import { toast } from "react-toastify";

const Logout = () => {
  const [logoutUser] = useLogoutUserMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <div className="container mt-5">
      <button className="btn btn-danger" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Logout;
