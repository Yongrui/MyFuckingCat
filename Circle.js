/**
 * Created by Yongrui on 2015/3/14.
 */

function Circle() {
    createjs.Shape.call(this);
    this.setCircleType(Circle.TYPE_UNSELECTED);
}

Circle.prototype = new createjs.Shape();
Circle.TYPE_UNSELECTED = 1;
Circle.TYPE_SELECTED = 2;
Circle.TYPE_CAT = 3;

Circle.prototype.setColor = function(colorString) {
    this.graphics.clear();
    this.graphics.beginFill(colorString);
    this.graphics.drawCircle(0, 0, 25);
    this.graphics.endFill();
}

Circle.prototype.setCircleType = function(circleType) {
    this._circleType = circleType;
    switch (this._circleType) {
        case Circle.TYPE_UNSELECTED:
            this.setColor("#ccc");
            break;
        case Circle.TYPE_SELECTED:
            this.setColor("#f60");
            break;
        case Circle.TYPE_CAT:
            this.setColor("#00f");
            break;
        default :
            this.setColor("#ccc");
            break;
    }
}

Circle.prototype.getCircleType = function() {
    return this._circleType;
}