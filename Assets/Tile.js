
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
	var contents:Contents;
	var distance_to_edge:int;
	
	function Tile(_coords:Vector3, _contents:Contents) {
		this.coords = _coords;
		this.contents = _contents;
		
	}
}

