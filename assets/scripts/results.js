function clearDecimalForm() {
    $("#dec1").val("");
    $("#dec2").val("");
    $("#dec-all").prop("checked", true);
}

function clearBinaryForm() {
    $("#bin1").val("");
    $("#bin2").val("");
    $("#bin-all").prop("checked", true);
}

//Submit for Decimal Inputs
function submitDecimal() {
    let num1 = $("#dec1").val();
    let num2 = $("#dec2").val();
    if (checkDecimalInput()) {
        displayData(sequentialCircuitBinaryMultiply(num1, num2));
    }
}

//Submit for Binary Inputs
function submitBinary() {
    let num1 = $("#bin1").val();
    let num2 = $("#bin2").val();
    if (checkBinaryInput()) {
        displayData(sequentialCircuitBinaryMultiply(num1, num2, true));
    }
}

//Displays the result of the Sequential Circuit Binary Multiplier operation
function displayData(values) {
    let answer = $("#answer");

    answer.empty();

    answer.append(
        `
        <div id="initData" class="mt-3 border rounded shadow-sm p-3">
            <h5 class="mr-auto">Initialization</h5>
            ${createTable({
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
                    <button id="solution-iteration-${
                        i + 1
                    }-btn" class="btn btn-primary btn-sm" data-toggle="collapse" onclick=changeIcon("solution-iteration-${
                i + 1
            }-btn") data-target="#iteration-${
                i + 1
            }-solution"><i class="fa fa-chevron-down"></i></button>
                </div>
                <!-- Table for Iteration Final Answer-->
                ${createTable({
                    A: values[i].AShift,
                    Q: values[i].QShift,
                    "Q<sub>-1</sub>": values[i].Qsub1Shift,
                })}
                <div id="iteration-${i + 1}-solution" class="collapse p-3 mt-3">

                    <h5>Solution:</h5>
                    <p>Previous Values</p>
                    ${createTable({
                        "Previous A": values[i].APrev,
                        "Previous Q<sub>0</sub>": values[i].QPrev.slice(-1),
                        "Previous Q<sub>-1</sub>": values[i].Qsub1Prev,
                        M: values[0].M,
                        "-M": values[0].Mcomplement,
                    })}

                    <p>${values[i].operationAdd}</p>
                    <!-- Table for A+M / A-M / A-->
                    ${createTable({
                        A: values[i].AAdd,
                        Q: values[i].QPrev,
                        "Q<sub>-1</sub>": values[i].Qsub1Prev,
                    })}

                    <p>Shift Arithmetic Right A Q Q<sub>-1</sub></p>
                    <!-- Table for Arithmetic Shift Right -->
                    ${createTable({
                        A: values[i].AShift,
                        Q: values[i].QShift,
                        "Q<sub>-1</sub>": values[i].Qsub1Shift,
                    })}
                </div>
            </div>
            `
        );
    }

    answer.append(
        `
        <div class="text-right mt-3">
            <button id="save" class="btn btn-primary" onclick = resultToText("values")>
                Save
            </button>
        </div>
        `
    );

    if (
        $("#decimal-form.active #dec-step-by-step").prop("checked") ||
        $("#binary-form.active #bin-step-by-step").prop("checked")
    ) {
        hideAllSolution();
    }
}

function createTable(values) {
    let headers = "";
    let data = "";

    Object.keys(values).forEach(function (key) {
        headers += `<th class="align-middle text-center">${key}</th>\n`;
        data += `<td class="align-middle text-center text-primary">${values[key]}</td>\n`;
    });

    return `
    <table class="table table-borderless mt-3">
        <tr class="thead-light"> ${headers} </tr>
        <tr> ${data} </tr>
    </table>
    `;
}

function hideAllSolution() {
    // If step by step, hide all other steps
    $("#stepControls").remove();
    $("#answer").children("div").hide();
    $("#answer").children("#initData").show();
    $("#initData").append(`
        <div id="stepControls" class="text-right">
            <button class="btn btn-primary" id="next" onclick="nextStep()">Next</button>
        </div>
    `);
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

function changeIcon(btnID) {
    if ($(`#${btnID}>i`).hasClass("fa-chevron-down")) {
        $(`#${btnID}>i`)
            .removeClass("fa-chevron-down")
            .addClass("fa-chevron-up");
    } else if ($(`#${btnID}>i`).hasClass("fa-chevron-up")) {
        $(`#${btnID}>i`)
            .removeClass("fa-chevron-up")
            .addClass("fa-chevron-down");
    }
}

// Function for outputting result in a text file
function resultToText(values) {
    let result = ""; //Text to be saved into the text file

    result += "Initialization\n";
    result =
        result +
        "A = " +
        values[0].APrev +
        "\tQ = " +
        values[0].QConvertString +
        "\tQ-1 = " +
        values[0].Qsub1Prev +
        "\tM = " +
        values[0].MConvertString +
        "\t-M = " +
        values[0].Mcomplement +
        "\n\n";

    // Adding results produced from the sequentialCircuitBinaryMultiply function
    for (let i = 0; i < values.length; i++) {
        result = result + "Iteration " + (i + 1) + "\n";
        result = result + "A = " + values[i].AShift + "\t";
        result = result + "Q = " + values[i].QShift + "\t";
        result = result + "Q-1 = " + values[i].Qsub1Shift + "\n\n";
    }

    var blob = new Blob([result], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "result.txt"); // Function from FileSaver.js that allows the multiplier result to be saved in a text file
}
