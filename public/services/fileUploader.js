'use strict';

import { componentSelector } from "/services/componentSelector.js";

class FileUploader {

  constructor() {

    this.ref = firebase.storage();

  }

  uploadFile(file, ref) {

    // Create a new promise
    return new Promise((resolve, reject)=>{
      
      // Create a root reference
      var storageRef = firebase.storage().ref();

      // Create a reference to 'track-x.mp3'
      var fileRef = storageRef.child('tracks/track-' + ref + '.mp3');
      
      // Upload file to ref
      var uploadTask = fileRef.put(file);

      uploadTask.then(snapshot => {

        // Get download URL of file
        snapshot.ref.getDownloadURL()

          .then(downloadURL => {
            resolve(downloadURL);
          })

          .catch(error => {
            reject(error);
          });

      });

      uploadTask.catch(error => {
        reject(error);
      });

      uploadTask.on('state_changed', snapshot => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      });  
          
    });
    
  }

}

export let fileUploader = new FileUploader();