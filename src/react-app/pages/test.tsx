// src/Login.js

const Test = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  console.log('API URL:', apiUrl);

  // Your login form logic here
  return (
    <div>
      <h1>Login Page</h1>
      <p>API URL: {apiUrl}</p>
    </div>
  );
};

export default Test;