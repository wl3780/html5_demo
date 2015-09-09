class SocketClient extends egret.WebSocket {

    private  MAX_BUFSIZE:number = 200000;

    /**
     * 服务器地址
     */
    private _serverHost:string;
    /**
     * 服务器端口
     */
    private _serverPort:number;
    /**
     * 读取的二进制数据缓冲区
     */
    private _buf:egret.ByteArray;

	public constructor(host:string=null, port:number=0) {
        super(host, port);

        this._buf = new egret.ByteArray();
        this.type = egret.WebSocket.TYPE_BINARY;
        this.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onMessage, this);
        this.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
        this.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
        this.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
	}

    public connect(host:string, port:number) {
        this._serverHost = host;
        this._serverPort = port;
        super.connect(host, port);
    }

    public disconnect() {
        this.close();
    }

    public sendMessage(packId:number, packData:egret.ByteArray) {
        if (this.connected) {
            var bytes:egret.ByteArray = new egret.ByteArray();
            // 协议头，用于校验
            bytes.writeByte(5);
            bytes.writeByte(1);
            bytes.writeByte(2);
            bytes.writeByte(0);

            var packLen:number = 2 + packData.length;
            bytes.writeInt(packLen);
            bytes.writeShort(packId);
            bytes.writeBytes(packData);
            try {
                this.writeBytes(bytes);
                this.flush();
            } catch (e) {
                console.error(e);
            }
        }
    }

    public get host():string {
        return this._serverHost;
    }
    public get port():number {
        return this._serverPort;
    }

    private onSocketOpen(evt:egret.Event) {
        this.dispatchEvent(new SocketEvent(SocketEvent.SERVER_CONNECT_SUCCESS));
    }

    private onSocketClose(evt:egret.Event) {
        this.dispatchEvent(new SocketEvent(SocketEvent.SERVER_DISCONNECT));
    }

    private onSocketError(evt:egret.IOErrorEvent) {
        this.dispatchEvent(new SocketEvent(SocketEvent.SERVER_CONNECT_FAIL));
    }

    private onMessage(evt:egret.ProgressEvent) {
        this.readBytes(this._buf, this._buf.length);
        if (this._buf.length >= this.MAX_BUFSIZE) { // 清理缓存
            var tmp:egret.ByteArray = new egret.ByteArray();
            this._buf.readBytes(tmp);
            this._buf.clear();
            this._buf = tmp;
        }

        if (this._buf.bytesAvailable >= 10) {   // 4（协议头）+4（包长度）+2（包ID）
            var position:number = this._buf.position;
            this._buf.position += 4;    // 跳过协议头
            var packLen:number = this._buf.readInt();
            if (packLen > this._buf.bytesAvailable) {
                this._buf.position = position;
                return;
            }

            var packId:number = this._buf.readShort();
            var bytes:egret.ByteArray = new egret.ByteArray();
            this._buf.readBytes(bytes, 0, packLen-2);

            var event:SocketEvent = new SocketEvent(SocketEvent.SERVER_SUCCESS_PARSE);
            event.params = [packId, bytes];
            this.dispatchEvent(event);
        }
    }
}
