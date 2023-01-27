import {useEffect, useState} from "react"
import './App.css';
import axios from "axios"

const App=()=> {
  const [trainer, setTrainer] = useState([]);

  axios.get("https://goat2.p.rapidapi.com/product/details/url/air-jordan-3-retro-se-canvas-dh7139-100").then((res)=>{
    console.log(res);
    const myRes = res.data;
    setTrainer(myRes)
  })

  useEffect(()=>App(),[]);
  
  
  return (
    <div className="App">
      <h1>Welcome to STOCKX TRAINERS!!!</h1>

      <button>Click Me</button>
      
      
    </div>
  );
}

export default App;
