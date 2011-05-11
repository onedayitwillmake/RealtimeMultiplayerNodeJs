/**
 * @author  Hyperandroid  ||  http://hyperandroid.com/
 *
 * Hold a 2D point information.
 * Think about the possibility of turning CAAT.Point into {x:,y:}.
 *
 * (This is stolen from Hyperandroid's CAAT)
 **/
(function() {

	RealtimeMultiplayerGame.namespace("RealtimeMultiplayerGame.model");

    /**
     *
     * A point defined by two coordinates.
     *
     * @param xpos {number}
     * @param ypos {number}
     *
     * @constructor
     */
	RealtimeMultiplayerGame.model.Point = function(xpos, ypos) {
		this.x = xpos || 0;
		this.y = ypos || 0;
		return this;
	};

	RealtimeMultiplayerGame.model.Point.prototype = {
		x:	0,
		y: 	0,

        /**
         * Sets this point coordinates.
         * @param x {number}
         * @param y {number}
         *
         * @return this
         */
		set : function(x,y) {
			this.x= x;
			this.y= y;
			return this;
		},
        /**
         * Create a new RealtimeMultiplayerGame.model.Point equal to this one.
         * @return {RealtimeMultiplayerGame.model.Point}
         */
        clone : function() {
            var p = new RealtimeMultiplayerGame.model.Point();
            p.set( this.x, this.y );
            return p;
        },
        /**
         * Translate this point to another position. The final point will be (point.x+x, point.y+y)
         * @param x {number}
         * @param y {number}
         *
         * @return this
         */
        translate : function(x,y) {
            this.x+= x;
            this.y+= y;

            return this;
        },
        /**
         * Translate this point to another point.
         * @param aPoint {RealtimeMultiplayerGame.model.Point}
         * @return this
         */
		translatePoint: function(aPoint) {
		    this.x += aPoint.x;
		    this.y += aPoint.y;
		    return this;
		},
        /**
         * Substract a point from this one.
         * @param aPoint {RealtimeMultiplayerGame.model.Point}
         * @return this
         */
		subtract: function(aPoint) {
			this.x -= aPoint.x;
			this.y -= aPoint.y;
			return this;
		},

		/**
         * Substract a point from this one
		 * Returns a new point with the difference
         * @param aPoint {RealtimeMultiplayerGame.model.Point}
		 * @return {RealtimeMultiplayerGame.model.Point}
         */
		subtractClone: function(aPoint) {
			return new RealtimeMultiplayerGame.model.Point(this.x - aPoint.x, this.y - aPoint.y)
		},

        /**
         * Multiply this point by a scalar.
         * @param factor {number}
         * @return this
         */
		multiply: function(factor) {
			this.x *= factor;
			this.y *= factor;
			return this;
		},
        /**
         * Rotate this point by an angle. The rotation is held by (0,0) coordinate as center.
         * @param angle {number}
         * @return this
         */
		rotate: function(angle) {
			var x = this.x, y = this.y;
		    this.x = x * Math.cos(angle) - Math.sin(angle) * y;
		    this.y = x * Math.sin(angle) + Math.cos(angle) * y;
		    return this;
		},
        /**
         *
         * @param angle {number}
         * @return this
         */
		setAngle: function(angle) {
		    var len = this.getLength();
		    this.x = Math.cos(angle) * len;
		    this.y = Math.sin(angle) * len;
		    return this;
		},
        /**
         *
         * @param length {number}
         * @return this
         */
		setLength: function(length)	{
		    var len = this.getLength();
		    if (len)this.multiply(length / len);
		    else this.x = this.y = length;
		    return this;
		},
        /**
         * Normalize this point, that is, both set coordinates proportionally to values raning 0..1
         * @return this
         */
		normalize: function() {
		    var len = this.getLength();
		    this.x /= len;
		    this.y /= len;
		    return this;
		},
        /**
         * Return the angle from -Pi to Pi of this point.
         * @return {number}
         */
		getAngle: function() {
		    return Math.atan2(this.y, this.x);
		},
        /**
         * Set this point coordinates proportinally to a maximum value.
         * @param max {number}
         * @return this
         */
		limit: function(max) {
			var aLenthSquared = this.getLengthSquared();
			if(aLenthSquared+0.01 > max*max)
			{
				var aLength = Math.sqrt(aLenthSquared);
				this.x = (this.x/aLength) * max;
				this.y = (this.y/aLength) * max;
			}
            return this;
		},
        /**
         * Get this point's lenght.
         * @return {number}
         */
		getLength: function() {
		    var length = Math.sqrt(this.x * this.x + this.y * this.y);
		    if ( length < 0.005 && length > -0.005) return 0.000001;
		    return length;

		},
        /**
         * Get this point's squared length.
         * @return {number}
         */
		getLengthSquared: function() {
		    var lengthSquared = this.x * this.x + this.y * this.y;
		    if ( lengthSquared < 0.005 && lengthSquared > -0.005) return 0;
		    return lengthSquared;
		},
        /**
         * Get the distance between two points.
         * @param point {RealtimeMultiplayerGame.model.Point}
         * @return {number}
         */
		getDistance: function(point) {
			var deltaX = this.x - point.x;
			var deltaY = this.y - point.y;
			return Math.sqrt( (deltaX * deltaX) + (deltaY * deltaY) );
		},
        /**
         * Get the squared distance between two points.
         * @param point {RealtimeMultiplayerGame.model.Point}
         * @return {number}
         */
		getDistanceSquared: function(point) {
			var deltaX = this.x - point.x;
			var deltaY = this.y - point.y;
			return (deltaX * deltaX) + (deltaY * deltaY);
		},
        /**
         * Get a string representation.
         * @return {string}
         */
		toString: function() {
			return "(RealtimeMultiplayerGame.model.Point)" +
                    " x:'" + String(Math.round(Math.floor(this.x*10))/10) +
                    " y:" + String(Math.round(Math.floor(this.y*10))/10);
		}
	};

	RealtimeMultiplayerGame.model.Point.prototype.ZERO = new RealtimeMultiplayerGame.model.Point(0,0);
})();