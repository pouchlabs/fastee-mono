import { time } from "console";
import {Edge} from "./edge.js";
import http from "http";
let server = http;
let app = new Edge();
app.get("/",()=>{
    console.log("home",Date.now())
})
app.route("get","/api/:id",()=>{});
app.route("get","/api",()=>{}); 
console.log(app.routes)
server.createServer(app.fetch)
.listen(3000,"localhost")