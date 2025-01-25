import { checktype } from './utils.js';
import { parse, inject } from './regex.js';
import { LoadGlobalWares } from './middlewares.js';
import { EdgeRequest } from './request.js';
import EdgeResponse  from './response.js';

  export  function parser(req) {
    let url = req.url;
    if (url === void 0) return url;
  
    let obj = req._parsedUrl;
    if (obj && obj._raw === url) return obj;
  
    obj = {};
    obj.query = obj.search = null;
    obj.href = obj.path = obj.pathname = url;
  
    let idx = url.indexOf('?', 1);
    if (idx !== -1) {
      obj.search = url.substring(idx);
      obj.query = obj.search.substring(1);
      obj.pathname = url.substring(0, idx);
    }
  
    obj._raw = url;
  
    return (req._parsedUrl = obj);
  }

  function exec(path, result) {
    let i=0, out={};
    let matches = result.pattern.exec(path);
    while (i < result.keys.length) {
      out[ result.keys[i] ] = matches[++i] || null;
    }
    return out;
  }
  
  function lead(x) {
    return x.charCodeAt(0) === 47 ? x : ('/' + x);
  }
  
  function value(x) {
    let y = x.indexOf('/', 1);
    return y > 1 ? x.substring(0, y) : x;
  } 
  
  function mutate(str, req) {
   req.url.substring(str.length) || '/';
   req.path.substring(str.length) || '/';
  } 
  
  function verify(pattern,fn,method=""){
      if(!method || typeof method !== "string" || method.length === 0){
          throw new Error("method not valid,allowed are'*,POST,GET,PUT,PATCH,CONNECT,OPTIONS,DELETE,TRACE,HEAD'")
        }
      if(!pattern || typeof pattern !== "string" || pattern.length === 0){
        throw new Error("pattern not valid,try some like,'/' or '/users/:id' ")
      }
     
      if(!fn || checktype(fn)!== "function"){
          throw new Error("handler not valid,requires a handler")
      }
     // for(let fn of fns){
        if(typeof fn !== "function"){
          throw new Error("fn not function");
      }
     
    //}
    }
    function add_route_to_routes(instance,method,pattern,fn){
      // for(let app of instance.apps){
      //   if(pattern.startsWith(app.base))pattern = app.base.concat(pattern.replace(app.base,"").trim()).trim()
      // }
          //new
          let newroute = {
              method:method,
              pasedurl:parse(pattern),
              rawurl:pattern,
              fn
          }
          let filtered = instance.routes.find((r)=>r.rawurl === newroute.rawurl);
              if(filtered){
                      //exists
                      throw new Error("route already exist" + " " + newroute.rawurl)
              }else{
                      //add
                  instance.routes.push(newroute)
                  return instance.routes
              }
              
     
    }
   
    /**
 * Fastee Edge class
 * @constructor
 * @param {object} opts - app options.
 * @returns {object}
 */
    export class Edge{
    
    
      constructor(opts={}){
      this.opts = opts;
      this.all = this.route.bind(this, '*');
      this.get = this.route.bind(this, 'GET');
      this.head = this.route.bind(this, 'HEAD');
      this.patch = this.route.bind(this, 'PATCH');
      this.options = this.route.bind(this, 'OPTIONS');
      this.connect = this.route.bind(this, 'CONNECT');
      this.delete = this.route.bind(this, 'DELETE');
      this.trace = this.route.bind(this, 'TRACE');
      this.post = this.route.bind(this, 'POST');
      this.put = this.route.bind(this, 'PUT');
      this.routes=[];
      this.wares=[];
      this.bwares=[];
      this.apps=[];
      this.parse=parser
      this.onNotFound = (req,res)=>{
        return new Response("404 Not Found",{status:404})
      }
      this.onError = (err,req,res)=>{
        return new Response("internal error",{status:500})
      }
        /**
           * fetch handler for server.
            * 
            * @param {object} request - The incoming request object.
            * @param {object} env - The environment object.
            * @param {object} ctx - The context object.
           */
      this.fetch= async (request={},env={},ctx={})=>{
        
         if(!request.url || typeof request.url !== "string" || request.url.length === 0 || !request.method || typeof request.method !== "string" || request.method.length === 0){
           throw new Error("valid request object required")
         }
         let req;
         try {
          let info = this.parse(request);
          req= new EdgeRequest(request);
          req.env=env;
          req.ctx=ctx;
           //call global wares
       let ware= await LoadGlobalWares(this,req,info);
       if(ware instanceof Response){
        return  ware
       }
       let handler;
      for(let h of this.routes.values()){
        if(h.pasedurl.pattern.test(new URL(request.url).pathname) && h.method === request.method)handler=h
      }
     
       if (handler){
            
            //call bware
            let  bware = this.bwares.find(v=>v.base === new URL(request.url).pathname);
            if(bware){
              let bres= await bware.fn(req,new EdgeResponse());
              if(bres && bres instanceof Response)return bres
            }
            let resp = await handler.fn(req,new EdgeResponse() );
            if(resp instanceof Response){
              return resp

            }else{
              //
              return this.onError(new Error(`${new URL(request.url).pathname} handler requires response object`),req,new EdgeResponse() )
            }
            //}
          }else{
            //not found
            return this.onNotFound(req,new EdgeResponse())
          }
  
         } catch (error) {
          console.log(error)
          return this.onError(error,req,new EdgeResponse())
         }
      
        };
  
  
  return this
  }
  route(method="", pattern="", fn) {
    verify(pattern,fn,method);
    if(this.routed && this.routed.base){
    
      if(this.routed.base.endsWith("/") && pattern.startsWith("/")){
          pattern = this.routed.base+pattern.replace("/","").trim();
        
      }else if(!this.routed.base.endsWith("/") && pattern.startsWith("/")){
        pattern = this.routed.base+"/"+pattern.replace("/","").trim();
        
      }
      else if(!this.routed.base.endsWith("/") && !pattern.startsWith("/")){
        pattern = this.routed.base+"/"+pattern.trim();
        
      }
    }else{
      //not router use
      if(pattern.startsWith("/")){
        pattern = pattern.trim();
      
    }else if(!pattern.startsWith("/")){
      pattern = "/"+pattern.trim();
      
    }
   
    }
     this.routes = add_route_to_routes(this,method.toUpperCase().trim(),pattern.trim(),fn);
  
    return this;
  }
  
  find(method="",path="") {
    let handler;
    var i=0;
    while (i< this.routes.length) {
      handler=this.routes[i];
       if(handler.method.toUpperCase() === method && handler.pasedurl.pattern.test(path))
        return handler()
        else null
      i++
    }
  } 
  
  use(base, ...fns) {
    if (typeof base === 'function') {
      this.wares = this.wares.concat(base, fns);
    } else if (base === '/') {
      this.wares = this.wares.concat(fns);
    } else {
      base = lead(base);
      fns.forEach(fn => {
        if (fn instanceof Edge) {
          this.routed = {
            base,
          };
          this.apps.push({base,fns:fn});
        } else {
        
          this.bwares.push({base,fn}); 
        
        }
      });
    }
    return this; // chainable 
  }
  
  }
  
