import Mouse from "./controls/Mouse";
import Keys from "./controls/Keys";
import Entities from "./entities/Entities";
import Entity from "./entities/Entity";
import Env from "./Env";

class Game {

  _resetGame = false;
  _resetDoesReload = true;

  entities;
  entitiesToAdd;
  startFunctions;
  startFunctionsToAdd;

  entityId = 1;
  lastTime = 0;

  constructor (container) {
    Env.game = this;

    this.container = container;
    this.entities = [];
    this.tick = this.tick.bind(this);
  }

  init (gameData) {
    this.gameData = gameData;

    this._reset();
    Keys.init();
    Mouse.init();
    Env.game.container.focus();
  }

  reset (reload = true) {
    this._resetGame = true;
    this._resetDoesReload = reload;
  }
  _reset () {
    // Remove all entities and components
    this.entities = this.entities.filter(e => {
      e.components = e.components.filter(c => {
        e.removeComponent(c);
        return false;
      });
      return false;
    });

    this.entitiesToAdd = [];
    this.startFunctions = [];
    this.startFunctionsToAdd = [];
    this.lastTime = 0;
    this.entityId = 1;

    if (this._resetDoesReload) {
      this.loadScene(this.gameData);
    }
  }

  loadScene (data) {
    data.entities
      .map(data => Entities.make(data))
      .map(e => this.addEntity(e));
  }

  getPrefabByName (name) {
    const data = this.gameData.entities.find(e => e.name === name);
    const entity = Entities.make(data);
    return entity;
  }

  addPrefabByName (name) {
    return this.addEntity(this.getPrefabByName(name));
  }

  start () {
    requestAnimationFrame(this.tick);
  }

  tick (time) {
    const dt = this.lastTime ? time - this.lastTime : 1000 / 60;
    this.lastTime = time;

    this.update(dt);

    requestAnimationFrame(this.tick);
  }

  update (dt) {
    dt /= 1000; // Let's work in seconds.

    // Add any new entities
    this.entitiesToAdd = this.entitiesToAdd.filter(e => {
      this.entities.push(e);
      return false;
    });

    this.runStartFunctions();

    // Update all entity's components
    this.entities.forEach(e => {
      e.components.forEach(c => {
        c.update(dt);
      });
    });

    this.checkCollisions();
    this.updatePost(dt);

  }

  // Just visual refresh, for editor.
  updateRenderOnly (dt) {

    // Do any Entity adds
    this.entitiesToAdd = this.entitiesToAdd.filter(e => {
      this.entities.push(e);
      return false;
    });

    this.runStartFunctions();

    // Don't know a nice way to do this... mark render-only components somehow?
    this.entities.forEach(e => {
      e.components.forEach(c => {
        if (c.name.indexOf("enderer") > -1) {
          c.update(dt);
        }
      });
    });

    this.updatePost(dt);
  }

  updatePost (dt) {
    Keys.update(dt);
    Mouse.update(dt);

    // Do any entity removal
    this.entities = this.entities.filter(e => {
      if (!e.remove) {
        return true;
      }
      // Remove the components
      e.components = e.components.filter(c => {
        e.removeComponent(c);
        return false;
      });
      return false;
    });

    if (this._resetGame) {
      this._resetGame = false;
      this._reset();
    }
  }

  runStartFunctions () {
    this.startFunctions = this.startFunctionsToAdd.slice();
    this.startFunctionsToAdd = []; // start functions can add new start functions

    // Execute component Start functions.
    this.startFunctions = this.startFunctions.filter(f => {
      f();
      return false;
    });
  }

  checkCollisions () {
    // TODO: smarter collisions. Collision layers
    // Naive collisions... check everything, tell everyone.
    for (let i = 0; i < this.entities.length - 1; i++) {
      const a = this.entities[i];
      const aPos = a.getComponent("Position");
      for (let j = i + 1; j < this.entities.length; j++) {
        const b = this.entities[j];
        const bPos = b.getComponent("Position");
        if (aPos.x + aPos.w >= bPos.x &&
          aPos.x <= bPos.x + bPos.w &&
          aPos.y + aPos.h >= bPos.y &&
          aPos.y <= bPos.y + bPos.h) {
          a.components.forEach(c => {
            c.onCollision(b);
          });
          b.components.forEach(c => {
            c.onCollision(a);
          });
        }
      }
    }
  }

  addStartFunction (f) {
    this.startFunctionsToAdd.push(f);
  }

  spawn (e, x, y) {
    const ent = this.addEntity(Entities.instanciate(e));
    if (x !== null) {
      const pos = ent.getComponent("Position");
      pos.x = x;
      pos.y = y;
    }
    return ent;
  }

  addEntity (e) {
    if (!e.id) {
      e.id = this.entityId++;
    }
    const sameName = this.entities.find(e2 => e2.name === e.name);
    if (sameName) {
      e.name += "-" + e.id;
    }
    this.entitiesToAdd.push(e);
    return e;
  }

  addBlankEntity () {
    // Should use helper method / data style. Always force this?
    const e = new Entity("entity", 50, 50, 69, 71, 5);
    Entities.addComponent(e, ["Renderer", "", "p3_duck.png"]);
    return this.addEntity(e);
  }

  removeEntity (entity) {
    entity.remove = true;
  }

  getEntityByName (name) {
    return this.entities.find(e => e.name === name);
  }

}

export default Game;
