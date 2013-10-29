#pragma strict

function Start () {

}

//var newVertices : Vector3[];
//var newUV : Vector2[];
//var newTriangles : int[];

var __angle: float;
var size: int = 100;
var height_map_z:int = 0;

var x_i:float;
var y_i:float;
var z_i:float;

var center_x:float;
var center_z:float;
var idx:int;

var verts:Array;
var tris:Array;
var uvs:Array;

function Update () {
	var mesh : Mesh = GetComponent(MeshFilter).mesh;
	mesh.Clear();
	// Do some calculations...
	center_x = 0;
	center_z = 0;
	idx = 0;
	verts = new Array();
	tris = new Array();
	uvs = new Array();
	for(var i:int = 0; i < 6; i++) {
		__angle = ((2 * Mathf.PI) / 6) * i;
		x_i = center_x + size * Mathf.Cos(__angle) + gameObject.transform.position.x;
		y_i = 0;
		z_i = center_z + size * Mathf.Sin(__angle) + gameObject.transform.position.z;
		verts.Push(Vector3(x_i, y_i, z_i));		
		uvs.Push(Vector2(0, 0));
	}
	
	tris.Push(0);
	tris.Push(2);
	tris.Push(1);
	tris.Push(0);
	tris.Push(3);
	tris.Push(2);
	tris.Push(0);
	tris.Push(4);
	tris.Push(3);
	tris.Push(0);
	tris.Push(5);
	tris.Push(4);

	
	
	
	mesh.vertices = verts.ToBuiltin(Vector3) as Vector3[];
	mesh.uv = uvs.ToBuiltin(Vector2) as Vector2[];
	mesh.triangles = tris.ToBuiltin(int) as int[];
	
	
}