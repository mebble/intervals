const ring = {
  init() {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    /* 
    Moved into function since:
      "If an AudioContext is created prior to the document receiving a user 
      gesture, it will be created in the "suspended" state, and you will 
      need to call resume() after a user gesture is received."
      From https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#webaudio
    */
    this.oscillator = audioContext.createOscillator();
    this.gainNode = audioContext.createGain();

    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(audioContext.destination);
    this.oscillator.type = "triangle";
    return audioContext;
  },

  play(freq, numPulses, pulseLen) {
    const audioContext = this.init();
    this.oscillator.frequency.value = freq;

    const imax = 2 * numPulses;
    const startTime = audioContext.currentTime;
    for (let i = 0; i < imax; i++) {
      let gain = Number(i % 2 === 0);
      let time = startTime + i * pulseLen;
      this.gainNode.gain.setValueAtTime(gain, time);
    }

    this.oscillator.start(startTime);
    const duration = 2 * numPulses * pulseLen;
    this.oscillator.stop(startTime + duration);
  },
};

export default ring;
