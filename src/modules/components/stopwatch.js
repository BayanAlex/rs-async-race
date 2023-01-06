export default class Stopwatch extends HTMLElement {
  value = 0;

  connectedCallback() {
    this.setAttribute('state', 'reset');
    this.reset();
    this.render();
  }

  static get observedAttributes() {
    return ['state'];
  }

  reset() {
    this.value = 0;
  }

  stopTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      delete this.timerId;
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'state') {
      switch (newValue) {
        case 'reset':
          this.stopTimer();
          this.reset();
          break;
        case 'run':
          this.timerId = setInterval(() => {
            this.value += 1;
            this.render();
          }, 10);
          break;
        case 'stop':
          this.stopTimer();
          break;
        default:
      }
    }
    this.render();
  }

  render() {
    const result = (`000${this.value}`).split('');
    result.splice(-2, 0, '.');
    this.innerHTML = result.slice(-5).join('');
  }
}
