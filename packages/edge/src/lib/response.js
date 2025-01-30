
/**fastee edgeresponse constructor.
 * @constructor 
 * @returns {object} -response object.
 */
export default class EdgeResponse{
    #response=Response;
    #bodyholder;
 constructor(body=null,opts={}){
     if(opts && typeof opts !== typeof {}){
        throw new Error("Edge response requires object")
     }
     if(body && opts){
        return new this.#response(body,opts);
     }return this
 }
 /**
  * @returns {object} -returns response readable object.
  */
 get body(){
    return new this.#response().body
 }
 /**
  * @returns {boolean} -returns response bodyused.
  */
 get bodyUsed(){
    return new this.#response().bodyUsed
 }
 /**
  * @returns {object} -returns response headers object.
  */
 get headers(){
    return new this.#response().headers
 }
 /**
  * @returns {boolean} -returns response ok status.
  */
 get ok(){
    return new this.#response().ok
 }
 /**
  * @returns {boolean} -returns response redirected.
  */
 get redirected(){
    return new this.#response().redirected
 }
 /**
  * @returns {string} -returns response status code.
  */
 get status(){
    return new this.#response().status
 }
 /**
  * @returns {string} -returns response statusText.
  */
 get statusText(){
    return new this.#response().statusText
 }
 /**
  * @returns {string} -returns response type.
  */
 get type(){
    return new this.#response().type
 }
 /**
  * @returns {string} -returns response url.
  */
 get url(){
    return new this.#response().url
 }
 /**
  * error
  * @returns {object} Returns a new Response object associated with a network error.
  */
 error(){
    return this.#response.error()
 }
  /**
  * redirect
  * @param {string} url -path to redirect.
  * @param {number} status -redirect code
  * @returns {object} returns a new response with a different URL.
  */
  redirect(url,status){
    return this.#response.redirect(url,status)
 }
   /**
  * json
  * @param {object} data -json to send.
  * @param {number} status -status code default 200
  * @returns {object} returns a new response with json.
  */
   json(data,status){
    if(!data && typeof data !== typeof {} || status && typeof status !== "number"){
        throw new Error("edge json method requires object and status number")
    }
    let json = new this.#response(JSON.stringify(data),{
        status:200 || status,
    })
    json.headers.append("content-type","application/json")
    return json
    
 }
  /**
  * json
  * @param {object} data -json to send.
  * @param {number} status -status code default 200
  * @returns {object} returns a new response with json.
  */
  json(data,status=200){
    if(!data || data && typeof data !== typeof {} || status && typeof status !== "number"){
        throw new Error("edge json method requires object and status number")
    }
    let json = new this.#response(JSON.stringify(data),{
        status
    })
    json.headers.append("content-type","application/json")
    return json
    
 }
   /**
  * text
  * @param {string} data -text to send.
  * @param {number} status -status code default 200
  * @returns {object} returns a new response with text.
  */
   text(data,status=200){
    if(!data || data && typeof data !== "string" || status && typeof status !== "number"){
        throw new Error("edge text method requires text and status number")
    }
    let text = new this.#response(data,{
        status
    }) 
    text.headers.append("content-type","text/plain")
    return text
    
 }
  /**
  * html
  * @param {string} data -html to send.
  * @param {number} status -status code default 200
  * @returns {object} returns a new response with html.
  */
  html(data,status=200){
    if(!data || data && typeof data !== "string" || status && typeof status !== "number"){
        throw new Error("edge html method requires html string and status number")
    }
    let html = new this.#response(data,{
        status
    }) 
    html.headers.append("content-type","text/html")
    return html
    
 } 
   /**
  * arraybuffer
  * @param {any} data -data to send.
  * @param {number} status -status code default 200
  * @returns {object} returns a new response with buffer.
  */
   async arrayBuffer(data,status=200){
      if(!data || data && typeof data !== "string" || status && typeof status !== "number"){
          throw new Error("edge arrayBuffer method requires buffer  and status number")
      }
      let buffer =await new this.#response(data,{
          status
      }).arrayBuffer() 
  
      return buffer
      
   } 
    /**
  * blob
  * @param {string} data -blob to send.
  * @param {number} status -status code default 200
  * @returns {object} returns a new response with blob.
  */
    async blob(data,status=200){
      if(!data || data && typeof data !== "string" || status && typeof status !== "number"){
          throw new Error("edge blob method requires blob  and status number")
      }
      let blob =await new this.#response(data,{
          status
      }).blob() 
  
      return blob
      
   } 
    /**
  * bytes
  * @param {string} data -bytes to send.
  * @param {number} status -status code default 200
  * @returns {object} returns a new response with bytes.
  */
    async bytes(data,status=200){
      if(!data || data && typeof data !== "string" || status && typeof status !== "number"){
          throw new Error("edge bytes method requires byte  and status number")
      }
      let bytes =await new this.#response(data,{
          status
      }).bytes() 
  
      return bytes
      
   } 
    /**
  * clone
  * 
  * @returns {object} returns a new response with clone.
  */
    clone(){
    
      return this.#response.prototype.clone()
      
   } 
    /**
  * formdata
  * @param {string} data -data to send.
  * @param {number} status -status code default 200
  * @returns {object} returns a new response with formdata.
  */
    async formData(data,status=200){
      if(!data || data && typeof data !== "string" || status && typeof status !== "number"){
          throw new Error("edge form method requires form  and status number")
      }
      let form =await new this.#response(data,{
          status
      }).formData() 
  
      return form
      
   } 
 
}