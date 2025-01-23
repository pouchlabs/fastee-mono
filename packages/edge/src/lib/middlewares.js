export async function LoadGlobalWares(instance,request){
 // for(var a = 0; a < instance.wares.length; ++a ){
  let l = instance.wares.length;
  let i = 0;
  while (i < l) {
 // for(var f in instance.wares){
      let  fn = instance.wares[i++];
       let resp = await fn(request);
       if(resp && resp instanceof Response){
          //response
          return resp
        }
    }
}
