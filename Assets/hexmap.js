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
var colors:Array;
var normals:Array;
var tris:Array;
var uvs:Array;

var sides:int = 6;

var map_width = 90;
var map_height = 60;

var map:Tile[];

var ISLAND_FACTOR:float = .60;  // 1.0 means no small islands; 2.0 leads to a lot
var bumps:int;
var startAngle:float;
var dipAngle:float;
var dipWidth:float;

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


function generate_randoms() {
	bumps = Random.Range(1, 6);
	startAngle = Random.Range(0, 2*Mathf.PI);
	dipAngle = Random.Range(0, 2*Mathf.PI);
	dipWidth = Random.Range(0.2, 0.7);
}
function regenerate_map() {
	map = new Tile[map_width * map_height];
	var contents;
	for(var m:int = 0; m < map.length; m++) {
		if(inside((m % map_width) - map_width/2, Mathf.FloorToInt(m / map_width) - map_height/2)) {
			contents = Tile.Contents.Grass;
		} else {
			contents = Tile.Contents.Water;
		}
		map[m] = Tile(Vector3(), contents);
		//map[m] = true;
	}
	rebuild_mesh();

}

function Start () {
	if(bumps == 0 && startAngle == 0 && dipAngle == 0 && dipWidth == 0) {
		generate_randoms();
	}
	regenerate_map();
	
}

var update_mesh = false;

function Update () {
	if(Input.GetKeyUp ("space")) {
		generate_randoms();
		regenerate_map();
		return;
	}
	if(update_mesh) {
		regenerate_map();
	}
	

	var ray = Camera.main.ScreenPointToRay (Input.mousePosition);
	var hit : RaycastHit;
	
	if (Physics.Raycast (ray, hit, 1000)) {
		Debug.DrawLine (Vector3(), hit.point);
		debug_point = hit.point;
		color_hex(hit.point);
	}
}

function rebuild_mesh() {
	var mesh : Mesh = GetComponent(MeshFilter).mesh;
	mesh.Clear();
	// Do some calculations...
	var cube_coords:Vector3;
	var center_position:Vector3;
	idx = 0;
	verts = new Array();
	colors = new Array();
	normals = new Array();
	tris = new Array();
	uvs = new Array();
	
	var current_tile:Tile;
	
	for(var m:int = 0; m < map.length; m++) {
		current_tile = map[m];
		q = m % map_width;
		r = Mathf.FloorToInt(m / map_width);
		
		cube_coords = libhex.evenq2cube(Vector2(q, r));
		
		center_position = Vector3();
		center_position.x = cube_coords.x * size * 1.5;
		center_position.y = 0;
		center_position.z = cube_coords.z * Mathf.Sqrt(3) * size;
		
		current_tile.position = center_position;
		
		center_position += gameObject.transform.position;
		
		
		// center vert
		verts.Push(center_position);		
		colors.Push(Tile.Colors[current_tile.contents]);
		normals.Push(Vector3.up);
		uvs.Push(Vector2(center_position.x * tiling_u, center_position.z * tiling_v));
		
		for(var i:int = 0; i < sides; i++) {
			__angle = ((2 * Mathf.PI) / 6) * i;
			x_i = center_position.x + (size * Mathf.Cos(__angle));
			y_i = center_position.y;
			z_i = center_position.z + (size * Mathf.Sin(__angle));
			
			verts.Push(Vector3(x_i, y_i, z_i));		
			colors.Push(Tile.Colors[current_tile.contents]);
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

	mesh.vertices = verts.ToBuiltin(Vector3) as Vector3[];
	mesh.colors = colors.ToBuiltin(Color) as Color[];
	mesh.normals = normals.ToBuiltin(Vector3) as Vector3[];
	mesh.uv = uvs.ToBuiltin(Vector2) as Vector2[];
	mesh.triangles = tris.ToBuiltin(int) as int[];
	var mesh_col:MeshCollider = GetComponent(MeshCollider);
	mesh_col.sharedMesh = mesh;
	// hack to get it to propogate immediately.
	mesh_col.enabled = false;
	mesh_col.enabled = true;
	
}

var debug_point:Vector3 = Vector3();

function color_hex(hex_to_find) {
	
}

function OnGUI() {
	GUI.Label(Rect(0, 0, 400, 30), 	debug_point.ToString("0.000"));
}