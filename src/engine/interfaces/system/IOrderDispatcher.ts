module engine {
	export interface IOrderDispatcher extends IProto {
		addFrameOrder(heartBeatHandler:Function,deay?:number,isOnStageHandler?:boolean);

		removeFrameOrder(heartBeatHandler:Function);

		hasFrameOrder(heartBeatHandler:Function):boolean;

		removeTotalFrameOrder();

		removeTotalEventOrder();

		removeTotalOrders();

		setInterval(heartBeatHandler:Function,delay:number,...args);

		setTimeOut(closureHandler:Function,deay:number,...args):string;
	}
}

