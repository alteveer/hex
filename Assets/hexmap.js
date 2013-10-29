#pragma strict

function Start () {

}

//var newVertices : Vector3[];
//var newUV : Vector2[];
//var newTriangles : int[];

var __angle: float;
var size: int = 5;
var height_map_z:int = 0;

var x_i:float;
var y_i:float;
var z_i:float;

var x:float;
var y:float;
var z:float;
var q:float;
var r:float;
var idx:int;

var verts:Array;
var normals:Array;
var tris:Array;
var uvs:Array;

var sides:int = 6;

var map:Array = new Array(
	0, 0, 0, 0, 0, 1,
	0, 1, 0, 1, 1, 0,
	0, 1, 1, 1, 1, 1,
	0, 0, 1, 0, 0, 1,
	0, 1, 1, 1, 1, 0,
	0, 0, 1, 1, 1, 0,
	0, 0, 0, 0, 0, 0
);

function Update () {
	var mesh : Mesh = GetComponent(MeshFilter).mesh;
	mesh.Clear();
	// Do some calculations...
	x = 0;
	y = 0;
	z = 0;
	idx = 0;
	verts = new Array();
	normals = new Array();
	tris = new Array();
	uvs = new Array();
	
	for(var m:int = 0; m < map.length; m++) {
		if(map[m] == 1) {
			q = m % 6;
			r = Mathf.FloorToInt(m / 6);
			
			x = -q * size * 1.5;
			z = ((r * Mathf.Sqrt(3)) + ((q % 2) * Mathf.Sqrt(3)/2)) * size; //- ((q - ()) * ( * (size * 1.5))) ;
			y = 0;// proper: -x - z;
			
			x += gameObject.transform.position.x;
			y += gameObject.transform.position.y;
			z += gameObject.transform.position.z;
			
			// center vert
			verts.Push(Vector3(x, y, z));		
			normals.Push(Vector3.up);
			uvs.Push(Vector2(x % 1, z % 1));
			
			for(var i:int = 0; i < sides; i++) {
				__angle = ((2 * Mathf.PI) / 6) * i;
				x_i = x + (size * Mathf.Cos(__angle));
				y_i = y;
				z_i = z + (size * Mathf.Sin(__angle));
				
				verts.Push(Vector3(x_i, y_i, z_i));		
				normals.Push(Vector3.up);
				//uvs.Push(Vector2((x_i % 1) * (x_i/Mathf.Abs(x_i)), (z_i % 1) * (z_i/Mathf.Abs(z_i))));
				uvs.Push(Vector2(Mathf.Repeat(x_i, 1), Mathf.Repeat(z_i, 1)));
				
				tris.Push(idx);
				if(i + 1 == sides) {
					tris.Push(idx + 1);	
				} else {
					tris.Push(idx + i + 2);
				}
				tris.Push(idx + i + 1);
				
			}
			
			idx += 7;
		}
	}

//	verts.Push(Vector3(x, y, z));		
//	uvs.Push(Vector2(x % 2, z % 2));
//
//	for(var i:int = 0; i < sides; i++) {
//		__angle = ((2 * Mathf.PI) / 6) * i;
//		x_i = x + (size * Mathf.Cos(__angle)) + gameObject.transform.position.x;
//		y_i = y;
//		z_i = z + (size * Mathf.Sin(__angle)) + gameObject.transform.position.z;
//		verts.Push(Vector3(x_i, y_i, z_i));		
//		uvs.Push(Vector2(x_i % 2, z_i % 2));
//		
//		tris.Push(idx);
//		if(i + 1 == sides) {
//			tris.Push(idx + 1);	
//		} else {
//			tris.Push(idx + i + 2);
//		}
//		tris.Push(idx + i + 1);
//		
//	}
	
	
	mesh.vertices = verts.ToBuiltin(Vector3) as Vector3[];
	mesh.normals = normals.ToBuiltin(Vector3) as Vector3[];
	mesh.uv = uvs.ToBuiltin(Vector2) as Vector2[];
	mesh.triangles = tris.ToBuiltin(int) as int[];
	
	
	
}