﻿#pragma strict

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

var verts:ArrayList;
var colors:ArrayList;
var normals:ArrayList;
var tris:ArrayList;
var uvs:ArrayList;

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

function find_distance_to_edge(tile_coords:Vector2):int {
	var cube_coords:Vector3 = libhex.oddq2cube(tile_coords);
	var results:Array;
	var x:int;
	var y:int;
	var z:int;
	var n:int;
	//Debug.Log(Mathf.Min(map_width, map_height));
	
	for(n = 0; n < Mathf.Min(map_width, map_height); n++) {
		results = [];
		for(x = -n; x <= n; x++) {
			for(y = Mathf.Max(-n, -x-n); y <= Mathf.Min(n, -x+n); y++) {
				z = -x-y;
				results.push(cube_coords + Vector3(x, y, z));
			}
		}
		var t:Vector2;
		for(var r:int = 0; r < results.length; r++) {
			t = libhex.cube2oddq(results[r]);
			if(t.x + (t.y * map_width) < map.length) {
				if(map[t.x + (t.y * map_width)].contents == Tile.Contents.Water) {
					return n;
				}
			}
		}
	}
	return 0;
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
		map[m] = Tile(Vector2(m % map_width, m / map_width), contents);
		//map[m] = true;
	}
	
	for(var t:Tile in map) {
		if(t.contents != Tile.Contents.Water) {
			t.distance_to_edge = find_distance_to_edge(t.coords);
		}
	}
	
	rebuild_mesh();

}

function Start () {
	if(bumps == 0 && startAngle == 0 && dipAngle == 0 && dipWidth == 0) {
		generate_randoms();
	}
	regenerate_map();
	
}



function rebuild_mesh() {
	var mesh : Mesh = GetComponent(MeshFilter).mesh;
	mesh.Clear();
	// Do some calculations...
	var center_position:Vector3;
	idx = 0;
	verts = new ArrayList();
	colors = new ArrayList();
	normals = new ArrayList();
	tris = new ArrayList();
	uvs = new ArrayList();
	
	var current_tile:Tile;
	var index_additions = [0, 2, 1, 0, 3, 2, 0, 4, 3, 0, 5, 4, 0, 6, 5, 0, 1, 6];
		
	for(var m:int = 0; m < map.length; m++) {
		current_tile = map[m];
		q = m % map_width;
		r = Mathf.FloorToInt(m / map_width);
		
		if(current_tile.contents == Tile.Contents.Water) {
			//continue;
		}
		
		center_position = libhex.cube2world(libhex.oddq2cube(Vector2(q, r)), size);
		center_position.y = current_tile.distance_to_edge;
						
		//current_tile.position = center_position;
		
		center_position += gameObject.transform.position;
		
		// center vert
		verts.Add(center_position);		
		colors.Add(Tile.Colors[current_tile.contents]);
		normals.Add(Vector3.up);
		uvs.Add(Vector2(center_position.x * tiling_u, center_position.z * tiling_v));
		
		for(var i:int = 0; i < 6; i++) {
			__angle = ((2 * Mathf.PI) / 6) * i;
			x_i = center_position.x + (size * Mathf.Cos(__angle));
			y_i = center_position.y;
			z_i = center_position.z + (size * Mathf.Sin(__angle));
			
			verts.Add(Vector3(x_i, y_i, z_i));		
			colors.Add(Tile.Colors[current_tile.contents]);
			normals.Add(Vector3.up);
			//uvs.Add(Vector2((x_i % 1) * (x_i/Mathf.Abs(x_i)), (z_i % 1) * (z_i/Mathf.Abs(z_i))));
			uvs.Add(Vector2(x_i * tiling_u, z_i * tiling_v));
			
//			tris.Add(idx);
//			//current_tile.index_list
//			if(i + 1 == 6) {
//				tris.Add(idx + 1);	
//			} else {
//				tris.Add(idx + i + 2);
//			}
//			tris.Add(idx + i + 1);
			
		}
		
		for(var j:int = 0; j < index_additions.Length; j++) {
			tris.Add(idx + index_additions[j]);
		}
		
		
		idx += 7;
		
	}

	mesh.vertices = verts.ToArray(Vector3) as Vector3[];
	mesh.colors = colors.ToArray(Color) as Color[];
	original_colors = colors;
	mesh.normals = normals.ToArray(Vector3) as Vector3[];
	mesh.uv = uvs.ToArray(Vector2) as Vector2[];
	mesh.triangles = tris.ToArray(int) as int[];
	var mesh_col:MeshCollider = GetComponent(MeshCollider);
	mesh_col.sharedMesh = mesh;
	// hack to get it to propogate immediately.
	mesh_col.enabled = false;
	mesh_col.enabled = true;
	
}

var update_mesh = false;
var hit : RaycastHit;
var tile_coords:Vector2;

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
	
	if (Physics.Raycast (ray, hit, 1000)) {
		//Debug.DrawLine (Vector3(), hit.point);
		debug_point = hit.point;
		//debug_point2.x = hit.triangleIndex;
		//debug_point2.y = Mathf.RoundToInt(hit.triangleIndex/6);//(hit.triangleIndex / 6) / map_height;
		//debug_point2.z = (hit.triangleIndex / 6) % map_height;
		//debug_point2 = libhex.hex_round(libhex.world2cube(hit.point, size));
		tile_coords = Vector2(
				Mathf.RoundToInt(hit.triangleIndex / 6) % map_width, 
				Mathf.RoundToInt(hit.triangleIndex / 6) / map_width);
		color_hexes(libhex.neighbors_oddq(tile_coords));
		debug_point2.x = tile_coords.x;
		debug_point2.y = tile_coords.y;
		debug_point2.z = find_distance_to_edge(tile_coords);
	}
}


function color_hexes(indexes:Vector2[]) {	
	
	var mesh : Mesh = GetComponent(MeshFilter).mesh;
	
	//debug_color = mesh.colors[idx];
	
	var colors:Color[] = original_colors.ToArray(Color) as Color[];
	for(var index:int = 0;index < indexes.Length; index++) {
		var coords:Vector2 = indexes[index];
		idx = (coords.x + (coords.y * map_width)) * 7;
		for(var i:int = 0; i < 7; i++) {
			if(idx + i > 0 && idx + i < colors.Length) {
				colors[idx+i] = Color(1, 0, 0, 1);
			}
		}
	}
	mesh.colors = colors;
	
}
var original_colors:ArrayList;
var debug_point:Vector3 = Vector3();
var debug_point2:Vector3 = Vector3();
var debug_color:Color = Color();

function OnGUI() {
	GUILayout.Label(debug_point.ToString("0.000"));
	GUILayout.Label(debug_point2.ToString("0.000"));
	GUILayout.Label(debug_color.ToString("0.0"));
}