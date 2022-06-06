attribute vec2 a_position;

uniform vec2 u_resolution;

varying vec3 v_color;
varying vec2 v_resolution;
varying vec2 v_clipSpace;

void main() {
    // Convert pixels to clip space
    vec2 zeroToOne = a_position / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = (zeroToTwo - 1.0) * vec2(1, -1);

    v_resolution = u_resolution;
    v_color = vec3(1, 0.8, 0);
    v_clipSpace = clipSpace;
    
    gl_Position = vec4(clipSpace, 0, 1);
}