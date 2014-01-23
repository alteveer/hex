
// Use this for initialization
class TileMap {

	var _width;
	var _height;
	
	var _tile_radius: float = 5;
	
	var _tile_list:Tile[];	
	
	var distance_to_edge:int;


	var tiling_u:float = 1;
	var tiling_v:float = 1;

	var x:float;
	var y:float;
	var z:float;
	var q:float;
	var r:float;

	var index_lookup:ArrayList;
	var __index_additions = [0, 2, 1, 0, 3, 2, 0, 4, 3, 0, 5, 4, 0, 6, 5, 0, 1, 6];

	var mesh:Mesh;
	var mesh_col:MeshCollider;	
	var highlight:GameObject;
	var highlight_mesh:Mesh;
	
	function TileMap(width:int, height:int) {
		this._width = width;
		this._height = height;		
		
		this.highlight = new GameObject();
		this.highlight.AddComponent(MeshRenderer);
		this.highlight.renderer.material = new Material(Shader.Find(" Diffuse"));
		this.highlight.renderer.material.color = Color(1, 0, 0, 0.5);
		
		var highlight_mf = this.highlight.AddComponent(MeshFilter);
		this.highlight_mesh = new Mesh();
		highlight_mf.mesh = this.highlight_mesh;
		
		rebuild_mesh()
	}
	
	function get width() : int { return _width; }
	function get height() : int { return _height; }
	function get tile_radius() : float { return _tile_radius; }

	
	var x_i:float;
	var y_i:float;
	var z_i:float;

	var __verts:ArrayList;
	var __colors:ArrayList;
	var __normals:ArrayList;
	var __tris:ArrayList;
	var __uvs:ArrayList;											

	function index2coords(index:int):Vector2 {
		return Vector2(index % this._width, Mathf.FloorToInt(index / this._width))
	}

	function coords2index(coords:Vector2):int {
		return 0;
	}

	function regenerate_map() {
		cart = new Cartographer();
		map = new Tile[map_width * map_height];
		var contents;
		var coords:Vector2;
		for(var m:int = 0; m < map.length; m++) {
			coords = index2coords(m);
			if(inside( - map_width/2, Mathf.FloorToInt(m / map_width) - map_height/2)) {
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
			
	function rebuild_mesh() {
		
		mesh.Clear();
		
		// Do some calculations...
		
		__verts = new ArrayList();
		__colors = new ArrayList();
		__normals = new ArrayList();
		__tris = new ArrayList();
		__uvs = new ArrayList();
		
		index_lookup = new ArrayList();
		
		var current_tile:Tile;
		var center_position:Vector3;
		var __idx:int = 0;
		var __angle: float;
		
		for(var m:int = 0; m < map.length; m++) {
			current_tile = _tile_list[m];
			q = m % _width;
			r = Mathf.FloorToInt(m / _width);
			
			if(current_tile.contents == Tile.Contents.Water) {
				continue;
			}
			
			center_position = libhex.cube2world(libhex.oddq2cube(Vector2(q, r)), _tile_radius);
			center_position.y = 0;
							
			current_tile.world_coords = center_position;
			
			//center_position += transform.position;
			
			// center vert
			__verts.Add(center_position);		
			__colors.Add(Tile.Colors[current_tile.contents]);
			__normals.Add(Vector3.up);
			__uvs.Add(Vector2(center_position.x * tiling_u, center_position.z * tiling_v));
			
			for(var i:int = 0; i < 6; i++) {
				__angle = ((2 * Mathf.PI) / 6) * i;
				x_i = center_position.x + (_tile_radius * Mathf.Cos(__angle));
				y_i = center_position.y;
				z_i = center_position.z + (_tile_radius * Mathf.Sin(__angle));
				
				__verts.Add(Vector3(x_i, y_i, z_i));		
				__colors.Add(Tile.Colors[current_tile.contents]);
				__normals.Add(Vector3.up);
				//__uvs.Add(Vector2((x_i % 1) * (x_i/Mathf.Abs(x_i)), (z_i % 1) * (z_i/Mathf.Abs(z_i))));
				__uvs.Add(Vector2(x_i * tiling_u, z_i * tiling_v));
				
	//			__tris.Add(__idx);
	//			//current_tile.index_list
	//			if(i + 1 == 6) {
	//				__tris.Add(__idx + 1);	
	//			} else {
	//				__tris.Add(__idx + i + 2);
	//			}
	//			__tris.Add(__idx + i + 1);
				
			}
			var tmp_indices:ArrayList = new ArrayList();
			for(var j:int = 0; j < __index_additions.Length; j++) {
				tmp_indices.Add(__idx + __index_additions[j]);
				index_lookup.Add(m);
			}
			__tris.AddRange(tmp_indices);
			current_tile.tris = tmp_indices;
			__idx += 7;
			
		}

		__idx.vertices = __verts.ToArray(Vector3) as Vector3[];
		mesh.colors = __colors.ToArray(Color) as Color[];
		original_colors = __colors;
		mesh.normals = __normals.ToArray(Vector3) as Vector3[];
		mesh.uv = __uvs.ToArray(Vector2) as Vector2[];
		mesh.triangles = __tris.ToArray(int) as int[];
		
		mesh_col.sharedMesh = mesh;
		// hack to get it to propogate immediately.
		mesh_col.enabled = false;
		mesh_col.enabled = true;
		
	}
    
            
}


