import Component from './Component';

class Position extends Component {

  constructor (x = 0, y = 0) {
    super();
    this.name = "Position";
    this.x = x;
    this.y = y;
  }

}

export default Position;
