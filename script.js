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
//Convert decimal to signed binary
function decToSignedBin(dec) {
    dec = parseInt(dec);
    if (dec >= 0) {
        return "0" + dec.toString(2);
    } else {
        let temp = "0" + (-dec).toString(2);
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
    console.log("ADD BINARY RESULT: " + answer);
    return answer;
}
//Multiply num1 and num2 and return the steps
function sequentialCircuitBinaryMultiply(num1, num2, isBinary = false) {
    let A = ""; //Answer
    let Qsub1 = "0"; //Quotient Sub 1 from Arithmetic Shift Right
    let M = isBinary ? num1 : decToSignedBin(num1); //Multiplicand
    let Mcomplement = isBinary ? get2sComplement(num1) : decToSignedBin(-num1); //Multiplicand
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

        // Add M if Q_0Q_-1 is 01 or Subtract M if Q_0Q_-1 is 10
        if (Q.charAt(Q.length - 1) == "0" && Qsub1 == "1") A = addBin(A, M);
        else if (Q.charAt(Q.length - 1) == "1" && Qsub1 == "0")
            A = addBin(A, Mcomplement);

        values.Amid = A;
        values.Qmid = Q;
        values.Qsub1mid = Qsub1;

        //Shift Arithmetic Right
        // Qsub1 gets the value of Q0 (the least significant bit of Q)
        Qsub1 = Q.charAt(Q.length - 1);
        // Q gets the least significant bit of A concatenated with Q minus the last character
        Q = A.charAt(A.length - 1) + Q.slice(0, -1);
        // A gets the most significant value of A concatenated with A minus the last character
        A = A.charAt(0) + A.slice(0, -1);

        // Store values from the current iteration
        values.A = A;
        values.Q = Q;
        values.Qsub1 = Qsub1;

        //Store solution message from the current iteration
        const arrow = String.fromCodePoint(0x2190); //Arrow Unicode: U+0x2190
        const subneg = String.fromCodePoint(0x208b); //Subscript - Unicode: U+0x208B
        const subone = String.fromCodePoint(0x2081); //Subscript 1 Unicode: U+0x2081

        values.operation = [];
        // "A <- A + M (values)"
        if (Q.charAt(Q.length - 1) == "0" && Qsub1 == "1") {
            values.operation[0] = `A ${arrow} A + M<br>`;
            values.operation[0] += `A ${arrow} ${A} + ${M}`;
        }

        // "A <- A - M (values)"
        else if (Q.charAt(Q.length - 1) == "1" && Qsub1 == "0") {
            values.operation[0] = `A ${arrow} A - M<br>`;
            values.operation[0] += `A ${arrow} ${A} + ${Mcomplement}`;
        }

        // "A <- A"
        else {
            values.operation[0] = `A ${arrow} A`;
        }

        //Shift Arithmetic Right AQQ_-1
        values.operation[1] = `Shift Arithmetic Right A Q Q${subneg}${subone}`;
        iterations.push(values);
    }
    return iterations;
}
//Submit for Decimal Inputs
function submitDecimal() {
    let num1 = $("#dec1").val();
    let num2 = $("#dec2").val();
    if (checkInputs(false))
        displayData(sequentialCircuitBinaryMultiply(num1, num2));
}
//Submit for Binary Inputs
function submitBinary() {
    let num1 = $("#bin1").val();
    let num2 = $("#bin2").val();
    if (checkInputs(true))
        displayData(sequentialCircuitBinaryMultiply(num1, num2, true));
}

//Displays the result of the Sequential Circuit Binary Multiplier operation
function displayData(values = null) {
    let answer = $("#answer");

    answer.empty();

    for (let i = 0; i < values.length; i++) {
        answer.append(
            `
            <div id="iteration-${
                i + 1
            }" class="mt-3 border rounded shadow-sm p-3">
                <div class="d-flex align-items-center">
                    <p class="mr-auto">Iteration #${i + 1}</p>
                    <button class="btn btn-primary btn-sm" data-toggle="collapse" data-target="#iteration-${
                        i + 1
                    }-solution"><i class="fa fa-plus"></i></button>
                </div>
                <table class="table table-borderless mt-3">
                    <tr class="thead-light">
                        <th class="align-middle text-center">A</th>
                        <th class="align-middle text-center">Q</th>
                        <th class="align-middle text-center">Q<sub>-1</sub></th>
                    </tr>
                    <tr>
                        <td class="align-middle text-center">${values[i].A}</td>
                        <td class="align-middle text-center">${values[i].Q}</td>
                        <td class="align-middle text-center">${
                            values[i].Qsub1
                        }</td>
                    </tr>
                </table>
                <div id="iteration-${i + 1}-solution" class="collapse">
                    <p>Solution:</p>
                    <p>${values[i].operation[0]}</p>
                    <!-- Table for A+M / A-M / A-->

                    <table class="table table-borderless mt-3">
                        <tr class="thead-light">
                            <th class="align-middle text-center">A</th>
                            <th class="align-middle text-center">Q</th>
                            <th class="align-middle text-center">Q<sub>-1</sub></th>
                        </tr>
                        <tr>
                            <td class="align-middle text-center">${
                                values[i].Amid
                            }</td>
                            <td class="align-middle text-center">${
                                values[i].Qmid
                            }</td>
                            <td class="align-middle text-center">${
                                values[i].Qsub1mid
                            }</td>
                        </tr>
                    </table>

                    <p>${values[i].operation[1]}</p>
                    <!-- Table for Arithmetic Shift Right -->
                    <table class="table table-borderless mt-3">
                        <tr class="thead-light">
                            <th class="align-middle text-center">A</th>
                            <th class="align-middle text-center">Q</th>
                            <th class="align-middle text-center">Q<sub>-1</sub></th>
                        </tr>
                        <tr>
                            <td class="align-middle text-center">${
                                values[i].A
                            }</td>
                            <td class="align-middle text-center">${
                                values[i].Q
                            }</td>
                            <td class="align-middle text-center">${
                                values[i].Qsub1
                            }</td>
                        </tr>
                    </table>
                </div>
            </div>
            `
        );
    }
    if (
        $("#decimal-form.active #dec-step-by-step").prop("checked") ||
        $("#binary-form.active #bin-step-by-step").prop("checked")
    ) {
        for (let i = 1; i < values.length; i++) $(`#iteration-${i + 1}`).hide();
        $("#iteration-1").append(
            `
            <div class="text-right">
                <button class="btn btn-primary" id="next" onclick="next()">Next</button>
            </div>
            `
        );
        $("#answer").children("div:last").find("#next").remove();
    }
}

function next() {
    $("#next").remove();
    $("#answer")
        .children("div:hidden:first")
        .append(
            `
        <div class="text-right">
            <button class="btn btn-primary" id="next" onclick="next()">Next</button>
        </div>
        `
        );
    $("#answer").children("div:hidden:first").show();
    $("#answer").children("div:last").find("#next").remove();
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
