'use strict';

class AudioLoader {

  constructor(context, urlList, callback) {
    this.context    = context;
    this.urlList    = urlList;
    this.onload     = callback;
    this.bufferList = new Array();
    this.idList     = new Array();
    this.loadCount  = 0;
  }

  loadBuffer(url, index) {
  
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";

    var loader = this;

    request.onload = function() {
    
      // Asynchronously decode the audio file data in request.response
      loader.context.decodeAudioData(
        request.response,
        function(buffer) {

          if (!buffer) {
            alert('error decoding file data: ' + url);
            return;
          }
          
          loader.bufferList[index] = buffer;
          
          if (++loader.loadCount == loader.urlList.length)

            // Send bufferList (<- TODO: needed?) and ID list on finish
            loader.onload(loader.bufferList, loader.idList);
        
        },
        
        function(error) {
          console.error('decodeAudioData error', error);
        }
      
      );
    }

    request.onerror = function() {
      alert('BufferLoader: XHR error');
    }

    request.send();
  }

  load() {
    if(this.urlList) {
      for (var i = 0; i < this.urlList.length; ++i) {

        // Load track by sending url and ID
        this.loadBuffer(this.urlList[i].url, this.urlList[i].id);

        // Add ID to list for activating the right tile
        this.idList.push(this.urlList[i].id);
      }
    }
  }
  
}

export let audioLoader = AudioLoader;