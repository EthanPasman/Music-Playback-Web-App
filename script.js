var supportedExtensions = ["mp3", "wav", "ogg"];
var fileData = ["", "", "", "", "", 0, 0, [], 0, "", [], 0, 0, 0, 0, [], "", 0];
                //URL, Title, Artist, Album, Contributors, Year, BPM, Genre(s), Rating/10,
                //Comments, Tags, Uploaded time, Length (s), # Listens, # Full listens, 
                //Playlists added to, Like/dislike/neutral, Shuffle weight
var genres = [];
var tags = [];
var playlists = [["", 0]]; //[Playlist name, Time added to playlist]

function addMetadata() {
    var time = Date.now();
    var expandedForm = document.getElementById("expandedForm");
    var ratingscale = expandedForm.querySelector("#ratingscale");
    //Update fileData with input from metadataForm
    //fileData[0] = file url
    fileData[1] = document.getElementById("title").value;
    fileData[2] = document.getElementById("artist").value;
    fileData[3] = document.getElementById("album").value;
    fileData[4] = expandedForm.querySelector("#contrArtists").value;
    fileData[5] = expandedForm.querySelector("#year").value;
    fileData[6] = expandedForm.querySelector("#bpm").value;
    fileData[7] = genres;
    fileData[8] = ratingscale.querySelector("#rating").textContent; //TODO Fix this not updating
    fileData[9] = expandedForm.querySelector("#comments").value;
    fileData[10] = tags;
    fileData[11] = time;
    //fileData[12] = file length
    fileData[13] = expandedForm.querySelector("#listens").value;
    fileData[14] = expandedForm.querySelector("#fullListens").value;
    fileData[15] = playlists;
    fileData[16] = expandedForm.querySelector("#likeStatus").value;
    fileData[17] = expandedForm.querySelector("#shuffleWeight").value;

    console.log(fileData); //For testing purposes

    document.getElementById("displayFileData").innerHTML = fileData[2] + " - " + fileData[1]; //Artist - title
    clearForm();
    document.getElementById("metadataForm").style.display = "none";
}

function clearForm() {
    //Manual form clear, resets all inputs and their values, as well as changed labels from input
    document.getElementById("genreList").textContent = "";
    document.getElementById("tagList").textContent = "";
    document.getElementById("rating").textContent = "";
    document.getElementById("comments").value = "";
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
    var audio = document.getElementById("audio");
    var unsupportedFileType = document.getElementById("unsupportedFileType");
    var metadataForm = document.getElementById("metadataForm");
    var rating = document.getElementById("rating");


    //Default visibilty of elements on page load
    unsupportedFileType.style.display = "none";
    metadataForm.style.display = "none";
    document.getElementById("contract").style.display = "none";
    document.getElementById("expandedForm").style.display = "none";

    //Update radiobuttons upon selection
    var radioButtons = document.querySelectorAll('input[type="radio"]');
    var expandedForm = document.getElementById("expandedForm");
    radioButtons.forEach((radioButton) => {
        radioButton.addEventListener('change', () => {
            radioButtons.forEach((rb) => {
                if (rb !== radioButton) {
                    rb.checked = false;
                }
            });
            //Update rating label
            rating.textContent = radioButton.value;
            expandedForm.querySelector("#shuffleWeight").value = rating.textContent / 10;
        });
    });

    //Event listener for file upload
    function fileListener() {
        unsupportedFileType.style.display = "none";
        var selectedFile = fileInput.files[0];

        if (selectedFile) {
            var fileNameParts = selectedFile.name.split(".");
            var fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase();

            //Supported: mp3, wav, ogg
            if (supportedExtensions.includes(fileExtension)) {
                //Metadata title field default
                fileNameParts.pop();
                var defaultTitle = fileNameParts.join("");
                document.getElementById("title").value = defaultTitle;

                //Send audio to playback source
                var objURL = URL.createObjectURL(selectedFile);
                document.getElementById("audioPlayback").src = objURL;
                audio.load();

                //Add implicit metadata from file
                fileData[0] = objURL;
                fileData[12] = Math.round(audio.duration); //TODO Fix this duration NaN

                metadataForm.style.display = "initial";
            } else {
                unsupportedFileType.style.display = "initial";
            }
        }
    }
    fileInput.addEventListener("change", fileListener);
});