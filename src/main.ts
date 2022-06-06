import './style.css'

import Renderer from './renderer';
import { Circle } from './shapes';

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;
const gl = canvas.getContext("webgl2");

if (gl) {
  const renderer = new Renderer(gl);
  const circle1 = new Circle(250, 250, 10);
  const circle2 = new Circle(400, 400, 20);

  renderer.addShape(circle1);
  renderer.addShape(circle2);

  function loop() {
    // requestAnimationFrame(loop);

    circle1.calculatePosition();
    circle2.calculatePosition();
  
    renderer.update();
  }

  loop();
}