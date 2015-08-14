module engine {

    export interface IAvatar extends IDisplay {
        stop();

        play(action:string, renderType:number=0, playEndFunc:Function=null, stopFrame:number=-1);

        loadAvatarPart(type:string, idNum:string, random:number=0);

        onEffectRender(oid:string, renderType:string, bitmapData:egret.Texture, tx:number, ty:number);

        onBodyRender(renderType:string, bitmapType:string, bitmapData:egret.Texture, tx:number, ty:number, shadow:egret.Texture=null);
    }
}