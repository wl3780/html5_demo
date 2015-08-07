var engine;
(function (engine) {
    var TileMapData = (function (_super) {
        __extends(TileMapData, _super);
        function TileMapData() {
            _super.call(this);
            this.map_id = 0;
            this.pixel_x = 0;
            this.pixel_y = 0;
            this.pixel_width = 0;
            this.pixel_height = 0;
            this.width = 0;
            this.height = 0;
        }
        var __egretProto__ = TileMapData.prototype;
        __egretProto__.uncode = function (bytes) {
            if (bytes == null) {
                return;
            }
            bytes.position = 0;
            this.map_id = bytes.readShort();
            this.pixel_x = bytes.readShort();
            this.pixel_y = bytes.readShort();
            this.pixel_width = bytes.readShort();
            this.pixel_height = bytes.readShort();
            var tile_x = 0;
            var tile_y = 0;
            var tile = null;
            engine.TileGroup.getInstance().clear();
            var len = bytes.readInt();
            var index = 0;
            while (index < len) {
                tile_x = bytes.readShort();
                tile_y = bytes.readShort();
                tile = this.prasePro(tile_x, tile_y, bytes.readShort());
                if (tile_x >= 0 && tile_y >= 0) {
                    engine.TileGroup.getInstance().put(tile.key, tile);
                }
                index++;
            }
            var p_id = null;
            var px = 0;
            var py = 0;
            var dir = 0;
            var data = null;
            this.items = new Array();
            len = bytes.readShort();
            index = 0;
            while (index < len) {
                p_id = bytes.readUTF();
                px = bytes.readInt();
                py = bytes.readInt();
                dir = bytes.readByte();
                data = this.praseLayerpro(p_id, px, py, dir);
                this.items.push(data);
                index++;
            }
        };
        __egretProto__.prasePro = function (x, y, pro) {
            var tile = engine.Tile.createTile();
            var str = pro.toString();
            tile.type = parseInt(str.slice(1, 2));
            tile.initValue = tile.type;
            tile.isSafe = parseInt(str.slice(2, 3)) == 1;
            tile.isSell = parseInt(str.slice(3, 4)) == 1;
            tile.isAlpha = parseInt(str.slice(4, 5)) == 1;
            tile.setXY(x, y);
            if (tile.type > 0) {
                tile.color = 0xFF00;
            }
            else {
                tile.color = 0xFF0000;
            }
            return tile;
        };
        __egretProto__.praseLayerpro = function (id, x, y, dir) {
            var result = new engine.ItemData();
            result.x = x;
            result.y = y;
            result.item_id = id;
            result.dir = dir;
            return result;
        };
        return TileMapData;
    })(egret.HashObject);
    engine.TileMapData = TileMapData;
    TileMapData.prototype.__class__ = "engine.TileMapData";
})(engine || (engine = {}));
//# sourceMappingURL=TileMapData.js.map