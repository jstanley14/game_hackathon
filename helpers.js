//// HELPER FUNCTIONS
//The `hitTestRectangle` function                                                                                                                                        [75/4306]
function hitTestRectangle(r1, r2) {
    //Define the variables we'll need to calculate
    var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    //hit will determine whether there's a collision
    hit = false;

    var r1_glob = r1.parent.toGlobal(r1.position);
    var r2_glob = r2.parent.toGlobal(r2.position);

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
    if (comboArea.mathSeq.length > 0) {
        if (comboArea.mathSeq[comboArea.mathSeq.length - 1].type !== elm.type) {
            if (elm.type === "number") {
                elm.visible = false;
            } else {
                elm.position.x = elm.origPosition.x;
                elm.position.y = elm.origPosition.y;
            }
            addToComboArea(elm);
        } else {
            elm.position.x = elm.origPosition.x;
            elm.position.y = elm.origPosition.y;
        }
    } else {
        if (elm.type === "number") {
            elm.visible = false;
            addToComboArea(elm);
        } else {
            elm.position.x = elm.origPosition.x;
            elm.position.y = elm.origPosition.y;
        }
    }
}

function addToComboArea(elm) {
    comboArea.text = comboArea.text + elm.children[0].children[0].text;
    comboArea.mathSeq.push({ type: elm.type, value: elm.value });
}

function checkResult() {
    var seq = comboArea.mathSeq;
    var idx = -1;
    // Want to evaluate result without using 'eval' function.
    // First sweep mathSeq for higher order operators
    while ((idx = seq.findIndex(function(elm) {
        return elm.type === "operator" && (elm.value === "/" || elm.value === "*")})) !== -1) {
        if (seq[idx].value === "/") {
            seq[idx - 1].value = seq[idx - 1].value / seq[idx + 1].value;
        }  else {
            seq[idx - 1].value = seq[idx - 1].value * seq[idx + 1].value;
        }
        seq.splice(idx, 2);
    }
    // Then evaluate lower-order operators.
    while ((idx = seq.findIndex(function(elm) {
        return elm.type === "operator" && (elm.value === "+" || elm.value === "-")})) !== -1) {
        if (seq[idx].value === "+") {
            seq[idx - 1].value = seq[idx - 1].value + seq[idx + 1].value;
        }  else {
            seq[idx - 1].value = seq[idx - 1].value - seq[idx + 1].value;
        }
        seq.splice(idx, 2);
    }

    return seq[0].value;
}

// Debugging
function showSeq(seq) {
    seq.forEach(function(elm) {
        console.log(elm.type + "----" + elm.value.toString());
    })
}