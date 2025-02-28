import {
    BoxGeometry,
    Matrix4,
    MeshPhysicalMaterial,
    Mesh,
    CatmullRomCurve3,
    TubeGeometry,
    Vector2,
    Vector3,
    SphereGeometry
} from "three";


const defaultProps = {
    color:0x6f7aab,
    clearcoat:1,
    metalness:0,
    roughness:0.5,
};



class FD{
    constructor(tau) {

        this.width = 2.*Math.PI;
        this.tau = tau.multiplyScalar(this.width);

    }

    getSurfaceMesh(color = 0x6f7aab){
        const geometry = new BoxGeometry(1,1,0.1);
        geometry.scale(this.width,this.tau.y,1);
        geometry.translate(this.width/2,this.tau.y/2,0.05);
        const matrix = new Matrix4();
        matrix.makeShear(0, 0, this.tau.x/this.tau.y, 0, 0,0);
        geometry.applyMatrix4(matrix);
        const mat = new MeshPhysicalMaterial({
            color:color,
            roughness:0.2,
            metalness:0,
            clearcoat:1,
        });
        return new Mesh(geometry, mat);
    }

    getFiberTranslate(offset=0,color=0xffffff,radius=0.01){
        //offset is a percent of edge length
        //horiz edges are of length this.width
        //spaced along the vertical edge of length sqrt(taux^2+tauy^2)

        let pts = [];
        for(let i=0; i<11; i++){
            let offsetVec = new Vector3(this.tau.x,this.tau.y,0).multiplyScalar(offset);
            let p = offsetVec.add(new Vector3(this.width*i/10,0,0));
            pts.push(p);
        }

        const curve = new CatmullRomCurve3(pts);
        const geom = new TubeGeometry(curve,64,radius);
        const mat = new MeshPhysicalMaterial({
            color:color,
            metalness:0,
            roughnes:0.2,
            clearcoat:1,
        });
        return new Mesh(geom,mat);

    }

    getEdgeTranslate(offset=0,color=0x000000,radius=0.01){
        //offset is a percent of edge length
        //vertical edges connect (0,0) to tau.
        //spaced along the horizontal edge of length 1.

        let pts = [];
        for(let i=0; i<11; i++){
            let offsetVec = new Vector3(offset*this.width,0,0);
            let p = offsetVec.add(new Vector3(this.tau.x,this.tau.y,0).multiplyScalar(i/10));
            pts.push(p);
        }

        const curve = new CatmullRomCurve3(pts);
        const geom = new TubeGeometry(curve,64,radius);
        const mat = new MeshPhysicalMaterial({
            color:color,
            metalness:0,
            roughnes:0.2,
            clearcoat:1,
        });
        return new Mesh(geom,mat);
    }


    getPointOnLatticeMesh(fiberOffset=0,edgeOffset=0,color = 0x8c1a0f,radius=0.01){

        let xOffsetVec = new Vector3(fiberOffset,0,0).multiplyScalar(this.width);
        let yOffsetVec = new Vector3(this.tau.x,this.tau.y,0).multiplyScalar(edgeOffset);
        let pos = xOffsetVec.add(yOffsetVec);

        const geom = new SphereGeometry(2.25*radius);
        const mat = new MeshPhysicalMaterial({
            color:color,
            roughness:0.2,
            metalness:0,
            clearcoat:1,
        });
        let mesh = new Mesh(geom,mat);
        mesh.position.set(pos.x,pos.y,0);

        return mesh;

    }


    //point using p=(x,y) coordinates in the plane
    getPointMesh(p, color=0x8c1a0f, radius =0.01){
        //p is mathematica input [x,y] in the domain spanned by 1 and tau.
        let P = new Vector2(p[0],p[1]).multiplyScalar(this.width);

        let pointGeom = new SphereGeometry(radius);
        let pointMat = new MeshPhysicalMaterial({color:color,roughness:0.1,metalness:0,clearcoat:1});
        let mesh = new Mesh(pointGeom,pointMat)
        mesh.position.set(P.x,P.y,0);
        return mesh;

    }


}

export default FD;
