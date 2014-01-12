function snakeBodyEl(position, cssClass, field) {

    this.snakeTPL = "<div class="+cssClass+"></div>";
    this.snakeParent = '';
    this.snakeChild = '';
    this.currentPosition = position;
    this.setChildren = function (el) {
        this.snakeChild = el;
    }
    this.setParent = function (el) {
        this.snakeParent = el;
    }
    this.changePosition = function (change, step) {

        if (this.snakeParent != '') {
            if (this.snakeChild != '') {
                this.snakeChild.changePosition(change, this.currentPosition);
            }
            this.currentPosition = [step[0], step[1]];
        } else {
            this.changeX = 0;
            this.changeY = 0;
            switch (change) {
                case 'top' :
                    this.changeX -= step;
                    break
                case 'left':
                    this.changeY -= step;
                    break
                case 'down' :
                    this.changeX += step;
                    break
                case 'right':
                    this.changeY += step;
                    break
            }

            if (Snake.checkForTail([this.currentPosition[0] + this.changeX, this.currentPosition[1] + this.changeY])) {
                playSound(this, 'snake/crow.mp3');
                Food.finish();
                Snake.finish();

                alert("game over");
            } else if (this.snakeChild != '') {
                this.snakeChild.changePosition(change, this.currentPosition);
            }
            if (!Snake.checkProblems(Food.position, [this.currentPosition[0] + this.changeX, this.currentPosition[1] + this.changeY])) {
                playSound(this, 'snake/Blop.wav');
                Food.destroy();
                Snake.grow([this.currentPosition[0] + this.changeX, this.currentPosition[1] + this.changeY]);
            } else {
                var positionY = this.currentPosition[1] + this.changeY;
                if (positionY == 500) {
                    positionY = 0;
                } else if (positionY == -10) {
                    positionY = 490
                }
                var positionX = this.currentPosition[0] + this.changeX
                if (positionX == 500) {
                    positionX = 0;
                } else if (positionX == -10) {
                    positionX = 490;
                }
                this.currentPosition = [positionX, positionY];
            }
        }
	    if(Snake.checkCrossWithOthers()){
		    alert("crash");
		    Snake.finish();
	    }
	}
}
function snake(cssClass) {
    this.step = settings.step;
    this.vector = settings.defaultVector;
    this.snakeBody = new Array();
    this.interval;
	this.cssClass = cssClass;
	this.competitors = new Array();
}
snake.prototype.run = function (vector) {
    var _this = this;
    if (arguments[0] == undefined) {
        vector = this.vector;
    }
    /*if (this.interval) {
        clearInterval(this.interval);
    }
    this.interval = setInterval(function () {*/
        switch (vector) {
            case 'top' :
                (this.vector == 'down') ? this.vector = 'down' : this.vector = 'top'
                break
            case 'left':
                (this.vector == 'right') ? this.vector = 'right' : this.vector = 'left'
                break
            case 'down' :
                (this.vector == 'top') ? this.vector = 'top' : this.vector = 'down'
                break
            case 'right':
                (this.vector == 'left') ? this.vector = 'left' : this.vector = 'right'
                break
        }
        _this.snakeBody[0].changePosition(this.vector, _this.step);
		$.each($(settings.field).find("." + this.cssClass), function (index, value) {
			$(value).css({"top": _this.snakeBody[index].currentPosition[0], "left": _this.snakeBody[index].currentPosition[1] })
		});


   // }, settings.speed);
}
snake.prototype.grow = function (newHeadPos) {
    if (newHeadPos != undefined) {
        this.snakeBody.unshift(new snakeBodyEl(newHeadPos));
    }
    for (var i = 0; i < this.snakeBody.length; i++) {
        if (i + 1 != this.snakeBody.length) {
            this.snakeBody[i].setChildren(this.snakeBody[i + 1]);
            this.snakeBody[i + 1].setParent(this.snakeBody[i]);
        }
    }
    $(settings.field).prepend(this.snakeBody[0].snakeTPL);
    var cur = $(settings.field).find("." + settings.snakeClass)[0];
    $(cur).css({"top": this.snakeBody[0].currentPosition[0], "left": this.snakeBody[0].currentPosition[1] });
}
snake.prototype.draw = function (pos) {
	var _this = this;

    for (var j = 0; j < pos.length; j++) {
        this.snakeBody.push(new snakeBodyEl(pos[j], _this.cssClass));
    }
    for (var i = 0; i < this.snakeBody.length; i++) {
        if (i + 1 != this.snakeBody.length) {
            this.snakeBody[i].setChildren(this.snakeBody[i + 1]);
            this.snakeBody[i + 1].setParent(this.snakeBody[i]);
        }
        $(settings.field).append(this.snakeBody[i].snakeTPL);
        var cur = $(settings.field).find("." + this.cssClass)[i];
        $(cur).css({"top": this.snakeBody[i].currentPosition[0], "left": this.snakeBody[i].currentPosition[1] });
    }
}
snake.prototype.checkProblems = function (first, second) {
	if (first.length<3){
		for (var i = 0; i < first.length; i++) {
			if (second[i] !== first[i]) return true;
		}
	}else{
		for(var i = 0; i<first.length; i++){
			for(var j=0; j<second.length; j++){
				if (first[i][0] == second[j][0] && first[i][1] == second[j][1]) {
					return true;
				}
			}



		}
	}

    return false;
}
snake.prototype.checkForTail = function (head) {
    var snakeBody = new Array();
    for (i = 0; i < Snake.snakeBody.length; i++) {
        snakeBody.push(Snake.snakeBody[i].currentPosition);
    }
    var res = snakeBody.shift();
    for (var i = 0; i < snakeBody.length; i++) {
        if (!this.checkProblems(snakeBody[i], head)) {
            return true
        }
    }
    return false
}
snake.prototype.getSnakeCoordinates = function(){
	var coordinates = [];
	for(var i=0; i<this.snakeBody.length; i++){
		if(this.snakeBody[i].hasOwnProperty('currentPosition')){
			coordinates.push(this.snakeBody[i].currentPosition);
		}
	}
	return coordinates;

}
snake.prototype.checkCrossWithOthers = function(){
	for(var i = 0;i<this.competitors.length; i++ ){
		console.log("compare:");
		console.log(JSON.stringify(this.getSnakeCoordinates()));
		console.log(JSON.stringify(this.competitors[i]));
		if(this.checkProblems(this.getSnakeCoordinates(), this.competitors[i]))

			return true
	}
	return false;
}
snake.prototype.finish = function () {
    //this = null;

    //var cur = $(settings.field).find("." + settings.snakeClass);
    //$(cur).remove();

}

