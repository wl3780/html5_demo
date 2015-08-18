module engine {
	export interface IMessage extends IProto {

		sender?:string;

		actionOrder?:string;

		messageType?:string;

		isDisposed?:boolean;

		geters?:Array<string>;

		send():boolean;

		checkFormat():boolean;

		recover();

	}
}

