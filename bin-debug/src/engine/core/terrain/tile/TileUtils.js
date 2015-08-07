var engine;
(function (engine) {
    var TileUtils = (function () {
        function TileUtils() {
        }
        var __egretProto__ = TileUtils.prototype;
        TileUtils.pixelsToTile = function (x, y, resultValue) {
            if (resultValue === void 0) { resultValue = null; }
            var x2 = x / engine.TileConst.TILE_WIDTH >> 0;
            var y2 = y / engine.TileConst.TILE_HEIGHT >> 0;
            if (resultValue == null) {
                resultValue = engine.Engine.getPoint();
            }
            resultValue.x = x2;
            resultValue.y = y2;
            return resultValue;
        };
        return TileUtils;
    })();
    engine.TileUtils = TileUtils;
    TileUtils.prototype.__class__ = "engine.TileUtils";
})(engine || (engine = {}));
//# sourceMappingURL=TileUtils.js.map