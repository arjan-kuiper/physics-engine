import './style.css'

import Renderer from './renderer';
import { Circle } from './shapes';

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;
const gl = canvas.getContext("webgl2");

if (gl) {
  const renderer = new Renderer(gl);
  const shapes: Circle[] = [];
  
  for (let i = 0; i < 10; i++) {
    const c = new Circle(Math.random() * 500, Math.random() * 200, 20);
    shapes.push(c);
    renderer.addShape(c);
  }

  function loop(time: number) {
    requestAnimationFrame(loop);

    for (let i = 0; i < shapes.length; i++) {
      shapes[i].calculatePosition();
    }

    renderer.update(0);
  }

  loop(0);
}