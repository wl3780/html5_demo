class Network_1001_Heartbeat_toc extends engine.Socket_toc {

	public sysTime:Number;

	public constructor() {
		super();
		this.pack_id = 1001;
	}

	public decode(byte:egret.ByteArray) {
		super.decode(byte);
		this.sysTime = this.readLong();
	}
}