class Ring {
    constructor(context) {
        this.context = context;
    }

    init() {
        this.oscillator = this.context.createOscillator();
        this.gainNode = this.context.createGain();

        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(this.context.destination);
        this.oscillator.type = 'sine';
    }

    play(freq, numPulses, pulseLen) {
        this.init();
        this.oscillator.frequency.value = freq;

        const imax = 2 * numPulses;
        const startTime = this.context.currentTime;
        for (let i = 0; i < imax; i++) {
            let gain = Number(i % 2 === 0);
            let time = startTime + i * pulseLen;
            this.gainNode.gain.setValueAtTime(gain, time);
        }

        this.oscillator.start(startTime);
        this.stop(startTime, 2 * numPulses * pulseLen);
    }

    stop(startTime, duration) {
        this.oscillator.stop(startTime + duration);
    }
}

export default Ring;
