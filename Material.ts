class Color {
    public hex: string;
    public r: number;
    public g: number;
    public b: number;
    
    constructor(hex: string = "000000", r: number = 0.0, g: number = 0.0, b: number = 0.0) {
        this.hex = hex;
        this.r = r;
        this.g = g;
        this.b = b;
    }
    
    static fromHex(hex: string): Color {
        let hexAsInt = parseInt(hex, 16);
        let r = (((hexAsInt >> 16) & 0xFF) / 0xFF);
        let g = (((hexAsInt >> 8) & 0xFF) / 0xFF);
        let b = (((hexAsInt >> 0) & 0xFF) / 0xFF);
        
        return new Color(hex, r, g, b);
    }
    
    static fromHexArray(hexArray: string[]): Color[] {
        return hexArray.map(Color.fromHex);
    }

    toFloat32Array() {
        return Float32Array.from([this.r, this.g, this.b]);
    }
}

class Material {
    public ambientColor: string;
    public diffuseColor: string;
    public specularColor: string;

    public Ka: number;
    public Kd: number;
    public Ks: number;
    public shininess: number;

    constructor(ambientColor, diffuseColor, specularColor, Ka, Kd, Ks, shininess) {
        this.ambientColor = ambientColor;
        this.diffuseColor = diffuseColor;
        this.specularColor = specularColor;

        this.Ka = Ka;
        this.Ks = Ks;
        this.Kd = Kd;
        this.shininess = shininess;
    }

    setMaterialInShader(shader: ShaderProgram) {
        let ambientColorArray = Color.fromHex(this.ambientColor).toFloat32Array();
        let diffuseColorArray = Color.fromHex(this.diffuseColor).toFloat32Array();
        let specularColorArray = Color.fromHex(this.specularColor).toFloat32Array();

        shader.setUniform1F("u_Ka", this.Ka);
        shader.setUniform1F("u_Kd", this.Kd);
        shader.setUniform1F("u_Ks", this.Ks);
        shader.setUniform1F("u_shininessValue", this.shininess);
        shader.setUniform3FV("u_ambientColor", glMatrix.vec3.fromValues(ambientColorArray[0], ambientColorArray[1], ambientColorArray[2]));
        shader.setUniform3FV("u_diffuseColor", glMatrix.vec3.fromValues(diffuseColorArray[0], diffuseColorArray[1], diffuseColorArray[2]));
        shader.setUniform3FV("u_specularColor", glMatrix.vec3.fromValues(specularColorArray[0], specularColorArray[1], specularColorArray[2]));
    }
}