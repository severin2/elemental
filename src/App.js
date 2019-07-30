import React, { Component } from 'react';
import { Stage, Layer, Circle, Text } from 'react-konva';
import Konva from 'konva';

class Elmt extends React.Component {
  render() {
    const { x, y, color } = this.props;
    return (
      <Circle
        ref={node => {
          this.node = node;
        }}
        x={x}
        y={y}
        radius={30}
        fill={color}
      />
    );
  }
}

class App extends Component {
  constructor() {
    super();

    const viewPortWidth = window.innerWidth;
    const viewPortHeight = window.innerHeight;
    const mapWidth = window.innerWidth * 2;
    const mapHeight = window.innerHeight;
    const elmts = [];

    for (let i = 0; i < 100; i++) {
      elmts.push({
        color: Konva.Util.getRandomColor(),
        x: Math.random() * mapWidth,
        y: Math.random() * mapHeight
      });
    }

    const myElmt = {
      x: mapWidth / 2,
      y: mapHeight / 2,
      color: Konva.Util.getRandomColor()
    };

    elmts.unshift(myElmt);

    this.state = {
      viewPortWidth,
      viewPortHeight,
      mapWidth,
      mapHeight,
      elmts,
      myElmt
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', event => {
      const left = 37;
      const up = 38;
      const right = 39;
      const down = 40;

      const { myElmt } = this.state;

      if (event.key === 'w' || event.keyCode === up) {
        myElmt.y = myElmt.y - 10;
      } else if (event.key === 'a' || event.keyCode === left) {
        myElmt.x = myElmt.x - 10;
      } else if (event.key === 's' || event.keyCode === down) {
        myElmt.y = myElmt.y + 10;
      } else if (event.key === 'd' || event.keyCode === right) {
        myElmt.x = myElmt.x + 10;
      }

      this.setState({ myElmt });

      console.log(`${this.state.x},${this.state.y}`);
    });
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  getXInViewPort(mapX) {
    const {
      viewPortWidth,
    } = this.state;
    return mapX - viewPortWidth / 2
  }

  getYInViewPort(mapY) {
    const {
      viewPortHeight,
    } = this.state;
    return mapY - viewPortHeight / 2
  }

  getElmtsInViewPort() {
    const {
      myElmt,
      elmts,
      viewPortWidth,
      viewPortHeight,
      mapHeight,
      mapWidth
    } = this.state;

    const leftBound = Math.max(0, myElmt.x - viewPortWidth / 2);
    const rightBound = Math.min(mapWidth, myElmt.x + viewPortWidth / 2);

    const topBound = Math.max(0, myElmt.y - viewPortHeight / 2);
    const bottomBound = Math.min(mapHeight, myElmt.y + viewPortHeight / 2);

    return elmts.filter(e => {
      return (
        e.x <= rightBound &&
        e.x >= leftBound &&
        e.y <= bottomBound &&
        e.y >= topBound
      );
    });
  }

  render() {
    const {
      myElmt,
      elmts,
      viewPortWidth,
      viewPortHeight,
      mapHeight,
      mapWidth
    } = this.state;

    const elmtsInViewPort = this.getElmtsInViewPort(elmts);
    return (
      <Stage width={mapWidth} height={mapHeight}>
        <Layer>
          {elmtsInViewPort.map((elmt, i) => (
            <Elmt
              key={i}
              x={elmt.x - viewPortWidth / 2}
              y={elmt.y - viewPortHeight / 2}
              color={elmt.color}
            />
          ))}
          <Elmt
              x={viewPortWidth / 2}
              y={viewPortHeight / 2}
              color={myElmt.color} />

          <Text x={0} y={0} text="0,0" />

          <Text x={viewPortWidth} y={viewPortHeight} text={viewPortWidth + ',' + viewPortHeight} />
          <Text x={0} y={viewPortHeight} text={0 + ',' + viewPortHeight} />
          <Text x={viewPortWidth} y={0} text={viewPortWidth + ',' + 0} />

          <Text x={mapWidth} y={mapHeight} text={mapWidth + ',' + mapHeight} />
          <Text x={0} y={mapHeight} text={0 + ',' + mapHeight} />
          <Text x={mapWidth} y={0} text={mapHeight + ',' + 0} />

        </Layer>
      </Stage>
    );
  }
}

export default App;
