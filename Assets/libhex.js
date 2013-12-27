#pragma strict

//static function cube2axial (x:float, y:float, z:float) {
//	Debug.Log("libhex function");
//}

//var tile_width = size * 2;
//var tile_height = (Mathf.Sqrt(3)/2) * size * 2;

static function cube2world(cube_coords:Vector3, size:float):Vector3 {
		return Vector3(
			cube_coords.x * (3.0/2.0),
			0,
			(cube_coords.z * Mathf.Sqrt(3))
			) * size;

}

static function world2cube(cube_coords:Vector3, size:float):Vector3 {
		return Vector3(
			cube_coords.x * (2.0/3.0),
			cube_coords.y,
			(cube_coords.z * (1/Mathf.Sqrt(3)))
			) / size;

}

static function hex_round(cube_coords:Vector3):Vector3 {
    var rx = Mathf.RoundToInt(cube_coords.x);
    var ry = Mathf.RoundToInt(cube_coords.y);
    var rz = Mathf.RoundToInt(cube_coords.z);

    var x_diff = Mathf.Abs(rx - cube_coords.x);
    var y_diff = Mathf.Abs(ry - cube_coords.y);
    var z_diff = Mathf.Abs(rz - cube_coords.z);

    if (x_diff > y_diff && x_diff > z_diff) {
        rx = -ry-rz;
    } else if (y_diff > z_diff) {
        ry = -rx-rz;
    } else {
        rz = -rx-ry;
    }
    
    return Vector3(rx, ry, rz);
}

static function cube2axial(cube_coords:Vector3):Vector2 {
	return Vector2(cube_coords.x, cube_coords.z);
}

static function axial2cube(axial_coords:Vector2):Vector3 {
	return Vector3(
		axial_coords.x, 
		-axial_coords.x + -axial_coords.y,
		axial_coords.y
		);
}

static function cube2evenq(cube_coords:Vector3):Vector2 {
	return Vector2(
		cube_coords.x, 
		cube_coords.z + (cube_coords.x + (((cube_coords.x % 2)) / 2))
		);	
}

static function evenq2cube(evenq_coords:Vector2):Vector3 {
	var __x = evenq_coords.x;
	var __z = (evenq_coords.y + (((evenq_coords.x % 2)) / 2));
	return Vector3(__x, -__x - __z, __z);
}

static var _cube_neighbors:Vector3[] = [
   Vector3(1, -1, 0), 
   Vector3(1, 0, -1), 
   Vector3(0, 1, -1),
   Vector3(-1, 1, 0), 
   Vector3(-1, 0, 1), 
   Vector3(0, -1, 1)
];

static var _evenq_neighbors = [
	[
		Vector2( 1,  0), 
	   	Vector2( 1, -1), 
	   	Vector2( 0, -1),
	   	Vector2(-1, -1), 
	   	Vector2(-1,  0), 
	   	Vector2( 0,  1)
	], [
		Vector2( 1,  1), 
	   	Vector2( 1,  0), 
	   	Vector2( 0, -1),
	   	Vector2(-1,  0), 
	   	Vector2(-1,  1), 
	   	Vector2( 0,  1)
	]
];


static function neighbors_cube(cube_coords:Vector3):Array {
	return [
		_cube_neighbors[0] + cube_coords,
		_cube_neighbors[1] + cube_coords,
		_cube_neighbors[2] + cube_coords,
		_cube_neighbors[3] + cube_coords,
		_cube_neighbors[4] + cube_coords,
		_cube_neighbors[5] + cube_coords
		];
		
}
static function neighbors_evenq(evenq_coords:Vector2):Vector2[] {
	
	var mod:int = parseInt(evenq_coords.x) % 2;
	
	return [
		_evenq_neighbors[mod][0] + evenq_coords,
		_evenq_neighbors[mod][1] + evenq_coords,
		_evenq_neighbors[mod][2] + evenq_coords,
		_evenq_neighbors[mod][3] + evenq_coords,
		_evenq_neighbors[mod][4] + evenq_coords,
		_evenq_neighbors[mod][5] + evenq_coords
		];
}