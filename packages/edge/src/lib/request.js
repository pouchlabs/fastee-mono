/**
 * Edge request decorator
 * @constructor
 * @param {object} request - The incoming request object.
 * @returns {object}
 */
export class EdgeRequest{
    #request;
 constructor(request){
    //super(request.url)
    if(!request && request instanceof Request)throw new Error("EdgeRequest requires incoming request object");
     this.#request=request;
     this.cf=request.cf || {};
     
    return this 
 }
 /**
  * request url 
  * @returns {string} - request url.
  */
 get url(){
    return this.#request.url
 }
 /**
  * @returns {string} - request method.
  */
 get method(){
   return this.#request.method;
 }
  /**
  * @returns {string} - request path.
  */
  get path(){
   return new URL(this.#request.url).pathname;
 }
  /**
  * @returns {string} - request pathName.
  */
  get pathName(){
   return new URL(this.#request.url).pathname;
 }
   /**
  * @returns {string} - request originalUrl.
  */
   get originalUrl(){
      return new URL(this.#request.url).href;
    }
      /**
  * @returns {string} - request _parsedUrl.
  */
  get _parsedUrl(){
   return new URL(this.#request.url);
 }
      /**
  * @returns {object} - request searchparams.
  */
   get query(){
      return new URL(this.#request.url).searchParams;
   }
         /**
  * @returns {any} - request body.
  */
   get body(){
      return this.#request.body;
   }
   /**
  * @returns {boolean} - request bodyused.
  */
   get bodyUsed(){
      return this.#request.bodyUsed;
   }
      /**
  * @returns {string} - request cache used.
  */
    get cache(){
      return this.#request.cache;
   }
      /**
  * @returns {string} - request credentials used.
  */
      get credentials(){
         return this.#request.credentials;
      }
         /**
  * @returns {string} - request destination.
  */
   get destination(){
      return this.#request.destination;
   }
      /**
  * @returns {object} - request headers.
  */
   get headers(){
      return this.#request.headers;
   }
      /**
  * @returns {string} - request integrity.
  */
   get integrity(){
    return this.#request.integrity;
   }
   /**
  * @returns {boolean} - request isHistoryNavigation.
  */
   get isHistoryNavigation(){
      return this.#request.isHistoryNavigation;
   }
   /**
  * @returns {boolean} - request keepalive.
  */
   get keepalive(){
      return this.#request.keepalive;
   }
   /**
  * @returns {string} - request mode.
  */
   get mode(){
      return this.#request.mode;
   }
   /**
  * @returns {string} - request redirect.
  */
   get redirect(){
      return this.#request.redirect;
   }
   /**
  * @returns {string} - request referrer.
  */
   get referrer(){
      return this.#request.referrer;
   }
   /**
  * @returns {string} - request referrerPolicy.
  */
   get referrerPolicy(){
      return this.#request.referrerPolicy;
   }
   /**
  * @returns {string} - request signal.
  */
   get signal(){
      return this.#request.signal;
   }

 /**
  * 
  * @returns {object} - returns body as json
  */
 async json(){
 let content_type = this.#request.headers.get("content-type");
 if(content_type){
   if(content_type === "application/json"){
    return await this.#request.json();
   }
    return null
 }
 return null
 }
 /**
  * 
  * @returns {Buffer} - returns body as buffer
  */
 async arrayBuffer(){
   return this.#request.arrayBuffer();
 }
 /**
  * 
  * @returns {blob} - returns body as blob
  */
 async blob(){
   return this.#request.blob();
 }
 /**
  * 
  * @returns {Uint8Array} - returns body as unit8Array
  */
 async bytes(){
   return this.#request.bytes();
 }
  /**
  * 
  * @returns {object} - returns creates current copy of request.
  */
  async clone(){
   return this.#request.clone();
 }
 /**
  * 
  * @returns {object} - returns body as formData
  */
 async formData(){
   return this.#request.formData();
 }
  /**
  * 
  * @returns {string} - returns body as string
  */
  async text(){
   return this.#request.text();
 }
}
//new Request()