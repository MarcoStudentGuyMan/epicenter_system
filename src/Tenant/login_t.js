import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';


const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: tableData, error } = await supabase
        .from('STALL')
        .select('stall_id, s_bus_name, s_desc, s_type, s_logo, ten_id');
      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setData(tableData);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <h1>Stall Information</h1>
      <table>
        <thead>
          <tr>
            <th>Stall ID</th>
            <th>Business Name</th>
            <th>Description</th>
            <th>Type</th>
            <th>Logo</th>
            <th>Tenant ID</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.stall_id}>
              <td>{item.stall_id}</td>
              <td>{item.s_bus_name}</td>
              <td>{item.s_desc}</td>
              <td>{item.s_type}</td>
              <td>
                <img src={item.s_logo} alt={item.s_bus_name} style={{ width: '50px', height: '50px' }} />
              </td>
              <td>{item.ten_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default App;
