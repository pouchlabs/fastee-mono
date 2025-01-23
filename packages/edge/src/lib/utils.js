export var checktype = (function(global) {
    var cache = {}; 
    return function(obj) {
        var key;
        return obj === null ? 'null' // null
            : obj === global ? 'global' // window in browser or global in nodejs
            : (key = typeof obj) !== 'object' ? key // basic: string, boolean, number, undefined, function
            : obj.nodeType ? 'object' // DOM element
            : cache[key = ({}).toString.call(obj)] // cached. date, regexp, error, object, array, math
            || (cache[key] = key.slice(8, -1).toLowerCase()); // get XXXX from [object XXXX], and cache it
    };
  }(this));
  
 export function bytesForHuman(bytes, decimals = 2) {
    let units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB','EB', 'ZB', 'YB']
    let i = 0
    for (i; bytes > 1024; i++) {
        bytes /= 1024;
    }
    return parseFloat(bytes.toFixed(decimals)) + ' ' + units[i]
  }


  //unique method
  function uniqueDeepArr(arr){
    const arrUniq = [...new Map(arr.slice().map(v => [v.id, v])).values()]//.reverse()
       const map = new Map()
       let deeparr = [];
       for(let i in arrUniq){
       
         for(let d in arrUniq[i]){
          
            map.set(d,arrUniq[i][d])
            if(checktype(map.get(d))=== checktype([])){
              let unique = [];

              //objects
              let obarr = [];
              let sarr = [];
              let narr = [];
            //loop props
             for(let val of map.get(d)){
               if(checktype(val) === checktype({})){
                obarr.push(val)
               }
               if(checktype(val)=== "string"){
                sarr.push(val)
               }
               if(checktype(val)=== "number"){
                narr.push(val)
               }
             }
                  //objects
                for(let f of uniqueDeepArr(obarr)){
                  unique.push(f)
                 }
                 //strings
                 for(let f of removeDuplicate(sarr)){
                   unique.push(f)
                 }
                  //numbers
                  for(let f of removeDuplicate(narr)){
                    unique.push(f)
                  } //the other way
            
                //concurent
              map.set(d,unique)
               deeparr.push(Object.fromEntries(map))
            }else{
              deeparr.push(Object.fromEntries(map))
            }
         }
       }
     
    
      return [...new Map(deeparr.slice().map(v => [v.id, v])).values()]
           
}


function removeDuplicate(array) {
return [...new Set(array.map(s => JSON.stringify(s)))]
  .map(s => JSON.parse(s));
}
export function uniqueArr(arr){
  let unique = [];

  //objects
  let obarr = [];
  let sarr = [];
  let narr = [];
//loop props
 for(let val of arr){
   if(checktype(val) === checktype({})){
    obarr.push(val)
   }
   if(checktype(val)=== "string"){
    sarr.push(val)
   }
   if(checktype(val)=== "number"){
    narr.push(val)
   }
 }
      //objects
    for(let f of uniqueDeepArr(obarr)){
      unique.push(f)
     }
     //strings
     for(let f of removeDuplicate(sarr)){
       unique.push(f)
     }
      //numbers
      for(let f of removeDuplicate(narr)){
        unique.push(f)
      }
   
     return unique
    }
   
    
