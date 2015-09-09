class NetworkModule extends engine.Module implements engine.INetworkModule {

    /** 指令接收者 */
    public static packageHash:Map<string, Array<string>> = new Map<string, Array<string>>();
    /** 指令解释器 */
    public static parserHash:Map<string, any> = new Map<string, any>();

    public constructor() {
        super();
    }

    public register() {
        super.register();
        this.registerSubProxy(
            SocketProxy
        );
        this.registerPackParser(
            Network_1001_Heartbeat_toc,
            Network_1002_Crossday_toc
        );
        this.registerSubPackage(
            NetworkServiceOrder.ORDER_1001,
            NetworkServiceOrder.ORDER_1002
        );
    }

    public addPackageHandler(packageId:string, module:engine.IModule) {
        var list:Array<string> = NetworkModule.packageHash.get(packageId);
        if (list == null) {
            list = [];
            NetworkModule.packageHash.set(packageId, list);
        }
        var index:number = list.indexOf(module.name);
        if (index == -1) {
            list.push(module.name);
        }
    }

    public addPackageParser(pClass:any) {
        var kName:string = egret.getQualifiedClassName(pClass);
        kName = kName.split("::").pop();
        // 约定解释器的命名规则（模块名_数据包id_描述信息_toc）
        var packId:string = kName.split("_")[1];
        NetworkModule.parserHash.set(packId, pClass);
    }

}