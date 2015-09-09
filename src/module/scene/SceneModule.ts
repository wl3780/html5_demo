class SceneModule extends engine.Module {

    public constructor() {
        super();
        this.registerSubProxy(
            SceneProxy
        );
        this.registerPackParser(
            Scene_1001_Enter_toc
        );
        this.registerSubPackage(
            SceneServiceOrder.ORDER_1101
        );
    }

}