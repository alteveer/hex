class Cartographer {

	var threshold:float = 1.8f;

	var ISLAND_FACTOR:float = 0.5f;  // 1.0 means no small islands; 2.0 leads to a lot
	var bumps:int;
	var startAngle:float;
	var dipAngle:float;
	var dipWidth:float;


	function Cartographer() {	}
	
	function generate_randoms() {
		bumps = Random.Range(1, 6);
		startAngle = Random.Range(0, 2*Mathf.PI);
		dipAngle = Random.Range(0, 2*Mathf.PI);
		dipWidth = Random.Range(0.2, 0.7);
	}

	function test_radial(x:int, y:int):boolean {
	  var angle:float = Mathf.Atan2(y, x);
	  var length:float = threshold * 0.01 * (Mathf.Max(Mathf.Abs(x), Mathf.Abs(y)) + Mathf.Sqrt((x*x) + (y*y)));

	  var r1:float = 0.5 + 0.40 * Mathf.Sin(startAngle + bumps*angle + Mathf.Cos((bumps+3)*angle));
	  var r2:float = 0.7 - 0.20 * Mathf.Sin(startAngle + bumps*angle - Mathf.Sin((bumps+2)*angle));
	  if (Mathf.Abs(angle - dipAngle) < dipWidth
	      || Mathf.Abs(angle - dipAngle + 2*Mathf.PI) < dipWidth
	      || Mathf.Abs(angle - dipAngle - 2*Mathf.PI) < dipWidth) {
	    r1 = r2 = 0.2;
	  }
	  return (length < r1 || (length > r1*ISLAND_FACTOR && length < r2));
	}
}