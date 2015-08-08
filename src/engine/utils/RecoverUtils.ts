module com {
	export module coder {
		export module utils {
			export class RecoverUtils extends egret.HashObject {

				public static matrix:flash.Matrix;
				public static point:egret.Point;
				public static rect:egret.Rectangle;
				public static textFromat:flash.TextFormat;
			}
		}
	}
}

com.coder.utils.RecoverUtils.matrix = new flash.Matrix();
com.coder.utils.RecoverUtils.point = new egret.Point();
com.coder.utils.RecoverUtils.rect = new egret.Rectangle();
com.coder.utils.RecoverUtils.textFromat = new flash.TextFormat();
