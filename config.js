// Example JSON configuration

let config = {
    questions: [
        {
          ops: ["+", "-", "*", "/"],
          choices: [-2, 1, 3, 6, 7, 9, 10, 11, 13],
          answer: 23
        },
        {
            ops: ["-", "*"],
            //opsOrder: [],
            choices: [-5, -3, -2, 0, 1, 2],
            answer: 17,
            //prompt: "Malicious process detected!\nID: ",
            //virusName: "Byte Bandito"
        },
        {
            ops: ["*", "/"],
            //opsOrder: [1, 0],
            choices: [2, 5, 7, 8, 9, 12],
            answer: 1.5,
            //prompt: "Your text here!!!"
        },
        {
            ops: ["+", "/"],
            choices: [7, 14, 21, 40],
            answer: 42
        },
        {
            ops: [],
            choices: [],
            prompt: "Questions can be randomly\ngenerated or programmed.",
        },
        {
            ops: [],
            choices: []
        },
        {
            ops: [],
            choices: []
        },
        {
            ops: [],
            choices: []
        },
        {
            ops: [],
            choices: []
        }
    ]
};