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

    const leftArrow = String.fromCodePoint(0x2190); //Left arrow unicode: U+0x2190
    answer.append(
        `
        <div id="initialization" class="mt-3 border rounded shadow-sm p-3">
            <div class="d-flex align-items-center">
                <h5 class="mr-auto">Initialization</h5>
                <button 
                    id="solution-initialization-btn" 
                    class="btn btn-primary btn-sm" data-toggle="collapse" 
                    onclick=changeIcon("solution-initialization-btn") 
                    data-target="#initialization-solution"
                >
                    <i class="fa fa-chevron-right"></i>
                </button>
            </div>
            <!-- Table for Initialization-->
            ${createTable({
                M: values[0].MConvertString,
                "-M": values[0].Mcomplement,
            })}
            ${createTable({
                A: values[0].APrev,
                Q: values[0].QConvertString,
                "Q<sub>-1</sub>": values[0].Qsub1Prev,
            })}
            <div id="initialization-solution" class="collapse p-3 mt-3">
                    <h5>Solution:</h5>
                    <p>Initialize</p>
                    <p>M ${leftArrow} Multiplicand</p>
                    <p>-M ${leftArrow} Two's Complement of the  Multiplicand</p>
                    ${createTable({
                        M: values[0].MConvertString,
                        "-M": values[0].Mcomplement,
                    })}
                    
                    <p>Initialize</p>
                    <p>A ${leftArrow} 0</p>
                    <p>Q ${leftArrow} Multiplier </p>
                    <p>Q<sub>-1</sub> ${leftArrow} 0</p>
                    ${createTable({
                        A: values[0].APrev,
                        Q: values[0].QConvertString,
                        "Q<sub>-1</sub>": values[0].Qsub1Prev,
                    })}
                    
        </div>
        `
    );

    for (let i = 0; i < values.length; i++) {
        answer.append(
            `
            <div 
                id="iteration-${i + 1}" 
                class="mt-3 border rounded shadow-sm p-3"
            >
                <div class="d-flex align-items-center">
                    <h5 class="mr-auto">Iteration #${i + 1}</h5>
                    <button 
                        id="solution-iteration-${i + 1}-btn" 
                        class="btn btn-primary btn-sm" data-toggle="collapse" 
                        onclick=changeIcon("solution-iteration-${i + 1}-btn") 
                        data-target="#iteration-${i + 1}-solution"
                    >
                        <i class="fa fa-chevron-right"></i>
                    </button>
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
                        M: values[0].M,
                        "-M": values[0].Mcomplement,
                    })}
                    ${createTable({
                        "Previous A": values[i].APrev,
                        "Previous Q<sub>0</sub>": values[i].QPrev.slice(-1),
                        "Previous Q<sub>-1</sub>": values[i].Qsub1Prev,
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
        <div id="result" class="mt-3 border rounded shadow-sm p-3">
            <div class="d-flex align-items-center">
                <h5 class="mr-auto">Result</h5>
                <button 
                    id="solution-final-btn" 
                    class="btn btn-primary btn-sm" data-toggle="collapse" 
                    onclick=changeIcon("solution-result-btn") 
                    data-target="#result-solution"
                >
                    <i class="fa fa-chevron-right"></i>
                </button>
            </div>
            <!-- Table for Result-->
            ${createTable({
                AQ: `${values[values.length - 1].AShift}${
                    values[values.length - 1].QShift
                }`,
            })}
            <div id="result-solution" class="collapse p-3 mt-3">
                    <h5>Solution:</h5>
                    <p>Combine Register A and Q</p>
                    ${createTable({
                        A: values[values.length - 1].AShift,
                        Q: values[values.length - 1].QShift,
                    })}
                    
        </div>
        `
    );

    // Creates a save button after the result is completely displayed
    answer.append(
        `
        <div class="text-right mt-3">
            <button id="save" class="btn btn-primary">
                Save
            </button>
        </div>
        `
    );

    let save = document // Assigns an eventListener to the save button
        .getElementById("save")
        .addEventListener("click", function () {
            let result = ""; // Text to be saved into the text file

            result += `Initialization\n`;
            result += `M = ${values[0].MConvertString},     -M = ${values[0].Mcomplement}\n`;
            result += `A = ${values[0].APrev},     Q = ${values[0].QConvertString},     Q_-1 = ${values[0].Qsub1Prev}\n\n`;

            // Adding produced values from the sequentialCircuitBinaryMultiply function to result
            for (let i = 0; i < values.length; i++) {
                result += `Iteration #${i + 1}\n`;
                result += `A = ${values[i].AShift},     Q = ${values[i].QShift},     Q_-1 = ${values[i].Qsub1Shift}\n\n`;
            }

            result += `AQ\n${values[values.length - 1].AShift}${
                values[values.length - 1].QShift
            }`;

            var blob = new Blob([result], { type: "text/plain;charset=utf-8" }); // Blob that will be used for saving result in a text file
            saveAs(blob, "result.txt"); // Function from FileSaver.js that allows the multiplier result to be saved in a text file
        });

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
    $("#answer").children("#initialization").show();
    $("#answer").children("div:last").show(); // Unhides the save button
    $("#initialization").append(`
        <div id="stepControls" class="text-right">
            <button class="btn btn-primary" id="next" onclick="nextStep()">Next</button>
        </div>
    `);
}

//Dynamically handles the showing of the next iteration
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
    $("#answer").children("div.rounded:last").find("#stepControls").remove();
    // console.log($("#answer").children("div:hidden"));
    // if ($("#answer").children("div:hidden") == null) {
    //     $("#stepControls").remove();
    // }
}

//Dynamically changes the dropdown icon for hide/show solution button
function changeIcon(btnID) {
    if ($(`#${btnID}>i`).hasClass("fa-chevron-right")) {
        $(`#${btnID}>i`)
            .removeClass("fa-chevron-right")
            .addClass("fa-chevron-down");
    } else if ($(`#${btnID}>i`).hasClass("fa-chevron-down")) {
        $(`#${btnID}>i`)
            .removeClass("fa-chevron-down")
            .addClass("fa-chevron-right");
    }
}
