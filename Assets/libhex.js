#pragma strict

//static function cube2axial (x:float, y:float, z:float) {
//	Debug.Log("libhex function");
//}
static function cube2axial(cube_coords:Vector3):Vector2 {
//	var __q = -axial_coords.x * 1.5;
//	var __r = (axial_coords.y + ((axial_coords.x % 2) / 2)) * Mathf.Sqrt(3);
//	return Vector3(__x, -__x - __z, __z);	
}

static function axial2cube(axial_coords:Vector2):Vector3 {
	var __x = -axial_coords.x;
	var __z = (axial_coords.y - ((axial_coords.x % 2) / 2));
	return Vector3(__x, -__x - __z, __z);
}
//static function neighbors(cube_coords)