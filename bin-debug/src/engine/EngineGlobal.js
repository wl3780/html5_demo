var engine;
(function (engine) {
    var EngineGlobal = (function () {
        function EngineGlobal() {
        }
        var __egretProto__ = EngineGlobal.prototype;
        EngineGlobal.getAvatarAssetsConfigPath = function (idName) {
            return "resource/avatars/output/" + idName + ".sm?ver=" + EngineGlobal.version;
        };
        EngineGlobal.getAvatarAssetsPath = function (idName, action, dir) {
            var idType = idName.split(engine.Engine.LINE)[0];
            return null;
        };
        EngineGlobal.getMapConfigPath = function (map_id) {
            return "resource/maps/map_data/scene_" + map_id + ".data?ver=" + EngineGlobal.version;
        };
        EngineGlobal.getMapMiniPath = function (map_id) {
            return "resource/maps/map_mini/scene_" + map_id + ".jpg?ver=" + EngineGlobal.version;
        };
        EngineGlobal.getMapImagePath = function (map_id, x, y) {
            return "resource/maps/map_image/scene_" + map_id + "/" + x + engine.Engine.LINE + y + ".jpg?ver=" + EngineGlobal.version;
        };
        EngineGlobal.IMAGE_WIDTH = 320;
        EngineGlobal.IMAGE_HEIGHT = 180;
        EngineGlobal.AVATAR_IMAGE_WIDTH = 400;
        EngineGlobal.AVATAR_IMAGE_HEIGHT = 300;
        EngineGlobal.language = "zh_CN";
        EngineGlobal.version = "ver-1";
        return EngineGlobal;
    })();
    engine.EngineGlobal = EngineGlobal;
    EngineGlobal.prototype.__class__ = "engine.EngineGlobal";
})(engine || (engine = {}));
//# sourceMappingURL=EngineGlobal.js.map