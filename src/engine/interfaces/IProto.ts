module engine {
    export interface IProto {
        
        id?:string;

        oid?:string;

        className?:string;

        proto?:any;

        dispose():void;

        toString():string;
    }
}