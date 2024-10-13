import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './chat.css'

const Login = () => {
  const navigate = useNavigate();
  const [userName, setuserName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState(null); // State for error message
  

  const submit = (e)=>{

    e.preventDefault(); // Prevent default form submission

    // Validation: Check if both fields are filled
    if (userName.length==0 && roomId.length!=0) {
      setError("userName is Required"); // Set error message
      return; // Prevent navigation if validation fails
    }
    else if(userName.length!=0 && roomId.length==0){
      setError("roomId is Required")
      return;
    }
    else if(userName.length==0 && roomId.length==0){
      setError("Both userName and roomId is required");
      return;
    }
    
    // Clear any existing errors
    setError(""); 
    navigate('/chat',{state:{username : userName, roomId : roomId}});
  }

  return (
    <div className="flex flex-col justify-center h-[88vh]  background">
      <div className="flex flex-row text-white  justify-center ">
        <form onSubmit={(e)=>submit(e)} className="bg-slate-950  gap-5 flex flex-col rounded-xl p-10 ">
          <div>
            <h2 className="text-3xl font-semibold">Login </h2>
          </div>

          <div>
            <label htmlFor="username" className="mx-2">User Name : </label>
            <input type="text" 
              onChange={(e)=> setuserName(e.target.value)}
              
            className="rounded h-10 text-2xl text-black px-2 font-bold" id="username" name="username" />
          </div>
          
          <div>
            <label htmlFor="roomId" className="mx-2">Room Id :  </label>
            <input type="text" onChange={(e)=> setRoomId(e.target.value)} className="rounded h-10 text-2xl px-2 mx-5 text-black font-bold" id="roomId" name="roomId" />
          </div>

          {error && <p className="text-red-700 font-bold text-right px-10">{error}**</p>}
          <div className="mt-5">
            <button className="flex justify-center w-full bg-slate-200 text-black p-2 text-2xl font-extrabold rounded-lg ">
              Enter 
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
