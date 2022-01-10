//Validates inputs
function checkInputs(isBinary) {
    let pass = true;
    let num1 = $(isBinary ? "#bin1" : "#dec1").val();
    let num2 = $(isBinary ? "#bin2" : "#dec2").val();

    // Check if num1 is a number, not an empty string, or only 0s and 1s for binary
    if (
        isNaN(num1) ||
        num1 == "" ||
        (isBinary && new RegExp(/[0-1]+/).test(num1))
    ) {
        $(isBinary ? "#bin1_error" : "#dec1_error").text(
            "Invalid input. Please try again."
        );
        pass = false;
    }
    // Check if num1 is within range -32768 to 32767 for decimal, 0-16 length for binary
    else if (
        (!isBinary && (num1 > 32767 || num1 < -32768)) ||
        (isBinary && ((num1 + "").length > 16 || (num1 + "").length < 0))
    ) {
        $(isBinary ? "#bin1_error" : "#dec1_error").text(
            "Out of range for 16 bits"
        );
        pass = false;
    }
    // Clear num1 error messages
    else $(isBinary ? "#bin1_error" : "#dec1_error").text("");

    // Check if the num2 is a number, not an empty string, or only 0s and 1s for binary
    if (
        isNaN(num2) ||
        num2 == "" ||
        (isBinary && new RegExp(/[0-1]+/).test(num2))
    ) {
        $(isBinary ? "#bin2_error" : "#dec2_error").text(
            "Invalid input. Please try again."
        );
        pass = false;
    }
    // Check if num2 is within range -32768 to 32767 for decimal, 0-16 length for binary
    else if (
        (!isBinary && (num2 > 32767 || num2 < -32768)) ||
        (isBinary && ((num2 + "").length > 16 || (num2 + "").length < 0))
    ) {
        $(isBinary ? "#bin2_error" : "#dec2_error").text(
            "Out of range for 16 bits"
        );
        pass = false;
    }
    // Clear num2 error messages
    else $(isBinary ? "#bin2_error" : "#dec2_error").text("");

    return pass;
}
