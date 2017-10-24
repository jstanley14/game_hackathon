// Example JSON configuration

// numQuestions
let config = {
    questions: [
            {
                ops: ["+", "-", "*", "/"],
                //opsOrder: [],
                choices: [1, 2, 3, 4, 5, 6, 7, 8],
                answer: 15,
                prompt: "Malicious process detected!\nID: ",
                virusName: "Byte Bandito"
            },
        {
            ops: ["+", "*"],
            //opsOrder: [1, 0],
            choices: [4, 5, 6, 7, 8, 9, 10, 11],
            answer: 23,
            prompt: "Your text here!!!"
        },
        {
            ops: [],
            choices: []
        }
    ]
};