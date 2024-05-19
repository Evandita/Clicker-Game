import React, {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom'; 

const baseURLAccount = "http://localhost:4000/readAccount/1";

export default function Profile(props) {

    const navigate = useNavigate();

    const handleLogout = () => {
        // Perform logout actions here
        // For example, clearing local storage, resetting state, etc.
        // Then navigate to the login page or any other appropriate page
        navigate('/');
    };

    console.log("props = ", props.account[0]);
    return (
        <div style={{ marginTop: '5%', marginLeft: '5%', marginBottom: '5%' }} className="flex items-center gap-4">
        <div className="font-medium dark:text-dark">
            <div>{props.account[0].account_username}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
            Money = {props.account[0].account_money}
            </div>
            
        </div>
        <button 
            onClick={handleLogout} 
            className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2">
            Logout
        </button>
        </div>
    );
}
