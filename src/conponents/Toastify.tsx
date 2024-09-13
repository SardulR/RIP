import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toastify = () => {
  const notify = () => {
    toast.success('This is a success message!', {
      
      autoClose: 3000, 
    });

    toast.error('This is an error message!', {
      
      autoClose: 5000, 
    });
  };

  return (
    <div>
      <h1>React Toastify Example</h1>
      <button onClick={notify}>Show Toast Notifications</button>
      <ToastContainer />
    </div>
  );
};

export default Toastify;
