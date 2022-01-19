function checkBinaryInput() {
    let isValid = true;
    let num1 = $("#bin1").val();
    let num2 = $("#bin2").val();

    // Check if num1 is a number, not an empty string, or only 0s and 1s for binary
    if (isNaN(num1) || num1 == "" || !new RegExp(/[0-1]+/).test(num1)) {
        $("#bin1_error").text("Invalid input. Please try again.");
        isValid = false;
    }
    // Check if num1 is within range 0-16 length for binary
    else if ((num1 + "").length > 16 || (num1 + "").length < 2) {
        $("#bin1_error").text(
            "Out of range for signed 16 bit integer (must be 2-16 digits)"
        );
        isValid = false;
    }
    // Clear num1 error messages
    else {
        $("#bin1_error").text("");
    }

    // Check if the num2 is a number, not an empty string, or only 0s and 1s for binary
    if (isNaN(num2) || num2 == "" || !new RegExp(/[0-1]+/).test(num2)) {
        $("#bin2_error").text("Invalid input. Please try again.");
        isValid = false;
    }
    // Check if num2 is within range -32768 to 32767 for decimal, 0-16 length for binary
    else if ((num2 + "").length > 16 || (num2 + "").length < 2) {
        $("#bin2_error").text(
            "Out of range for signed 16 bit integer (must be 2-16 digits)"
        );
        isValid = false;
    }
    // Clear num2 error messages
    else {
        $("#bin2_error").text("");
    }

    return isValid;
}

function checkDecimalInput() {
    let isValid = true;
    let num1 = $("#dec1").val();
    let num2 = $("#dec2").val();

    // Check if num1 is a number, not an empty string, or only 0s and 1s for binary
    if (isNaN(num1) || num1 == "") {
        $("#dec1_error").text("Invalid input. Please try again.");
        isValid = false;
    }
    // Check if num1 is within range -32768 to 32767 for decimal
    else if (num1 < -32768 || num1 > 32767) {
        $("#dec1_error").text("Out of range for 16 bits");
        isValid = false;
    }
    // Clear num1 error messages
    else {
        $("#dec1_error").text("");
    }

    // Check if the num2 is a number, not an empty string
    if (isNaN(num2) || num2 == "") {
        $("#dec2_error").text("Invalid input. Please try again.");
        isValid = false;
    }
    // Check if num2 is within range -32768 to 32767 for decimal
    else if (num2 < -32768 || num2 > 32767) {
        $("#dec2_error").text("Out of range for 16 bits");
        isValid = false;
    }
    // Clear num2 error messages
    else {
        $("#dec2_error").text("");
    }

    return isValid;
}
