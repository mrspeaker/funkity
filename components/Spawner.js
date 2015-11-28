import Component from "./Component";
import Env from "../Env";

class Spawner extends Component {

  static deps = ["Position"];
  static propTypes = {
    enabled: "Boolean",
    prefab: "Instance",
    rate: "Number",
    xRange: "Number",
    yRange: "Number"
  };

  enabled = true;
  time = 0;

  constructor (prefab, rate = 2, xRange = 0, yRange = 0) {
    super();
    this.prefabName = prefab;
    this.rate = rate;
    this.xRange = xRange;
    this.yRange = yRange;
  }

  start () {
    super.start();
    this.prefab = Env.game.getPrefabByName(this.prefabName); //Env.game.getEntityByName(this.prefabName);
  }

  update (dt) {
    if (!this.enabled) { return; }

    this.time += dt;
    if (this.time > this.rate) {
      this.time -= this.rate;
      const {x, y, w, h} = this.deps.Position;
      const e = Env.game.spawn(this.prefab);
      // Set the new position near the spawner
      const pos = e.getComponent("Position");
      const xo = Math.random() * w;
      const yo = Math.random() * h;
      pos.x = x + xo - (pos.w / 2);
      pos.y = y + yo - (pos.h / 2);
    }
  }
}

export default Spawner;
