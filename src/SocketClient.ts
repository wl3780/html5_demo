class SocketClient {
    
    private socket:egret.WebSocket;
    
	public constructor() {
        this.socket = new egret.WebSocket();
        this.socket.type = egret.WebSocket.TYPE_BINARY;
        this.socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onMessage, this);
        this.socket.addEventListener(egret.Event.CONNECT, this.onOpen, this);
        this.socket.addEventListener(egret.Event.CLOSE, this.onClose, this);
        this.socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);
        this.socket.connect("echo.websocket.org", 80);
	}

    private onOpen(evt:egret.Event) {
        var bytes:egret.ByteArray = new egret.ByteArray();
        bytes.writeUTF("hello world");
        bytes.writeInt(1024);
        bytes.writeBoolean(true);
        bytes.position = 0;
        this.socket.writeBytes(bytes, 0, bytes.bytesAvailable);
        this.socket.flush();
    }

    private onClose(evt:egret.Event) {

    }

    private onError(evt:egret.IOErrorEvent) {

    }

    private onMessage(evt:egret.ProgressEvent) {
        var bytes:egret.ByteArray = new egret.ByteArray();
        this.socket.readBytes(bytes);
        var msg:string = bytes.readUTF();
        var num:number = bytes.readInt();
        var flag:boolean = bytes.readBoolean();
        console.log(msg + num + flag);
    }
}
