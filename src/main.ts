import './style.css'

import Renderer from './renderer';

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;
const gl = canvas.getContext("webgl2");

if (gl) {
  const renderer = new Renderer(gl);
}