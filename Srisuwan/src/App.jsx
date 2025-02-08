import Navbar from "./components/Navbar"
import TableContent from "./components/TableContent"
import { useState } from "react"

function App(){

  const [data,setdata] = useState("Dome")

var tam = 55+66
const handdleShow =()=>{
  console.log("click")
}

  return <h1><Navbar handdleShow={handdleShow}
  setdata = {setdata}
  />
  <hr />
  <TableContent data = {data}/>
  </h1>
}

export default App