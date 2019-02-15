  namespace paramsSingleton{
    export   let appSingleton = 
         {
            
            "getNavParamVal":async(params:any[],navParamSingleton:any)=>{
                let paramValues = [];
                params.forEach(param=>{
                paramValues.push(Promise.resolve(navParamSingleton.get(param)));
                })
                return await Promise.all(paramValues);
            },
            "getLocalStorageVal":async(params:any[],storageSingleton:any)=>{
                let paramValues = [];
                params.forEach(async param=>{
                    paramValues.push(await storageSingleton.get(param))
                })

                return await paramValues;
            },
            "setLocalStorageVal":async(param:any,val:any,storageSingleton:any)=>{
              await storageSingleton.set(param,val);
            }
        }
    

}


export default paramsSingleton;