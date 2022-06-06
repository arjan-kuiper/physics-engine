import shapeVert from './shaders/shape.vert';
import shapeFrag from './shaders/shape.frag';
import { Circle } from './shapes';

export default class Renderer {
    private gl: WebGL2RenderingContext;
    private shaderProgram: WebGLProgram | null;

    private positionAttributeLocation: number;
    private radiusAttributeLocation: number;
    private colorAttributeLocation: number;
    private resolutionUniformLocation: WebGLUniformLocation | null;

    private allShapes: Circle[] = [];

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
        
        this.shaderProgram = this.initShaders(shapeVert, shapeFrag)!;
        this.positionAttributeLocation = this.gl.getAttribLocation(this.shaderProgram, 'a_position');
        this.radiusAttributeLocation = this.gl.getAttribLocation(this.shaderProgram, 'a_radius');
        this.colorAttributeLocation = this.gl.getAttribLocation(this.shaderProgram, 'a_color');
        this.resolutionUniformLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_resolution');

        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.gl.useProgram(this.shaderProgram);
        this.gl.uniform2f(this.resolutionUniformLocation, this.gl.canvas.width, this.gl.canvas.height);
    }

    public addShape(shape: Circle): void {
        this.allShapes.push(shape);
    }

    public update(): void {
        if (this.allShapes.length > 0) {
            const buffer = new Float32Array(this.allShapes.flatMap((shape) => shape.buffer));
            console.log(buffer);
            return;

            // Positional Data
            const positionBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.DYNAMIC_DRAW);
            this.gl.vertexAttribPointer(this.positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray(this.positionAttributeLocation);
            
            // Radius Data
            const radiusBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, radiusBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(radii), this.gl.STATIC_DRAW);
            this.gl.vertexAttribPointer(this.radiusAttributeLocation, 1, this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray(this.radiusAttributeLocation);

            // Color Data
            const colorBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
            this.gl.vertexAttribPointer(this.colorAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray(this.colorAttributeLocation);
            
            this.gl.drawArrays(this.gl.POINTS, 0, positions.length / 2);
        }
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