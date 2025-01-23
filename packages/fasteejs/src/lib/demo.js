import { Edge } from "./core/edge.js";

const app = new Edge();
//app.handler()
app.get("/",(req,res)=>{
  res.json(JSON.stringify({a:"bbb"}))
})

let request = await fetch(new Request("http://localhost:3000")) 
  .then((response) => {
    return response
  })
