module engine {
	export interface IProxy extends IProto {

		send(message:IMessage);

		subHandle(message:IMessage);

		checkFromat():boolean;
	}
}

