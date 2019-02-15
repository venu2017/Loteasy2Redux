namespace locationSingleton{
    export let locationSingleton = {
   
        "reverseGeocode":async(geolocSingleton:any,google:any):Promise<any>=>{
            let options = {enableHighAccuracy:true};
            let res = await geolocSingleton.getCurrentPosition(options);
            let latlng = {lat:res.coords.latitude,lng:res.coords.longitude}
            console.log(latlng);
            let geocoder = new google.maps.Geocoder;
            let geocoded = new Promise((resolve,reject)=>{
                geocoder.geocode({'location':latlng},(result,status)=>{
                    resolve(result);
              });
            })
           return  geocoded;
        },
        "addressFormatter":(geocoded:any)=>{
            let formattedAddress = geocoded[0].formatted_address;
            let city = geocoded[0].address_components[4].long_name;
            let addressOne = geocoded[0].address_components[1].long_name +','
            + geocoded[0].address_components[0].long_name;
            let addressTwo = geocoded[0].address_components[2].long_name; 
            return {formattedAddress:formattedAddress,city:city,addressOne:addressOne,addressTwo:addressTwo};
        }
    }
}

export default locationSingleton;