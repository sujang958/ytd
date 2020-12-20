$(".submit").on("click", () => {
    var inputVal = $('input#url').val() + ""
    if (inputVal != "" && inputVal.replace(/^\s+|\s+$/g, "") != "") {
        location.href = `/process?url=${$('input#url').val()}`;
    } else {
        $("#error").modal({
            escapeClose: true,
            clickClose: true,
            showClose: true
        });
    }
})

$(document).on('keydown', e => {
    if (e.key == "Enter") {
        var inputVal = $('input#url').val() + ""
        if (inputVal != "" && inputVal.replace(/^\s+|\s+$/g, "") != "") {
            location.href = `/process?url=${$('input#url').val()}`;
        } else {
            $("#error").modal({
                escapeClose: true,
                clickClose: true,
                showClose: true
            });
        }
    }
})