#pragma strict

var map:hexmap;
var map_dimensions:Vector2;
var map_center:Vector2;
var target:Vector3;

var zoom_level_current:int = 0;
var zoom_levels:Vector3[];

function Start () {

	map = GameObject.Find("Tilemap").GetComponent(hexmap);
	Debug.Log("Map size: " + map.size);
	map_dimensions.x = map.map_width * map.size * libhex.tile_horiz_spacing(map.size);
	map_dimensions.y = map.map_height * map.size * libhex.tile_vert_spacing(map.size);
	map_center = Vector2(
		Mathf.RoundToInt(map_dimensions.x / 2),
		Mathf.RoundToInt(map_dimensions.y / 2));

	Debug.Log("Map size: " + map_dimensions + ": " + map_center);
	
	zoom_levels = new Vector3[3];
	zoom_levels[0] = Vector3(0, 30, -10);
	zoom_levels[1] = Vector3(0, 60, -20);
	zoom_levels[2] = Vector3(0, 90, -30);

	target = Vector3(map_center.x, 0, map_center.y);
	from = target;
}

var frustum_width:float;
var frustum_height:float;
var from:Vector3;
var start_lerp:float;

function Update () {
	if(Input.GetAxis("mwheel") < 0) {
		zoom_level_current += 1;
		if(zoom_level_current >= zoom_levels.Length) { zoom_level_current = zoom_levels.Length - 1; }
	}
	if(Input.GetAxis("mwheel") > 0) {
		zoom_level_current -= 1;
		if(zoom_level_current < 0) { zoom_level_current = 0; }
	}
	
	if(Input.GetMouseButtonUp(0) && map.hit.point != null) {
		target = map.hit.point;
		from = this.transform.position - offset();
		start_lerp = Time.time;
	}
	
	this.transform.position = Vector3.Lerp(from, target, Time.time - start_lerp) + offset();
	
	frustum_height = 2.0 * offset().magnitude * Mathf.Tan(camera.fieldOfView * 0.5 * Mathf.Deg2Rad);
	frustum_width = frustum_height * camera.aspect;

	//Debug.Log(frustum_width + " : " + frustum_height);
}

function offset():Vector3 {
	return zoom_levels[zoom_level_current];
}