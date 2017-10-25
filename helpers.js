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

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createNumbers(nums) {
    let numbers = [];
    if (nums.length === 0) {
        for (let i = 0; i < 8; i++) {
            nums[i] = randomInt(1, 12);
        }
    }

    for (let i = 0; i < nums.length; i++) {
        let text = new Text(nums[i].toString(),
            { fontFamily: "Arial", fontSize: 140 * sizing, fill: "white" });
        let button = new Container();
        let buttonImg = new Sprite(resources["images/draggable_num.png"].texture);
        buttonImg.anchor.set(0.5);
        text.anchor.set(0.5);
        buttonImg.width = buttonImg.height = 210 * sizing;
        button.addChild(buttonImg);
        button.type = "number";
        button.value = nums[i];
        button.text = text.text;
        button.addChild(text);
        numbers.push(button);
    }
    return numbers;
}

function createOperators(ops) {
    if (ops.length === 0) { ops = ["+", "-", "*", "/"] }
    let operators = [];
    let img = "";
    ops.forEach(function(symbol) {
        let button = new Container();
        switch (symbol) {
            case "+":
                img = "images/draggable_plus.png";
                break;
            case "-":
                img = "images/draggable_minus.png";
                break;
            case "*":
                img = "images/draggable_multiply.png";
                break;
            case "/":
                img = "images/draggable_divide.png";
        }
        let buttonImg = new Sprite(resources[img].texture);
        buttonImg.width = buttonImg.height = 210 * sizing;
        buttonImg.anchor.set(0.5);
        button.addChild(buttonImg);
        button.type = "operator";
        button.value = symbol;
        button.text = symbol;
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
        let newPosition = this.data.getLocalPosition(this.parent);
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
    comboArea.text = comboArea.text + elm.text;
    comboArea.mathSeq.push({ type: elm.type, value: elm.value });
}

function checkResult() {
    let seq = comboArea.mathSeq;
    let idx = -1;
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

//  HH:MM *M
function updateTime() {
    let d = new Date();
    time.text = d.toTimeString().slice(0, 5) + " " + d.toLocaleTimeString().slice(-2)
}

let prompts = [
    "Malicious process detected!\nID: ",
    "File under attack!\nID: ",
    "Error found!\nLine: ",
    "Firewall under pressure!\nClear port: ",
    "Reset encryption key!\nNeeded: "
];

function randomPrompt() {
    return prompts[randomInt(0, prompts.length - 1)];
}

let virusNames = [
    "Wormy the Worm",
    "Sassy Sasser",
    "Colin Ficker",
    "Crypto Locker",
    "I am Not a Virus!"
];

function randomName() {
    return virusNames[randomInt(0, virusNames.length - 1)];
}

// For centering text based on leng5h - assumes 1, 2, or 3.
function anchorProps(text) {
    if (text.length === 3) {
        return { x: 0.1, y: -0.1 };
    } else if (text.length === 2) {
        return { x: -0.1, y: -0.1 };
    } else {
        return { x: -0.8, y: -0.1 }
    }
}