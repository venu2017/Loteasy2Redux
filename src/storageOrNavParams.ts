 //get and set local storage values and get nav paramas using NavParams Obj.
 import { Injectable } from '@angular/core';

 abstract class AbstractBehaviourStrategy {
   abstract storageOrNavParams(names:string[], behaviourObj:any, typeOfBehaviour:string, actionType:any);
}

@Injectable()
export class ConcreteBehaviourStrategy implements AbstractBehaviourStrategy {
  async  storageOrNavParams(names:string[], behaviourObj:any, typeOfBehaviour:any,actionType:any) {
    let returnValues = [];
       switch(typeOfBehaviour){
           case BehaviourTypes.navParams:
          
           for(let i=0;i<names.length;i++){
               returnValues.push(behaviourObj.get(names[i]))
           }
          return returnValues;
          case BehaviourTypes.localSrorage:
          for(let i=0;i<names.length;i++){
              if(actionType== typeOfAction.get){
                returnValues.push(await behaviourObj.get(names[i]))
              }else{
                  returnValues.push(await behaviourObj.set(names[i]))
              }
           
          }

          return returnValues;
       }

       
       
    }
   
}

 enum BehaviourTypes{
    navParams ,
    localSrorage
}

enum typeOfAction{
    get,
    set
}