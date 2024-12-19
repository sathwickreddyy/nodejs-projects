import React, { useState } from 'react';

function App() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const callApi = async () => {
    try {
      // Make an HTTPS request to the Spring Boot server
      const response = await fetch('https://localhost:8443/hello', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.text(); // Assuming the response is plain text
      setMessage(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data from server.');
    }
  };

  return (
      <div className="App">
        <header className="App-header">
          <h1>React TLS Client</h1>
          <button onClick={callApi}>Call Secure API</button>
          {message && <p>Response: {message}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </header>
      </div>
  );
}

export default App;
