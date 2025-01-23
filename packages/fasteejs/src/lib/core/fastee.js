import  http from 'http';
import  Router from './router.js';
import { parse } from 'querystring';
import parser from './perser.js';
import detect from 'detect-port';
import { logSuccess,logError} from '../utils/index.js';
import sirv from "sirv";
import GracefulShutdown from './shutdown.js';
import {DEV} from "esm-env";
import colors from "kleur";
import EventEmitter from 'eventemitter3';
import compression from 'compression';
import {textParser,jsonParser,urlencodedParser,send,json,reqValidator,resValidator,redirect,stream,text,html,ip} from "../middlewares/index.js"
const fasteeEvent = new EventEmitter();

function lead(x) {
	return x.charCodeAt(0) === 47 ? x : ('/' + x);
}

function value(x) {
  let y = x.indexOf('/', 1);
  return y > 1 ? x.substring(0, y) : x;
} 

function mutate(str, req) {
	req.url = req.url.substring(str.length) || '/';
	req.path = req.path.substring(str.length) || '/';
} 

function onError(err, req, res, next) {
	let code = (res.statusCode = err.code || err.status || 500);
	res.end(err.length && err || err.message || http.STATUS_CODES[code]);
}

class Server extends Router {
	constructor(opts={}) {
		super(opts);
		this.apps = {};
		this.wares = [];
		this.bwares = {};
		this.parse = parser;
		this.server = opts.server;
		this.handler = this.handler.bind(this);
		this.onError = opts.onError || onError; // catch-all handler
		this.onNoMatch = opts.onNoMatch || this.onError.bind(null, { code:404 });
      
	}
	add(method, pattern, ...fns) {
		let base = lead(value(pattern));
		if (this.apps[base] !== void 0) throw new Error(`Cannot mount ".${method.toLowerCase()}('${lead(pattern)}')" because a Polka application at ".use('${base}')" already exists! You should move this handler into your Polka application instead.`);
		return super.add(method, pattern, ...fns);
	}
	use(base, ...fns) {
		if (typeof base === 'function') {
			this.wares = this.wares.concat(base, fns);
		} else if (base === '/') {
			this.wares = this.wares.concat(fns);
		} else {
			base = lead(base);
			fns.forEach(fn => {
				if (fn instanceof Server) {
					this.apps[base] = fn;
				} else {
					let arr = this.bwares[base] || [];
					arr.length > 0 || arr.push((r, _, nxt) => (mutate(base, r),nxt()));
					this.bwares[base] = arr.concat(fn);
				}
			});
		}
		return this; // chainable 
	}
	init() {
		(this.server=http.createServer()).on('request', this.handler);
		//no server provided listen
		detect(this.port,(err,_port)=>{
                 
			if(_port !== this.port){
				//todo
			  console.log(colors.yellow(`server already running on: ${this.port}`))
			   console.log(colors.blue(`next fastee instance try using ${colors.grey(_port)} is free port`))
			  }else{ 
			 //
			 this.server.listen(this.port,(err)=>{
				if(err){
					return
				}
				//
				logSuccess(this.port)  
			
			 })
				
			  }
		})
		 
   
		return this;
	}
   

	handler(req, res, info) {
		info = info || this.parse(req);
		let fns=[], arr=this.wares, obj=this.find(req.method, info.pathname);
		req.originalUrl = req.originalUrl || req.url;
		let base = value(req.path = info.pathname);
		if (this.bwares[base] !== void 0) {
			arr = arr.concat(this.bwares[base]);
		}
		if (obj) {
			fns = obj.handlers;
			req.params = obj.params;
		} else if (this.apps[base] !== void 0) {
			mutate(base, req); info.pathname=req.path; //=> updates
			fns.push(this.apps[base].handler.bind(null, req, res, info));
		} else if (fns.length === 0) {
			fns.push(this.onNoMatch); 
		}
		// Grab addl values from `info`
		req.search = info.search; 
		req.query = parse(info.query);
		// Exit if only a single function
		let i=0, len=arr.length, num=fns.length;
		if (len === i && num === 1) return fns[0](req, res);
		// Otherwise loop thru all middlware
		let next = err => err ? this.onError(err, req, res, next) : loop();
		let loop = _ => res.finished || (i < len) && arr[i++](req, res, next);
		arr = arr.concat(fns);
		len += num; 

		loop(); // init
	}
} 

function shutdownFunction(signal) {
	return new Promise((resolve) => {
		fasteeEvent.emit("shutdown_fastee",signal);
	  console.log('... called signal: ' + signal);
	  console.log('... in cleanup')
	  setTimeout(function() {
		console.log('... cleanup finished');
		resolve();
	  }, 1000)
	});
  }
  function finalFunction() {
	console.log(colors.green(`Fastee gracefully shutted down.....`))
  }
  
export function onShutdown(cb){
	 fasteeEvent.once('shutdown_fastee',(data)=>{
		if(cb && typeof cb === "function"){
			return cb(data)
		}
	 })
}
class Fastee extends Server{
	constructor(opts={}){
		super()
		this.port = process.env.PORT  || Number(opts.port) || 7090;
		this.delay = opts.delay || 10000;
		this.onShutdown=onShutdown
		if(opts.server && opts.server.on){
			//server provided init
			this.server = opts.server
			this.server.on('request', this.handler)
			
			this
			.use(json)
			.use(send)
			.use(jsonParser)
			.use(urlencodedParser)
			.use(textParser)
			.use(reqValidator)
			.use(resValidator)
			
		    .use(redirect)
			.use(stream)
			.use(html)
			.use(text)
			.use(ip)
			.use(compression())
		   this.port=null
		   GracefulShutdown(this.server,
			{
			  signals: 'SIGINT SIGTERM',
			  timeout: this.delay,
			  development: DEV,
			  onShutdown: shutdownFunction, 
			  finally: finalFunction            
			}
		  );
		  console.log(colors.bold().green(`[fastee]:`),`now attached to your server`)
		   return this
		  }else{
			
			this.init()
			this
			.use(json)
			.use(send)
			.use(jsonParser)
			.use(urlencodedParser)
			.use(textParser)
			.use(reqValidator)
			.use(resValidator)
			.use(compression())
		    .use(redirect)
			.use(stream)
			.use(html)
			.use(text)
			.use(ip)
			GracefulShutdown(this.server,
				{
				  signals: 'SIGINT SIGTERM',
				  timeout: this.delay,
				  development: false, 
				  onShutdown: shutdownFunction,
				  finally: finalFunction  
				}
			  );
		  }
		
	}
		//router
		Router(path=""){
			if(path && typeof path === 'string' && path.length > 0 && path.startsWith('/')){
			  return  this.use(path,this)
			}else{
			   logError('valid path required for router < / > or < /api >')
			}
	      }

		static(folder="",opts={dotfiles:false,extensions:["html,htm,css"],brotli:false,gzip:false,maxAge:undefined,immutable:true,single:false,ignores:["/*.test.js"],etag:false}){
			   if(folder && typeof folder === "string" && folder.length > 0 && opts){
				const assets = sirv(folder,opts);
			  this.use(assets)
		  }else{
				 logError('folder name  required')
			 }
	    }
	
	  
} 

export {Server}
export default Fastee

