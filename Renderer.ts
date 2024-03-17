let renderer_gl: WebGL2RenderingContext | WebGLRenderingContext;

type VertexData = {
    start: number;
    count: number;
    drawingMethod: number;
};

type AttributeData = {
    name: string;
    size: number;
    type: any;
    isNormalized: boolean;
    stride: number;
    offset: number;
};

type UniformData = {
    name: string;
};

class ShaderProgram{
    public shaderProgram: WebGLProgram;
    public attributes: AttributeData[];
    public uniforms: UniformData[];
    public attributeLocations: Map<string, GLuint>;
    public uniformLocations: Map<string, WebGLUniformLocation>;
    public vboBufferLocation: WebGLBuffer;
    public bufferDrawHint: number;
    public bufferPurpose: number;

    constructor(shaderProgram: WebGLProgram, bufferDrawHint: number = renderer_gl.STATIC_DRAW, bufferPurpose: number = renderer_gl.ARRAY_BUFFER) {
        this.shaderProgram = shaderProgram;
        renderer_gl.useProgram(this.shaderProgram);
        this.attributes = [];
        this.uniforms = [];
        this.attributeLocations = new Map<string, GLuint>();
        this.uniformLocations = new Map<string, WebGLUniformLocation>();
        this.vboBufferLocation = renderer_gl.createBuffer();
        if (!this.vboBufferLocation) {
            console.log("Failed to create buffer"); 
            return;
        }
        renderer_gl.bindBuffer(bufferPurpose, this.vboBufferLocation);
        this.bufferPurpose = bufferPurpose;
        this.bufferDrawHint = bufferDrawHint;
    }

    addAttribute(attribute: AttributeData): number {
        let attributeLocation = renderer_gl.getAttribLocation(this.shaderProgram, attribute.name);
        if(attributeLocation < 0) {
            console.log("Failed to generate attribute: " + attribute.name);
            return -1;
        }

        this.attributeLocations.set(attribute.name, attributeLocation);

        this.attributes.push(attribute);

        return this.attributes.length - 1;
    }

    addUniform(uniform: UniformData): number {
        let uniformLocation = renderer_gl.getUniformLocation(this.shaderProgram, uniform.name);
        if (!uniformLocation) {
            console.log("Failed to generate attribute: " + uniform.name);
        return -1;
        }

        this.uniformLocations.set(uniform.name, uniformLocation);

        this.uniforms.push(uniform);

        return this.uniforms.length - 1;
    }

    loadBufferData(bufferData: Float32Array) {
        renderer_gl.bufferData(this.bufferPurpose, bufferData, this.bufferDrawHint);
    }

    setUniform4MatrixFVFromIndex(uniformIndex: number, matrix4FV) {
        renderer_gl.uniformMatrix4fv(this.uniformLocations.get(this.uniforms[uniformIndex].name), false, matrix4FV);
    }

    setUniformMatrix4FVFromData(uniformData: UniformData, matrix4FV) {
        renderer_gl.uniformMatrix4fv(this.uniformLocations.get(uniformData.name), false, matrix4FV);
    }

    setUniformMatrix4FV(name: string, matrix4FV) {
        renderer_gl.uniformMatrix4fv(this.uniformLocations.get(name), false, matrix4FV);
    }

    setUniform1F(name: string, value: number) {
        renderer_gl.uniform1f(this.uniformLocations.get(name), value);
    }

    setUniform3FV(name: string, values) {
        renderer_gl.uniform3fv(this.uniformLocations.get(name), Float32Array.from(values));
    }

    activate() {
        renderer_gl.useProgram(this.shaderProgram);

        renderer_gl.bindBuffer(this.bufferPurpose, this.vboBufferLocation);

        for (const attribute of this.attributes) {
            renderer_gl.vertexAttribPointer(
                this.attributeLocations.get(attribute.name),
                attribute.size,
                attribute.type,
                attribute.isNormalized,
                attribute.stride,
                attribute.offset
            )

            renderer_gl.enableVertexAttribArray(this.attributeLocations.get(attribute.name));
        }
    }
}

class VertexBufferObject{
	public vertices: Float32Array;
	public drawableObjects: Map<string, VertexData>;
	public currentCount: number;
    public floatsPerVertex: number;
    public currentShaderProgram: number;

	constructor(floatsPerVertex: number = 9) {
		this.vertices = new Float32Array(0);
		this.drawableObjects = new Map<string, VertexData>();
		this.currentCount = 0;
        this.floatsPerVertex = floatsPerVertex;
	}

	draw(
        name: string
    ) {
        let objectData = this.drawableObjects.get(name)!;

		renderer_gl.drawArrays(
			objectData.drawingMethod,
			objectData.start/this.floatsPerVertex,
			objectData.count/this.floatsPerVertex
		);
	}

	addVertices(name: string, vertices: Float32Array, drawingMethod: number) {
		let newCount = this.currentCount + vertices.length;
		let newVertices = new Float32Array(newCount);

		let i = 0;
			for (i = 0; i < this.currentCount; i++) {
		newVertices[i] = this.vertices[i];
		}

		for(let j = 0; j < vertices.length; j++, i++) {
			newVertices[i] = vertices[j];
		}

        this.drawableObjects.set(name,
            {
                start: this.currentCount,
                count: vertices.length,
                drawingMethod: drawingMethod
            });
		this.currentCount = newCount;
		this.vertices = newVertices;
	}
}

function initWebGL(): HTMLCanvasElement {
    let canvas = <HTMLCanvasElement>document.getElementById("webglCanvas")!;

    let glContext = WebGLUtils.setupWebGL(canvas, WebGLUtils.WebGLContextType.WebGL);

    if (glContext == null) {
        console.log("Failed to get the rendering context for WebGL");
		return null;
    }

    renderer_gl = glContext;
    return canvas;
}

function createWebGLProgram(vertexShaderSource: string, fragmentShaderSource: string): [WebGLShader, WebGLShader, WebGLProgram] | null {

    let vertexShader = WebGLUtils.createShader(renderer_gl, WebGLUtils.WebGLShaderType.VertexShader, vertexShaderSource);
    if (vertexShader == null) {
        console.log("Failed to create vertex shader");
        return null;
    }

    let fragmentShader = WebGLUtils.createShader(renderer_gl, WebGLUtils.WebGLShaderType.FragmentShader, fragmentShaderSource);
    if (fragmentShader == null) {
        console.log("Failed to create fragment shader");
        return null;
    }

    let program = WebGLUtils.createProgram(renderer_gl, vertexShader, fragmentShader);
    if (program == null) {
        console.log("Failed to create program");
        return null;
    }

    return [vertexShader, fragmentShader, program];
}
