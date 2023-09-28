var supportedExtensions = ["mp3", "wav", "ogg"];
var fileData = ["", "", "", ""]; //URL, Title, Artist, Album
var genres = [];
var tags = [];

function addMetadata() {
    fileData[1] = document.getElementById("title").value;
    fileData[2] = document.getElementById("artist").value;
    fileData[3] = document.getElementById("album").value;
    document.getElementById("displayFileData").innerHTML = fileData[2] + " - " + fileData[1];
    clearForm();
    document.getElementById("metadataForm").style.display = "none";
}

function clearForm() {
    document.getElementById("genreList").textContent = "";
    document.getElementById("tagList").textContent = "";
    document.getElementById("rating").textContent = "";
    genres = [];
    tags = [];
    var formElements = document.getElementById("metadataForm").getElementsByTagName("input");
    for (i = 0; i < formElements.length; i++) {
        var fieldType = formElements[i].type;
        switch (fieldType) {
            case "text":
            case "number":
                formElements[i].value = "";
                break;
            case "radio":
                formElements[i].checked = false;
                break;
        }
    }
    contractForm();
}

function extendForm() {
    extend.style.display = "none";
    contract.style.display = "initial";
    expandedForm.style.display = "initial";
}

function contractForm() {
    extend.style.display = "initial";
    contract.style.display = "none";
    expandedForm.style.display = "none";
}

function addGenre() {
    genres.push(" " + document.getElementById("genre").value);
    document.getElementById("genreList").textContent = genres.toString();
    document.getElementById("genre").value = "";
}

function addTag() {
    tags.push(" " + document.getElementById("tags").value);
    document.getElementById("tagList").textContent = tags.toString();
    document.getElementById("tags").value = "";
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
    var rating = document.getElementById("rating");

    unsupportedFileType.style.display = "none";
    metadataForm.style.display = "none";
    contract.style.display = "none";
    expandedForm.style.display = "none";

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
                metadataForm.style.display = "initial";
            } else {
                unsupportedFileType.style.display = "initial";
            }
        }
    }
    fileInput.addEventListener("change", fileListener);
});