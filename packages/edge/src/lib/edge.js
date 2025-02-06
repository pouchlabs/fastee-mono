import { checktype } from './utils.js';
import { parse, inject } from './regex.js';
import { LoadGlobalWares } from './middlewares.js';
import { EdgeRequest } from './request.js';
import EdgeResponse  from './response.js';
//import {join} from "path"
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

    async function handleHandlerResponse(resp,request){

      //undefined
      if(!resp){
        throw new Error(`${new URL(request.url).pathname} handler requires response`);
      }
      //response
      if(resp instanceof Response){ 
        return resp
      }
      //object
      if(checktype(resp) === checktype({})){
        let {status,type,data,...rest}=resp;
        let status_code= Number(status) || 200;
        let others = rest || null;
        if(data && type && typeof type === "string"){
             switch(type){
               case "html":
                       //html
                if(/^/.test(data)){
                     let r = new EdgeResponse()
                     r.headers.append( "X-Content-Type-Options","nosniff")
                     r.html(data,status_code)
                     return r
                }
          //err
            throw new Error("handler received non html text")
             
                case "text":
                  //text
                  if(/^/.test(data)){
                    let r = new EdgeResponse()
                    r.headers.append( "X-Content-Type-Options","nosniff")
                    r.text(data,status_code)
                    return r
                  }
                  //err
                  throw new Error("handler received non text")
                  //json
                  case "json":
                    if(checktype(data) === checktype({})){
                      let r = new EdgeResponse()
                      r.headers.append( "X-Content-Type-Options","nosniff")
                      r.json(data,status_code)
                      
                      return r
                    }
                    //err
                    throw new Error("handler received non object")
                    //stream
                  case "stream":
                  
                    //json
                      if(checktype(data) === checktype({}) && !data.readable || !data.stream || !data.writer){
                        const response = new Response({
                          [Symbol.asyncIterator]: async function* () {
                          yield JSON.stringify(data);
                          },
                        },{
                          status:status_code,
                          ...rest

                        });
                        response.headers.append( "X-Content-Type-Options","nosniff")
                        return response;
                    }else{
                        //normal stream
                    //all text
                    if(typeof data === "string" || typeof data === "number"){
                        const response = new Response({
                        [Symbol.asyncIterator]: async function* () {
                          
                          yield data
                          
                        },
                        },{
                          status:status_code,
                          ...rest
                    
                        });
                        response.headers.append( "X-Content-Type-Options","nosniff")
                        return response;
                    

                      
                    }else{
                        const response = new Response(data,
                          {
                              status:200,
                              ...rest
                        
                          }
                        );
                        response.headers.append( "X-Content-Type-Options","nosniff")
                        return response;
                    }

                    }
                  default:
                    throw new Error("handler requires response")
             }
        }else{
          throw new Error("data and type properties required,try return {type:'text',data:'hello world'}")
        }
       
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
      /**
       * no match handler
       * @param {object} req 
       * @param {object} res 
       * @returns 
       */
      this.onNotFound = (req,res)=>{
        return new Response("404 Not Found",{status:404})
      }
      /**error handle
       * @param {Error} err 
       * @param {object} req 
       * @param {object} res 
       * @returns 
       */
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
         let res = new EdgeResponse();
         try {
          let handler = this.find(request.method,new URL(request.url).pathname);
          req= new EdgeRequest(request);
         
          req.env=env;
          req.ctx=ctx;
          if(handler)req.params=handler.params || {};
           //call global wares
       let ware= await LoadGlobalWares(this,req);
       if(ware instanceof Response){
        return  ware
       }
      
   
        if(handler){
       for(let b of this.bwares){
            if(b.base === new URL(request.url).pathname){
              let bres= await b.fn(req,res);
              if(bres && bres instanceof Response)return bres
            }
          }

      
          let resp = await handler.fn(req, res);
          //handle response
          return await handleHandlerResponse(resp,req); 
        
        }else{
          //not found
          return this.onNotFound(req,res)
        }
      
        
    
         
         } catch (error) {
          return this.onError(error,req,res)
         }
      
        };
  
  
  return this
  }
  /**
   * 
   * @param {string} method - http methods
   * @param {string} pattern - url pattern eg "/","api/:id"
   * @param {function} fn  - handler function return response
   * @returns {object}
   */
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
  /**
   * find route
   * @param {string} method 
   * @param {string} path 
   * @returns 
   */
  find(method="",path="") {
    let handlers=this.routes;
    let handler;
    let l =handlers.length;
      for (var i = 0; i < l; i++) {
       let h = this.routes[i];
       if(h.pasedurl.pattern.test(path) && h.method === method)
        handler=h;
      }
      if(handler){
        handler.params=exec(path,handler.pasedurl)
        return handler
      }
  } 
  /**
   * 
   * @param {string | function} base - route path or a function.
   * @param  {function} fns -function handlers for middleware.
   * @returns {object}
   */
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
   /**
   * Router - split funtionality
   * @param {string} base -base route
   * @example let api = app.Router("/api");
   * api.get("/",async(req,res)=>{
   * return res.json({msg:"test api"})
   * })
   * export default api
   * @returns {Edge}
   */
  Router(base){
    if(!base || base.length === 0 || typeof base !== "string")throw new Error("Router requires valid path");
    
    return this.use(base,this)
  }

  
  }
 


export default Edge