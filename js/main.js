(function () { "use strict";
var $estr = function() { return js.Boot.__string_rec(this,''); };
var Enumerator = function() { }
Enumerator.__name__ = true;
Enumerator.as_enumerable = function(iter) {
	return { iterator : function() {
		return iter;
	}};
}
Enumerator.product = function(xs,ys) {
	return Enumerator.flatmap(Lambda.map(xs,function(x) {
		return Lambda.map(ys,function(y) {
			return [x,y];
		});
	}),function(i) {
		return i;
	});
}
Enumerator.flatmap = function(xs,func) {
	return Lambda.fold(xs,function(xs1,xs2) {
		return Lambda.concat(func(xs1),func(xs2));
	},Lambda.list([]));
}
var HxOverrides = function() { }
HxOverrides.__name__ = true;
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var IntIterator = function(min,max) {
	this.min = min;
	this.max = max;
};
IntIterator.__name__ = true;
IntIterator.prototype = {
	next: function() {
		return this.min++;
	}
	,hasNext: function() {
		return this.min < this.max;
	}
	,__class__: IntIterator
}
var Lambda = function() { }
Lambda.__name__ = true;
Lambda.list = function(it) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		l.add(i);
	}
	return l;
}
Lambda.map = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(x));
	}
	return l;
}
Lambda.filter = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) l.add(x);
	}
	return l;
}
Lambda.fold = function(it,f,first) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		first = f(x,first);
	}
	return first;
}
Lambda.count = function(it,pred) {
	var n = 0;
	if(pred == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var _ = $it0.next();
			n++;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(pred(x)) n++;
		}
	}
	return n;
}
Lambda.concat = function(a,b) {
	var l = new List();
	var $it0 = $iterator(a)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(x);
	}
	var $it1 = $iterator(b)();
	while( $it1.hasNext() ) {
		var x = $it1.next();
		l.add(x);
	}
	return l;
}
var List = function() {
	this.length = 0;
};
List.__name__ = true;
List.prototype = {
	map: function(f) {
		var b = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			b.add(f(v));
		}
		return b;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,__class__: List
}
var Main = function() { }
Main.__name__ = true;
Main.main = function() {
	var boad = js.Boot.__cast(js.Browser.document.getElementById("draw") , HTMLCanvasElement);
	var life_game = new GameOfLife(boad);
	life_game.start();
}
var Seed = { __ename__ : true, __constructs__ : ["Alive","Dead"] }
Seed.Alive = function(v) { var $x = ["Alive",0,v]; $x.__enum__ = Seed; $x.toString = $estr; return $x; }
Seed.Dead = function(v) { var $x = ["Dead",1,v]; $x.__enum__ = Seed; $x.toString = $estr; return $x; }
var GameOfLife = function(canvas) {
	this.generation = new Generation(canvas,100);
};
GameOfLife.__name__ = true;
GameOfLife.prototype = {
	start: function() {
		this.generation.next();
		haxe.Timer.delay($bind(this,this.start),100);
	}
	,__class__: GameOfLife
}
var Generation = function(canvas,tick_length) {
	this._initialize_canvas(canvas);
	this.drawing_context = canvas.getContext("2d");
	this.tick_length = tick_length;
	this.current_cell_generation = this.seed();
	this.draw_grid();
};
Generation.__name__ = true;
Generation.prototype = {
	next: function() {
		this.draw_grid();
		this.evolve_cell_generation();
	}
	,count_alive_neighbors: function(cell) {
		var current_generation = this.current_cell_generation;
		var lower_row_bound = Math.max(cell.row - 1,0) | 0;
		var upper_row_bound = Math.min(cell.row + 1,79) | 0;
		var lower_column_bound = Math.max(cell.column - 1,0) | 0;
		var upper_column_bound = Math.min(cell.column + 1,79) | 0;
		var number_of_alive_neighbors = Lambda.count(Enumerator.flatmap(Lambda.map(Enumerator.as_enumerable(new IntIterator(lower_row_bound,upper_row_bound + 1)),function(row_index) {
			return Lambda.filter(Enumerator.as_enumerable(new IntIterator(lower_column_bound,upper_column_bound + 1)),function(i) {
				return !(cell.row == row_index && cell.column == i);
			}).map(function(column_index) {
				return (function($this) {
					var $r;
					var _g = current_generation[row_index][column_index];
					$r = (function($this) {
						var $r;
						var $e = (_g);
						switch( $e[1] ) {
						case 0:
							var c = $e[2];
							$r = true;
							break;
						default:
							$r = false;
						}
						return $r;
					}($this));
					return $r;
				}(this));
			});
		}),function(xs) {
			return xs;
		}),function(b) {
			return b;
		});
		return number_of_alive_neighbors;
	}
	,evolve_cell: function(previous_cell) {
		var cell = (function($this) {
			var $r;
			var $e = (previous_cell);
			switch( $e[1] ) {
			case 0:
				var c = $e[2];
				$r = c;
				break;
			case 1:
				var c = $e[2];
				$r = c;
				break;
			}
			return $r;
		}(this));
		var number_of_alive_neighbors = this.count_alive_neighbors(cell);
		return (function($this) {
			var $r;
			switch(number_of_alive_neighbors) {
			case 3:
				$r = Seed.Alive(cell);
				break;
			case 2:
				$r = (function($this) {
					var $r;
					var $e = (previous_cell);
					switch( $e[1] ) {
					case 0:
						var c = $e[2];
						$r = Seed.Alive(c);
						break;
					default:
						$r = Seed.Dead(cell);
					}
					return $r;
				}($this));
				break;
			default:
				$r = Seed.Dead(cell);
			}
			return $r;
		}(this));
	}
	,evolve_cell_generation: function() {
		var new_cell_generation = [];
		var _g = 0;
		while(_g < 80) {
			var row = _g++;
			var next_generation = [];
			var _g1 = 0;
			while(_g1 < 80) {
				var column = _g1++;
				var evolved_cell = this.evolve_cell(this.current_cell_generation[row][column]);
				next_generation.push(evolved_cell);
			}
			new_cell_generation.push(next_generation);
		}
		this.current_cell_generation = new_cell_generation;
	}
	,draw_cell: function(cell) {
		var _cell = (function($this) {
			var $r;
			var $e = (cell);
			switch( $e[1] ) {
			case 0:
				var s = $e[2];
				$r = s;
				break;
			case 1:
				var s = $e[2];
				$r = s;
				break;
			}
			return $r;
		}(this));
		var x = _cell.row * 7;
		var y = _cell.column * 7;
		var fillStyle = (function($this) {
			var $r;
			var $e = (cell);
			switch( $e[1] ) {
			case 0:
				var cell1 = $e[2];
				$r = "rgb(242, 198, 65)";
				break;
			case 1:
				var cell1 = $e[2];
				$r = "rgb(38, 38, 38)";
				break;
			}
			return $r;
		}(this));
		this.drawing_context.strokeStyle = "rgba(242, 198, 65, 0.1)";
		this.drawing_context.strokeRect(x,y,7,7);
		this.drawing_context.fillStyle = fillStyle;
		this.drawing_context.fillRect(x,y,7,7);
	}
	,draw_grid: function() {
		var _g = 0;
		while(_g < 80) {
			var row = _g++;
			var _g1 = 0;
			while(_g1 < 80) {
				var column = _g1++;
				this.draw_cell(this.current_cell_generation[row][column]);
			}
		}
	}
	,seed: function() {
		var _current_cell_generation = [];
		var _g = 0;
		while(_g < 80) {
			var row_index = _g++;
			var new_row = [];
			var _g1 = 0;
			while(_g1 < 80) {
				var column_index = _g1++;
				var cell = { row : row_index, column : column_index};
				new_row.push(Std.random(2) < 0.5?Seed.Alive(cell):Seed.Dead(cell));
			}
			_current_cell_generation.push(new_row);
		}
		return _current_cell_generation;
	}
	,_initialize_canvas: function(canvas) {
		this.canvas = canvas;
		canvas.width = 560;
		canvas.height = 560;
	}
	,__class__: Generation
}
var Std = function() { }
Std.__name__ = true;
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std.random = function(x) {
	return x <= 0?0:Math.floor(Math.random() * x);
}
var haxe = {}
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe.Timer.__name__ = true;
haxe.Timer.delay = function(f,time_ms) {
	var t = new haxe.Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
}
haxe.Timer.prototype = {
	run: function() {
		console.log("run");
	}
	,stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,__class__: haxe.Timer
}
var js = {}
js.Boot = function() { }
js.Boot.__name__ = true;
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) {
					if(cl == Array) return o.__enum__ == null;
					return true;
				}
				if(js.Boot.__interfLoop(o.__class__,cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Browser = function() { }
js.Browser.__name__ = true;
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; };
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; };
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = String;
String.__name__ = true;
Array.prototype.__class__ = Array;
Array.__name__ = true;
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
GameOfLife.cellSize = 7;
GameOfLife.numberOfRows = 80;
GameOfLife.numberOfColumns = 80;
GameOfLife.seedProbability = 0.5;
GameOfLife.tickLength = 100;
js.Browser.document = typeof window != "undefined" ? window.document : null;
Main.main();
})();

//@ sourceMappingURL=main.js.map