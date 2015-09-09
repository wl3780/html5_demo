class Scene_1001_Enter_toc extends engine.Socket_toc {

	public result:number = 0;

	public constructor() {
		super();
		this.pack_id = 1101;
	}

	public decode(byte:egret.ByteArray) {
		super.decode(byte);
		this.result = this.readByte();
	}
}