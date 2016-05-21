// Variable and setup section:
// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_usage
var keyRightPressed = false;
var keyLeftPressed = false;

// 0 - keyboard WSAD
// 1 - keyboard arrows
// 2 - WiiMote
// 3 - nunchak
var inputInfos = [];

for (i = 0; i < 4; i++) {
    inputInfos[i] = {
        "A": false,
        "acc": 0
    };
}



var listenFunction;

function cloneParams(toArr, index, fromObj) {
    
    toArr[index] = Object.assign({}, fromObj);
    toArr[index].rand = Math.random();
    console.log(fromObj, toArr[index]);
    /*
    
    for (var key in fromObj) {
        if (fromObj.hasOwnProperty(key))
            toObj[key] = fromObj[key];
    }
    */
}



// Start the game loop as soon as the sprite sheet is loaded
listenFunction = window.addEventListener("load", function () {
    console.log("hello, world!");
    
    

    window.addEventListener("keydown", function (event){
        
        console.log(event);
        
        if (inMenu == true)
        {
            switch (event.keyCode)
            {
                case 39:                        // Right arrow
                    onMenuRight();
                    break;
                    
                case 37:                        // Left arrow
                    onMenuLeft();
                    break;
                    
                case 40:                        // Down arrow
                    onMenuDown();
                    break;
                    
                case 38:                        // Up arrow
                    onMenuUp();
                    break;
                    
                case 13:                        // Enter
                    onMenuAccept();
                    break;
            }
        }
        else
        {
            switch (event.keyCode)
            {
                case 65:                        // A
                    inputInfos[0].acc = -90;
                    break;
                    
                case 68:                        // D
                    inputInfos[0].acc = 90;
                    break;
                    
                case 83:                        // S
                    inputInfos[0].A = true;
                    break;
                    
                    
                case 39:                        // Right arrow
                    inputInfos[1].acc = 90;
                    break;
                    
                case 37:                        // Left arrow
                    inputInfos[1].acc = -90;
                    break;
                    
                case 40:                        // Down arrow
                    inputInfos[1].A = true;
                    break;
            }
        }
    });

    window.addEventListener("keyup", function (event){
        
        console.log(event);
        
        switch (event.keyCode)
        {
            case 65:
                inputInfos[0].acc = 0;
                break;
                
            case 68:
                inputInfos[0].acc = 0;
                break;
                
            case 83:
                inputInfos[0].A = false;
                break;
                
                
                
            case 39:                        // Right arrow
                inputInfos[1].acc = 0;
                break;
                
            case 37:                        // Left arrow
                inputInfos[1].acc = 0;
                break;
                
            case 40:                        // Down arrow
                inputInfos[1].A = false;
                break;
        }
    });
    
    
    var canvas = document.getElementById('main');
    var ctx = canvas.getContext('2d');

    var x = 0;
    var y = 0;
    
    var placeNames = [];
    placeNames[0] = "1st: ";
    placeNames[1] = "2nd: ";
    placeNames[2] = "3rd: ";
    placeNames[3] = "4th: ";
    placeNames[4] = "5th: ";
    placeNames[5] = "6th: ";
    placeNames[6] = "7th: ";
    placeNames[7] = "8th: ";
    
    var menuCursorX = 0;
    var menuCursorY = 0;
    var menuCursorXMax = 4;
    var menuCursorXMin = 0;
    var menuCursorYMax = 2;
    var menuCursorYMin = 0;
    var inMenu = true;

    // Array of cars taking part in race:
    var cars = [];

    // Array of car numbers taken by players:
    var menuCars = [0, 1, 2, 3, 4];
    var menuControllers = [0, -1, -1, -1, -1];

    // Var used in menu, serving as database to copy car properties:
    var carBluprints = []; 

    var controllerNames = ["WSAD", "Arrows", "Wiimote", "Nunchuck"];
    controllerNames[-1] = "AI";
    
    var carImage = new Image();
    carImage.src = "carImages/sonicRKart.png";
    
    var metalSonicImage = new Image();
    metalSonicImage.src = "carImages/metalSonicDrift.png";
    
    var metalKnucklesImage = new Image();
    metalKnucklesImage.src = "carImages/metalKnuckles.png";
    
    var silverImage = new Image();
    silverImage.src = "carImages/silver.png";
    
    var shadowImage = new Image();
    shadowImage.src = "carImages/shadow.png";
    
    var tailsImage = new Image();
    tailsImage.src = "carImages/tails.png";
    
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
    
    var sonicSprite = sprite({
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
    
    var tailsSprite = sprite({
        context: canvas.getContext('2d'),
        width: 36,
        height: 32,
        image: tailsImage,
        imageStartX: 0,
        imageStartY: 0,
        pivotx: 0.5,
        pivoty: 0.9,
        ticksPerFrame: 30,
        numberOfFrames: 7,
        loop: true
    });
    
    var shadowSprite = sprite({
        context: canvas.getContext('2d'),
        width: 36,
        height: 32,
        image: shadowImage,
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
    
    var metalKnucklesSprite = sprite({
        context: canvas.getContext('2d'),
        width: 36,
        height: 32,
        image: metalKnucklesImage,
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
    
    var car1Sprite = sprite({
        context: canvas.getContext('2d'),
        width: 96,
        height: 32,
        image: cityImage,
        imageStartX: 256,
        imageStartY: 224,
        pivotx: 0.5,
        pivoty: 1,
        ticksPerFrame: 30,
        numberOfFrames: 1,
        loop: false
    });
    
    var house1Sprite = sprite({
        context: canvas.getContext('2d'),
        width: 128,
        height: 64,
        image: cityImage,
        imageStartX: 288,
        imageStartY: 320,
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
        that.halfWidth = options.halfWidth;
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
        that.minSpeed = options.minSpeed;
        that.accel = options.accel;
        that.driftSpeedAtt = options.driftSpeedAtt;
        that.turnAccel = options.turnAccel;
        that.turnMaxSpeed = options.turnMaxSpeed;
        that.speed = options.speed;
        that.controllerId = options.controllerId;
        that.carHalfWidth = options.carHalfWidth;
        that.name = options.name;
        
        // Values, that will be displayed in menu to inform player about driver's stats:
        that.infoSpeed = options.infoSpeed;
        that.infoAcc = options.infoAcc;
        that.infoHandling = options.infoHandling;
        that.infoDrift = options.infoDrift;
        that.infoWeight = options.infoWeight;
        
        that.turnSpeed = 0;
        that.extraTurnSpeed = 0;
        that.pushTurnSpeed = 0;
        that.pushTurnAtt = 2;
        that.pushForce = 50;
        that.pushSpeedDec = 0.1;
        that.rotationSpeeds = [10, 25, 50];
        that.inputAccMultiplier = that.turnMaxSpeed / 90;
        that.inDrift = false;
        that.driftExtraSpeed = 10;
        that.driftExtraRotation = 60;
        that.targetTurnSpeed = 0;       // when controlled by player, value, that turnSpeed aspires to become
        that.turnAcc = 1;               // when controlled by player, speed at which turnSpeed changes
        that.rotationBase = 0;          // Dependant on input
        that.rotationAdditional = 0;    // Dependant on other things, like drift or rotating due to oil on road
        that.rotationPerSprite = 30;    // Degrees per sprite index
        that.halfRotationPerSprite = that.rotationPerSprite / 2;
        
        that.targetX = 0;               // used to control cars with AI
        that.targetXChangeSpeed = 1;    //
        that.targetXSize = 10;          // acceptance radius used by AI
        that.preferedTargetX = options.preferedTargetX;
        
        that.reInit = function(params){
            
            that.sprite = params.sprite;
            that.x = params.x;
            that.distance = params.distance;
            that.maxSpeed = params.maxSpeed;
            that.accel = params.accel;
            that.driftSpeedAtt = params.driftSpeedAtt;
            that.turnAccel = params.turnAccel;
            that.turnMaxSpeed = params.turnMaxSpeed;
            that.speed = params.speed;
            that.controllerId = params.controllerId;
            that.name = params.name;
            
            that.inputAccMultiplier = that.turnMaxSpeed / 90;
            that.halfRotationPerSprite = that.rotationPerSprite / 2;
            that.rotationAdditional = 0;
            
            that.targetX = 0;               // used to control cars with AI
            that.targetXChangeSpeed = 1;    //
            that.targetXSize = 10;          // acceptance radius used by AI
            that.preferedTargetX = params.preferedTargetX;
        }
        
        that.rotate = function (value) {

            that.rotationBase += value;
            
            if (that.rotationBase > 180)
                that.rotationBase -= 360;
            if (that.rotationBase < -180)
                that.rotationBase += 360;
        }; 
        
        that.render = function (x, y, scale) {

            // Keep both rotations in [-180, 180]:
            while (that.rotationBase > 180)
                that.rotationBase -= 360;
                
            while (that.rotationBase < -180)
                that.rotationBase += 360;
                
            while (that.rotationAdditional > 180)
                that.rotationAdditional -= 360;
                
            while (that.rotationAdditional < -180)
                that.rotationAdditional += 360;

            // Check, what imageFrame corresponds to rotationBase + rotationAdditional:
            var imageFrame = 0;
            
            // If car is rotated left, the we should use second set of images, rotated left:
            if (that.rotationBase + that.rotationAdditional < 0)
                imageFrame += 7;
            
            var absRotation = Math.abs(that.rotationBase + that.rotationAdditional);
            
            // Since image nr 0 is smaller, consider 15 degree 
            absRotation += that.halfRotationPerSprite;
            
            // Find frame nr corresponding to calculated rotation:
            imageFrame += Math.floor(absRotation / 30);
            
            that.sprite.render(x, y, imageFrame, scale);
        };
        
        that.update = function () {

            var currentSegment = Math.floor(that.distance / road1.roadPieceDistance);
            
            // If you have a controller, get input from it:
            if (that.controllerId >= 0)
            {
                // Get desired rotation from controller:
                that.targetTurnSpeed = inputInfos[that.controllerId].acc * that.inputAccMultiplier;
                if (inputInfos[that.controllerId].A == true)
                    that.inDrift = true;
                else
                    that.inDrift = false;
                
            }
            // if not, calculate AI input:
            else
            {
                // For now, simulate input accordingly to road
                if (road1.roadPieces[currentSegment].preferedXMatters == false)
                    that.targetX = that.preferedTargetX;
                else
                    that.targetX = road1.roadPieces[currentSegment].preferedX;
                
                if (Math.abs(that.x - that.targetX) < that.targetXSize)
                    that.targetTurnSpeed = road1.roadPieces[currentSegment].direction;
                else if (that.targetX < that.x)
                    that.targetTurnSpeed = -90 * that.inputAccMultiplier;
                else
                    that.targetTurnSpeed = 90 * that.inputAccMultiplier;
                
                // If road turns too rapidly and you're about to get thrown out, it's time to drift like a boss: 
                if ( that.inputAccMultiplier * 90 < Math.abs(road1.roadPieces[currentSegment].direction) &&
                    (
                    (road1.roadPieces[currentSegment].direction > 0 && that.x < road1.roadPieces[currentSegment].roadWidth * -0.25) ||
                    (road1.roadPieces[currentSegment].direction < 0 && that.x > road1.roadPieces[currentSegment].roadWidth * 0.25) 
                    )
                    )
                    that.inDrift = true;
                else
                    that.inDrift = false;
            }
            
            // Gradually change your actual rotation to it:
            if (Math.abs(that.targetTurnSpeed - that.turnSpeed) <= that.turnAcc)
                that.turnSpeed = that.targetTurnSpeed;
            else if (that.targetTurnSpeed > that.turnSpeed)
                that.turnSpeed += that.turnAcc;
            else
                that.turnSpeed -= that.turnAcc;
            
            if (that.inDrift == true)
            {
                that.rotationAdditional = that.driftExtraRotation;
                that.extraTurnSpeed = that.driftExtraSpeed;
                if (that.turnSpeed < 0)
                {
                    that.rotationAdditional *= -1;
                    that.extraTurnSpeed *= -1;
                }
                
            }
            else
            {
                that.rotationAdditional = 0;
                that.extraTurnSpeed = 0;
            }
            
            // Find rotation corresponding to current turning speed
            var i = 0;
            while (i < that.rotationSpeeds.length && Math.abs(that.turnSpeed) > that.rotationSpeeds[i])
                i++;
                
            that.rotationBase = i * that.rotationPerSprite;
            
            if (that.turnSpeed < 0)
                that.rotationBase *= -1;
                
            // Update speed and acceleration:
            that.speed += that.accel;
            if (that.inDrift == true ||
                that.x > road1.roadPieces[currentSegment].roadWidth * 0.5 || that.x < road1.roadPieces[currentSegment].roadWidth * -0.5)
                that.speed -= that.driftSpeedAtt;
                
            if (that.speed > that.maxSpeed)
                that.speed = that.maxSpeed;
            if (that.speed < that.minSpeed)
                that.speed = that.minSpeed;
                
            // Update push speed:
            if (Math.abs(that.pushTurnSpeed) <= that.pushTurnAtt)
                that.pushTurnSpeed = 0;
            else if (that.pushTurnSpeed > 0)
                that.pushTurnSpeed -= that.pushTurnAtt;
            else
                that.pushTurnSpeed += that.pushTurnAtt;
            
            // Update x according to turnSpeed and current road piece:
            that.x += (that.turnSpeed + that.extraTurnSpeed + that.pushTurnSpeed
                    - road1.roadPieces[currentSegment].direction) / road1.roadPieceDistance * that.speed;
                
            that.distance += that.speed;
            if (that.distance > road1.roadCarLength)
                that.distance = road1.roadCarLength;
            currentSegment = Math.floor(that.distance / road1.roadPieceDistance);
            
            // Check, if you didn't hit any object:
            for (var i = 0; i < road1.roadPieces[currentSegment].things.length; i++)
            {
                var theThing = road1.roadPieces[currentSegment].things[i];
                var theDistance = theThing.distance + currentSegment * road1.roadPieceDistance;
                // If there has been collision:
                if (theDistance < that.distance && theDistance > that.distance - that.speed &&
                    Math.abs(theThing.x - that.x) < theThing.halfWidth + that.carHalfWidth)
                {
                    // Get hit by theThing:
                    that.pushTurnSpeed = that.pushForce;
                    if (that.x < theThing.x)
                        that.pushTurnSpeed *= -1;
                        
                    that.speed -= that.pushSpeedDec;
                }
            }
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
        that.preferedXMatters = options.preferedXMatters;   // Used by AI to know, where car should be now
        that.preferedX = options.preferedX;
        that.avoidX = options.avoidX;                       // Used by AI to know, which parts of road to avoid

        return that;
    }
    
    function road (options) {
                    
        var that = {};
                        
        that.roadPieceDistance = options.roadPieceDistance;
        that.roadPieces = [];
        that.roadCarLength = 0;         // Distance in in-game units (NOT number of negments) that can be traveled by cars
        that.roadCameraLength = 0;
        
        that.init = function () {
            
            var pieceNr = 0;
            var i = 0;
            
            // Keep generating until you reach at least set number of road pieces:
            while (pieceNr < 400)
            {
                switch ( Math.floor( Math.random() * 4) )
                {
                case 0:     // Make straight road:
                    for (i = 0; i < 10; i++)
                    {
                        that.roadPieces[pieceNr + i] = 
                            roadPiece({
                                direction: 0,
                                roadWidth: 500,
                                roadColor: 1,
                                grassColor: 2,
                                things: [],
                                preferedXMatters: false,
                                preferedX: 0
                            });
                    }
                    
                    break;
                    
                case 1:     // Make nice turn:
                    var direction =  Math.floor( Math.random() * 2) * 2 - 1;
                    
                    for (i = 0; i < 20; i++)
                    {
                        that.roadPieces[pieceNr + i] = 
                            roadPiece({
                                direction: Math.sin(i * Math.PI * 0.05) * 26 * direction,
                                roadWidth: 500,
                                roadColor: 1,
                                grassColor: 2,
                                things: [],
                                preferedXMatters: true,
                                preferedX: Math.sin((i + 5) * Math.PI * 0.05) * 150 * direction
                            });
                    }
                    
                    break;
                    
                case 2:     // Make tight turn:
                    var direction =  Math.floor( Math.random() * 2) * 2 - 1;
                    
                    if (pieceNr > 5)
                    {
                        for (i = 1; i <= 5; i++)
                        {
                            that.roadPieces[pieceNr - i].preferedXMatters = true;
                            that.roadPieces[pieceNr - i].preferedX = 150 * direction;
                        }
                    }
                
                    for (i = 0; i < 30; i++)
                    {
                        that.roadPieces[pieceNr + i] = 
                            roadPiece({
                                direction: Math.sin(i * Math.PI * 0.033) * 50 * direction,
                                roadWidth: 500,
                                roadColor: 1,
                                grassColor: 2,
                                things: [],
                                preferedXMatters: true,
                                preferedX: 150 * direction
                            });
                    }
                    
                    break;
                    
                case 3:     // Place random stuff on road:
                    // Randomize a safe passage and save it in road pieces:
                    var rightX = Math.random() * 400 - 200;
                    var safeHalfWidth = 100;
                
                    for (i = 0; i < 20; i++)
                    {
                        that.roadPieces[pieceNr + i] = 
                            roadPiece({
                                direction: 0,
                                roadWidth: 500,
                                roadColor: 1,
                                grassColor: 2,
                                things: [],
                                preferedXMatters: true,
                                preferedX: rightX
                            });
                    }
                    
                    // Generate set number of blockades:
                    for (var j = 0; j < 5; j++)
                    {
                        // Randomize new x value from not-safe space:
                        var objX = Math.random() * (500 - (safeHalfWidth * 2) ) - 250;
                        if (objX > rightX - safeHalfWidth && objX < rightX + safeHalfWidth)
                            objX += safeHalfWidth * 2;
                        
                        that.roadPieces[pieceNr + i - j - 1].things[0] = 
                            thing({
                                sprite: car1Sprite,
                                x: objX,
                                halfWidth: 30,
                                //x: 0,
                                distance: 0
                            });
                    }
                    
                    break;
                }
                
                // Move forward by number of generated road pieces:
                pieceNr += i;
            }
            
            // Generate finish line:
            that.roadCameraLength = pieceNr * that.roadPieceDistance - 1;
            for (i = 0; i < 40; i++)
            {
                that.roadPieces[pieceNr + i] = 
                            roadPiece({
                                direction: 0,
                                roadWidth: 500,
                                roadColor: 1,
                                grassColor: 2,
                                things: [],
                                preferedXMatters: false,
                                preferedX: 0
                            });
            }
            
            // After this, place enviro objects next to the road:
            for (i = 0; i < that.roadPieces.length; i++)
            {
                if (i % 2 == 0)
                {
                    that.roadPieces[i].things[that.roadPieces[i].things.length] = thing({
                        sprite: lampSprite,
                        x: that.roadPieces[i].roadWidth * 0.5 + 10,
                        halfWidth: 5,
                        //x: 0,
                        distance: 0
                    });
                    if (i % 4 == 0)
                        that.roadPieces[i].things[0].x *= -1;
                }
            }
            
            i = 0;
            while (i < that.roadPieces.length)
            {
                that.roadPieces[i].things[that.roadPieces[i].things.length] = thing({
                    sprite: house1Sprite,
                    x: that.roadPieces[i].roadWidth * 0.5 + 100,
                    halfWidth: 50,
                    //x: 0,
                    distance: 0
                });
                if (Math.floor(Math.random() * 2) == 0)
                    that.roadPieces[i].things[that.roadPieces[i].things.length - 1].x *= -1;
                
                i += Math.floor(Math.random() * 20);
            }
            
            that.roadCarLength = (that.roadPieces.length - 1) * that.roadPieceDistance;

            /*
            for (i = 0; i < 400; i++) { 
                
                that.roadPieces[i] = 
                    roadPiece({
                        direction: Math.sin(i * 0.1) * 26,
                        roadWidth: 500,
                        roadColor: 1,
                        grassColor: 2,
                        things: [],
                        preferedXMatters: true,
                        preferedX: Math.sin((i + 5) * 0.1) * 150
                        
                    });
                
                if (i > 100)
                {
                    that.roadPieces[i].roadWidth = 300;
                    that.roadPieces[i].preferedX *= 0.5;
                }
                    
                if (i % 2 == 0)
                {
                    that.roadPieces[i].things[0] = thing({
                        sprite: lampSprite,
                        x: that.roadPieces[i].roadWidth * 0.5 + 10,
                        halfWidth: 5,
                        //x: 0,
                        distance: 0
                    });
                    if (i % 4 == 0)
                        that.roadPieces[i].things[0].x *= -1;
                }
            }*/
            
            console.log("Road initialized!");
        };
        
        that.init();

        return that;
    }
    
    carBluprints.push(
    car({
        sprite: sonicSprite,
        x: 0,
        distance: 11,
        maxSpeed: 0.7,
        minSpeed: 0.1,
        accel: 0.001,
        driftSpeedAtt: 0.002,
        turnAccel: 5,
        turnMaxSpeed: 27,
        speed: 0.1,
        controllerId: 0,
        carHalfWidth: 30,
        name: "Sonic",
        infoSpeed: 5,
        infoAcc: 3,
        infoHandling: 2, 
        infoDrift: 3
    })
    );
    
    carBluprints.push(
    car({
        sprite: shadowSprite,
        x: -20,
        distance: 11,
        maxSpeed: 0.68,
        minSpeed: 0.1,
        accel: 0.001,
        driftSpeedAtt: 0.0017,
        turnAccel: 5,
        turnMaxSpeed: 28,
        speed: 0.1,
        controllerId: -1,
        carHalfWidth: 30,
        preferedTargetX: -20,
        name: "Shadow",
        infoSpeed: 4,
        infoAcc: 3,
        infoHandling: 3, 
        infoDrift: 3
    })
    );
    
    carBluprints.push(
    car({
        sprite: metalSonicSprite,
        x: 50,
        distance: 10,
        maxSpeed: 0.69,
        minSpeed: 0.1,
        accel: 0.001,
        driftSpeedAtt: 0.002,
        turnAccel: 5,
        turnMaxSpeed: 27,
        speed: 0.1,
        controllerId: -1,
        carHalfWidth: 30,
        preferedTargetX: 50,
        name: "Metal Sonic",
        infoSpeed: 5,
        infoAcc: 3,
        infoHandling: 2, 
        infoDrift: 3
    })
    );
    
    carBluprints.push(
    car({
        sprite: metalKnucklesSprite,
        x: 80,
        distance: 12,
        maxSpeed: 0.67,
        minSpeed: 0.1,
        accel: 0.001,
        driftSpeedAtt: 0.002,
        turnAccel: 7,
        turnMaxSpeed: 33,
        speed: 0.1,
        controllerId: -1,
        carHalfWidth: 30,
        preferedTargetX: 30,
        name: "Metal Knux",
        infoSpeed: 3,
        infoAcc: 3,
        infoHandling: 4, 
        infoDrift: 3
    })
    );
    
    
    carBluprints.push(
    car({
        sprite: silverSprite,
        x: -50,
        distance: 12,
        maxSpeed: 0.65,
        minSpeed: 0.1,
        accel: 0.001,
        driftSpeedAtt: 0.002,
        turnAccel: 5,
        turnMaxSpeed: 35,
        speed: 0.1,
        controllerId: -1,
        carHalfWidth: 30,
        preferedTargetX: -50,
        name: "Silver",
        infoSpeed: 2,
        infoAcc: 3,
        infoHandling: 5, 
        infoDrift: 3
    })
    );
    
    carBluprints.push(
    car({
        sprite: tailsSprite,
        x: 0,
        distance: 10,
        maxSpeed: 0.67,
        minSpeed: 0.1,
        accel: 0.0015,
        driftSpeedAtt: 0.002,
        turnAccel: 5,
        turnMaxSpeed: 35,
        speed: 0.1,
        controllerId: -1,
        carHalfWidth: 30,
        preferedTargetX: -50,
        name: "Tails",
        infoSpeed: 3,
        infoAcc: 5,
        infoHandling: 4, 
        infoDrift: 3
    })
    );
    
    
    // Init cars array with any random values:
    for (var i = 0; i < menuCars.length; i++)
    {
        cars[i] = car({
            sprite: silverSprite,
            x: -50,
            distance: 12,
            maxSpeed: 0.66,
            minSpeed: 0.1,
            accel: 0.0013,
            driftSpeedAtt: 0.002,
            turnAccel: 5,
            turnMaxSpeed: 35,
            speed: 0.1,
            controllerId: -1,
            carHalfWidth: 30,
            preferedTargetX: 10,
            name: "Silver",
            infoSpeed: 2,
            infoAcc: 3,
            infoHandling: 5, 
            infoDrift: 3
        });
        //cloneParams(cars[i], carBluprints[i]);
    }
    
    
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
        that.startY = options.startY;
        
        that.render = function () {
            
            // Number of first visible segment from that camera's viewpoint:
            var startSegment = Math.floor(that.distance / road1.roadPieceDistance);
            // Value in [0, 1] showing, how much of that segment is visible:
            var segmentFirstFragment = ( that.distance % road1.roadPieceDistance)  / road1.roadPieceDistance;
            //segmentFirstFragment = 1 - segmentFirstFragment;
            
            // X value of the middle of currently drawing segment:
            var currentx = canvas.width / 2;
            var currentHeight = that.roadPieceDistanceBase * (1 - segmentFirstFragment);
            var currentWidthMultiplier = 1;
            var currenty = that.startY - currentHeight; 
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
                    if (roadPoints[i].y < that.startY)
                    {
                        targetPiece.things[j].render(roadPoints[i].x + (targetPiece.things[j].x * roadPoints[i].multiplier),
                                                    roadPoints[i].y,
                                                    roadPoints[i].multiplier);
                    }
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
                    if (carY < that.startY)
                        cars[i].render(carX, carY, carMultiplier);
                }
                
                
                //cars[0].render(roadPoints[2].x, roadPoints[2].y, 0.3);
            }
        };
        
        that.update = function () {
            
            that.distance = that.targetObj.distance - that.distanceToObj;
            if (that.distance > road1.roadCameraLength)
                that.distance = road1.roadCameraLength;
        };
        
        that.goForward = function () {
            
            that.distance += 0.5;  
        };

        return that;
    }
    
    var cameras = [];
    
    cameras[0] =
    camera({
        distance: 10,
        roadPiecesVisible: 15,
        roadPiecesMultiplier: 0.7,
        roadWidthMultiplier: 0.8,
        roadPieceDistanceBase: 50,
        targetObj: cars[0],
        distanceToObj: 10,
        startY: canvas.height
    });
    
    cameras[1] = 
    camera({
        distance: 10,
        roadPiecesVisible: 15,
        roadPiecesMultiplier: 0.7,
        roadWidthMultiplier: 0.8,
        roadPieceDistanceBase: 50,
        targetObj: cars[1],
        distanceToObj: 10,
        startY: canvas.height / 2
    });
    
    var car1 = car({
        sprite: sonicSprite,
        distance: 0,
        speed: 0,
        x: 0
    });
    
    
    
    
    
    
    
    
    
    
    // Interesting code section:
    
    function onMenuUp(){
        menuCursorY--;
        if (menuCursorY < menuCursorYMin)
            menuCursorY = menuCursorYMax;
    }

    function onMenuDown(){
        menuCursorY++;
        if (menuCursorY > menuCursorYMax)
            menuCursorY = menuCursorYMin;
    }

    function onMenuLeft(){
        if (menuCursorY >= 1)
        {
            menuCursorX--;
            if (menuCursorX < menuCursorXMin)
                menuCursorX = menuCursorXMax;
        }
    }

    function onMenuRight(){
        if (menuCursorY >= 1)
        {
            menuCursorX++;
            if (menuCursorX > menuCursorXMax)
                menuCursorX = menuCursorXMin;
        }
    }

    function onMenuAccept(){
        
        switch (menuCursorY)
        {
        // If cursor is on start field:
        case 0:
            inMenu = false;
            for (var i = 0; i < menuCars.length; i++)
            {
                carBluprints[menuCars[i]].rotationAdditional = 0;
                //cloneParams(cars, i, carBluprints[menuCars[i]]);
                cars[i].reInit(carBluprints[menuCars[i]]);
                cars[i].controllerId = menuControllers[i];
            }
            break;
            
        // If cursor is on control type field:
        case 1:
            menuControllers[menuCursorX]++;
            if (menuControllers[menuCursorX] > 3)
                menuControllers[menuCursorX] = -1;
            break;
            
        // If cursor is on car bluprint field:
        case 2:
            menuCars[menuCursorX]++;
            if (menuCars[menuCursorX] >= carBluprints.length)
                menuCars[menuCursorX] = 0;
            break; 
        }
    }

    function onGameStart(){
        
    }

    function onGameEnd(){
        
    }
    
    // Since it's JavaScript, the draw method also serves as update method:
    function draw() {
        //console.log("General draw function called!");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // If in menu, draw it and allow navigation:
        if (inMenu == true)
        {
            // Update cars on display, so they rotate slowly:
            for (var i = 0; i < carBluprints.length; i++)
            {
                carBluprints[i].rotationAdditional += 1;
            }
            
            // Draw everything in menu:
            ctx.fillStyle = "black";
            ctx.font = "20px Arial";
            
            ctx.fillText("Start", ctx.canvas.width * 0.5, 20);
            if (menuCursorY == 0)
                ctx.fillText(">           <", ctx.canvas.width * 0.5 - 20, 20);
                
            for (var i = 0; i <= menuCursorXMax; i++)
            {
                ctx.font = "20px Arial";
                ctx.fillText(controllerNames[menuControllers[i]], 20 + i * 130, 50);
                if (menuCursorY == 1 && menuCursorX == i)
                    ctx.fillText(">", 20 + i * 130 - 20, 50);
                
                ctx.fillText(carBluprints[menuCars[i]].name, 20 + i * 130, 80);
                if (menuCursorY == 2 && menuCursorX == i)
                    ctx.fillText(">", 20 + i * 130 - 20, 80);
                
                carBluprints[menuCars[i]].render(20 + i * 130 + 40, 130, 1);
                
                ctx.font = "15px Arial";
                ctx.fillText("Speed:    ", 20 + i * 130, 160);
                ctx.fillText("Acc:      ", 20 + i * 130, 190);
                ctx.fillText("Handling: ", 20 + i * 130, 220);
                ctx.fillText("Drift:    ", 20 + i * 130, 250);
                
                for (var j = 0; j < carBluprints[menuCars[i]].infoSpeed; j++)
                    ctx.fillRect(20 + i * 130 + 70 + j * 4, 160 - 10, 3, 10);
                    
                for (var j = 0; j < carBluprints[menuCars[i]].infoAcc; j++)
                    ctx.fillRect(20 + i * 130 + 70 + j * 4, 190 - 10, 3, 10);
                    
                for (var j = 0; j < carBluprints[menuCars[i]].infoHandling; j++)
                    ctx.fillRect(20 + i * 130 + 70 + j * 4, 220 - 10, 3, 10);
                    
                for (var j = 0; j < carBluprints[menuCars[i]].infoDrift; j++)
                    ctx.fillRect(20 + i * 130 + 70 + j * 4, 250 - 10, 3, 10);
            }
        }
        // If in game, calculate game logic and draw all cameras:
        else
        {
            // Sort cars, so that they are listed from 1st place to last:
            for (var i = 0; i < cars.length; i++)
            {
                for (var j = 0; j < cars.length - i - 1; j++)
                {
                    if (cars[j].distance < cars[j + 1].distance)
                    {
                        var tempCar = cars[j];
                        cars[j] = cars[j + 1];
                        cars[j + 1] = tempCar;
                    }
                }
            }
            
            // Update game logic:
            for (var i = 0; i < cars.length; i++) {
                
                cars[i].update();
            }
            
            // Update camera's logic and then draw their views:
            for (var i = 0; i < 2; i++)
            {
                cameras[i].update();
                cameras[i].render();
            }
            
            var textY = 15;
            
            // Finally, draw HUD:
            ctx.fillStyle = "black";
            ctx.font = "20px Arial";
            for (var i = 0; i < cars.length; i++)
            {
                ctx.fillText(placeNames[i] + cars[i].name, 5, textY);
                textY += 30;
            }
            //ctx.fillTex("Pootis", 10, 10);
            
        }
        /*
        ctx.fillStyle = "rgba(200, 0, 0, 0.5)";
        ctx.fillRect(x, y, x + 55, y + 50);
        x += 2;
        y += 2;
        */

        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
    
    //sonicSprite.render();
    
    function gameLoop () {

        window.requestAnimationFrame(gameLoop);
        sonicSprite.update();
    }

    //gameLoop();
});