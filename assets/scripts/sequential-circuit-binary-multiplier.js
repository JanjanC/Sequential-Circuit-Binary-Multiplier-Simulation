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
    let Mcomplement = isBinary ? get2sComplement(num1) : decToSignedBin(-num1); //Multiplicand complement
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
            values.operationAdd = `Q<sub>0</sub> = 0 and Q<sub>-1</sub> = 1 thus A is added with M<br>`;
            values.operationAdd += `A ${leftArrow} A + M<br>`;
            values.operationAdd += `A ${leftArrow} ${values.APrev} + ${M}<br>`;
            values.operationAdd += `A ${leftArrow} ${values.AAdd}`;
        }

        // "A <- A - M"
        else if (values.QPrev.slice(-1) == "1" && values.Qsub1Prev == "0") {
            values.operationAdd = `Q<sub>0</sub> = 1 and Q<sub>-1</sub> = 0 thus A is subtracted with M<br>`;
            values.operationAdd += `A ${leftArrow} A - M<br>`;
            values.operationAdd += `A ${leftArrow} A + (-M)<br>`;
            values.operationAdd += `A ${leftArrow} ${values.APrev} + ${Mcomplement}<br>`;
            values.operationAdd += `A ${leftArrow} ${values.AAdd}`;
        }

        // "A <- A"
        else {
            values.operationAdd = `Q<sub>0</sub> = Q<sub>-1</sub> thus A retains its value<br>`;
            values.operationAdd += `A ${leftArrow} A<br>`;
            values.operationAdd += `A ${leftArrow} ${values.AAdd}`;
        }

        iterations.push(values);
    }
    const rightArrow = String.fromCodePoint(0x2192); //Right arrow unicode: U+0x2192
    iterations[0].M = M;
    iterations[0].Mcomplement = Mcomplement;
    iterations[0].MConvertString = isBinary ? M : num1 + ` ${rightArrow} ` + M;
    iterations[0].QConvertString = isBinary ? Q : num2 + ` ${rightArrow} ` + Q;
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
function displayData(values) {
    let answer = $("#answer");

    answer.empty();

    answer.append(
        `
        <div id="initData" class="mt-3 border rounded shadow-sm p-3">
            <h5 class="mr-auto">Initialization</h5>
            ${makeTable({
                A: values[0].APrev,
                Q: values[0].QConvertString,
                "Q<sub>-1</sub>": values[0].Qsub1Prev,
                M: values[0].MConvertString,
                "-M": values[0].Mcomplement,
            })}
        </div>
        `
    );

    for (let i = 0; i < values.length; i++) {
        answer.append(
            `
            <div id="iteration-${
                i + 1
            }" class="mt-3 border rounded shadow-sm p-3">
                <div class="d-flex align-items-center">
                    <h5 class="mr-auto">Iteration #${i + 1}</h5>
                    <button class="btn btn-primary btn-sm" data-toggle="collapse" data-target="#iteration-${
                        i + 1
                    }-solution"><i class="fa fa-plus"></i></button>
                </div>
                <!-- Table for Iteration Final Answer-->
                ${makeTable({
                    A: values[i].AShift,
                    Q: values[i].QShift,
                    "Q<sub>-1</sub>": values[i].Qsub1Shift,
                })}
                <div id="iteration-${i + 1}-solution" class="collapse p-3 mt-3">
                    <h5>Solution:</h5>
                    <p>Previous Values</p>
                    ${makeTable({
                        "Previous A": values[i].APrev,
                        "Previous Q<sub>0</sub>": values[i].QPrev.slice(-1),
                        "Previous Q<sub>-1</sub>": values[i].Qsub1Prev,
                        M: values[0].M,
                        "-M": values[0].Mcomplement,
                    })}
                    <p>${values[i].operationAdd}</p>
                    <!-- Table for A+M / A-M / A-->
                    ${makeTable({
                        A: values[i].AAdd,
                        Q: values[i].QPrev,
                        "Q<sub>-1</sub>": values[i].Qsub1Prev,
                    })}

                    <p>Shift Arithmetic Right A Q Q<sub>-1</sub></p>
                    <!-- Table for Arithmetic Shift Right -->
                    ${makeTable({
                        A: values[i].AShift,
                        Q: values[i].QShift,
                        "Q<sub>-1</sub>": values[i].Qsub1Shift,
                    })}
                </div>
            </div>
            `
        );
    }
    // If step by step, hide all other steps
    if (
        $("#decimal-form.active #dec-step-by-step").prop("checked") ||
        $("#binary-form.active #bin-step-by-step").prop("checked")
    ) {
        $("#stepControls").remove();
        $("#answer").children("div").hide();
        $("#answer").children("#initData").show();
        $("#answer").children("#iteration-1").show();
        $("#iteration-1").append(
            `
            <div id="stepControls" class="text-right">
                <button class="btn btn-primary" id="next" onclick="nextStep()">Next</button>
            </div>
            `
        );
    }
}

function makeTable(values) {
    let headers = "";
    let row1 = "";
    Object.keys(values).forEach(function (key) {
        headers += `<th class="align-middle text-center">${key}</th>\n`;
        row1 += `<td class="align-middle text-center text-success">${values[key]}</td>\n`;
    });

    return `
    <table class="table table-borderless mt-3">
        <tr class="thead-light"> ${headers} </tr>
        <tr> ${row1} </tr>
    </table>
    `;
}

function nextStep() {
    $("#stepControls").remove();
    $("#answer")
        .children("div:hidden:first")
        .append(
            `
            <div id="stepControls" class="text-right">
                <button class="btn btn-primary" id="next" onclick="nextStep()">Next</button>
            </div>
            `
        );
    $("#answer").children("div:hidden:first").show();
    $("#answer").children("div:last").find("#stepControls").remove();
}

/*
// Function for outputting result in a text file
function outputToText(values) {
    // FS module is required for it contains the definition of the writefile function
    const fs = require("fs");

    let result = ""; //Text to be saved into the text file

    // For writing and debugging the text saved in the text file
    fs.appendFile('result.txt', result, (err) => {
        if (err)
            console.log(err);
        else {
            console.log("result.txt written successfully\n");
            console.log("result.txt has the following contents:\n");
            console.log(fs.readFileSync("result.txt", "utf8");
        }
    })
}*/
/*
function () {
    
}
*/
