// Variable and setup section:
// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_usage


// Start the game loop as soon as the sprite sheet is loaded
window.addEventListener("load", function () {
    console.log("hello, world!");
    var canvas = document.getElementById('main');
    var ctx = canvas.getContext('2d');

    var x = 0;
    var y = 0;
    
    var carImage = new Image();
    carImage.src = "carImages/sonicRKart.png";
    
    var metalSonicImage = new Image();
    metalSonicImage.src = "carImages/metalSonicDrift.png";
    
    var silverImage = new Image();
    silverImage.src = "carImages/silver.png";
    
    var cityImage = new Image();
    cityImage.src = "enviroImages/cityEscape.png";

    var date = Date.now();

    var date2 = Date.now() - date;
    
    
    function sprite (options) {
                    
        var that = {};
                        
        that.context = options.context;
        that.width = options.width;
        that.height = options.height;
        that.image = options.image;
        that.imageStartX = options.imageStartX;
        that.imageStartY = options.imageStartY;
        that.pivotx = options.pivotx;
        that.pivoty = options.pivoty;
        
        that.frameIndex = 1;
        that.tickCount = 0;
        that.ticksPerFrame = options.ticksPerFrame || 0;
        that.numberOfFrames = options.numberOfFrames || 1;
        that.loop = options.loop;
        
        
        that.render = function (worldx, worldy, imageNr, scale) {

            //console.log("that.render successfully called!");
            
            var imageXPos = imageNr % that.numberOfFrames;
            var imageYPos = Math.floor(imageNr / that.numberOfFrames);
            
            // Draw the animation
            that.context.drawImage(
                that.image,
                that.imageStartX + imageXPos * that.width,
                that.imageStartY + imageYPos * that.height,
                that.width,
                that.height,
                //worldx + that.width * (1 - scale) * 0.5 - that.width * scale * 0.5,
                //worldy + that.height * (1 - scale) * 0.5 - that.height * scale * 0.5,
                worldx - that.width * scale * that.pivotx,
                worldy - that.height * scale * that.pivoty,
                that.width * scale,
                that.height * scale);
            
            //that.context.fillStyle = "rgba(200, 0, 0, 0.5)";
            //that.context.fillRect(10, 10, 30, 30);
        };
        
        that.update = function () {

            that.tickCount += 1;
                
            if (that.tickCount > that.ticksPerFrame) {
            
                that.tickCount = 0;
                
                // If the current frame index is in range
                if (that.frameIndex < that.numberOfFrames - 1) {	
                    // Go to the next frame
                    that.frameIndex += 1;
                }
                else if (that.loop)
                {
                    that.frameIndex = 0;
                }
                    
            }
        }; 

        return that;
    }
    
    var carSprite = sprite({
        context: canvas.getContext('2d'),
        width: 36,
        height: 32,
        image: carImage,
        imageStartX: 0,
        imageStartY: 0,
        pivotx: 0.5,
        pivoty: 0.9,
        ticksPerFrame: 30,
        numberOfFrames: 7,
        loop: true
    });
    
    var metalSonicSprite = sprite({
        context: canvas.getContext('2d'),
        width: 36,
        height: 32,
        image: metalSonicImage,
        imageStartX: 0,
        imageStartY: 0,
        pivotx: 0.5,
        pivoty: 0.9,
        ticksPerFrame: 30,
        numberOfFrames: 7,
        loop: true
    });
    
    var silverSprite = sprite({
        context: canvas.getContext('2d'),
        width: 36,
        height: 32,
        image: silverImage,
        imageStartX: 0,
        imageStartY: 0,
        pivotx: 0.5,
        pivoty: 0.9,
        ticksPerFrame: 30,
        numberOfFrames: 7,
        loop: true
    });
    
    var lampSprite = sprite({
        context: canvas.getContext('2d'),
        width: 32,
        height: 63,
        image: cityImage,
        imageStartX: 225,
        imageStartY: 64,
        pivotx: 0.5,
        pivoty: 1,
        ticksPerFrame: 30,
        numberOfFrames: 1,
        loop: false
    });
    
    function thing (options) {
                    
        var that = {};
                        
        that.sprite = options.sprite;
        that.x = options.x;
        that.distance = options.distance;
        //that.spritex = options.spritex;
        //that.spritey = options.spritey;
        //that.spriteWidth = options.spriteWidth;
        //that.spriteHeight = options.spriteHeight;
        
        that.render = function (x, y, scale) {

            that.sprite.render(x, y, 0, scale);
        };
        
        that.update = function () {

        }; 

        return that;
    }
    
    function car (options) {
                    
        var that = {};
                        
        that.sprite = options.sprite;
        that.x = options.x;
        that.distance = options.distance;
        that.maxSpeed = options.maxSpeed;
        that.accel = options.accel;
        that.turnAccel = options.turnAccel;
        that.turnMaxSpeed = options.turnMaxSpeed;
        that.speed = options.speed;
        that.turnSpeed = 0;
        that.rotationSpeeds = [10, 25, 50];
        that.rotationBase = 0;          // Dependant on input
        that.rotationAdditional = 0;    // Dependant on other things, like drift or rotating due to oil on road
        that.rotationPerSprite = 30;    // Degrees per sprite index
        
        that.rotate = function (value) {

            that.rotationBase += value;
            
            if (that.rotationBase > 180)
                that.rotationBase -= 360;
            if (that.rotationBase < -180)
                that.rotationBase += 360;
        }; 
        
        that.render = function (x, y, scale) {

            while (that.rotationBase > 180)
                that.rotationBase -= 360;
                
            while (that.rotationBase < -180)
                that.rotationBase += 360;
                
            while (that.rotationAdditional > 180)
                that.rotationAdditional -= 360;
                
            while (that.rotationAdditional < -180)
                that.rotationAdditional += 360;

            var imageFrame = 0;
            if (that.rotationBase + that.rotationAdditional < 0)
                imageFrame += 7;
            
            var absRotation = Math.abs(that.rotationBase + that.rotationAdditional);
            absRotation += 15;
            
            imageFrame += Math.floor(absRotation / 30);
            
            that.sprite.render(x, y, imageFrame, scale);
        };
        
        that.update = function () {

            // Get Input
            // React to input
            var currentSegment = Math.floor(that.distance / road1.roadPieceDistance);   // For now, simulate input accordingly to road
            that.turnSpeed = road1.roadPieces[currentSegment].direction;
            
            // Find rotation corresponding to current turning speed
            // Find rotations frame corresponding to current ro
            var i = 0;
            while (i < that.rotationSpeeds.length && Math.abs(that.turnSpeed) > that.rotationSpeeds[i] )
                i++
                
            that.rotationBase = i * that.rotationPerSprite;
            
            if (that.turnSpeed < 0)
                that.rotationBase *= -1;
                
            that.speed += that.accel;
            if (that.speed > that.maxSpeed)
                that.speed = that.maxSpeed;
            
            that.distance += that.speed;
            //that.rotate(1);
        }; 

        return that;
    }
    
    function roadPiece (options) {
                    
        var that = {};
                        
        that.direction = options.direction;
        that.roadWidth = options.roadWidth;
        that.roadColor = options.roadColor;
        that.grassColor = options.grassColor;
        that.things = options.things;

        return that;
    }
    
    function road (options) {
                    
        var that = {};
                        
        that.roadPieceDistance = options.roadPieceDistance;
        that.roadPieces = [];
        
        that.init = function () {

            for (i = 0; i < 200; i++) { 
                
                that.roadPieces[i] = 
                    roadPiece({
                        direction: Math.sin(i * 0.1) * 26,
                        roadWidth: 500,
                        roadColor: 1,
                        grassColor: 2,
                        things: []
                        
                    });
                
                if (i > 100)
                    that.roadPieces[i].roadWidth = 250;
                    
                if (i % 2 == 0)
                {
                    that.roadPieces[i].things[0] = thing({
                        sprite: lampSprite,
                        x: that.roadPieces[i].roadWidth * 0.5 + 10,
                        //x: 0,
                        distance: 0
                    });
                    if (i % 4 == 0)
                        that.roadPieces[i].things[0].x *= -1;
                }
            }
            
            console.log("Road initialized!");
        };
        
        that.init();

        return that;
    }
    
    var cars = [];
    cars.push(
    car({
        sprite: carSprite,
        x: 0,
        distance: 10,
        maxSpeed: 0.7,
        accel: 0.001,
        turnAccel: 5,
        turnMaxSpeed: 5,
        speed: 0.1
    })
    );
    
    cars.push(
    car({
        sprite: metalSonicSprite,
        x: 50,
        distance: 10,
        maxSpeed: 0.6,
        accel: 0.0011,
        turnAccel: 5,
        turnMaxSpeed: 5,
        speed: 0.1
    })
    );
    
    
    cars.push(
    car({
        sprite: silverSprite,
        x: -50,
        distance: 100,
        maxSpeed: 0.5,
        accel: 0.1,
        turnAccel: 5,
        turnMaxSpeed: 5,
        speed: 0.4
    })
    );
    
    var road1 = road({
        roadPieceDistance: 5
    });
    //road1.init();
    
    function roadPoint (options) {
     
        var that = {};
        
        that.x = options.x;
        that.y = options.y;
        that.multiplier = options.multiplier;
        
        return that;
    }
    
    function camera (options) {
                    
        var that = {
            // distance: options.distance,
            // roadPieceDistance: options.roadPieceDistance
        };
                        
        that.distance = options.distance;
        that.roadPiecesVisible = options.roadPiecesVisible;
        that.roadPiecesMultiplier = options.roadPiecesMultiplier;
        that.roadWidthMultiplier = options.roadWidthMultiplier;
        that.roadPieceDistanceBase = options.roadPieceDistanceBase;
        that.targetObj = options.targetObj;
        that.distanceToObj = options.distanceToObj;
        
        that.render = function () {
            
            /*
            for (i = that.roadPiecesVisible - 1; i >= 0; i--)
            {
                
            }*/
            
            // Number of first visible segment from that camera's viewpoint:
            var startSegment = Math.floor(that.distance / road1.roadPieceDistance);
            // Value in [0, 1] showing, how much of that segment is visible:
            var segmentFirstFragment = ( that.distance % road1.roadPieceDistance)  / road1.roadPieceDistance;
            //segmentFirstFragment = 1 - segmentFirstFragment;
            
            // X value of the middle of currently drawing segment:
            var currentx = canvas.width / 2;
            var currentHeight = that.roadPieceDistanceBase * (1 - segmentFirstFragment);
            var currentWidthMultiplier = 1;
            var currenty = canvas.height - currentHeight;
            //currenty += segmentFirstFragment * that.roadPieceDistanceBase;
            var widthMultiplierDifference = 1 - that.roadWidthMultiplier;
            
            // Var storing data about each road segment, to be used later:
            var roadPoints = [];
            
            // For each segment:
            for (i = startSegment; i < startSegment + that.roadPiecesVisible; i++)
            {
                //console.log("Attempting to read road piece nr :");
                //console.log("i: " + i);
                //console.log("currenty: " + currenty);
                //console.log("segmentFirstFragment: " + segmentFirstFragment);
                
                // If this is the first segment, we initialized values earlier, so there is nothing to do:
                if (i == startSegment)
                {
                    
                }
                // If it's the second segment, it's a special one, that has to have initialized another set of values:
                else if (i == startSegment + 1)
                {
                    // Init values for second part:
                    //console.log("Initializing piece ns start+1");
                    // Height of second piece depends on size of the first:
                    currentHeight = that.roadPieceDistanceBase * (that.roadPiecesMultiplier + widthMultiplierDifference * segmentFirstFragment * 1.5);
                    currenty -= currentHeight;
                    segmentFirstFragment = 0;
                }
                // It it's just another road piece, modify some values:
                else
                {
                    currentHeight *= that.roadPiecesMultiplier;
                    currenty -= currentHeight;
                } 
                
                // Now, it's time to calculate and record data for drawing
                
                // Chamge x value for this part:
                var botX = currentx;
                
                currentx += road1.roadPieces[i].direction * (1 - segmentFirstFragment);
                
                var topX = currentx;
                
                
                // Change width multiplier:
                //currenty = canvas.height - currentHeight;
                var botHalfWidth = road1.roadPieces[i].roadWidth * currentWidthMultiplier / 2;
                var oldMultiplier = currentWidthMultiplier;
                
                // After this line, currentWidthMultiplier is myltiplier from next segment:
                currentWidthMultiplier *= that.roadWidthMultiplier + widthMultiplierDifference * segmentFirstFragment;
                
                var topHalfWidth = road1.roadPieces[i].roadWidth * currentWidthMultiplier / 2;
                
                // Finally, its time to draw 
                // Draw grass:
                ctx.fillStyle = "rgba(0, 180, 0, 1)";
                ctx.fillRect(0, currenty, canvas.width, currentHeight);
                
                // Draw road:
                ctx.fillStyle = "rgba(0, 180, 180, 1)";
                ctx.beginPath();
                
                
                ctx.moveTo(botX - botHalfWidth, currenty + currentHeight);
                ctx.lineTo(botX + botHalfWidth, currenty + currentHeight);
                
                ctx.lineTo(topX + topHalfWidth, currenty);
                ctx.lineTo(topX - topHalfWidth, currenty);
                ctx.closePath();
                ctx.fill();
                
                // When you're done with everything, save road points to place objects and cars related to them:
                roadPoints[i - startSegment] = roadPoint({
                    
                    x: botX,
                    y: currenty + currentHeight,
                    multiplier: oldMultiplier
                }); 
                
                // First segment is super special, and it has different true values, than we thought:
                if (i == startSegment + 1)
                {
                    // currenty + currentHeight is topY from previous step
                    roadPoints[0].y = currenty + currentHeight + (currentHeight / that.roadPiecesMultiplier);
                    roadPoints[0].multiplier = (oldMultiplier / that.roadWidthMultiplier);
                    roadPoints[0].x = botX - road1.roadPieces[i - 1].direction;
                    
                }
            }
            
            // Draw things on road:
            for (i = roadPoints.length - 1; i >= 0; i--)    // It's important to count down from top to bottom
            { 
                var targetPiece = road1.roadPieces[startSegment + i];
                for (j = 0; j < targetPiece.things.length; j++)
                {
                    targetPiece.things[j].render(roadPoints[i].x + (targetPiece.things[j].x * roadPoints[i].multiplier),
                                                 roadPoints[i].y,
                                                 roadPoints[i].multiplier);
                }
            }
            
            // Finally, draw cars:
            for (i = 0; i < cars.length; i++)
            { 
                var carSegment = Math.floor(cars[i].distance / road1.roadPieceDistance);
                var carSegmentPart = ( cars[i].distance % road1.roadPieceDistance ) / road1.roadPieceDistance;
                var carRelativeSegment = Math.floor( (carSegment) - startSegment);
                
                if (carRelativeSegment >= 0 && carRelativeSegment < roadPoints.length)
                {
                    var carX = roadPoints[carRelativeSegment].x;
                    var carY = roadPoints[carRelativeSegment].y;
                    var carMultiplier = roadPoints[carRelativeSegment].multiplier;
                               
                    if (carRelativeSegment < roadPoints.length - 1)
                    {
                        carX = ( roadPoints[carRelativeSegment].x * (1 - carSegmentPart) +
                                roadPoints[carRelativeSegment + 1].x * carSegmentPart ) +
                                
                                cars[i].x *
                                ( roadPoints[carRelativeSegment].multiplier * (1 - carSegmentPart) +
                                roadPoints[carRelativeSegment + 1].multiplier * carSegmentPart );
                        carY = ( roadPoints[carRelativeSegment].y * (1 - carSegmentPart) +
                                roadPoints[carRelativeSegment + 1].y * carSegmentPart );
                        carMultiplier = ( roadPoints[carRelativeSegment].multiplier * (1 - carSegmentPart) +
                                roadPoints[carRelativeSegment + 1].multiplier * carSegmentPart );
                    }
                                          
                    //cars[i].render(cars[i].x + 50, cars[i].distance + 100, 1);
                    cars[i].render(carX, carY, carMultiplier);
                }
                
                
                //cars[0].render(roadPoints[2].x, roadPoints[2].y, 0.3);
            }
        };
        
        that.update = function () {
            
            that.distance = that.targetObj.distance - that.distanceToObj;
        };
        
        that.goForward = function () {
            
            that.distance += 0.5;  
        };

        return that;
    }
    
    var camera1 = camera({
        distance: 10,
        roadPiecesVisible: 15,
        roadPiecesMultiplier: 0.7,
        roadWidthMultiplier: 0.8,
        roadPieceDistanceBase: 50,
        targetObj: cars[0],
        distanceToObj: 10
    });
    
    var car1 = car({
        sprite: carSprite,
        distance: 0,
        speed: 0,
        x: 0
    });
    
    
    
    
    
    
    
    
    
    
    // Interesting code section:

    function draw() {
        //console.log("General draw function called!");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        //carSprite.update();
        //metalSonicSprite.update();
        //carSprite.render(0, 0);
        
        for (i = 0; i < cars.length; i++) {
             
             cars[i].update();
        }
        
        //camera1.goForward();
        camera1.update();
        camera1.render();
        
        /*
        ctx.fillStyle = "rgba(200, 0, 0, 0.5)";
        ctx.fillRect(x, y, x + 55, y + 50);
        x += 2;
        y += 2;
        */

        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
    
    //carSprite.render();
    
    function gameLoop () {

        window.requestAnimationFrame(gameLoop);
        carSprite.update();
    }

    //gameLoop();
});