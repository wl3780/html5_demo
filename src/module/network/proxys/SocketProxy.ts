class SocketProxy extends engine.SubProxy {

    private _conn:SocketClient;
    private _messList:Array<Array<any>> = [];

    public constructor() {
        super();
        this._conn = new SocketClient();
        this._conn.addEventListener(SocketEvent.SERVER_CONNECT_SUCCESS, this.onConnectSuccess, this);
        this._conn.addEventListener(SocketEvent.SERVER_SUCCESS_PARSE, this.onSuccessParse, this);
    }

    public subHandler(message:engine.IMessage) {
        switch (message.actionOrder) {
            case engine.MessageConst.SEND_TO_SOCKET:
                var tos:engine.Socket_tos = message.proto;
                this._conn.sendMessage(tos.pack_id, tos.encode());
                tos.clear();
                break;
            case NetworkInternalOrder.CONNECT:
                var param:any = message.proto;
                this._conn.connect(param.host, param.prot);
                break;
            case NetworkInternalOrder.DISCONNECT:
                this._conn.disconnect();
                break;

            case NetworkServiceOrder.ORDER_1001:	// 收到心跳包
                var heartData:Network_1001_Heartbeat_toc = message.proto;
                this.sendToTotalModule(NetworkInternalOrder.SERVICE_HEARTBEAT, null);
                break;
            case NetworkServiceOrder.ORDER_1002:	//　收到跨天提示
                this.sendToTotalModule(NetworkInternalOrder.SERVICE_CROSSDAY, null);
                break;
        }
    }

    private onConnectSuccess(evt:SocketEvent) {

    }

    private onSuccessParse(evt:SocketEvent) {
        this._messList.push(evt.params);
    }

    private parseMessage() {
        var arr:Array<any> = this._messList.shift();
        var packId:number = arr[0];
        var packData:egret.ByteArray = arr[1];
        var cls:any = NetworkModule.parserHash.get(packId+"");
        var data:engine.Socket_toc = new cls;
        data.decode(packData);

        var geters:Array<string> = NetworkModule.packageHash.get(packId+"");
        if (geters) {
            this.sendToModules(packId+"", geters, data);
        }
    }

}