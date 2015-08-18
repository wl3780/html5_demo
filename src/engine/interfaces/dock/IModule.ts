module engine {
	export interface IModule extends IProto {

		name?:string;

		lock?:boolean;

		register();

		unregister();

		send(message:IMessage);

		subHandle(message:IMessage);

		registerSubProxy(...args);

		registerSubPackage(...args);

		registerPackParser(...args);
	}
}

