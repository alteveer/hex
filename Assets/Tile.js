
// Use this for initialization
class Tile {
	enum Contents {
		Water,
		Grass
	};
	static var Colors = {
		Contents.Water: Color(0, 0, 1),
		Contents.Grass: Color(0, 1, 0)
	};
	
	var coords:Vector2;
	var world_coords:Vector3;
	var contents:Contents;
	var distance_to_edge:int;
	var tris:ArrayList;
	
	function Tile(_coords:Vector3, _contents:Contents) {
		this.coords = _coords;
		this.contents = _contents;
		this.tris = new ArrayList();
		this.world_coords = new Vector3();
	}
}

