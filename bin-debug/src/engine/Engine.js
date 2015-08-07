var engine;
(function (engine) {
    var Engine = (function () {
        function Engine() {
        }
        var __egretProto__ = Engine.prototype;
        Engine.setup = function (target, path, lang, ver) {
            if (lang === void 0) { lang = "zh_CN"; }
            if (ver === void 0) { ver = "v1.0"; }
            Engine.stage = target.stage;
            engine.EngineGlobal.assetsHost = path;
            engine.EngineGlobal.language = lang;
            engine.EngineGlobal.version = ver;
        };
        Engine.getSoleId = function () {
            Engine.instance_index--;
            if (Engine.instance_index < 0) {
                Engine.instance_index = 2147483647;
            }
            return Engine.instance_index.toString(16);
        };
        Engine.getPoint = function () {
            return new egret.Point();
        };
        Engine.getRectangle = function () {
            return new egret.Rectangle();
        };
        Engine.SIGN = "@";
        Engine.LINE = "_";
        Engine.enabled = true;
        Engine.compress = true;
        Engine.sceneClickEnabled = true;
        Engine.instance_index = 2147483647;
        return Engine;
    })();
    engine.Engine = Engine;
    Engine.prototype.__class__ = "engine.Engine";
})(engine || (engine = {}));
//# sourceMappingURL=Engine.js.map