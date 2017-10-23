//// HELPER FUNCTIONS
//The `hitTestRectangle` function                                                                                                                                        [75/4306]
function hitTestRectangle(r1, r2) {
    //Define the variables we'll need to calculate
    var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    //hit will determine whether there's a collision
    hit = false;

    var r1_glob = r1.parent.toGlobal(r1.position);
    var r2_glob = r2.parent.toGlobal(r2.position);
    console.log(r1_glob);
    console.log(r2_glob);
    console.log(r2.width);
    console.log(r2.height);

    //Find the center points of each sprite
    r1_glob.centerX = r1_glob.x + r1.width / 2;
    r1_glob.centerY = r1_glob.y + r1.height / 2;
    r2_glob.centerX = r2_glob.x + r2.width / 2;
    r2_glob.centerY = r2_glob.y + r2.height / 2;

    //Find the half-widths and half-heights of each sprite
    r1_glob.halfWidth = r1.width / 2;
    r1_glob.halfHeight = r1.height / 2;
    r2_glob.halfWidth = r2.width / 2;
    r2_glob.halfHeight = r2.height / 2;

    //Calculate the distance vector between the sprites                                                                                                                    [54/4306]
    vx = r1_glob.centerX - r2_glob.centerX;
    vy = r1_glob.centerY - r2_glob.centerY;

    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1_glob.halfWidth + r2_glob.halfWidth;
    combinedHalfHeights = r1_glob.halfHeight + r2_glob.halfHeight;

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

function droppedInZone(loc, zone) {
    console.log(loc);
    console.log(zone.x);
    console.log(zone.y);
    console.log(zone.width);
    console.log(zone.height);
    return false;
}

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
        button.type = "number";
        button.value = number;
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
        button.type = "operator";
        button.value = symbol;
        operators.push(button);
    });
    return operators;
}

function makeDraggable(elms) {
    elms.forEach(function(elm) {
        elm.interactive = true;
        elm.on('pointerdown', onDragStart)
            .on('pointerup', onDragEnd)
            .on('pointerupoutside', onDragEnd)
            .on('pointercancel', onDragEnd)
            .on('pointermove', onDragMove) });
}

function onDragStart(evt) {
    this.data = evt.data;
    this.alpha = 0.5;
    this.dragging = true;
}

function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    this.data = null;

    if (hitTestRectangle(this, comboZone)) {
        dropInComboArea(this);
    } else {
        this.position.x = this.origPosition.x;
        this.position.y = this.origPosition.y;
    }
}

function onDragMove() {
    if (this.dragging) {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;
    }
}

function dropInComboArea(elm) {
    var dropped = comboArea.children;
    if (dropped.length > 0) {
        if (dropped[dropped.length - 1].type !== elm.type) {
            elm.visible = false;
            comboArea.addChild(elm);
            addToComboArea(elm);
        } else {
            elm.position.x = elm.origPosition.x;
            elm.position.y = elm.origPosition.y;
        }
    } else {
        if (elm.type === "number") {
            elm.visible = false;
            comboArea.addChild(elm);
            addToComboArea(elm);
        } else {
            elm.position.x = elm.origPosition.x;
            elm.position.y = elm.origPosition.y;
        }
    }
}

function addToComboArea(elm) {
    comboArea.text = comboArea.text + elm.children[0].children[0].text;
}