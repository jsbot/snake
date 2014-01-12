$('#top').click(function () {
    Snake.run('top');
});
$('#left').click(function () {
    Snake.run('left');
});
$('#right').click(function () {
    Snake.run('right');
});
$('#down').click(function () {
    Snake.run('down');
});
$('#grow').click(function () {
    var x = parseInt($('#posX').val());
    var y = parseInt($('#posY').val());
    Snake.grow([x, y]);
});
window.addEventListener('keydown', function (e) {
    switch (e.keyCode) {
        case 37:
            Snake.run('left');
            break;
        case 38:
            Snake.run('top');
            break;
        case 39:
            Snake.run('right');
            break;
        case 40:
            Snake.run('down');
            break;
    }
}, false);
