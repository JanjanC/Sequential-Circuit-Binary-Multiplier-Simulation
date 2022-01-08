//Convert to unsigned binary 2's complement
function get2sComplement(bin) {
    let complement = "";
    let seenOne = false;

    for (let i = bin.length - 1; i >= 0; i--) {
        if (!seenOne) {
            if (bin[i] === "1") {
                seenOne = true;
            }
            complement = bin[i] + complement;
        } else {
            if (bin[i] === "0") {
                complement = 1 + complement;
            } else {
                complement = 0 + complement;
            }
        }
    }
    return complement;
}

function decToSignedBin(dec) {
    dec = parseInt(dec);
    if (dec >= 0) {
        return "0" + dec.toString(2);
    } else {
        let temp = "0" + (-dec).toString(2);
        return get2sComplement(temp);
    }
}

function addBin(bin1, bin2) {
    let carryOver = 0;
    let answer = "";
    //check bin.length == bin2.length
    for (let ctr = bin1.length - 1; ctr >= 0; ctr--) {
        carryOver =
            carryOver + parseInt(bin1.charAt(ctr)) + parseInt(bin2.charAt(ctr));
        answer = (carryOver % 2) + answer;
        carryOver = parseInt(carryOver / 2);
    }
    console.log("ADD BINARY RESULT: " + answer);
    return answer;
}

//Function for each iteration
function sequentialCircuitBinaryMultiply(num1, num2, isBinary) {
    let A = ""; //Answer
    let Qsub1 = "0"; //Quotient Sub 1 from Arithmetic Shift Right
    let M = isBinary ? num1 : decToSignedBin(num1); //Multiplicand
    let Mcomplement = isBinary ? -num1 : decToSignedBin(-num1); //Multiplicand
    let Q = isBinary ? num2 : decToSignedBin(num2); //Multiplier
    let length = M.length > Q.length ? M.length : Q.length;

    // Make sure they are all the same length
    M = M.padStart(length, M.charAt(0));
    Q = Q.padStart(length, Q.charAt(0));
    A = A.padStart(length, "0");
    Mcomplement = Mcomplement.padStart(length, Mcomplement.charAt(0));
    console.log("Mcomplement : " + Mcomplement);
    console.log("M: " + M);
    const iterations = [];
    console.log(Q);
    for (let i = 0; i < length; i++) {
        let values = {};

        if (Q.charAt(Q.length - 1) == "0" && Qsub1 == "1") A = addBin(A, M);
        else if (Q.charAt(Q.length - 1) == "1" && Qsub1 == "0")
            A = addBin(A, Mcomplement);
        console.log(i + ": " + A);

        /**SHIFT ARITHMETIC RIGHT**/
        // Qsub1 gets the value of Q0 (the least significant bit of Q)
        Qsub1 = Q.charAt(Q.length - 1);
        // Q gets the least significant bit of A concatenated with Q minus the last character
        Q = A.charAt(A.length - 1) + Q.slice(0, -1);
        // A gets the most significant value of A concatenated with A minus the last character
        A = A.charAt(0) + A.slice(0, -1);

        values.A = A;
        values.Q = Q;
        values.Qsub1 = Qsub1;
        values.M = M;
        iterations.push(values);
        console.log(values);
    }
    return iterations;
}

function submit() {
    let num1 = document.getElementById("num1").value;
    let num2 = document.getElementById("num2").value;
    let iterations = sequentialCircuitBinaryMultiply(num1, num2, false);
    console.log(iterations);
    let table = document.getElementById("answer");
    while (table.firstChild) table.removeChild(table.firstChild);

    let headerRow = document.createElement("tr");
    let header1 = document.createElement("th");
    header1.appendChild(document.createTextNode("A"));
    let header2 = document.createElement("th");
    header2.appendChild(document.createTextNode("Q"));
    let header3 = document.createElement("th");
    header3.appendChild(document.createTextNode("Q -1"));
    headerRow.appendChild(header1);
    headerRow.appendChild(header2);
    headerRow.appendChild(header3);
    table.appendChild(headerRow);

    for (const i of iterations) {
        let row = document.createElement("tr");
        let aData = document.createElement("td");
        let qData = document.createElement("td");
        let qSub1Data = document.createElement("td");
        aData.appendChild(document.createTextNode(i.A));
        qData.appendChild(document.createTextNode(i.Q));
        qSub1Data.appendChild(document.createTextNode(i.Qsub1));
        row.appendChild(aData);
        row.appendChild(qData);
        row.appendChild(qSub1Data);
        table.appendChild(row);
    }
}

/*
// Function for outputting result in a text file
function outputToText() {
    // FS module is required for it contains the definition of the writefile function
    const fs = require("fs");

    fs.writeFile('result.txt', result, (err) => {
        if (err) throw err;
    })
}*/
