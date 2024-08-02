import { useNavigate } from 'react-router-dom';
import './App.css';
import './router';


function App() {
  const navigate = useNavigate();//declaring navigate


  return (
    <div className="App">
      
      <p>SELECT USER LOGIN TO EPICENTER</p>
      <div class="container">
        <div class="square" onclick={()=> navigate('/login_admin')}>ADMIN</div>
        <div class="square" onclick={()=> navigate('/login_tenant')}>TENANT</div>
      </div>

   </div>
  );
}


export default App;
