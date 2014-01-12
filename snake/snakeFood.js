var food = function () {
    this.foodTPL = "<div class='food'></div>";
    this.position = [0, 0];
}
food.prototype.create = function (start) {
    var pos = [0, 0];
    var min = 0;
    var max = 40;
    if (start != undefined) {
        pos = start;
    } else {
        var posx = (Math.floor(Math.random() * (max - min + 1)) + min) * 10;
        var posy = (Math.floor(Math.random() * (max - min + 1)) + min) * 10;
        pos = [posx, posy];
    }
    this.position = pos;
    $("#field").append(this.foodTPL);
    var newFood = $("#field").find(".food")[0];
    $(newFood).css({"top": pos[0], "left": pos[1]});
}
food.prototype.destroy = function () {
    var curFood = $("#field").find(".food")[0];
    $(curFood).remove();
    this.create();
}
food.prototype.finish = function () {
    var curFood = $("#field").find(".food")[0];
    $(curFood).remove();
    this.position = [0, 0];
}