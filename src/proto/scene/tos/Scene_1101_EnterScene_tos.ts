class Scene_1001_Enter_tos extends engine.Socket_tos {

	public scene_id:number = 0;

	public constructor() {
		super();
		this.pack_id = 1101;
	}

	public encode():egret.ByteArray {
		this.writeInt(this.scene_id);
		return this._bytes;
	}
}