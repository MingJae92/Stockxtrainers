import {useEffect, useState} from "react"
import './App.css';
import axios from "axios"

const App=()=> {
  const [trainer, setTrainer] = useState([]);
  axios.get("localhost:8000/products").then((data)=>{
    console.log(data)
    

  })

  return (
    <div className="App">
      <h1>Welcome to STOCKX TRAINERS!!!</h1>

      <button>Click Me</button>
      
      
    </div>
  );
}

export default App;
