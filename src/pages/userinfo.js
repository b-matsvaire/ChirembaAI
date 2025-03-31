import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

const UserData = () => {
  const [data, setData] = useState(null);
  const [cookies] = useCookies(['username']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/userdata?username=${cookies.username}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch data');
        }
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (cookies.username) {
      fetchData();
    }
  }, [cookies.username]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>No data found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-teal-600">User Data</h2>
        
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Active Complaint</h3>
          <pre className="bg-gray-50 p-4 rounded-lg">{JSON.stringify(data.activeComplaint, null, 2)}</pre>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Health Histories</h3>
          <pre className="bg-gray-50 p-4 rounded-lg">{JSON.stringify(data.healthHistories, null, 2)}</pre>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Report Images</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.images.map((image) => (
              <div key={image.reportType} className="text-center">
                <img src={`/report/${cookies.username}/${image.reportType}.png`} alt={image.reportType} className="w-full max-w-xs mx-auto" />
                <p className="mt-2 text-gray-700">{image.reportType}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => alert('Button 1 clicked')}
            className="bg-teal-500 text-white hover:bg-teal-600 font-semibold py-2 px-4 rounded-lg transition"
          >
            Button 1
          </button>
          <button
            onClick={() => alert('Button 2 clicked')}
            className="bg-teal-500 text-white hover:bg-teal-600 font-semibold py-2 px-4 rounded-lg transition"
          >
            Button 2
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserData;
