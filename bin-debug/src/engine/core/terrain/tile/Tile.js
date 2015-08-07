var engine;
(function (engine) {
    var Tile = (function () {
        function Tile() {
            this.type = 0;
            this.initValue = 0;
            this.isSell = false;
            this.isSafe = false;
            this.isAlpha = false;
            this.quoteIndex = 0;
            this.charIndex = 0;
            this._x_ = 0;
            this._y_ = 0;
            this._pt_ = new egret.Point();
        }
        var __egretProto__ = Tile.prototype;
        Tile.createTile = function () {
            if (Tile._tileHash_.length) {
                return Tile._tileHash_.pop();
            }
            return new Tile();
        };
        __egretProto__.setTileIndex = function (x, y) {
            engine.TileUtils.pixelsToTile(x, y, this._pt_);
        };
        __egretProto__.setXY = function (x, y) {
            this._x_ = x;
            this._y_ = y;
            this._pt_.x = x;
            this._pt_.y = y;
            this._key_ = this._x_ + "|" + this._y_;
        };
        Object.defineProperty(__egretProto__, "x", {
            get: function () {
                return this._x_;
            },
            set: function (value) {
                this._x_ = value;
                this._pt_.x = value;
                this._key_ = this._x_ + "|" + this._y_;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(__egretProto__, "y", {
            get: function () {
                return this._y_;
            },
            set: function (value) {
                this._y_ = value;
                this._pt_.y = value;
                this._key_ = this._x_ + "|" + this._y_;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(__egretProto__, "pt", {
            get: function () {
                return this._pt_;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(__egretProto__, "key", {
            get: function () {
                return this._key_;
            },
            enumerable: true,
            configurable: true
        });
        __egretProto__.dispose = function () {
            Tile._tileHash_.push(this);
        };
        Tile._tileHash_ = new Array();
        return Tile;
    })();
    engine.Tile = Tile;
    Tile.prototype.__class__ = "engine.Tile";
})(engine || (engine = {}));
//# sourceMappingURL=Tile.js.map