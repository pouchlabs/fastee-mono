![fastee](https://fasteejs.top/icon.svg "fasteejs") 
# blazing fast web application framework

Built on web Standards

Fast, Lightweight,runs on any JavaScript runtime
# Features
 * fast
 * middlewares
 * already know express Yei!
 * multi-runtime
 * express ecosystem support
 * gracefully shutsdown
 * has built-in goodies

## packages
* Fastee - a blazing fast express alternative,runs on nodejs,bun and deno only.
* edge - a web application framework can serve a hono alternative,it's fast,runs on bun,deno,and workers.

# How to install Fastee
found as fasteejs

```bash
npm install fasteejs
```


## How to install Edge
found as @fasteejs/edge

```bash
npm install @fasteejs/edge
``` 
 ```bash
  npm i fasteejs
 ```
 # Fastee usage
  runs on node,bun and deno
 ```js
   import {Fastee} from "fasteejs"

   const app = new Fastee(); //uses defaults
   const app1 = new Fastee({port:4000,delay:30000}) //pass port and shutdown delay
   let server = http.createServer().listen(5000)
   const app2 = new Fastee({server,delay:30000}) //passed listening server must be already running
   app.get('/', function (req, res) {
      res.send('Hello World')
   })

app.static("static",{dotfiles:false}) //pass valid folder path and optional config

  //shutdown listener
 app.onShutdown((signal)=>{
   //call service before shutdown
   console.log("before",signal)
 })

   export {app,app1,app2}
 ```
 ## edge usage
```js
import Edge from "@fasteejs/edge" //or import {Edge} from "@fasteejs/edge"

const app = new Edge();

console.log(app)
//global wares
app.use((req,res)=>{//no next funtion required
 req.id="ware1"
},(req,res)=>{
  console.log(req.id)
  return res.json({msg:"success"})
})
//bwares route specific wares
app.use("/api",(req,res)=>{//no next funtion required
 req.id="ware1"
},(req,res)=>{
  console.log(req.id)
  return res.json({msg:"success"})
})
/*handler
a handler must return a response 
*/
app.get("/",async (req,res)=>{
  console.log(req)
  //object
  return new Response("hi from server")//or return res.text("hi edge")
})

export default app //must do
```