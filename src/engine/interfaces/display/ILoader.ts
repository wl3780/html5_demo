module engine {

    export interface ILoader extends IProto {
        path:string;

        name:string;

        unloadAndStop(gc:boolean=true):void;

        loadElemt(url:string, successFunc:Function=null, errorFunc:Function=null, progressFunc:Function=null):void;
    }
}