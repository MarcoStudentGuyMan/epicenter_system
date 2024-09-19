import { useEffect, useState } from "react";

const useFetch = (url) => {
  const [data, setData] = useState({ data: [] });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(url);

        if (!res.ok) {
          const errorData = await res.json();
          console.error("Error Response Data:", errorData);  // Log the error response for debugging
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const json = await res.json();
        console.log('Fetched Data:', json);  // Log data for debugging
        setData(json);
      } catch (error) {
        console.error('Fetch Error:', error.message);  // Log error message if it occurs
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return { loading, error, data };
};

export default useFetch;
