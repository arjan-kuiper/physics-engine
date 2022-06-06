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
    private timeUniformLocation: WebGLUniformLocation | null;

    private allShapes: Circle[] = [];

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
        
        this.shaderProgram = this.initShaders(shapeVert, shapeFrag)!;
        this.positionAttributeLocation = this.gl.getAttribLocation(this.shaderProgram, 'a_position');
        this.radiusAttributeLocation = this.gl.getAttribLocation(this.shaderProgram, 'a_radius');
        this.colorAttributeLocation = this.gl.getAttribLocation(this.shaderProgram, 'a_color');
        this.resolutionUniformLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_resolution');
        this.timeUniformLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_time');

        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.gl.useProgram(this.shaderProgram);
        this.gl.uniform2f(this.resolutionUniformLocation, this.gl.canvas.width, this.gl.canvas.height);
    }

    public addShape(shape: Circle): void {
        this.allShapes.push(shape);
    }

    public update(currentTime: number): void {
        if (this.allShapes.length > 0) {

            // Create an interleaved buffer for all of the shapes that have to be drawn
            let buffer = [] as number[];
            for (let i = 0; i < this.allShapes.length; i++) {
                buffer = buffer.concat(this.allShapes[i].buffer);
            }

            const positionVertexSize = 2;
            const colorVertexSize = 3;
            const radiusVertexSize = 1;
            const floatSize = Float32Array.BYTES_PER_ELEMENT;
            const stride = (positionVertexSize + colorVertexSize + radiusVertexSize) * floatSize;

            // Update the time for the shader
            this.gl.uniform1f(this.timeUniformLocation, currentTime);

            // Setup the buffer
            const shapeBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, shapeBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(buffer), this.gl.STATIC_DRAW);

            // Positional Data
            this.gl.vertexAttribPointer(this.positionAttributeLocation, 2, this.gl.FLOAT, false, stride , 0);
            this.gl.enableVertexAttribArray(this.positionAttributeLocation);
            
            // Color Data
            this.gl.vertexAttribPointer(this.colorAttributeLocation, 3, this.gl.FLOAT, false, stride, positionVertexSize * floatSize);
            this.gl.enableVertexAttribArray(this.colorAttributeLocation);

            // Radius Data
            this.gl.vertexAttribPointer(this.radiusAttributeLocation, 1, this.gl.FLOAT, false, stride, (positionVertexSize + colorVertexSize) * floatSize);
            this.gl.enableVertexAttribArray(this.radiusAttributeLocation);

            // Draw
            this.gl.drawArrays(this.gl.POINTS, 0, this.allShapes.length);
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