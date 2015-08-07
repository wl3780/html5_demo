var engine;
(function (engine) {
    var ItemData = (function () {
        function ItemData() {
            this.x = 0;
            this.y = 0;
            this.layer = 0;
            this.depth = 0;
            this.dir = 0;
        }
        var __egretProto__ = ItemData.prototype;
        return ItemData;
    })();
    engine.ItemData = ItemData;
    ItemData.prototype.__class__ = "engine.ItemData";
})(engine || (engine = {}));
//# sourceMappingURL=ItemData.js.map