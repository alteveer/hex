//#pragma strict
//
////var newVertices : Vector3[];
////var newUV : Vector2[];
////var newTriangles : int[];
//
//var threshold:float;
//
//var __angle: float;
//var size: float = 5;
//var height_per_level:float = 0.5f;
//
//var x_i:float;
//var y_i:float;
//var z_i:float;
//
//var tiling_u:float = 1;
//var tiling_v:float = 1;
//
//var x:float;
//var y:float;
//var z:float;
//var q:float;
//var r:float;
//
//var __verts:ArrayList;
//var __colors:ArrayList;
//var __normals:ArrayList;
//var __tris:ArrayList;
//var __uvs:ArrayList;
//
//var index_lookup:ArrayList;
//
//var map_width = 90;
//var map_height = 60;
//
//var map:Tile[];
//
//var ISLAND_FACTOR:float = .60;  // 1.0 means no small islands; 2.0 leads to a lot
//var bumps:int;
//var startAngle:float;
//var dipAngle:float;
//var dipWidth:float;
//
//function inside(x:int, y:int):boolean {
//  var angle:float = Mathf.Atan2(y, x);
//  var length:float = threshold * 0.01 *(Mathf.Max(Mathf.Abs(x), Mathf.Abs(y)) + Mathf.Sqrt((x*x) + (y*y)));
//
//  var r1:float = 0.5 + 0.40 * Mathf.Sin(startAngle + bumps*angle + Mathf.Cos((bumps+3)*angle));
//  var r2:float = 0.7 - 0.20 * Mathf.Sin(startAngle + bumps*angle - Mathf.Sin((bumps+2)*angle));
//  if (Mathf.Abs(angle - dipAngle) < dipWidth
//      || Mathf.Abs(angle - dipAngle + 2*Mathf.PI) < dipWidth
//      || Mathf.Abs(angle - dipAngle - 2*Mathf.PI) < dipWidth) {
//    r1 = r2 = 0.2;
//  }
//  return (length < r1 || (length > r1*ISLAND_FACTOR && length < r2));
//}
//
//
//
//
//function find_distance_to_edge(tile_coords:Vector2):int {
//	var cube_coords:Vector3 = libhex.oddq2cube(tile_coords);
//	var results:Array;
//	var x:int;
//	var y:int;
//	var z:int;
//	var n:int;
//	//Debug.Log(Mathf.Min(map_width, map_height));
//	
//	for(n = 0; n < Mathf.Min(map_width, map_height); n++) {
//		results = [];
//		for(x = -n; x <= n; x++) {
//			for(y = Mathf.Max(-n, -x-n); y <= Mathf.Min(n, -x+n); y++) {
//				z = -x-y;
//				results.push(cube_coords + Vector3(x, y, z));
//			}
//		}
//		var t:Vector2;
//		var check_value:int;
//		for(var r:int = 0; r < results.length; r++) {
//			t = libhex.cube2oddq(results[r]);
//			check_value = t.x + (t.y * map_width);
//			if(check_value > 0 && check_value < map.length) {
//				if(map[t.x + (t.y * map_width)].contents == Tile.Contents.Water) {
//					return n;
//				}
//			}
//		}
//	}
//	return 0;
//}
//
//
//
//var tilemap_mesh:Mesh;
//var tilemap_mesh_col:MeshCollider;
//var highlight_mesh:Mesh;
//
//var index_additions:int[];
//
//function Start () {
//
//	
//	if(bumps == 0 && startAngle == 0 && dipAngle == 0 && dipWidth == 0) {
//		generate_randoms();
//	}
//	regenerate_map();
//	
//}
//
//function rebuild_mesh() {
//	
//	tilemap_mesh.Clear();
//	
//	// Do some calculations...
//	
//	__verts = new ArrayList();
//	__colors = new ArrayList();
//	__normals = new ArrayList();
//	__tris = new ArrayList();
//	__uvs = new ArrayList();
//	
//	index_lookup = new ArrayList();
//	
//	var current_tile:Tile;
//	var center_position:Vector3;
//	var idx:int = 0;
//	
//	for(var m:int = 0; m < map.length; m++) {
//		current_tile = map[m];
//		q = m % map_width;
//		r = Mathf.FloorToInt(m / map_width);
//		
//		if(current_tile.contents == Tile.Contents.Water) {
//			continue;
//		}
//		
//		center_position = libhex.cube2world(libhex.oddq2cube(Vector2(q, r)), size);
//		center_position.y = current_tile.distance_to_edge * height_per_level;
//						
//		current_tile.world_coords = center_position;
//		
//		center_position += gameObject.transform.position;
//		
//		// center vert
//		__verts.Add(center_position);		
//		__colors.Add(Tile.Colors[current_tile.contents]);
//		__normals.Add(Vector3.up);
//		__uvs.Add(Vector2(center_position.x * tiling_u, center_position.z * tiling_v));
//		
//		for(var i:int = 0; i < 6; i++) {
//			__angle = ((2 * Mathf.PI) / 6) * i;
//			x_i = center_position.x + (size * Mathf.Cos(__angle));
//			y_i = center_position.y;
//			z_i = center_position.z + (size * Mathf.Sin(__angle));
//			
//			__verts.Add(Vector3(x_i, y_i, z_i));		
//			__colors.Add(Tile.Colors[current_tile.contents]);
//			__normals.Add(Vector3.up);
//			//__uvs.Add(Vector2((x_i % 1) * (x_i/Mathf.Abs(x_i)), (z_i % 1) * (z_i/Mathf.Abs(z_i))));
//			__uvs.Add(Vector2(x_i * tiling_u, z_i * tiling_v));
//			
////			__tris.Add(idx);
////			//current_tile.index_list
////			if(i + 1 == 6) {
////				__tris.Add(idx + 1);	
////			} else {
////				__tris.Add(idx + i + 2);
////			}
////			__tris.Add(idx + i + 1);
//			
//		}
//		var tmp_indices:ArrayList = new ArrayList();
//		for(var j:int = 0; j < index_additions.Length; j++) {
//			tmp_indices.Add(idx + index_additions[j]);
//			index_lookup.Add(m);
//		}
//		__tris.AddRange(tmp_indices);
//		current_tile.tris = tmp_indices;
//		idx += 7;
//		
//	}
//
//	tilemap_mesh.vertices = __verts.ToArray(Vector3) as Vector3[];
//	tilemap_mesh.colors = __colors.ToArray(Color) as Color[];
//	original_colors = __colors;
//	tilemap_mesh.normals = __normals.ToArray(Vector3) as Vector3[];
//	tilemap_mesh.uv = __uvs.ToArray(Vector2) as Vector2[];
//	tilemap_mesh.triangles = __tris.ToArray(int) as int[];
//	
//	tilemap_mesh_col.sharedMesh = tilemap_mesh;
//	// hack to get it to propogate immediately.
//	tilemap_mesh_col.enabled = false;
//	tilemap_mesh_col.enabled = true;
//	
//}
//
//var update_mesh = false;
//var hit : RaycastHit;
//var _tile:Tile;
//
//function Update () {
//	if(Input.GetKeyUp ("space")) {
//		generate_randoms();
//		regenerate_map();
//		return;
//	}
//	if(update_mesh) {
//		regenerate_map();
//	}
//
//	var ray = Camera.main.ScreenPointToRay (Input.mousePosition);
//	
//	if (Physics.Raycast (ray, hit, 1000)) {
//		//Debug.DrawLine (Vector3(), hit.point);
//		debug_point = hit.point;
//		//debug_point2.x = hit.triangleIndex;
//		//debug_point2.y = Mathf.RoundToInt(hit.triangleIndex/6);//(hit.triangleIndex / 6) / map_height;
//		//debug_point2.z = (hit.triangleIndex / 6) % map_height;
//		//debug_point2 = libhex.hex_round(libhex.world2cube(hit.point, size));
//		//tile_coords = Vector2(
//		//		Mathf.RoundToInt(hit.triangleIndex / 6) % map_width, 
//		//		Mathf.RoundToInt(hit.triangleIndex / 6) / map_width);
//
//		//map[index_lookup[hit.triangleIndex * 3]].coords;
//		_tile = map[index_lookup[hit.triangleIndex * 3]];
//		
////		var neighbor_coords:Vector2[] = libhex.neighbors_oddq(
////			_tile.coords
////		);
//		var to_highlight:ArrayList = new ArrayList();
//		var cube_coords:Vector3 = libhex.oddq2cube(_tile.coords);
//		var n = 2;
//		for(x = -n; x <= n; x++) {
//			for(y = Mathf.Max(-n, -x-n); y <= Mathf.Min(n, -x+n); y++) {
//				z = -x-y;
//				to_highlight.Add(cube_coords + Vector3(x, y, z));
//			}
//		}
//
////		for(var n:Vector2 in neighbor_coords) {
////			to_highlight.Add(map[n.x + (n.y * map_width)]);
////		}
//		highlight_tiles(to_highlight.ToArray(Tile) as Tile[]);
//		//color_hexes();
//		
//		
//		debug_point2.x = _tile.coords.x;
//		debug_point2.y = _tile.coords.y;
//		debug_point2.z = find_distance_to_edge(_tile.coords);
//	}
//}
//
//
//function highlight_tiles(tiles:Tile[]) {
//	highlight_mesh.Clear();
//	
//	__verts = new ArrayList();
//	__normals = new ArrayList();
//	__tris = new ArrayList();
//	__uvs = new ArrayList();
//	
//	var idx:int = 0;
//	
//	for(var tile:Tile in tiles) {
//		if(tile.world_coords == Vector3()) {
//			continue;
//		}
//		
//		var center_position = tile.world_coords;
//		
//		
//		__verts.Add(center_position);
//		__normals.Add(Vector3.up);
//		__uvs.Add(Vector2(center_position.x * tiling_u, center_position.z * tiling_v));
//
//		for(var i:int = 0; i < 6; i++) {
//			__angle = ((2 * Mathf.PI) / 6) * i;
//			x_i = center_position.x + (size * Mathf.Cos(__angle));
//			y_i = center_position.y;
//			z_i = center_position.z + (size * Mathf.Sin(__angle));
//			
//			__verts.Add(Vector3(x_i, y_i, z_i));		
//			
//			__normals.Add(Vector3.up);
//			__uvs.Add(Vector2(x_i * tiling_u, z_i * tiling_v));
//			
//		}
//		var tmp_indices:ArrayList = new ArrayList();
//		for(var j:int = 0; j < index_additions.Length; j++) {
//			tmp_indices.Add(idx + index_additions[j]);
//		}
//		__tris.AddRange(tmp_indices);	
//		idx += 7;
//	}
//	highlight_mesh.vertices = __verts.ToArray(Vector3) as Vector3[];	
//	highlight_mesh.triangles = __tris.ToArray(int) as int[];
//	highlight_mesh.normals = __normals.ToArray(Vector3) as Vector3[];
//	highlight_mesh.uv = __uvs.ToArray(Vector2) as Vector2[];
//	
//}
//
////function color_hexes2(indexes:Vector2[]) {	
////	
////	var mesh : Mesh = GetComponent(MeshFilter).mesh;
////	
////	//debug_color = mesh.colors[idx];
////	
////	var colors:Color[] = original_colors.ToArray(Color) as Color[];
////	for(var index:int = 0; index < indexes.Length; index++) {
////		var coords:Vector2 = indexes[index];
////		idx = (coords.x + (coords.y * map_width)) * 7;
////		for(var i:int = 0; i < 7; i++) {
////			if(idx + i > 0 && idx + i < colors.Length) {
////				colors[idx+i] = Color(1, 0, 0, 1);
////			}
////		}
////	}
////	mesh.colors = colors;
////	
////}
//var original_colors:ArrayList;
//var debug_point:Vector3 = Vector3();
//var debug_point2:Vector3 = Vector3();
//var debug_color:Color = Color();
//
//function OnGUI() {
//	GUILayout.Label(debug_point.ToString("0.000"));
//	GUILayout.Label(debug_point2.ToString("0.000"));
//	GUILayout.Label(debug_color.ToString("0.0"));
//}