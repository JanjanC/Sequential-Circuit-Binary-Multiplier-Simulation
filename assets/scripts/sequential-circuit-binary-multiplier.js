//Convert to unsigned binary 2's complement
function get2sComplement(bin) {
    let complement = "";
    for (let i = 0; i < bin.lastIndexOf("1"); i++)
        complement += bin[i] === "0" ? "1" : "0";
    return complement + bin.slice(bin.lastIndexOf("1"));
}
//Convert decimal to signed binary
function decToSignedBin(dec) {
    dec = parseInt(dec);
    if (dec >= 0) {
        return "0" + dec.toString(2);
    } else {
        let temp = (-dec).toString(2);

        //special case 10...0
        if (temp.lastIndexOf("1") == 0) {
            return temp;
        }

        temp = "0" + temp;
        return get2sComplement(temp);
    }
}

//Add binary inputs
function addBin(bin1, bin2) {
    let carryOver = 0;
    let answer = "";
    // Get shortest length to avoid errors when lengths do not match
    let length = bin1.length < bin2.length ? bin1.length : bin2.length;
    for (let ctr = length - 1; ctr >= 0; ctr--) {
        carryOver =
            carryOver + parseInt(bin1.charAt(ctr)) + parseInt(bin2.charAt(ctr));
        answer = (carryOver % 2) + answer;
        carryOver = parseInt(carryOver / 2);
    }
    return answer;
}

//Multiply num1 and num2 and return the steps
function sequentialCircuitBinaryMultiply(num1, num2, isBinary = false) {
    let A = ""; //Answer
    let Qsub1 = "0"; //Quotient Sub 1 from Arithmetic Shift Right
    let M = isBinary ? num1 : decToSignedBin(num1); //Multiplicand
    let Mcomplement = get2sComplement(M); //Multiplicand complement
    let Q = isBinary ? num2 : decToSignedBin(num2); //Multiplier
    // Get the longest length
    let length = M.length > Q.length ? M.length : Q.length;

    // Make sure they are all the same length
    M = M.padStart(length, M.charAt(0));
    Q = Q.padStart(length, Q.charAt(0));
    A = A.padStart(length, "0");
    Mcomplement = Mcomplement.padStart(length, Mcomplement.charAt(0));

    // Will contain the steps
    const iterations = [];

    for (let i = 0; i < length; i++) {
        let values = {};
        if (i == 0) {
            const rightArrow = String.fromCodePoint(0x2192); //Right arrow unicode: U+0x2192
            values = {
                M: M,
                Mcomplement: Mcomplement,
                MConvertString: isBinary ? M : num1 + ` ${rightArrow} ` + M,
                QConvertString: isBinary ? Q : num2 + ` ${rightArrow} ` + Q,
            };
        }

        // Store values from the previous iteration
        values.APrev = A;
        values.QPrev = Q;
        values.Qsub1Prev = Qsub1;

        // Add M if Q_0Q_-1 is 01 or Subtract M if Q_0Q_-1 is 10
        if (Q.slice(-1) == "0" && Qsub1 == "1") {
            A = addBin(A, M);
        } else if (Q.slice(-1) == "1" && Qsub1 == "0") {
            A = addBin(A, Mcomplement);
        }

        // Store value of A after adding from the current iteration
        values.AAdd = A;

        //Shift Arithmetic Right
        // Qsub1 gets the value of Q0 (the least significant bit of Q)
        Qsub1 = Q.slice(-1);
        // Q gets the least significant bit of A concatenated with Q minus the last characters
        Q = A.slice(-1) + Q.slice(0, -1);
        // A gets the most significant value of A concatenated with A minus the last character
        A = A.charAt(0) + A.slice(0, -1);

        // Store values after shifting from the current iteration
        values.AShift = A;
        values.QShift = Q;
        values.Qsub1Shift = Qsub1;

        //Store solution message from the current iteration
        const leftArrow = String.fromCodePoint(0x2190); //Left arrow unicode: U+0x2190
        // "A <- A + M"
        if (values.QPrev.slice(-1) == "0" && values.Qsub1Prev == "1") {
            values.operationAdd = `Q<sub>0</sub> = 0 and Q<sub>-1</sub> = 1; thus, A is added with M<br>`;
            values.operationAdd += `A ${leftArrow} A + M<br>`;
            values.operationAdd += `A ${leftArrow} ${values.APrev} + ${M}<br>`;
            values.operationAdd += `A ${leftArrow} ${values.AAdd}`;
        }

        // "A <- A - M"
        else if (values.QPrev.slice(-1) == "1" && values.Qsub1Prev == "0") {
            values.operationAdd = `Q<sub>0</sub> = 1 and Q<sub>-1</sub> = 0; thus, A is subtracted with M<br>`;
            values.operationAdd += `A ${leftArrow} A - M<br>`;
            values.operationAdd += `A ${leftArrow} A + (-M)<br>`;
            values.operationAdd += `A ${leftArrow} ${values.APrev} + ${Mcomplement}<br>`;
            values.operationAdd += `A ${leftArrow} ${values.AAdd}`;
        }

        // "A <- A"
        else {
            values.operationAdd = `Q<sub>0</sub> = Q<sub>-1</sub>; thus, A retains its value<br>`;
            values.operationAdd += `A ${leftArrow} A<br>`;
            values.operationAdd += `A ${leftArrow} ${values.AAdd}`;
        }

        iterations.push(values);
    }

    return iterations;
}
