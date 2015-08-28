module engine {
	export class RecoverUtils {

		private static _point:egret.Point = new egret.Point();

		private static _rect:egret.Rectangle = new egret.Rectangle();

		private static _matrix:egret.Matrix = new egret.Matrix();

		public static get point():egret.Point {
			RecoverUtils._point.setTo(0, 0);
			return RecoverUtils._point;
		}

		public static get rect():egret.Rectangle {
			RecoverUtils._rect.setEmpty();
			return RecoverUtils._rect;
		}

		public static get matrix():egret.Matrix {
			RecoverUtils._matrix.identity();
			return RecoverUtils._matrix;
		}

	}
}

