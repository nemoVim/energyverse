export class Timer {

    #index;

    constructor(_index) {
        // this.#index = _index;
        this.initUI();
        this.refreshUI();
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

    #timerDiv;
    #timeSlider;
    #timeP;

    initUI() {
        this.#timerDiv = document.createElement('div');

        this.#timeSlider = document.createElement('input');
        this.#timeSlider.setAttribute('type', 'range');
        this.#timeSlider.setAttribute('min', 0);
        this.#timeSlider.setAttribute('max', 90);
        this.#timeSlider.setAttribute('step', 1);
        this.#timeSlider.disabled = true;

        this.#timeP = document.createElement('p');

        this.#timerDiv.append(this.#timeSlider);
        this.#timerDiv.append(this.#timeP);
    }

    refreshUI() {
        this.#timeSlider.value = this.#time;
        this.#timeP.innerText = `${this.#time}초`;
    }

    getUI() {
        return this.#timerDiv;
    }


}