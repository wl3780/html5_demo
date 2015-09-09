module engine {
	export class Socket_toc extends Proto implements ISocket_toc {

		protected _pack_id:number = 0;
		protected _bytes:egret.ByteArray;

		public constructor() {
			super();
		}

		public get pack_id():number {
			return this._pack_id;
		}
		public set pack_id(value:number) {
			this._pack_id = value;
		}

		public decode(byte:egret.ByteArray) {
			this._bytes = byte;
		}

		public toString():string {
			return "【收到消息号:" + this._pack_id + "】" + super.toString();
		}

		protected readString():string {
			return this._bytes.readUTF();
		}

		protected readByte():number {
			return this._bytes.readByte();
		}

		protected readShort():number {
			return this._bytes.readShort();
		}

		protected readInt():number {
			if (Engine.compress) {
				return ByteArrayUtil.readInt(this._bytes);
			} else {
				return this._bytes.readInt();
			}
		}

		protected readBoolean():boolean {
			return this._bytes.readByte() == 1;
		}

		protected readLong():number {
			var head:number = this.readInt();
			var end:number = this._bytes.readUnsignedInt();
			return head * 4294967296 + end;
		}
	}
}