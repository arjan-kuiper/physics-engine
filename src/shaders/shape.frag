precision mediump float;


varying vec3 v_color;
varying vec2 v_resolution;
varying vec2 v_clipSpace;

vec3 get_circle(vec2 position, vec3 color, float size) {
    float circle = sqrt(pow(position.x, 2.0) + pow(position.y, 2.0));
    circle = smoothstep(size, size + 0.003, 1.0 - circle);

    return color * circle;
}

void main() {
    vec2 st = gl_FragCoord.xy / v_resolution;
    vec3 canvas = vec3(0.0);
    vec3 circle = get_circle(st - vec2(0.2, 0.2), v_color, 0.9);
    vec3 circle2 = get_circle(st - vec2(0.5, 0.5), v_color, 0.9);
    vec3 circle3 = get_circle(st - vec2(0.8, 0.8), v_color, 0.9);

    canvas += circle;
    canvas += circle2;
    canvas += circle3;

    gl_FragColor = vec4(canvas, 1);
}