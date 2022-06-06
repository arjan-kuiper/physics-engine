attribute vec2 a_position;
attribute float a_radius;
attribute vec3 a_color;

uniform vec2 u_resolution;

varying vec2 v_resolution;
varying vec2 v_clipSpace;
varying vec3 v_color;

void main() {
    // Convert pixels to clip space
    vec2 zeroToOne = a_position / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = (zeroToTwo - 1.0) * vec2(1, -1);

    v_resolution = u_resolution;
    v_clipSpace = clipSpace;
    v_color = a_color;
    
    gl_Position = vec4(clipSpace, 0, 1);
    gl_PointSize = a_radius;
}