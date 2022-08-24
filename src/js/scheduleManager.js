export default class ScheduleManager {
  #timerId;
  #func;
  #second;
  constructor(intervalFunc, second) {
    this.#timerId = 0;
    this.#func = intervalFunc;
    this.#second = second;
  }

  begin() {
    this.#timerId = setInterval(this.#func, this.#second * 1000);
  }

  end() {
    clearInterval(this.#timerId);
  }

  reset() {
    this.end();
    this.begin();
  }
}
