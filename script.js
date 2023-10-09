var supportedExtensions = ["mp3", "wav", "ogg"];
var fileData = ["", "", "", "", "", NaN, NaN, [], 0, "", [], 0, 0, 0, 0, [], "", 0];
                //URL, Title, Artist, Album, Contributors, Year, BPM, Genre(s), Rating/10,
                //Comments, Tags, Uploaded time, Length (s), # Listens, # Full listens, 
                //Playlists added to, Like/dislike/neutral, Shuffle weight
var genres = [];
var tags = [];
var playlists = []; //[Playlist name, Time added to playlist]
var listeningQueue = [];
var playHistory = [];
var flFlag = true;
var seekTime = 0;

function addMetadata() {
    var time = Date.now();
    var expandedForm = document.getElementById("expandedForm");

    inputValidation();

    //Update fileData with input from metadataForm
    //fileData[0] = file url got on file upload
    fileData[1] = document.getElementById("title").value;
    fileData[2] = document.getElementById("artist").value;
    fileData[3] = document.getElementById("album").value;
    fileData[4] = expandedForm.querySelector("#contrArtists").value;
    fileData[5] = Number(expandedForm.querySelector("#year").value);
    fileData[6] = Number(expandedForm.querySelector("#bpm").value);
    fileData[7] = genres;
    fileData[8] = expandedForm.querySelector("#rating").textContent;
    fileData[9] = expandedForm.querySelector("#comments").value;
    fileData[10] = tags;
    fileData[11] = time;
    //fileData[12] = file length got on audio load
    fileData[13] = expandedForm.querySelector("#listens").value;
    fileData[14] = expandedForm.querySelector("#fullListens").value;
    fileData[15] = [["Play History", time], ["Listening Queue", time]];
    fileData[16] = expandedForm.querySelector("#likeStatus").value;
    fileData[17] = expandedForm.querySelector("#shuffleWeight").value;

    console.log(fileData); //For testing purposes

    listeningQueue.push(fileData);
    //Send audio to playback source
    //if (document.getElementById("audioPlayback").src.endsWith("Assets/tempBlankAudio.mp3")) {
        document.getElementById("audioPlayback").src = fileData[0];
        audio.load();
        flFlag = true;
        
        if (fileData[2].length > 0) {
            document.getElementById("displayFileData").innerHTML = fileData[2] + " - " + fileData[1]; //Artist - title
        } else {
            document.getElementById("displayFileData").innerHTML = fileData[1]; //Title
        }
        playHistory.push(fileData);
    //}
    clearForm();
    document.getElementById("metadataForm").style.display = "none";
}

function inputValidation() {
    //Validate number fields
    var expandedForm = document.getElementById("expandedForm");
    var year = expandedForm.querySelector("#year").value;
    var bpm = expandedForm.querySelector("#bpm").value;

    if (year == "" || year % 1 != 0 || year < 0) {
        expandedForm.querySelector("#year").value = NaN;
    }
    if (bpm == "" || bpm < 0) {
        expandedForm.querySelector("#bpm").value = NaN;
    }
}

function clearForm() {
    //Manual form clear, resets all inputs and their values, as well as changed labels from input
    var expandedForm = document.getElementById("expandedForm");
    expandedForm.querySelector("#shuffleWeight").value = 0.6; //Default shuffle weight
    document.getElementById("rating").textContent = "";
    document.getElementById("comments").value = "";
    //Clear lists of genres and tags
    document.getElementById("genreList").replaceChildren();
    document.getElementById("tagList").replaceChildren();
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
    var genre = document.getElementById("genre").value.trim();
    var glDiv = document.getElementById("genreList");

    if (genre.length == 0 || genres.includes(genre)) {
        document.getElementById("genre").value = "";
        return;
    }
    genres.push(genre);

    var newGenre = document.createElement("input");
    newGenre.type = "button";
    newGenre.id = genre + "glBtn";
    newGenre.onclick = function () { removeGenre(genre); };
    //Shorten string for button if necessary
    if (genre.length > 15) {
        genre = genre.slice(0, 15) + "...";
    }
    newGenre.value = genre + " ✖";
    glDiv.appendChild(newGenre);
    //Scroll genre list if necessary
    glDiv.scrollTop = glDiv.scrollHeight;

    document.getElementById("genre").value = "";
}

function removeGenre(genre) {
    var glDiv = document.getElementById("genreList");
    glDiv.removeChild(document.getElementById(genre + "glBtn"));
    glDiv.scrollTop = glDiv.scrollHeight;
    //Remove genre from array
    genres = genres.filter(g => g != genre);
}

function addTag() {
    var tag = document.getElementById("tag").value.trim();
    var tlDiv = document.getElementById("tagList");

    if (tag.length == 0 || tags.includes(tag)) {
        document.getElementById("tag").value = "";
        return;
    }
    tags.push(tag);

    var newTag = document.createElement("input");
    newTag.type = "button";
    newTag.id = tag + "tlBtn";
    newTag.onclick = function () { removeTag(tag); };
    //Shorten string for button if necessary
    if (tag.length > 15) {
        tag = tag.slice(0, 15) + "...";
    }
    newTag.value = tag + " ✖";
    tlDiv.appendChild(newTag);
    //Scroll tag list if necessary
    tlDiv.scrollTop = tlDiv.scrollHeight;

    document.getElementById("tag").value = "";
}

