function vertexLength(vertex) {
    return Math.sqrt(vertex.x * vertex.x + vertex.y * vertex.y + vertex.z * vertex.z);
}
function normalizeVertex(vertex) {
    let length = vertexLength(vertex);
    return { x: vertex.x / length, y: vertex.y / length, z: vertex.z / length };
}
function scaleVertex(vertex, scaleFactor) {
    return { x: vertex.x * scaleFactor, y: vertex.y * scaleFactor, z: vertex.z * scaleFactor };
}
function distanceBetweenVertices(vertex1, vertex2) {
    return Math.sqrt(Math.pow(vertex1.x - vertex2.x, 2) + Math.pow(vertex1.y - vertex2.y, 2) + Math.pow(vertex1.z - vertex2.z, 2));
}
function calculateMidpoint(vertex1, vertex2) {
    let midX = (vertex1.x + vertex2.x) / 2;
    let midY = (vertex1.y + vertex2.y) / 2;
    let midZ = (vertex1.z + vertex2.z) / 2;
    return { x: midX, y: midY, z: midZ };
}
class TriangleMesh {
    constructor() {
        this.vertices = [];
        this.triangles = [];
        this.normals = [];
    }
    addVertex(vertex) {
        this.vertices.push(vertex);
        return this.vertices.length - 1;
    }
    addNormal(normal) {
        this.normals.push(normalizeVertex(normal));
        return this.normals.length - 1;
    }
    addTriangleFromVertices(vertex1, vertex2, vertex3, normalVertexA, normalVertexB, normalVertexC) {
        this.triangles.push({ vertexA: vertex1, vertexB: vertex2, vertexC: vertex3, normalVertexA: normalVertexA, normalVertexB: normalVertexB, normalVertexC: normalVertexC });
    }
    addTriangle(vertexIndex1, vertexIndex2, vertexIndex3, normalVertexIndex1, normalVertexIndex2, normalVertexIndex3) {
        if (vertexIndex1 == vertexIndex2 ||
            vertexIndex2 == vertexIndex3 ||
            vertexIndex1 == vertexIndex3) {
            console.log("unable to add triangle: invalid vertices");
            return;
        }
        if (Math.max(Math.max(vertexIndex1, vertexIndex2), vertexIndex3) >= this.vertices.length) {
            console.log("unable to add triangles: invalid vertices");
            return;
        }
        let newTriangle = {
            vertexA: this.vertices[vertexIndex1],
            vertexB: this.vertices[vertexIndex2],
            vertexC: this.vertices[vertexIndex3],
            normalVertexA: this.normals[normalVertexIndex1],
            normalVertexB: this.normals[normalVertexIndex2],
            normalVertexC: this.normals[normalVertexIndex3]
        };
        this.triangles.push(newTriangle);
    }
    toFloat32Array() {
        let floats = new Float32Array(7 * 3 * this.triangles.length);
        let floatIndex = 0;
        for (const triangle of this.triangles) {
            let vertexA = triangle.vertexA;
            let vertexB = triangle.vertexB;
            let vertexC = triangle.vertexC;
            let normalVertexA = triangle.normalVertexA;
            let normalVertexB = triangle.normalVertexB;
            let normalVertexC = triangle.normalVertexC;
            let vertices = [
                vertexA.x, vertexA.y, vertexA.z, 1.0, normalVertexA.x, normalVertexA.y, normalVertexA.z,
                vertexB.x, vertexB.y, vertexB.z, 1.0, normalVertexB.x, normalVertexB.y, normalVertexB.z,
                vertexC.x, vertexC.y, vertexC.z, 1.0, normalVertexC.x, normalVertexC.y, normalVertexC.z
            ];
            for (let vertexIndex = 0; vertexIndex < vertices.length; vertexIndex++) {
                floats[floatIndex + vertexIndex] = vertices[vertexIndex];
            }
            floatIndex += vertices.length;
        }
        return floats;
    }
}
function createIcosahedron(radius = 1) {
    let icosahedronTriangleMesh = new TriangleMesh();
    let t = (1.0 + Math.sqrt(5.0)) / 2.0;
    icosahedronTriangleMesh.addVertex(scaleVertex(normalizeVertex({ x: -1, y: t, z: 0 }), radius));
    icosahedronTriangleMesh.addVertex(scaleVertex(normalizeVertex({ x: 1, y: t, z: 0 }), radius));
    icosahedronTriangleMesh.addVertex(scaleVertex(normalizeVertex({ x: -1, y: -t, z: 0 }), radius));
    icosahedronTriangleMesh.addVertex(scaleVertex(normalizeVertex({ x: 1, y: -t, z: 0 }), radius));
    icosahedronTriangleMesh.addNormal({ x: -1, y: t, z: 0 });
    icosahedronTriangleMesh.addNormal({ x: 1, y: t, z: 0 });
    icosahedronTriangleMesh.addNormal({ x: -1, y: -t, z: 0 });
    icosahedronTriangleMesh.addNormal({ x: 1, y: -t, z: 0 });
    icosahedronTriangleMesh.addVertex(scaleVertex(normalizeVertex({ x: 0, y: -1, z: t }), radius));
    icosahedronTriangleMesh.addVertex(scaleVertex(normalizeVertex({ x: 0, y: 1, z: t }), radius));
    icosahedronTriangleMesh.addVertex(scaleVertex(normalizeVertex({ x: 0, y: -1, z: -t }), radius));
    icosahedronTriangleMesh.addVertex(scaleVertex(normalizeVertex({ x: 0, y: 1, z: -t }), radius));
    icosahedronTriangleMesh.addNormal({ x: 0, y: -1, z: t });
    icosahedronTriangleMesh.addNormal({ x: 0, y: 1, z: t });
    icosahedronTriangleMesh.addNormal({ x: 0, y: -1, z: -t });
    icosahedronTriangleMesh.addNormal({ x: 0, y: 1, z: -t });
    icosahedronTriangleMesh.addVertex(scaleVertex(normalizeVertex({ x: t, y: 0, z: -1 }), radius));
    icosahedronTriangleMesh.addVertex(scaleVertex(normalizeVertex({ x: t, y: 0, z: 1 }), radius));
    icosahedronTriangleMesh.addVertex(scaleVertex(normalizeVertex({ x: -t, y: 0, z: -1 }), radius));
    icosahedronTriangleMesh.addVertex(scaleVertex(normalizeVertex({ x: -t, y: 0, z: 1 }), radius));
    icosahedronTriangleMesh.addNormal({ x: t, y: 0, z: -1 });
    icosahedronTriangleMesh.addNormal({ x: t, y: 0, z: 1 });
    icosahedronTriangleMesh.addNormal({ x: -t, y: 0, z: -1 });
    icosahedronTriangleMesh.addNormal({ x: -t, y: 0, z: 1 });
    icosahedronTriangleMesh.addTriangle(0, 11, 5, 0, 11, 5);
    icosahedronTriangleMesh.addTriangle(0, 5, 1, 0, 5, 1);
    icosahedronTriangleMesh.addTriangle(0, 1, 7, 0, 1, 7);
    icosahedronTriangleMesh.addTriangle(0, 7, 10, 0, 7, 10);
    icosahedronTriangleMesh.addTriangle(0, 10, 11, 0, 10, 11);
    icosahedronTriangleMesh.addTriangle(1, 5, 9, 1, 5, 9);
    icosahedronTriangleMesh.addTriangle(5, 11, 4, 5, 11, 4);
    icosahedronTriangleMesh.addTriangle(11, 10, 2, 11, 10, 2);
    icosahedronTriangleMesh.addTriangle(10, 7, 6, 10, 7, 6);
    icosahedronTriangleMesh.addTriangle(7, 1, 8, 7, 1, 8);
    icosahedronTriangleMesh.addTriangle(3, 9, 4, 3, 9, 4);
    icosahedronTriangleMesh.addTriangle(3, 4, 2, 3, 4, 2);
    icosahedronTriangleMesh.addTriangle(3, 2, 6, 3, 2, 6);
    icosahedronTriangleMesh.addTriangle(3, 6, 8, 3, 6, 8);
    icosahedronTriangleMesh.addTriangle(3, 8, 9, 3, 8, 9);
    icosahedronTriangleMesh.addTriangle(4, 9, 5, 4, 9, 5);
    icosahedronTriangleMesh.addTriangle(2, 4, 11, 2, 4, 11);
    icosahedronTriangleMesh.addTriangle(6, 2, 10, 6, 2, 10);
    icosahedronTriangleMesh.addTriangle(8, 6, 7, 8, 6, 7);
    icosahedronTriangleMesh.addTriangle(9, 8, 1, 9, 8, 1);
    return icosahedronTriangleMesh;
}
function createIcosphere(numRecursions, radius = 1) {
    let mesh = createIcosahedron(radius);
    for (let i = 0; i < numRecursions; i++) {
        let newMesh = new TriangleMesh();
        for (const triangle of mesh.triangles) {
            let a = normalizeVertex(calculateMidpoint(triangle.vertexA, triangle.vertexB));
            let b = normalizeVertex(calculateMidpoint(triangle.vertexB, triangle.vertexC));
            let c = normalizeVertex(calculateMidpoint(triangle.vertexC, triangle.vertexA));
            newMesh.addTriangleFromVertices(triangle.vertexA, a, c, triangle.vertexA, a, c);
            newMesh.addTriangleFromVertices(triangle.vertexB, b, a, triangle.vertexB, b, a);
            newMesh.addTriangleFromVertices(triangle.vertexC, c, b, triangle.vertexC, c, b);
            newMesh.addTriangleFromVertices(a, b, c, a, b, c);
        }
        mesh = newMesh;
    }
    return mesh;
}
function createRectangularPrism(width, height, depth) {
    let mesh = new TriangleMesh();
    let halfWidth = width / 2;
    let halfHeight = height / 2;
    let halfDepth = depth / 2;
    let topBackLeft = mesh.addVertex({ x: -halfWidth, y: -halfHeight, z: halfDepth });
    let topBackRight = mesh.addVertex({ x: halfWidth, y: -halfHeight, z: halfDepth });
    let topFrontRight = mesh.addVertex({ x: halfWidth, y: halfHeight, z: halfDepth });
    let topFrontLeft = mesh.addVertex({ x: -halfWidth, y: halfHeight, z: halfDepth });
    let bottomBackLeft = mesh.addVertex({ x: -halfWidth, y: -halfHeight, z: -halfDepth });
    let bottomBackRight = mesh.addVertex({ x: halfWidth, y: -halfHeight, z: -halfDepth });
    let bottomFrontRight = mesh.addVertex({ x: halfWidth, y: halfHeight, z: -halfDepth });
    let bottomFrontLeft = mesh.addVertex({ x: -halfWidth, y: halfHeight, z: -halfDepth });
    let topNormal = mesh.addNormal({ x: 0, y: 0, z: 1 });
    let bottomNormal = mesh.addNormal({ x: 0, y: 0, z: -1 });
    let frontNormal = mesh.addNormal({ x: 0, y: 1, z: 0 });
    let backNormal = mesh.addNormal({ x: 0, y: -1, z: 0 });
    let rightNormal = mesh.addNormal({ x: 1, y: 0, z: 0 });
    let leftNormal = mesh.addNormal({ x: -1, y: 0, z: 0 });
    // front triangles
    // bottom edge
    mesh.addTriangle(bottomFrontLeft, bottomFrontRight, topFrontLeft, frontNormal, frontNormal, frontNormal);
    // top edge
    mesh.addTriangle(bottomFrontRight, topFrontRight, topFrontLeft, frontNormal, frontNormal, frontNormal);
    // back triangles
    // bottom edge
    mesh.addTriangle(bottomBackRight, bottomBackLeft, topBackRight, backNormal, backNormal, backNormal);
    // top edge
    mesh.addTriangle(bottomBackLeft, topBackLeft, topBackRight, backNormal, backNormal, backNormal);
    // top triangles
    // front edge
    mesh.addTriangle(topFrontLeft, topFrontRight, topBackLeft, topNormal, topNormal, topNormal);
    // back edge
    mesh.addTriangle(topFrontRight, topBackRight, topBackLeft, topNormal, topNormal, topNormal);
    // bottom triangles
    // front edge
    mesh.addTriangle(bottomFrontRight, bottomFrontLeft, bottomBackRight, bottomNormal, bottomNormal, bottomNormal);
    // back edge
    mesh.addTriangle(bottomFrontLeft, bottomBackLeft, bottomBackRight, bottomNormal, bottomNormal, bottomNormal);
    // right triangles
    // top edge
    mesh.addTriangle(bottomFrontRight, bottomBackRight, topFrontRight, rightNormal, rightNormal, rightNormal);
    // bottom edge
    mesh.addTriangle(bottomBackRight, topBackRight, topFrontRight, rightNormal, rightNormal, rightNormal);
    // left triangles
    // top edge
    mesh.addTriangle(bottomBackLeft, bottomFrontLeft, topBackLeft, leftNormal, leftNormal, leftNormal);
    // bottom edge
    mesh.addTriangle(bottomFrontLeft, topFrontLeft, topBackLeft, leftNormal, leftNormal, leftNormal);
    return mesh;
}
