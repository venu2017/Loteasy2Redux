import { Injectable } from '@angular/core';
import * as S3 from 'aws-sdk/clients/s3';
 
@Injectable()
export class UploadFileService {
 
  FOLDER = 's3-user/';
 
  constructor() { }
 
  uploadfile(file) {
    console.log(file);
    const bucket = new S3(
      {
        accessKeyId: 'AKIAIZAAARUMWWGIYYMA',
        secretAccessKey: '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',
        region: 'ap-south-1'
      }
    );
 
    const params = {
      Bucket: 'loteasy-s3-bucket',
      Key: this.FOLDER + file.name,
      Body: file
    };
 
    bucket.upload(params, (err, data)=> {
      if (err) {
        console.log('There was an error uploading your file: ', err);
        return false;
      }
 
      console.log('Successfully uploaded file.', data);
      return data;
    });
  }
 
}