package ;

import Enumerator;

import js.html.CanvasElement;
import js.html.CanvasRenderingContext2D;

using Enumerator;
using Lambda;

class Main
{
    static function main()
    {
        //trace((0...10).as_enumerable().list().toString());
        //trace(Enumerator.product([1, 2, 3], [4, 5, 6]).list().toString());
        var boad = cast(js.Browser.document.getElementById("draw"), CanvasElement);
        var life_game = new GameOfLife(boad);
        life_game.start();
    }
}

typedef Cell = {
    var row(default, never) : Int;
    var column(default, never) : Int;
}

enum Seed {
    Alive(v : Cell);
    Dead(v : Cell);
}


class GameOfLife
{
    static public inline var cellSize : Int = 7;
    static public inline var numberOfRows : Int = 80;
    static public inline var numberOfColumns : Int = 80;
    static public inline var seedProbability : Float = 0.5;
    static public inline var tickLength : Int = 100;

    public var generation(default, null) : Generation;

    public function new(canvas : CanvasElement) {
        this.generation = new Generation(canvas, GameOfLife.tickLength);
    }

    public function start()
    {
        this.generation.next();
        haxe.Timer.delay(this.start, GameOfLife.tickLength);
    }

}


class Generation
{
    public var canvas(default, null) : CanvasElement;
    public var drawing_context(default, null) : CanvasRenderingContext2D;
    public var tick_length(default, null) : Int;
    public var current_cell_generation(default, null) : Array<Array<Seed>>;

    public function new(canvas : CanvasElement, tick_length : Int){
        this._initialize_canvas(canvas);
        this.drawing_context = canvas.getContext2d();
        this.tick_length = tick_length;
        this.current_cell_generation = this.seed();

        this.draw_grid();
    }

    function _initialize_canvas(canvas : CanvasElement) : Void
    {
        this.canvas = canvas;
        canvas.width = GameOfLife.cellSize * GameOfLife.numberOfColumns;
        canvas.height = GameOfLife.cellSize * GameOfLife.numberOfRows;
    }


    function seed() : Array<Array<Seed>>
    {
        var _current_cell_generation : Array<Array<Seed>> = [];
        for (row_index in 0...GameOfLife.numberOfRows)
        {
            var new_row : Array<Seed> = [];
            for (column_index in 0...GameOfLife.numberOfColumns)
            {
                var cell = {row: row_index, column: column_index};
                new_row.push(if (Std.random(2) < GameOfLife.seedProbability) Alive(cell) else Dead(cell));
            }
            _current_cell_generation.push(new_row);
        }
        return _current_cell_generation;
    }

    function draw_grid() : Void
    {
        for (row in 0...GameOfLife.numberOfRows)
        {
            for (column in 0...GameOfLife.numberOfColumns)
            {
                this.draw_cell(this.current_cell_generation[row][column]);
            }
        }

    }

    function draw_cell(cell : Seed) : Void
    {
        var _cell = (switch(cell) {case Alive(s) : s; case Dead(s) : s;});
        var x = _cell.row * GameOfLife.cellSize;
        var y = _cell.column * GameOfLife.cellSize;
        var fillStyle = switch(cell){
            case Alive(cell): "rgb(242, 198, 65)";
            case Dead(cell): "rgb(38, 38, 38)";
        }
        this.drawing_context.strokeStyle = 'rgba(242, 198, 65, 0.1)';
        this.drawing_context.strokeRect(x, y, GameOfLife.cellSize, GameOfLife.cellSize);

        this.drawing_context.fillStyle = fillStyle;
        this.drawing_context.fillRect(x, y, GameOfLife.cellSize, GameOfLife.cellSize);
    }

    function evolve_cell_generation() : Void
    {
        var new_cell_generation = [];

        for (row in 0...GameOfLife.numberOfRows) {
            var next_generation : Array<Seed> = [];
            for(column in 0...GameOfLife.numberOfColumns) {
                var evolved_cell : Seed = this.evolve_cell(this.current_cell_generation[row][column]);
                next_generation.push(evolved_cell);
            }
            new_cell_generation.push(next_generation);
        }
        this.current_cell_generation = new_cell_generation;
    }

    function evolve_cell(previous_cell : Seed) : Seed
    {

        var cell = switch(previous_cell){case Alive(c) : c; case Dead(c) : c;};
        var number_of_alive_neighbors = this.count_alive_neighbors(cell);
        return switch [previous_cell, number_of_alive_neighbors] {
            case [_, 3] : Alive(cell);
            case [Alive(c), 2] : Alive(c);
            case [_, _] : Dead(cell);
        }
    }

    public function count_alive_neighbors(cell : Cell) : Int
    {
        var current_generation = this.current_cell_generation;
        var lower_row_bound = Std.int(Math.max(cell.row - 1, 0));
        var upper_row_bound = Std.int(Math.min(cell.row + 1, GameOfLife.numberOfRows - 1));
        var lower_column_bound = Std.int(Math.max(cell.column - 1, 0));
        var upper_column_bound = Std.int(Math.min(cell.column + 1, GameOfLife.numberOfColumns - 1));

        var number_of_alive_neighbors =
        (lower_row_bound...upper_row_bound + 1).as_enumerable()
            .map(function(row_index)
                    {
                        return (lower_column_bound...upper_column_bound + 1).as_enumerable()
                                .filter(function(i) {return !(cell.row == row_index && cell.column == i);})
                                .map(function(column_index)
                                    {
                                        return switch(current_generation[row_index][column_index]) {
                                            case Alive(c): true;
                                            case _ : false;
                                        }
                                    }
                                );
                    }
                )
            .flatmap(function(xs){return xs;})
            .count(function(b){return b;});
        return number_of_alive_neighbors;
    }

    public function next() : Void
    {
        this.draw_grid();
        this.evolve_cell_generation();
    }

}

