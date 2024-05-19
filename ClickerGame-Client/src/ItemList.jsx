import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Profile from "./Profile";

export default function ItemList() {
  const {accountId} = useParams();
  const baseURLItem = `http://localhost:4000/readItem/${accountId}`;
  const baseURLAccount = `http://localhost:4000/readAccount/${accountId}`;
  const buyItemURL = "http://localhost:4000/buyItem";
  const sellItemURL = "http://localhost:4000/sellItem";
  const clickURL = "http://localhost:4000/click";
  const getEarningURL = `http://localhost:4000/getEarning/${accountId}`;

  const [items, setItems] = useState(null);
  const [account, setAccount] = useState(null);
  const [earn, setEarn] = useState(null);
  const [trigger, setTrigger] = useState(false); // State variable to trigger useEffect

  useEffect(() => {
    fetch(baseURLItem)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        setItems(data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, [trigger]); // Add trigger as a dependency

  useEffect(() => {
    fetch(baseURLAccount)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        setAccount(data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, [trigger]);

  useEffect(() => {
    fetch(getEarningURL)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        setEarn(data.click);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, [trigger]);


  const handleBuy = (itemId) => {
    const params = new URLSearchParams();
    params.append('accountId', accountId);
    params.append('itemId', itemId);

    fetch(buyItemURL, {
      method: 'PUT',
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
        console.log('Item bought successfully:', data);
        setTrigger(prev => !prev); // Toggle the trigger state
      })
      .catch(error => {
        console.error('Error buying item:', error);
      });
  };

  const handleSell = (itemId) => {
    const params = new URLSearchParams();
    params.append('accountId', accountId);
    params.append('itemId', itemId);

    fetch(sellItemURL, {
      method: 'PUT',
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
        console.log('Item sold successfully:', data);
        setTrigger(prev => !prev); // Toggle the trigger state
      })
      .catch(error => {
        console.error('Error selling item:', error);
      });
  };

  const handleClick = () => {
    const params = new URLSearchParams();
    params.append('accountId', accountId);

    fetch(clickURL, {
      method: 'PUT',
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
        console.log('Click successfully:', data);
        setTrigger(prev => !prev); // Toggle the trigger state
      })
      .catch(error => {
        console.error('Error selling item:', error);
      });
  };

  if (!items || !account || !earn) return null;

  return (
    <>
      <Profile account={account} />
      
      <div className="flex flex-col items-center">
        <button
            type="button"
            onClick={() => handleClick()}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
            Click
        </button>
        <p>Earnings per Click: {earn}</p>
      </div>

      <div className="flex justify-center mt-8 pb-20">  
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-700 bg-white">
            <thead className="text-xs text-gray-700 uppercase bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3">Item Name</th>
                <th scope="col" className="px-6 py-3">Price</th>
                <th scope="col" className="px-6 py-3">Earnings</th>
                <th scope="col" className="px-6 py-3">Total</th>
                <th scope="col" className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="odd:bg-gray-100 even:bg-gray-50 border-b">
                  <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">{item.item_name}</th>
                  <td className="px-6 py-4">{item.item_price}</td>
                  <td className="px-6 py-4">{item.item_earn}</td>
                  <td className="px-6 py-4">{item.item_count}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleBuy(item.item_id)}
                      className="px-4 py-2 mr-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600"
                    >
                      Buy
                    </button>
                    <button
                      onClick={() => handleSell(item.item_id)}
                      className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600"
                    >
                      Sell
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      

    </>
  );
}
