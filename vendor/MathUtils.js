

var MathUtils = {};

MathUtils.angle2pos = function(centerPoint, rayon, angle) {
	var posX = centerPoint.x + (rayon * Math.cos((Math.PI) * (angle / 180)));
	var posY = centerPoint.y + (rayon * Math.sin((Math.PI) * (angle / 180)));
	return {x : posX, y : posY};
}

MathUtils.pos2angle = function(centerPoint, position) {
	return Math.atan2(centerPoint.y - position.y, centerPoint.x - position.x) * (180 / Math.PI);
}

MathUtils.randomMinMax = function(min, max) {
	return (min + (Math.random() * (max - min)));
}

MathUtils.deg2rad = function(deg) {
	return deg / 180.0 * Math.PI;
}

MathUtils.rad2deg = function(rad) {
	return 180 * (rad) / Math.PI;
}

MathUtils.hypotenuse = function(a, b) {
	return Math.sqrt(a * a + b * b);
}

MathUtils.delay = function(time, callback, arg) {

	setTimeout(callback(arg), time * 1000);
}

MathUtils.randomColor = function() {
	return (Math.random() * 0xFFFFFF << 0).toString(16);
}

MathUtils.distance = function(p0, p1) {
	return Math.sqrt((p1.x - p0.x) * (p1.x - p0.x) + (p1.y - p0.y) * (p1.y - p0.y));

};

MathUtils.getMove = function(startPt, movePt) {
	return {x : (movePt.x - startPt.x >= 0) ? movePt.x - startPt.x : movePt.x - startPt.x, y : (movePt.y - startPt.y >= 0) ? movePt.y - startPt.y : movePt.y - startPt.y};

};


	MathUtils.getMovement = function(posRef, touchPoint) {
		var directionX;
		var directionY;

		posRef.x1 = posRef.x2;
		posRef.x2 = touchPoint.x;
		directionX = (touchPoint.x > posRef.x1) ? 1 : -1;

		posRef.y1 = posRef.y2;
		posRef.y2 = touchPoint.y;
		directionY = (touchPoint.y > posRef.y1) ? 1 : -1;

		return {x : directionX * MathUtils.distance({x : posRef.x1, y : 0}, {x : posRef.x2, y : 0}), y : directionY * MathUtils.distance({x : 0, y : posRef.y1}, {x : 0, y : posRef.y2})};
	};

MathUtils.getMouse = function(e, canvas) {
	var element = canvas, offsetX = 0, offsetY = 0;
	if (element.offsetParent !== undefined) {
		do {
			offsetX += element.offsetLeft;
			offsetY += element.offsetTop;
		} while ((element = element.offsetParent));
	}
	if (e.touches) {
		return {x : (e.touches[0].pageX - offsetX), y : (e.touches[0].pageY - offsetY)};
	}
	return {x : e.pageX - offsetX, y : e.pageY - offsetY};
};



