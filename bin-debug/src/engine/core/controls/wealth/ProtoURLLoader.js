var engine;
(function (engine) {
    var ProtoURLLoader = (function (_super) {
        __extends(ProtoURLLoader, _super);
        function ProtoURLLoader(request) {
            _super.call(this, request);
        }
        var __egretProto__ = ProtoURLLoader.prototype;
        return ProtoURLLoader;
    })(egret.URLLoader);
    engine.ProtoURLLoader = ProtoURLLoader;
    ProtoURLLoader.prototype.__class__ = "engine.ProtoURLLoader";
})(engine || (engine = {}));
//# sourceMappingURL=ProtoURLLoader.js.map