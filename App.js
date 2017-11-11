import React, { Component } from "react";
import { StatusBar, Dimensions } from "react-native";
import { GameEngine } from "react-native-game-engine";
import { Physics, CreateBox, MoveBox } from "./systems";
import { Box, Ball } from "./renderers";
import Matter from "matter-js";

const key = {
  1: 'target',
  2: 'square',
  3: 'triangle1',
  4: 'triangle2',
  5: 'triangle3',
  6: 'triangle4',
};

function generateRandomLayer() {
  let layer = [null, null, null, null, null, null, null, null, null];

  // generate target
  layer[Math.floor(Math.random() * 9)] = 1;

  // generate remaining spaces
  layer = layer.map(cell => {
    if (!cell) {
      const randomNumber = Math.ceil(Math.random() * 100);
      if (randomNumber <= 50) {
        return cell;
      } else if (randomNumber <= 80) {
        return 2;
      } else if (randomNumber <= 85) {
        return 3;
      } else if (randomNumber <= 90) {
        return 4;
      } else if (randomNumber <= 95) {
        return 5;
      } else if (randomNumber <= 100) {
        return 6;
      }
    }
    return cell;
  });

  return layer;
}

Matter.Common.isElement = () => false; //-- Overriding this function because the original references HTMLElement

export default class RigidBodies extends Component {
  constructor() {
    super();

    state = {
      board: []
    }
  }

  render() {
    const { width, height } = Dimensions.get("window");
    const boxSize = Math.trunc(Math.max(width, height) * 0.05);

    const engine = Matter.Engine.create({ enableSleeping: false });
    engine.world.gravity.y = 0;
    const world = engine.world;
    const body = Matter.Bodies.circle(width / 2, 200, boxSize / 2, {
      frictionAir: 0,
      friction: 0,
      frictionStatic: 0,
      restitution: 1,
      inertia: Infinity,
      inverseInertia: 1 / Infinity,
    });

    const leftWall = Matter.Bodies.rectangle(boxSize / 2, height / 2, boxSize, height,  { isStatic: true, restitution: 1 });
    const rightWall = Matter.Bodies.rectangle(width - (boxSize / 2), height / 2, boxSize, height,  { isStatic: true, restitution: 1 });
    const topWall = Matter.Bodies.rectangle(width / 2, boxSize / 2, width, boxSize,  { isStatic: true, restitution: 1 });
    const bottomWall = Matter.Bodies.rectangle(width / 2, height - (boxSize / 2), width, boxSize,  { isStatic: true, restitution: 1 });

    const constraint = Matter.Constraint.create({
      label: "Drag Constraint",
      pointA: { x: 0, y: 0 },
      pointB: { x: 0, y: 0 },
      length: 0.01,
      stiffness: 0.1,
      angularStiffness: 1
    });

    Matter.World.add(world, [body, leftWall, rightWall, topWall, bottomWall]);
    Matter.World.addConstraint(world, constraint);

    return (
      <GameEngine
        systems={[Physics, CreateBox, MoveBox]}
        entities={{
          physics: { engine: engine, world: world, constraint: constraint },
          ball: { body: body, size: [boxSize, boxSize], color: "pink", renderer: Ball },
          leftWall: { body: leftWall, size: [boxSize, height], color: "#c2c7c5", renderer: Box },
          rightWall: { body: rightWall, size: [boxSize, height], color: "#c2c7c5", renderer: Box },
          topWall: { body: topWall, size: [width, boxSize], color: "#c2c7c5", renderer: Box },
          bottomWall: { body: bottomWall, size: [width, boxSize], color: "#c2c7c5", renderer: Box },
        }}
      >

        <StatusBar hidden={true} />

      </GameEngine>
    );
  }
}
