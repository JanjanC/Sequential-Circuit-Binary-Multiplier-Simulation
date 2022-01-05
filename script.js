//Convert to unsigned binary 2's complement
//
function decToSignedBin(dec) {
    if (num >= 0) {
        return "0" + dec.toString(2);
    } else {
        return "1" + (~-dec + 1).toString(2);
    }
}

function addBin(bin1, bin2) {
    let dec1 = parseInt(2, bin1);
    let dec2 = parseInt(2, bin2);
    return decToSignedBin(dec1 + dec2);
}
//Pano irreturn bin1 or bin2 ippasok ba to as object para pass-by-reference or???
//Pad shorter to make it the same with higher
//num1 and num2 assumed to be passed as bin
function matchLengths(bin1, bin2) {
    let length1 = bin1.length();
    let length2 = bin2.length();
    let string1 = bin1.toString(2);
    let string2 = bin2.toString(2);
    let MSb1 = string1.charAt(0);
    let MSb2 = string2.charAt(0);
    //bin2 has smaller length than bin1
    if (length1 > length2) string2.padStart(length1, MSb2);
    //bin1 has smaller length than bin2
    else string1.padStart(length2, MSb1);
}

//Function for each iteration
function sequentialCircuitBinaryMultiply(dec1, dec2) {
    let A = ""; //Answer
    let Qsub1 = ""; //Quotient Sub 1 from Arithmetic Shift Right
    let M = decToSignedBin(dec1); //Multiplicand
    let Mcomplement = decToSignedBin(-dec1); //Multiplicand
    let Q = decToSignedBin(dec2); //Multiplier
    let length = M.length() > Q.length() ? M.length() : Q.length();

    const iterations = [];

    for (let i = 0; i < length; i++) {
        let values = {};

        if (Q % 10 == 0 && Qsub1 == 1) A = addBin(A, M);
        else if (Q % 10 == 1 && Qsub1 == 0) A = addBin(A, Mcomplement);

        // Qsub1 gets the value of Q0 (the least significant bit of Q)
        Qsub1 = Q.charAt(Q.length() - 1);
        // Q gets the least significant bit of A concatenated with Q minus the last character
        Q = A.charAt(A.length() - 1) + Q.slice(0, -1);
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
    let iterations = sequentialCircuitBinaryMultiply(num1, num2);
    console.log(iterations);
}
