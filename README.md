![fastee](https://fasteejs.top/icon.svg "fasteejs") 
# Next gen blazing fast web application framework

full featured backend webframework
Fast, Lightweight,Built-in zod schema validator..

# Features
 * fast
 * production ready
 * no production code required it just works
 * already know express Yei!
 * type safety endpoints
 * express ecosystem support
 * gracefully shutsdown
 * has built-in goodies

 ```bash
  npm i fasteejs
 ```
 # usage
 
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

# what led to the developement of fasteejs
 maintaining production server api was  hectick and repetitive ,thus this gave birth to this awesome alternative.

