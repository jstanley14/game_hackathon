//// HELPER FUNCTIONS
//The `hitTestRectangle` function                                                                                                                                        [75/4306]
function hitTestRectangle(r1, r2) {

    //Define the variables we'll need to calculate
    var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    //hit will determine whether there's a collision
    hit = false;

    //Find the center points of each sprite
    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2;
    r2.centerX = r2.x + r2.width / 2;
    r2.centerY = r2.y + r2.height / 2;

    //Find the half-widths and half-heights of each sprite
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;

    //Calculate the distance vector between the sprites                                                                                                                    [54/4306]
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;

    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;

    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {

        //A collision might be occuring. Check for a collision on the y axis
        if (Math.abs(vy) < combinedHalfHeights) {

            //There's definitely a collision happening
            hit = true;
        } else {

            //There's no collision on the y axis
            hit = false;
        }
    } else {

        //There's no collision on the x axis
        hit = false;
    }

    //`hit` will be either `true` or `false`
    return hit;
};


//The `randomInt` helper function
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createNumbers() {
    var numbers = [];
    for (var i = 0; i < 8; i++) {
        var number = randomInt(1, 12);
        var text = new Text(number.toString(),
            { fontFamily: "Arial", fontSize: 32, fill: "black" });
        // Center text in frame.
        if (number < 10) {
            text.anchor.set(-0.5, 0)
        }

        var button = new Container();
        var buttonFrame = new Graphics();
        buttonFrame.beginFill("0xFFFFFF");
        buttonFrame.lineStyle(2, "0x000000", 1);
        //buttonFrame.drawRect(0, 0, 36, 36);
        buttonFrame.drawCircle(17, 17, 28);
        buttonFrame.endFill();
        buttonFrame.addChild(text);
        button.addChild(buttonFrame);
        numbers.push(button);
    }
    return numbers;
}

function createOperators() {
    var operators = [];
    ["+", "-", "*", "/"].forEach(function(symbol) {
        var op = new Text(symbol,
            { fontFamily: "Arial", fontSize: 32, fill: "black" });
        op.anchor.set(-0.6, 0);
        var button = new Container();
        var buttonFrame = new Graphics();
        buttonFrame.beginFill("0xFFFFFF");
        buttonFrame.lineStyle(2, "0x000000", 1);
        buttonFrame.drawRect(0, 0, 40, 40);
        buttonFrame.endFill();
        buttonFrame.addChild(op);
        button.addChild(buttonFrame);
        operators.push(button);
    });
    return operators;
}