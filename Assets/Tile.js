
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
	
	var position:Vector3;
	var contents:Contents;
	
	function Tile(_p:Vector3, _c:Contents) {
		this.position = _p;
		this.contents = _c;
		
	}
}

