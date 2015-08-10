module engine {

    export interface IChar extends ISceneItem {
        moveTo(x:number,y:number);

        moveToTile(index_x:number,index_y:number);
    }
}