function removeTag(tag) {
    var tlDiv = document.getElementById("tagList");
    tlDiv.removeChild(document.getElementById(tag + "tlBtn"));
    tlDiv.scrollTop = tlDiv.scrollHeight;
    //Remove tag from array
    tags = tags.filter(t => t != tag);
}

document.addEventListener("DOMContentLoaded", function () {
    var fileInput = document.getElementById("fileInput");
    var audio = document.getElementById("audio");
    var unsupportedFileType = document.getElementById("unsupportedFileType");
    var metadataForm = document.getElementById("metadataForm");
    var rating = document.getElementById("rating");

    //Get audio duration from file upload on metadata load
    audio.onloadedmetadata = function () {
        var dur = audio.duration;
        if (dur) {
            fileData[12] = Math.round(dur);
        }
    }

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

                var objURL = URL.createObjectURL(selectedFile);
                fileData[0] = objURL;

                metadataForm.style.display = "initial";
            } else {
                unsupportedFileType.style.display = "initial";
            }
        }
    }
    fileInput.addEventListener("change", fileListener);

    audio.addEventListener("ended", endSongListener);
});

function acPrev(playlist = playHistory) {
    var audio = document.getElementById("audio");
    audio.currentTime = 0;
    if (audio.paused == false) {
        audio.pause();
        document.getElementById("play-pause").value = "▶";
    }
    //TODO return to start of previous song in playlist
    /*var index = 0;
    index = playlist.findIndex(song => song[0] == document.getElementById("audioPlayback").src); //Find index of playlist where songs source url matches

    if (index < 0) {
        return;
    }

    playlist[index][13]++; //Add listen to current song

    if (index > 0) {
        index--;

        //Send prev audio to playback source
        document.getElementById("audioPlayback").src = playlist[index][0];
        if (playlist[index][2].length > 0) {
            document.getElementById("displayFileData").innerHTML = playlist[index][2] + " - " + playlist[index][1]; //Artist - title
        } else {
            document.getElementById("displayFileData").innerHTML = playlist[index][1]; //Title
        }
        audio.load();
        flFlag = true;
    }*/
}

function acRestart() {
    var audio = document.getElementById("audio");
    audio.currentTime = 0;
    if (audio.paused) {
        audio.play();
        document.getElementById("play-pause").value = "⏸";
    }
    flFlag = true;
}

function acRewind() {
    //Go back 5 seconds
    var audio = document.getElementById("audio");
    if (audio.currentTime - 5 <= 0) {
        audio.currentTime = 0;
        flFlag = true;
    } else {
        audio.currentTime -= 5;
    }
}

function acPlayPause() {
    var audio = document.getElementById("audio");
    var acpp = document.getElementById("play-pause");

    if (audio.paused) {
        audio.play();
        acpp.value = "⏸";
    } else {
        audio.pause();
        acpp.value = "▶";
    }
}

function acFastForward() {
    //Skip 5 seconds
    var audio = document.getElementById("audio");
    if (audio.currentTime + 5 >= audio.duration) {
        audio.currentTime = audio.duration;
    } else {
        audio.currentTime += 5;
    }
    flFlag = false;
}

function acLoop() {
    var audio = document.getElementById("audio");
    var acloop = document.getElementById("loop");

    if (audio.loop == false) {
        audio.loop = true;
        acloop.style.color = "white";
    } else {
        audio.loop = false;
        acloop.style.color = "lightblue";
    }
}

function acSkip() {
    var audio = document.getElementById("audio");
    audio.currentTime = audio.duration;
    flFlag = false;
    endSongListener();
}

//Event listener for end of song
function endSongListener() {
    document.getElementById("play-pause").value = "▶";
    nextSong();
}

function nextSong(playlist = listeningQueue) {
    //TODO advance to next song
    /*var index = 0;
    index = playlist.findIndex(song => song[0] == document.getElementById("audioPlayback").src); //Find index of playlist where songs source url matches

    if (index < 0) {
        return;
    }

    //Add a listen and full listen is flag is true
    playlist[index][13]++;
    if (flFlag) {
        playlist[index][14]++;
    }

    index++;
    if (playlist.length >= index) {
        if (playlist == listeningQueue) {
            listeningQueue.shift();
            index = 0;
        }

        //Send next audio to playback source
        document.getElementById("audioPlayback").src = playlist[index][0];
        if (playlist[index][2].length > 0) {
            document.getElementById("displayFileData").innerHTML = playlist[index][2] + " - " + playlist[index][1]; //Artist - title
        } else {
            document.getElementById("displayFileData").innerHTML = playlist[index][1]; //Title
        }
        audio.load();
        playHistory.push(playlist[index]);
        flFlag = true;
    }*/
}