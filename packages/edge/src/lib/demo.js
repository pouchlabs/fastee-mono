
import {Edge} from "./edge.js";

let app = new Edge();
app.get("/",()=>{
   return {type:"html",data:"hi from home"}
})
app.route("get","/api/:id",(req)=>{
 console.log()
 return {type:"html",data:"hi from home"}
});
app.route("get","/api",()=>{}); 
export default app