module engine {
	export class ObjectUtils {

		public static copy(value:any):any {
			var bytes:egret.ByteArray = new egret.ByteArray();
			bytes["writeObject"](value);
			bytes.position = 0;
			var result:any = bytes["readObject"]();
			return result;
		}

		public static newInstance(kName:string):any {
			var x:string = "new " + kName + "()";
			return eval(x);
		}

	}
}

