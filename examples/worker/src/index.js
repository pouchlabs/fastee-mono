
import Edge from "../../../packages/edge/src/lib/index.js";

class EdgeResponse extends Response{
  constructor(data,opts={}){
    super(data,opts)
  }   
  stream(){

  }
}
console.log(new EdgeResponse()) 
const app = new Edge()
 app.use((req)=>{
  console.log(req.body)  
 // return new Response("ware")
 })     
app.get("/",(req,res)=>{  
  //res.statusCode=200
   
  return EdgeResponse.json({name:"anto users"})
 })      
 app.use("/users",()=>{ 
  //return new Response("uew")
 })

console.log(app)//app.wares.forEach(async (w,i)=>console.log(await w(),i)))
app.port=4000 
app.fetch 
export default app 
