export class Timer {

    constructor() {
    }

    #time = 0;

    setTime(_time) {
        this.#time = Number(_time);
        this.refreshUI();
    }

    getTime() {
        return this.#time;
    }

    #func;

    setFunc(_func) {
        this.#func = _func;
    }

    #interval;

    start() {
        return new Promise((resolve, reject) => {
            clearInterval(this.#interval);
            this.#interval = setInterval(() => {
                if (this.#time <= 0) {
                    this.#time = 0;
                    resolve();
                }
                this.#func();
                this.refreshUI();
                this.#time -= 1;
            }, 1000);
        });
    }

    stop() {
        clearInterval(this.#interval);
    }

    #timerP;

    setTimerP(_timerP) {
        this.#timerP = _timerP;
        this.refreshUI();
    }

    refreshUI() {
        this.#timerP.innerText = `${this.#time}초`;
        this.#timerP.style.background = 'linear-gradient(to right, rgb(190, 240, 190) 0%, rgb(190, 240, 190) '+this.#time +'%, #fff ' + this.#time + '%, white 100%)';
    }
}