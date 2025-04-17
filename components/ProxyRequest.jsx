// app/components/ProxyRequest.js
import { useState } from 'react';

export default function ProxyRequest({ proxyId, markedFor }) {
  const [status, setStatus] = useState('');

  const handleStatusChange = async (newStatus) => {
    const res = await fetch('/api/approve-proxy', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proxyId, status: newStatus }),
    });

    const data = await res.json();
    setStatus(data.proxy.status); // Update the UI with the new status
    alert(data.message);
  };

  return (
    <div>
      <h3>Proxy for {markedFor}</h3>
      <button onClick={() => handleStatusChange('accepted')}>Accept</button>
      <button onClick={() => handleStatusChange('rejected')}>Reject</button>
    </div>
  );
}