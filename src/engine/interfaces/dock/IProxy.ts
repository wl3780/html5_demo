module engine {
	export interface IProxy extends IProto {
    	
        lock?:boolean;

		send(message:IMessage);

		subHandle(message:IMessage);

		checkFromat():boolean;
	}
}

