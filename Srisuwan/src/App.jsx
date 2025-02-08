import Bannerbg from "./components/Bannerbg"
import Cards from "./components/Cards"
import Navbar from "./components/Navbar"
import TableContent from "./components/TableContent"
import { useState } from "react"

function App() {

  const [data, setdata] = useState("Dome")
  const [obj,setobj] = useState([
    {title:"Room 101",url:"https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg",content:"1200 Bath"},
    {title:"Room 102",url:"https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg",content:"1200 Bath"},
    {title:"Room 103",url:"https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg",content:"1200 Bath"},
    {title:"Room 104",url:"https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg",content:"1200 Bath"},
    {title:"Room 105",url:"https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg",content:"1200 Bath"},
    {title:"Room 106",url:"https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg",content:"1200 Bath"},
    {title:"Room 107",url:"https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg",content:"1200 Bath"},
    {title:"Room 108",url:"https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg",content:"1200 Bath"},
    {title:"Room 109",url:"https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg",content:"1200 Bath"},
  ])

  const handdleShow = () => {
    console.log("click")
  }

  return <><h1><Navbar /></h1>
    <h1><Bannerbg/></h1>
    <h1  style={{ height: "30px",fontSize:"35px",marginTop:"25px",marginLeft:"25px",marginBottom:"-10px"}}>Avaliable room</h1>
    <h7 style={{marginLeft:"25px"}}><Cards obj={obj}/></h7>

  </>
}

export default App