import { Injectable } from "@angular/core";


@Injectable()
export class CloudinaryImageService{
    CLOUD_NAME:string = "venu2017";
    CLOUDINARY_URL:string = `https://api.cloudinary.com/v1_1/${this.CLOUD_NAME}/upload`;
    
    CLOUD_UPLOAD_PRESET:string= "eraezukw";
     uploadImage(file):Promise<any> {

        return new Promise((resolve,reject)=>{
       let xhr = new XMLHttpRequest();
        let fd = new FormData();
        xhr.open('POST', this.CLOUDINARY_URL, true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.onreadystatechange = (e) =>{
          if (xhr.readyState == 4 && xhr.status == 200) {
            // File uploaded successfully
            
            resolve(xhr.responseText);
            // https://res.cloudinary.com/cloudName/image/upload/v1483481128/public_id.jpg
            // let url = response.secure_url;
            // Create a thumbnail of the uploaded image, with 150px width
            // let tokens = url.split('/');
            // tokens.splice(-2, 0, 'w_150,c_scale');
            // let img = new Image(); // HTML5 Constructor
            // img.src = tokens.join('/');
            // img.alt = response.public_id;      
            // document.body.appendChild(img);
          }else{
              reject(new Error("Error occured while uploading imagt to cloudinary, xhr.readyState: " + xhr.readyState + ",xhr.status: " + xhr.status));
          }
        };
      
        fd.append('upload_preset', this.CLOUD_UPLOAD_PRESET);
        // fd.append('tags', 'browser_upload'); // Optional - add tag for image admin in Cloudinary
        fd.append('file', file);
        xhr.send(fd);
        

    }) //<--end of promise-->

      }

      fetchImage(){
          
      }
      
}