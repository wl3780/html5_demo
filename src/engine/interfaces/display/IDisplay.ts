module engine {

    export interface IDisplay extends IProto, egret.IEventDispatcher {
        x:number;

        y:number;

        enabled:boolean;

        visible:boolean;

        type:string;

        name:string;

        isDisposed:boolean;
    }
}