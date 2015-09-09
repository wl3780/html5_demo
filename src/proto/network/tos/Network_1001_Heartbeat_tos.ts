class Network_1001_Heartbeat_tos extends engine.Socket_tos {

	public constructor() {
		super();
		this.pack_id = 1001;
	}

	public encode():egret.ByteArray {
		return this._bytes;
	}
}