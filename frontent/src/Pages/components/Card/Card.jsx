import React, { useState } from "react";
import { useUserInfoQuery } from "../../../redux/Slice/User.Slice";
import PortFolio from "../../PortFolio/PortFolio";

function Card() {
  const { data: users, isLoading, error } = useUserInfoQuery();
  const [open, setOpen] = useState(false);

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error fetching user data</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-2xl transition-transform duration-300 hover:scale-[1.01]">
        
      
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32">
            <img
              src={users?.data?.profilePhoto}
              alt="Profile"
              className="w-full h-full rounded-full object-cover border-4 border-indigo-500 shadow-lg"
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mt-4">
            {users?.data?.firstName} {users?.data?.lastName}
          </h2>
        </div>

        
        <div className="mt-8 space-y-4 text-center text-gray-700 text-base">
          <p>
            <span className="font-semibold text-gray-900"> Email: </span><span className="text-lg">{users?.data?.email}</span> 
          </p>
          <p>
            <span className="font-semibold text-gray-900"> Phone:</span> {users?.data?.phoneNumber}
          </p>
          <p>
            <span className="font-semibold text-gray-900">Date of Birth:</span>{" "}
            {formatDate(users?.data?.dateOfBirth)}
          </p>
        </div>

       
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setOpen(true)}
            className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-all duration-200"
          >
            View Portfolio
          </button>
        </div>
        <PortFolio visible={open} onClose={() => setOpen(false)} />
      </div>
    </div>
  );
}

export default Card;
