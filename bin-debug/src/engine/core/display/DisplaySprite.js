var engine;
(function (engine) {
    var DisplaySprite = (function (_super) {
        __extends(DisplaySprite, _super);
        function DisplaySprite() {
            _super.call(this);
            this._id_ = engine.Engine.getSoleId();
            this._className_ = egret.getQualifiedClassName(this);
            engine.DisplayObjectPort.addTarget(this);
        }
        var __egretProto__ = DisplaySprite.prototype;
        Object.defineProperty(__egretProto__, "id", {
            get: function () {
                return this._id_;
            },
            set: function (value) {
                this._id_ = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(__egretProto__, "oid", {
            get: function () {
                return this._oid_;
            },
            set: function (value) {
                this._oid_ = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(__egretProto__, "proto", {
            get: function () {
                return this._proto_;
            },
            set: function (value) {
                this._proto_ = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(__egretProto__, "type", {
            get: function () {
                return this._type_;
            },
            set: function (value) {
                this._type_ = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(__egretProto__, "enabled", {
            get: function () {
                return this._enabled_;
            },
            set: function (value) {
                this._enabled_ = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(__egretProto__, "className", {
            get: function () {
                return this._className_;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(__egretProto__, "isDisposed", {
            get: function () {
                return this._isDisposed_;
            },
            enumerable: true,
            configurable: true
        });
        __egretProto__.onRender = function () {
        };
        __egretProto__.dispose = function () {
            if (this.parent) {
                this.parent.removeChild(this);
            }
            engine.DisplayObjectPort.removeTarget(this.id);
            this._id_ = null;
            this._oid_ = null;
            this._type_ = null;
            this._proto_ = null;
            this._isDisposed_ = true;
        };
        __egretProto__.toString = function () {
            return "[" + this._className_ + engine.Engine.SIGN + this._id_ + "]";
        };
        return DisplaySprite;
    })(egret.Sprite);
    engine.DisplaySprite = DisplaySprite;
    DisplaySprite.prototype.__class__ = "engine.DisplaySprite";
})(engine || (engine = {}));
//# sourceMappingURL=DisplaySprite.js.map