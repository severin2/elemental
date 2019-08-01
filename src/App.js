import React, { Component } from 'react';
import { Stage, Layer, Circle, Text, Group, Label } from 'react-konva';
import Konva from 'konva';

class Elmt extends React.Component {
  render() {
    const { label, x, y, color } = this.props;
    return (
      <Group x={x} y={y}>
        <Circle
          ref={node => {
            this.node = node;
          }}
          radius={30}
          fill={color}
        />
        <Text text={label} />
      </Group>
    );
  }
}

class App extends Component {
  constructor() {
    super();

    const viewPortWidth = window.innerWidth;
    const viewPortHeight = window.innerHeight;

    // dont let the map be smaller than the viewport...
    const mapWidth = viewPortWidth * 2;
    const mapHeight = viewPortHeight * 2;

    const originX = mapWidth / 2 - (viewPortWidth / 2);
    const originY = mapHeight / 2 - (viewPortHeight / 2);
    const viewPortOrigin = { x: originX, y: originY };

    const elmts = [];

    // elmt positions are map positions
    for (let i = 0; i < 100; i++) {
      elmts.push({
        label: i,
        color: Konva.Util.getRandomColor(),
        x: Math.random() * mapWidth,
        y: Math.random() * mapHeight
      });
    }

    // start my element in the center
    const myElmt = {
      x: mapWidth / 2,
      y: mapHeight / 2,
      color: Konva.Util.getRandomColor(),
      label: 'me'
    };

    this.state = {
      viewPortOrigin,
      viewPortWidth,
      viewPortHeight,
      mapWidth,
      mapHeight,
      elmts,
      myElmt
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  handleKeyDown(event) {
    const left = 37;
    const up = 38;
    const right = 39;
    const down = 40;

    const { viewPortOrigin, mapWidth, mapHeight } = this.state;

    if (event.key === 'w' || event.keyCode === up) {
      viewPortOrigin.y = Math.max(0, viewPortOrigin.y - 10);
    } else if (event.key === 'a' || event.keyCode === left) {
      viewPortOrigin.x = Math.max(0, viewPortOrigin.x - 10);
    } else if (event.key === 's' || event.keyCode === down) {
      viewPortOrigin.y = Math.min(mapHeight, viewPortOrigin.y + 10);
    } else if (event.key === 'd' || event.keyCode === right) {
      viewPortOrigin.x = Math.min(mapWidth, viewPortOrigin.x + 10);
    }

    this.setState({ viewPortOrigin });
  }

  // TODO correct position relative to this origin?
  getPositionInViewPort(mapX, mapY) {
    const { viewPortWidth, viewPortHeight } = this.state;
    return {
      relativeX: Math.max(0, mapX - viewPortWidth / 2),
      relativeY: Math.max(0, mapY - viewPortHeight / 2)
    };
  }

  getViewPortBounds() {
    const {
      mapWidth,
      mapHeight,
      viewPortOrigin,
      viewPortWidth,
      viewPortHeight
    } = this.state;

    const left = viewPortOrigin.x
    const right = Math.min(mapWidth, viewPortOrigin.x + viewPortWidth);

    const top = viewPortOrigin.y
    const bottom = Math.min(mapHeight, viewPortOrigin.y + viewPortHeight);

    return {
      left,
      right,
      top,
      bottom
    };
  }

  isInViewport(x, y) {
    const { left, right, top, bottom } = this.getViewPortBounds();
    return x >= left && x <= right && y >= top && y <= bottom;
  }

  getElmtsInViewPort() {
    const { elmts } = this.state;
    return elmts.filter(e => this.isInViewport(e.x, e.y));
  }

  render() {
    const { myElmt, elmts, viewPortWidth, viewPortHeight } = this.state;

    const elmtsInViewPort = this.getElmtsInViewPort(elmts);
    return (
      <Stage width={viewPortWidth} height={viewPortHeight}>
        <Layer>
          {elmtsInViewPort
            .filter(elmt => this.isInViewport(elmt.x, elmt.y))
            .map((elmt, i) => {
              const { relativeX, relativeY } = this.getPositionInViewPort(
                elmt.x,
                elmt.y
              );
              return (
                <Elmt
                  key={i}
                  label={elmt.label + ' ' + relativeX + ',' + relativeY}
                  x={relativeX}
                  y={relativeY}
                  color={elmt.color}
                />
              );
            })}
            <Elmt
              label={myElmt.label}
              x={viewPortWidth / 2}
              y={viewPortHeight / 2}
              color={myElmt.color}
            />
        </Layer>
      </Stage>
    );
  }
}

export default App;
