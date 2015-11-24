import Position from '../components/Position';
import Renderer from '../components/Renderer';
import theGame from "../theGame";

class Entity {

  constructor (name, x = 0, y = 0) {
    this.name = name;
    this.components = [];

    // I'm adding Position by default... not sure that's a good idea.
    // not all enitties need a position (but it could be good for displaying
    // in a game editor)
    this.addComponent(new Position(x, y));

    this.remove = false;
  }

  addComponent (comp) {
    this.components.push(comp);
    comp.entity = this; // Add reference to the component's entity

    // If there are start methods on the comp, add it to be run next tick.
    if (comp.start) {
      theGame.addStart(comp.start.bind(comp));
    }
    
    return comp;
  }

  removeComponent (comp) {
    comp.remove && comp.remove();
    comp.entity = null;
    this.components = this.components.filter(c => c !== comp);
  }

  getComponent (name) {
    return this.components.find(c => c.name === name);
  }

}

export default Entity;
