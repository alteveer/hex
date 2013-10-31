#pragma strict

//var newVertices : Vector3[];
//var newUV : Vector2[];
//var newTriangles : int[];

var threshold:float;

var __angle: float;
var size: float = 5;
var height_map_z:int = 0;

var x_i:float;
var y_i:float;
var z_i:float;

var tiling_u:float = 1;
var tiling_v:float = 1;

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

var map_width = 100;
var map_height = 100;

var map:boolean[];

var ISLAND_FACTOR:float = 1.07;  // 1.0 means no small islands; 2.0 leads to a lot
var bumps:int;
var startAngle:float;
var dipAngle:float;
var dipWidth:float;

function Start () {
	bumps = Random.Range(1, 6);
	startAngle = Random.Range(0, 2*Mathf.PI);
	dipAngle = Random.Range(0, 2*Mathf.PI);
	dipWidth = Random.Range(0.2, 0.7);
	
	map = new boolean[map_width * map_height];
	for(var m:int = 0; m < map.length; m++) {
		map[m] = inside(
			(m % map_width) - map_width/2, 
			Mathf.FloorToInt(m / map_width) - map_width/2
		);
		//map[m] = true;
	}
	

}

function inside(x:int, y:int):boolean {
  var angle:float = Mathf.Atan2(y, x);
  var length:float = threshold * 0.01 *(Mathf.Max(Mathf.Abs(x), Mathf.Abs(y)) + Mathf.Sqrt((x*x) + (y*y)));

  var r1:float = 0.5 + 0.40 * Mathf.Sin(startAngle + bumps*angle + Mathf.Cos((bumps+3)*angle));
  var r2:float = 0.7 - 0.20 * Mathf.Sin(startAngle + bumps*angle - Mathf.Sin((bumps+2)*angle));
  if (Mathf.Abs(angle - dipAngle) < dipWidth
      || Mathf.Abs(angle - dipAngle + 2*Mathf.PI) < dipWidth
      || Mathf.Abs(angle - dipAngle - 2*Mathf.PI) < dipWidth) {
    r1 = r2 = 0.2;
  }
  return (length < r1 || (length > r1*ISLAND_FACTOR && length < r2));
}



function Update () {

	//map = new boolean[map_width * map_height];
	for(var n:int = 0; n < map.length; n++) {
		map[n] = inside(
			(n % map_width) - map_width/2, 
			Mathf.FloorToInt(n / map_width) - map_width/2
		);
		//map[m] = true;
	}

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
		if(map[m] == true) {
			q = m % map_width;
			r = Mathf.FloorToInt(m / map_width);
			
			x = -q * size * 1.5;
			z = ((r * Mathf.Sqrt(3)) + ((q % 2) * Mathf.Sqrt(3)/2)) * size; //- ((q - ()) * ( * (size * 1.5))) ;
			y = 0;// proper: -x - z;
			
			x += gameObject.transform.position.x;
			y += gameObject.transform.position.y;
			z += gameObject.transform.position.z;
			
			// center vert
			verts.Push(Vector3(x, y, z));		
			normals.Push(Vector3.up);
			uvs.Push(Vector2(x * tiling_u, z * tiling_v));
			
			for(var i:int = 0; i < sides; i++) {
				__angle = ((2 * Mathf.PI) / 6) * i;
				x_i = x + (size * Mathf.Cos(__angle));
				y_i = y;
				z_i = z + (size * Mathf.Sin(__angle));
				
				verts.Push(Vector3(x_i, y_i, z_i));		
				normals.Push(Vector3.up);
				//uvs.Push(Vector2((x_i % 1) * (x_i/Mathf.Abs(x_i)), (z_i % 1) * (z_i/Mathf.Abs(z_i))));
				uvs.Push(Vector2(x_i * tiling_u, z_i * tiling_v));
				
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

	mesh.vertices = verts.ToBuiltin(Vector3) as Vector3[];
	mesh.normals = normals.ToBuiltin(Vector3) as Vector3[];
	mesh.uv = uvs.ToBuiltin(Vector2) as Vector2[];
	mesh.triangles = tris.ToBuiltin(int) as int[];
	//mesh.RecalculateBounds();
}