//   export class Edge{
  
//     constructor(opts={}){
//     this.opts = opts;
//     this.all = this.route.bind(this, '*');
//     this.get = this.route.bind(this, 'GET');
//     this.head = this.route.bind(this, 'HEAD');
//     this.patch = this.route.bind(this, 'PATCH');
//     this.options = this.route.bind(this, 'OPTIONS');
//     this.connect = this.route.bind(this, 'CONNECT');
//     this.delete = this.route.bind(this, 'DELETE');
//     this.trace = this.route.bind(this, 'TRACE');
//     this.post = this.route.bind(this, 'POST');
//     this.put = this.route.bind(this, 'PUT');
//     this.routes=[]
//     this.fetch=(request,env={},ctx={})=>{
//       //processor.preRequest(request);
//        if(!request.url || typeof request.url !== "string" || request.url.length === 0 || !request.method || typeof request.method !== "string" || request.method.length === 0){
//          throw new Error("valid request object required")
//        }
    
//       let path = request.url || new URL(request.url).pathname;
//       let l = this.routes.length;
//       for (var i = 0; i < l; i++) {
//         let  handler = this.routes[i];
//           if (handler.pasedurl.pattern.test(path)){
//             for(let func of handler.fns){
//               return func(request,env)
//             }
//           }else{
//             //not found
//             return this.onNotFound(request,env)
//           }
              
//       }
    
//     }
 
// }

// route(method="", pattern="", ...fns) {
//     verify(pattern,fns,method);
//      this.routes = add_route_to_routes(this,method.toUpperCase().trim(),pattern.trim(),fns);
  
//     return this;
// }

// find(method="", url="") {
//     let arr = match(url, this.routes[method] || []);
//     if (arr.length === 0) {
//         arr = match(url, this.routes[method='*'] || []);
//         if (!arr.length) return false;
//     }
//     return {
//         params: exec(url, arr),
//         handlers: this.handlers[method][arr[0].old]
//     };
// }


// }


export default Edge