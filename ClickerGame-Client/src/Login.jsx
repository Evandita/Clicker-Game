import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import axios from 'axios';

function Login() {

    const logInURL = "http://localhost:4000/logIn";
    const signInURL = "http://localhost:4000/createAccount";
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        const params = new URLSearchParams();
        
        params.append('username', username);
        params.append('password', password);
    
        fetch(logInURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params.toString()
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            console.log('Log In successfully:', data[0].account_id);
            
            navigate(`/game/${data[0].account_id}`);
          })
          .catch(error => {
                alert('Wrong username or password');
          });
      };

      const handleSignIn = () => {
        const params = new URLSearchParams();
        
        params.append('username', username);
        params.append('password', password);
    
        fetch(signInURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params.toString()
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            console.log('Sign In successfully:', data.newAccount.account_id);
            
            navigate(`/game/${data.newAccount.account_id}`);
          })
          .catch(error => {
                alert('Username already used');
          });
      };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="flex flex-col items-center mb-6">
                <h1 className="text-2xl font-bold mb-4">Clicker Game</h1>
                <input 
                    type="text" 
                    placeholder="Username" 
                    className="text-gray-900 px-4 py-2 border border-gray-300 rounded mb-2" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} // Add this onChange handler
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    className="text-gray-900 px-4 py-2 border border-gray-300 rounded mb-2" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} // Add this onChange handler
                />
                <div className="flex">
                <button type="button" onClick={() => handleLogin()} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">
                    Login
                </button>
                <button type="button" onClick={() => handleSignIn()} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2">
                    Sign Up
                </button>
                </div>
            </div>
        </div>


    );
}

export default Login;
