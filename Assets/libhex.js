#pragma strict

//static function cube2axial (x:float, y:float, z:float) {
//	Debug.Log("libhex function");
//}
static function cube2evenq(cube_coords:Vector3):Vector2 {
	return Vector2(
		cube_coords.x, 
		cube_coords.z + (cube_coords.x + (((cube_coords.x % 2)) / 2))
		);	
}

static function evenq2cube(evenq_coords:Vector2):Vector3 {
	var __x = -evenq_coords.x;
	var __z = (evenq_coords.y + (((evenq_coords.x % 2)) / 2));
	return Vector3(__x, -__x - __z, __z);
}

static var _neighbors:Vector3[] = [
   Vector3(1, -1, 0), 
   Vector3(1, 0, -1), 
   Vector3(0, 1, -1),
   Vector3(-1, 1, 0), 
   Vector3(-1, 0, 1), 
   Vector3(0, -1, 1)
];

static function neighbors(cube_coords:Vector3):Array {
	return [
		_neighbors[0] + cube_coords,
		_neighbors[1] + cube_coords,
		_neighbors[2] + cube_coords,
		_neighbors[3] + cube_coords,
		_neighbors[4] + cube_coords,
		_neighbors[5] + cube_coords
		];
		
}