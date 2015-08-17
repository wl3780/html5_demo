module engine {

    export interface IChar extends ISceneItem, IInteractiveObject {
        moveTo(x:number,y:number);

        moveToTile(index_x:number,index_y:number);
    }
}