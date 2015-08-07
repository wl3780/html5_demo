var engine;
(function (engine) {
    var TileConst = (function () {
        function TileConst() {
        }
        var __egretProto__ = TileConst.prototype;
        TileConst.BLOCK_TYPE = 0;
        TileConst.ROAD_TYPE = 1;
        TileConst.LEFT = -1;
        TileConst.RIGHT = 1;
        TileConst.TILE_SIZE = 35;
        TileConst.TILE_HEIGHT = 30;
        TileConst.TILE_WIDTH = TileConst.TILE_HEIGHT * 2;
        TileConst.WH = TileConst.TILE_WIDTH * 0.5;
        TileConst.HH = TileConst.TILE_HEIGHT * 0.5;
        TileConst.Tile_XIE = 60;
        return TileConst;
    })();
    engine.TileConst = TileConst;
    TileConst.prototype.__class__ = "engine.TileConst";
})(engine || (engine = {}));
//# sourceMappingURL=TileConst.js.map