precision mediump float;

varying vec2 v_resolution;
varying vec2 v_clipSpace;
varying vec3 v_color;

void main() {
    gl_FragColor = vec4(v_color, 1.0);
}