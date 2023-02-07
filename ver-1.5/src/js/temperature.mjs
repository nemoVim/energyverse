export class Temperature {

    static initialTemp = 15;

    #temp;

    constructor() {
        this.#temp = Temperature.initialTemp;
    }

    setTemp(_temp) {
        this.#temp = Number(Number(_temp).toFixed(2));
    }

    getTemp() {
        return this.#temp;
    }

    modifyTemp(delta) {
        this.#temp += Number(delta);
        this.#temp = Number((this.#temp).toFixed(2));
    }

    isEnd() {
        if (this.#temp <= 14 || this.#temp >= 21) {
            return true;
        } else {
            return false;
        }
    }
}