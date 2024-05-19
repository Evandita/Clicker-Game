import React, { useState } from 'react';
import axios from "axios";
import ItemList from './ItemList';



const SignUp = () => {
   
   const {items, setItems} = useState([]);
   
   React.useEffect(() => {
    axios.get("http://localhost:4000/readItem")
    .then((response) => {
        setItems(response.data);
    }).catch(error => {
        console.error(error);
    });
   }, []);

  return (
    <div>
      <h1>Sign Up</h1>
      <ItemList items={items} />
    </div>
  );
};

export default SignUp;
