package ;

using Lambda;
using Enumerator;

class Enumerator {
    public static function as_enumerable<T>(iter : Iterator<T>) : Iterable<T>
    {
        return {iterator : function(){return iter;}};
    }

    public static function product<T>(xs : Iterable<T>, ys : Iterable<T>)
    {
        return xs.map(function(x : T)
            {
                return ys.map(function(y : T)
                    {
                        return [x, y];
                    });
            }).flatmap(function(i){return i;});
    }

    public static function flatmap<T>(xs : Iterable<Iterable<T>>, func : Iterable<T> -> Iterable<T>)
    {
        return xs.fold(function(xs1, xs2) {return func(xs1).concat(func(xs2));}, Lambda.list([]));
    }
}
