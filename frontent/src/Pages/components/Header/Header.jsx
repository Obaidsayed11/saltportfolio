import React, { useState } from "react";
import { useUserInfoQuery } from "../../../redux/Slice/User.Slice.js";
import { useLogoutUserMutation } from "../../../redux/Slice/Auth.Slice.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { logoutResetToken } from "../../../redux/Slice/Token.Slice.js";
import { toast } from "sonner";

function Header() {
  const { data: users, isLoading, error } = useUserInfoQuery();
  const [logoutUser] = useLogoutUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      Cookies.remove("token");
      dispatch(logoutResetToken());
      toast.success("User Logged out successfully");
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed");
      console.error("Logout failed:", err);
    }
  };

  const initials = () => {
    const firstI = users?.data?.firstName?.charAt(0) || '';
    const lastI = users?.data?.lastName?.charAt(0) || '';
    return `${firstI}${lastI}`.toUpperCase();
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching user data</div>;

  return (
    <>
      <header className="w-full h-20 bg-gradient-to-r from-indigo-600 to-purple-700 px-6 flex items-center justify-between shadow-md">
        <div className="text-white text-2xl font-semibold">MyDashboard</div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {users?.data?.profilePhoto ? (
              <img
                src={users.data.profilePhoto}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-white text-indigo-600 flex items-center justify-center text-lg font-bold border-2 border-white shadow-md">
                {initials()}
              </div>
            )}

            <div className="text-white font-medium">{initials()}</div>
          </div>
          {/* <button
            onClick={() => setShowConfirm(true)}
            className="bg-white text-indigo-600 hover:bg-indigo-100 transition-all duration-200 font-semibold px-4 py-2 rounded-lg shadow"
          >
            Logout
          </button> */}
          <button
  class="group flex items-center justify-start w-11 h-11 bg-red-600 rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-32 hover:rounded-lg active:translate-x-1 active:translate-y-1"
   onClick={() => setShowConfirm(true)}
>
  <div
    class="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:px-3"
  >
    <svg class="w-4 h-4" viewBox="0 0 512 512" fill="white">
      <path
        d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
      ></path>
    </svg>
  </div>
  <div
    class="absolute right-5 transform translate-x-full opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
  >
    Logout
  </div>
</button>
        </div>
      </header>

     {showConfirm && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white border rounded-lg shadow relative max-w-sm w-full mx-4">
      
      {/* Close (X) button */}
      <div className="flex justify-end p-2">
        <button
          type="button"
          onClick={() => setShowConfirm(false)}
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </div>

      {/* Modal Content */}
      <div className="p-6 pt-0 text-center">
        <svg
          className="w-20 h-20 text-red-600 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <h3 className="text-xl font-normal text-gray-500 mt-5 mb-6">
          {users?.data?.firstName} {users?.data?.lastName}, do you really want to logout?
        </h3>

        {/* Yes */}
        <button
          onClick={() => {
            setShowConfirm(false);
            handleLogout();
          }}
          className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-4 py-2.5 text-center mr-2"
        >
          Yes, I'm sure
        </button>

        {/* No */}
        <button
          onClick={() => setShowConfirm(false)}
          className="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-4 py-2.5 text-center"
        >
          No, cancel
        </button>
      </div>
    </div>
  </div>
)}

    </>
  );
}

export default Header;
