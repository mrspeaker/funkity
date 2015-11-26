import Component from "./Component";

class SineX extends Component {

  static deps = ["Position"];
  static propTypes = {
    freq: "Number",
    amp: "Number"
  };

  constructor (freq = 0.4, amp = 2) {
    super();
    this.freq = freq;
    this.amp = amp;
    this.time = 0;
  }

  update (dt) {
    this.time += dt;
    this.deps.Position.x += Math.sin(this.time / this.freq) * this.amp;
  }

}

export default SineX;
