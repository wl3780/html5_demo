module engine {
	export interface IOrder extends IProto {
		execute();

		executedHandler:Function;
	}
}

