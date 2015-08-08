module com {
	export module coder {
		export module utils {
			export class ObjectUtils extends egret.HashObject {

				public static copy(value:any):any
				{
					var bytes:flash.ByteArray = new flash.ByteArray();
					bytes.writeObject(value);
					bytes.position = 0;
					var result:any = bytes.readObject();
					return result;
				}

			}
		}
	}
}

