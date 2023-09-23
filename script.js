var supportedExtensions = ["mp3", "wav", "ogg"];
var fileData = ["", "", "", ""]; //URL, Title, Artist, Album

function addMetadata() {
    fileData[1] = document.getElementById("title").value;
    fileData[2] = document.getElementById("artist").value;
    fileData[3] = document.getElementById("album").value;
    document.getElementById("displayFileData").innerHTML = fileData[2] + " - " + fileData[1];
    document.getElementById("metadataForm").style.display = "none";
}

function extendForm() {
    extend.style.display = "none";
    contract.style.display = "inherit";
    expandedForm.style.display = "inherit";
}

function contractForm() {
    extend.style.display = "inherit";
    contract.style.display = "none";
    expandedForm.style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
    var fileInput = document.getElementById("fileInput");
    var audioPlayback = document.getElementById("audioPlayback");
    var audio = document.getElementById("audio");
    var unsupportedFileType = document.getElementById("unsupportedFileType");
    var metadataForm = document.getElementById("metadataForm");
    var extend = document.getElementById("extend");
    var contract = document.getElementById("contract");
    var expandedForm = document.getElementById("expandedForm");
    var formReset = document.getElementById("formReset");
    var rating = document.getElementById("rating");

    unsupportedFileType.style.display = "none";
    metadataForm.style.display = "none";
    contract.style.display = "none";
    expandedForm.style.display = "none";

    formReset.addEventListener("click", function () {
        rating.textContent = "";
    });

    var radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach((radioButton) => {
        radioButton.addEventListener('change', () => {
            radioButtons.forEach((rb) => {
                if (rb !== radioButton) {
                    rb.checked = false;
                }
            });
            rating.textContent = radioButton.value;
        });
    });

    function fileListener() {
        unsupportedFileType.style.display = "none";
        var selectedFile = fileInput.files[0];
        if (selectedFile) {
            var fileNameParts = selectedFile.name.split(".");
            var fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase();
            if (supportedExtensions.includes(fileExtension)) {
                var objURL = URL.createObjectURL(selectedFile);
                audioPlayback.src = objURL;
                audio.load();
                fileData[0] = objURL;
                metadataForm.style.display = "inherit";
            } else {
                unsupportedFileType.style.display = "inherit";
            }
        }
    }
    fileInput.addEventListener("change", fileListener);
});