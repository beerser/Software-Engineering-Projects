import Bannerbg from "./components/Bannerbg"
import Cards from "./components/Cards"
import Navbar from "./components/Navbar"
import TableContent from "./components/TableContent"
import { useState } from "react"

function App() {

  const [data, setdata] = useState("Dome")
  const [obj,setobj] = useState([
    {title:"ห้อง101",url:"https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg",content:"ห้องพักที่สะดวกสบายต่อการเดินทางและราคาถูก"},
    {title:"ห้อง102",url:"https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg",content:"ห้องพักที่สะดวกสบายต่อการเดินทางและราคาถูก"},
    {title:"ห้อง103",url:"https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg",content:"ห้องพักที่สะดวกสบายต่อการเดินทางและราคาถูก"},
    {title:"ห้อง104",url:"https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg",content:"ห้องพักที่สะดวกสบายต่อการเดินทางและราคาถูก"},
    {title:"ห้อง105",url:"https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg",content:"ห้องพักที่สะดวกสบายต่อการเดินทางและราคาถูก"},
    {title:"ห้อง106",url:"https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg",content:"ห้องพักที่สะดวกสบายต่อการเดินทางและราคาถูก"},
    {title:"ห้อง107",url:"https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg",content:"ห้องพักที่สะดวกสบายต่อการเดินทางและราคาถูก"},
    {title:"ห้อง108",url:"https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg",content:"ห้องพักที่สะดวกสบายต่อการเดินทางและราคาถูก"},
    {title:"ห้อง109",url:"https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg",content:"ห้องพักที่สะดวกสบายต่อการเดินทางและราคาถูก"},
  ])

  const handdleShow = () => {
    console.log("click")
  }

  return <><h1><Navbar /></h1>
    <Bannerbg/>
    <Cards obj={obj}/>

  </>
}

export default App