var engine;
(function (engine) {
    var Proto = (function () {
        function Proto() {
            this._id_ = engine.Engine.getSoleId();
        }
        var __egretProto__ = Proto.prototype;
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
        Object.defineProperty(__egretProto__, "className", {
            get: function () {
                if (Proto._className_ == null) {
                    Proto._className_ = egret.getQualifiedClassName(this);
                }
                return Proto._className_;
            },
            enumerable: true,
            configurable: true
        });
        __egretProto__.dispose = function () {
            this._id_ = null;
            this._oid_ = null;
            this._proto_ = null;
        };
        __egretProto__.clone = function () {
            return this;
        };
        __egretProto__.toString = function () {
            return "[" + this.className + engine.Engine.SIGN + this.id + "]";
        };
        return Proto;
    })();
    engine.Proto = Proto;
    Proto.prototype.__class__ = "engine.Proto";
})(engine || (engine = {}));
//# sourceMappingURL=Proto.js.map