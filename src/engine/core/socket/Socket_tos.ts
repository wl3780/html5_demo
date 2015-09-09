module engine {
	export class Socket_tos extends Proto implements ISocket_tos {

		protected _bytes:egret.ByteArray;
		protected _pack_id:number = 0;

		public constructor() {
			super();
			this._bytes = new egret.ByteArray();
		}

		public get pack_id():number {
			return this._pack_id;
		}
		public set pack_id(value:number) {
			this._pack_id = value;
		}

		public get bytes():egret.ByteArray {
			return this._bytes;
		}

		public encode():egret.ByteArray {
			return this._bytes;
		}

		public clear() {
			this._bytes.clear();
			this._bytes = null;
		}

		public toString():string {
			return "【发送消息号:" + this._pack_id + "】" + super.toString();
		}

		protected writeString(value:string) {
			this._bytes.writeUTF(value);
		}

		protected writeByte(value:number) {
			this._bytes.writeByte(value);
		}

		protected writeShort(value:number) {
			this._bytes.writeShort(value);
		}

		protected writeBoolean(value:boolean) {
			value ? this._bytes.writeByte(1) : this._bytes.writeByte(0);
		}

		protected writeInt(value:number) {
			if (Engine.compress) {
				ByteArrayUtil.writeInt(this._bytes, value);
			} else {
				this._bytes.writeInt(value);
			}
		}

		protected writeLong(value:number) {
			var end:number = value;
			var head:number = (value - end) / 4294967296;
			this.writeInt(head);
			this._bytes.writeUnsignedInt(end);
		}

	}
}