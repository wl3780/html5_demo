module com {
	export module coder {
		export module utils {
			export class FilterUtils extends egret.HashObject {

				public static light(N:number):Array<any>
				{
					return ([1,0,0,0,N,0,1,0,0,N,0,0,1,0,N,0,0,0,1,0]);
				}

			}
		}
	}
}

