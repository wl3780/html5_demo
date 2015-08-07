module com {
	export module coder {
		export module core {
			export module controls {
				export module elisor {
					export class OrderMode extends egret.HashObject {

						public static ENTER_FRAME_ORDER:string;
						public static DELAY_FRAME_ORDER:string;
						public static INTERVAL_FRAME_ORDER:string;
						public static EVENT_ORDER:string;
					}
				}
			}
		}
	}
}

com.coder.core.controls.elisor.OrderMode.ENTER_FRAME_ORDER = "EnterFrameOrder";
com.coder.core.controls.elisor.OrderMode.DELAY_FRAME_ORDER = "DelayFrameOrder";
com.coder.core.controls.elisor.OrderMode.INTERVAL_FRAME_ORDER = "IntervalFrameOrder";
com.coder.core.controls.elisor.OrderMode.EVENT_ORDER = "EventOrder";
