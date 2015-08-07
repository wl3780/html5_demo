var engine;
(function (engine) {
    var TileGroup = (function () {
        function TileGroup() {
            this._hash = new Map();
        }
        var __egretProto__ = TileGroup.prototype;
        TileGroup.getInstance = function () {
            if (TileGroup._instance == null) {
                TileGroup._instance = new TileGroup();
            }
            return TileGroup._instance;
        };
        __egretProto__.put = function (key, tile) {
            this._hash.set(key, tile);
        };
        __egretProto__.take = function (key) {
            return this._hash.get(key);
        };
        __egretProto__.has = function (key) {
            return this._hash.has(key);
        };
        __egretProto__.remove = function (key) {
            return this._hash.delete(key);
        };
        __egretProto__.clear = function () {
            this._hash.forEach(function (v) {
                v.dispose();
            });
            this._hash.clear();
        };
        return TileGroup;
    })();
    engine.TileGroup = TileGroup;
    TileGroup.prototype.__class__ = "engine.TileGroup";
})(engine || (engine = {}));
//# sourceMappingURL=TileGroup.js.map