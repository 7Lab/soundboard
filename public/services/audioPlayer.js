'use strict';

import { storageHandler } from "/services/storageHandler.js";
import { audioLoader } from "/services/audioLoader.js";
import { componentSelector } from "/services/componentSelector.js";

let audioContext,
    tracks_buffer,
    source,
    audioLoading;

class AudioPlayer {

  constructor() {

    this.storage  = storageHandler;

    // Listen to page change to fetch new data
    document.addEventListener("pageChangeEvent", e => {

      // Get all pads
      let pads = componentSelector.find('pad-render');

      // Loop through padds, disable and change class
      for (var i = pads.length - 1; i >= 0; i--) {
        pads[i].toggleLoading('off');
      }

    });

  }

  // Preload audio and store in browser cache
  // for quick play
  preloadAudio() {

    // Load all tracks
    this.storage.getData('tracks')
      .then(data => {

        audioContext = new (window.AudioContext || window.webkitAudioContext)();

            this.audioLoading = new audioLoader(audioContext, data, this.finishedLoading);
            this.audioLoading.load();

        return audioContext;

      })
      .catch(error => console.log(error));

  }

  // Called when audioLoader is ready
  // Set event listners and remove loading class
  finishedLoading(bufferList, idList) {

    // Create custom event
    var finishedLoadingEvent = new CustomEvent('finishedLoadingEvent', {
      detail: {
        listOfIds: idList
      },
      bubbles: false,
      cancelable: false
    });

    // Dispatch the event
    document.dispatchEvent(finishedLoadingEvent);

    tracks_buffer = bufferList;
  }

  // Mount play and pause function
  playSound(index, time, volume) {

    source        = audioContext.createBufferSource();
    var gainNode  = audioContext.createGain();

    source.buffer = tracks_buffer[index];
    source.connect(gainNode);

    // Connect gain node to destination
    gainNode.connect(audioContext.destination);
    var fraction  = parseInt(volume) / parseInt(100);
    
    gainNode.gain.value = fraction * fraction;

    source.start(time);
  }

  stopSound() {
    source.stop(0);
  }

}

export let audioPlayer = new AudioPlayer();