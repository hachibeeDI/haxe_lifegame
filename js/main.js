(function () { "use strict";
var $estr = function() { return js.Boot.__string_rec(this,''); };
var Enumerator = function() { }
Enumerator.as_enumerable = function(iter) {
	return { iterator : function() {
		return iter;
	}};
}
Enumerator.flatmap = function(xs,func) {
	return Lambda.fold(xs,function(xs1,xs2) {
		return Lambda.concat(func(xs1),func(xs2));
	},Lambda.list([]));
}
var HxOverrides = function() { }
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
IntIterator.prototype = {
	next: function() {
		return this.min++;
	}
	,hasNext: function() {
		return this.min < this.max;
	}
}
var Lambda = function() { }
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
}
var Main = function() { }
Main.main = function() {
	var boad = js.Browser.document.getElementById("draw");
	var life_game = new GameOfLife(boad);
	life_game.start();
}
var Seed = { __constructs__ : ["Alive","Dead"] }
Seed.Alive = function(v) { var $x = ["Alive",0,v]; $x.__enum__ = Seed; $x.toString = $estr; return $x; }
Seed.Dead = function(v) { var $x = ["Dead",1,v]; $x.__enum__ = Seed; $x.toString = $estr; return $x; }
var GameOfLife = function(canvas) {
	this.generation = new Generation(canvas,100);
};
GameOfLife.prototype = {
	start: function() {
		this.generation.next();
		haxe.Timer.delay($bind(this,this.start),100);
	}
}
var Generation = function(canvas,tick_length) {
	this._initialize_canvas(canvas);
	this.drawing_context = canvas.getContext("2d");
	this.tick_length = tick_length;
	this.current_cell_generation = this.seed();
	this.draw_grid();
};
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
}
var Std = function() { }
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
}
var js = {}
js.Browser = function() { }
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
js.Browser.document = typeof window != "undefined" ? window.document : null;
Main.main();
})();

//@ sourceMappingURL=main.js.map