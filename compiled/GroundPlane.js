class GroundPlane {
    constructor(sinIterations = 7, numXLines = 50, numYLines = numXLines, frequency = 0.025, floatsPerVertex = 7, worldSize = 250, height = 1) {
        this.sinIterations = sinIterations;
        this.numXLines = numXLines;
        this.numYLines = numYLines;
        this.frequency = frequency;
        this.floatsPerVertex = floatsPerVertex;
        this.worldSize = worldSize;
        this.height = height;
        this.vertices = new Float32Array(0);
    }
    calculateHeightAtPoint(x, y) {
        let result = 0;
        for (let i = 0; i < this.sinIterations; i++) {
            result += Math.pow(2, -i) * Math.sin(this.frequency * Math.pow(2, i) * x);
        }
        for (let i = 0; i < this.sinIterations; i++) {
            result += Math.pow(2, -i) * Math.sin(this.frequency * Math.pow(2, i) * y);
        }
        return result;
    }
    makeGroundGrid() {
        var xColor = new Float32Array([240 / 255, 174 / 255, 207 / 255]);
        var yColor = new Float32Array([240 / 255, 174 / 255, 207 / 255]);
        let numVertices = (2 * this.numYLines - 2) * this.numXLines + (2 * this.numXLines - 2) * this.numYLines;
        this.vertices = new Float32Array(numVertices * this.floatsPerVertex);
        var xGap = 2 * this.worldSize / this.numXLines;
        var yGap = 2 * this.worldSize / this.numYLines;
        let j = 0;
        for (let xIndex = 0; xIndex < this.numXLines; xIndex++) {
            for (let yIndex = 0; yIndex < this.numYLines; yIndex++) {
                let x = -this.worldSize + xIndex * xGap;
                let y = -this.worldSize + yIndex * yGap;
                let z = this.height * this.calculateHeightAtPoint(x, y);
                this.vertices[j] = x;
                this.vertices[j + 1] = y;
                this.vertices[j + 2] = z;
                this.vertices[j + 3] = 1.0;
                this.vertices[j + 4] = xColor[0];
                this.vertices[j + 5] = xColor[1];
                this.vertices[j + 6] = xColor[2];
                j += this.floatsPerVertex;
                if (yIndex != 0 && yIndex != this.numYLines - 1) {
                    this.vertices[j] = x;
                    this.vertices[j + 1] = y;
                    this.vertices[j + 2] = z;
                    this.vertices[j + 3] = 1.0;
                    this.vertices[j + 4] = yColor[0];
                    this.vertices[j + 5] = yColor[1];
                    this.vertices[j + 6] = yColor[2];
                    j += this.floatsPerVertex;
                }
            }
        }
        for (let yIndex = 0; yIndex < this.numYLines; yIndex++) {
            for (let xIndex = 0; xIndex < this.numXLines; xIndex++) {
                let x = -this.worldSize + xIndex * xGap;
                let y = -this.worldSize + yIndex * yGap;
                let z = this.height * this.calculateHeightAtPoint(x, y);
                this.vertices[j] = x;
                this.vertices[j + 1] = y;
                this.vertices[j + 2] = z;
                this.vertices[j + 3] = 1.0;
                this.vertices[j + 4] = yColor[0];
                this.vertices[j + 5] = yColor[1];
                this.vertices[j + 6] = yColor[2];
                j += this.floatsPerVertex;
                if (xIndex != 0 && xIndex != this.numXLines - 1) {
                    this.vertices[j] = x;
                    this.vertices[j + 1] = y;
                    this.vertices[j + 2] = z;
                    this.vertices[j + 3] = 1.0;
                    this.vertices[j + 4] = yColor[0];
                    this.vertices[j + 5] = yColor[1];
                    this.vertices[j + 6] = yColor[2];
                    j += this.floatsPerVertex;
                }
            }
        }
        return this.vertices;
    }
}
