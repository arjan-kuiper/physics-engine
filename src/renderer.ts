import shapeVert from './shaders/shape.vert';
import shapeFrag from './shaders/shape.frag';

export default class Renderer {
    private gl: WebGL2RenderingContext;
    private shaderProgram: WebGLProgram | null;

    private positionAttributeLocation: number;
    private resolutionUniformLocation: WebGLUniformLocation | null;
    private colorUniformLocation: WebGLUniformLocation | null;

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
        
        this.shaderProgram = this.initShaders(shapeVert, shapeFrag)!;
        this.positionAttributeLocation = this.gl.getAttribLocation(this.shaderProgram, 'a_position');
        this.resolutionUniformLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_resolution');
        this.colorUniformLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_color');

        let positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        let positions = [
            0, 0,
            0, 500,
            500, 500,
            500, 500,
            500, 0,
            0, 0
        ];
        this.gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        this.gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.gl.useProgram(this.shaderProgram);
        this.gl.uniform2f(this.resolutionUniformLocation, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.uniform4f(this.colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);
        this.gl.enableVertexAttribArray(this.positionAttributeLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        let size = 2;
        let type = this.gl.FLOAT;
        let normalize = false;
        let stride = 0;
        let offset = 0;
        this.gl.vertexAttribPointer(this.positionAttributeLocation, size, type, normalize, stride, offset);

        var primitiveType = gl.TRIANGLES;
        var count = positions.length;
        this.gl.drawArrays(primitiveType, offset, count);
    }

    private initShaders(vertexShader: string, fragmentShader: string): WebGLProgram | null {
        const vShader = this.loadShader(this.gl.VERTEX_SHADER, vertexShader);
        const fShader = this.loadShader(this.gl.FRAGMENT_SHADER, fragmentShader);
        const shaderProgram = this.gl.createProgram();

        if (shaderProgram && vShader && fShader) {
            this.gl.attachShader(shaderProgram, vShader);
            this.gl.attachShader(shaderProgram, fShader);
            this.gl.linkProgram(shaderProgram);

            if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
                console.error('Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(shaderProgram));
                this.gl.deleteProgram(shaderProgram);
                return null;
            }
        }

        return shaderProgram;
    }

    private loadShader(type: number, source: string): WebGLShader | null {
        const shader = this.gl.createShader(type);

        if (shader) {
            this.gl.shaderSource(shader, source);
            this.gl.compileShader(shader);

            if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
                console.error('An error occurred compiling the shaders: ' + this.gl.getShaderInfoLog(shader));
                this.gl.deleteShader(shader);
                return null;
            }
        }

        return shader;
    }
}