interface SceneGraphNode {
    name: string;
    traverseNode: (worldMatrix, parameters) => void;
    printNode: (markerStr: string, levelMarkers: boolean[]) => void;
};

function printNode(markerStr: string, value: string, levelMarkers: boolean[]) {
    let emptyStr = " ".repeat(markerStr.length);
    let connectionString = "|".concat(" ".repeat(markerStr.length - 1));

    let level = levelMarkers.length;
    let mapper = (draw) => {
        if (draw) {
            return connectionString;
        } else {
            return emptyStr;
        }
    };

    let markers = "".concat(levelMarkers.slice(0, -1).map(mapper).join(""));
    if (level > 0) {
        markers = markers.concat(markerStr);
    }

    console.log(`${markers}${value}`);

    return level;
}

class DrawNode implements SceneGraphNode{
    public name: string;
    public drawFunction: Function;

    constructor(name: string, drawFunction: Function) {
        this.name = name;
        this.drawFunction = drawFunction;
    }

    traverseNode(worldMatrix, parameters) {
        let childWorldMatrix = glMatrix.mat4.clone(worldMatrix);
        this.drawFunction(childWorldMatrix, parameters);
    }

    printNode (markerStr: string, levelMarkers: boolean[]) {
        printNode(markerStr, this.name, levelMarkers);
    }
}

class TransformationNode implements SceneGraphNode{
    public name: string;
    public transformationFunction: Function;
    public child: SceneGraphNode;

    constructor(name: string, transformationFunction, child) {
        this.name = name;
        this.transformationFunction = transformationFunction;
        this.child = child;
    }

    printNode (markerStr: string, levelMarkers: boolean[]) {
        printNode(markerStr, this.name, levelMarkers);
        
        this.child.printNode(markerStr, levelMarkers.concat(false));
    };

    traverseNode(worldMatrix, parameters) {
        let childWorldMatrix = glMatrix.mat4.clone(worldMatrix);
        this.transformationFunction(childWorldMatrix, worldMatrix, parameters);
        this.child.traverseNode(childWorldMatrix, parameters);
    }
}

class GroupNode implements SceneGraphNode{
    public name: string;
    public children: SceneGraphNode[];

    constructor(name: string, children: SceneGraphNode[]) {
        this.name = name;
        this.children = children;
    }

    printNode (markerStr: string, levelMarkers: boolean[]) {
        printNode(markerStr, this.name, levelMarkers);
        
        let numChildren = this.children.length;

        for (let i = 0; i < numChildren; i++) {
            let isLast = (i == numChildren - 1);
            this.children[i].printNode(markerStr, levelMarkers.concat(!isLast));
        }
    };

    traverseNode(worldMatrix, parameters) {
        for(const child of this.children){
            let childWorldMatrix = glMatrix.mat4.clone(worldMatrix);
            child.traverseNode(childWorldMatrix, parameters);
        }
    }
}

class BaseNode implements SceneGraphNode{
    public name: string;
    public baseWorldMatrix;
    public child: SceneGraphNode;

    constructor(name: string, baseWorldMatrix, child) {
        this.name = name;
        this.baseWorldMatrix = baseWorldMatrix;
        this.child = child;
    }

    printNode (markerStr: string, _levelMarkers: boolean[]) {
        this.child.printNode(markerStr, []);
    };

    traverseNode(_worldMatrix, parameters) {
        let childWorldMatrix = glMatrix.mat4.clone(this.baseWorldMatrix);
        this.child.traverseNode(childWorldMatrix, parameters);
    }

    traverseGraph(parameters = {}) {
        this.traverseNode(null, parameters);
    }

    printGraph() {
        this.printNode("+- ", null);
    }
}
