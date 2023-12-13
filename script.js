const supportedExtensions = ["mp3", "wav", "ogg"];
var fileData = ["", "", "", "", "", NaN, NaN, [], 0, "", [], 0, 0, 0, 0];
                //URL, Title, Artist, Album, Contributors, Year, BPM, Genre(s), Rating/10,
                //Comments, Tags, Uploaded time, Length (s), # Listens, # Full listens
var genres = [];
var tags = [];
var listeningQueue = [];
var playHistory = [];
var flFlag = true;
var seekTime = 0;
var playlistShuffle = false;
var playlistLoop = false;

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
    //fileData[8] = document.getElementById("#rating").textContent;
    fileData[9] = expandedForm.querySelector("#comments").value;
    fileData[10] = tags;
    fileData[11] = time;
    //fileData[12] = file length got on audio load
    fileData[13] = expandedForm.querySelector("#listens").value;
    fileData[14] = expandedForm.querySelector("#fullListens").value;

    //console.log(fileData); //For testing purposes

    listeningQueue.push([].concat(fileData)); //Add copy of fileData to lqueue for current songs data
    document.getElementById("playlistName").innerHTML = "Listening Queue";
    addToTable(fileData);

    //Send audio to playback source
    if (document.getElementById("audioPlayback").src.endsWith("Assets/tempBlankAudio.mp3")) {
        document.getElementById("audioPlayback").src = fileData[0];
        document.getElementById("audio").load();
        flFlag = true;
        
        if (fileData[2].length > 0) {
            document.getElementById("displayFileData").innerHTML = fileData[2] + " - " + fileData[1]; //Artist - title
        } else {
            document.getElementById("displayFileData").innerHTML = fileData[1]; //Title
        }
        //playHistory.push([].concat(fileData)); //Add copy of fileData to playHistory for current songs data
        //addToTable(fileData, "playHistoryTable");
    }
    clearForm();
    document.getElementById("metadataForm").style.display = "none";
    document.getElementById("uploadInput").style.display = "initial";
    document.getElementsByClassName("ratingscale")[0].style.display = "flex";
    document.getElementById("rtlbl").textContent = "Rating: ";
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
        }
    }
    contractForm();
}

function addToTable(fmetadata, tblName = "lqueueTable") {
    var table = document.getElementById(tblName).getElementsByTagName("tbody")[0];
    var newRow = table.insertRow(table.rows.length);
    newRow.className = "trBasic";
    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    var cell3 = newRow.insertCell(2);
    var cell4 = newRow.insertCell(3);
    var url = fmetadata[0];
    var tblList = listeningQueue;

    //Update play history song number label
    if (tblName == "playHistoryTable") {
        document.getElementById("songsNum").innerHTML = "Songs: " + playHistory.length;
        //Send playHistory list for onDoubleClick function
        tblList = playHistory;
    }

    //Title Artist (Contributors)
    if (fmetadata[4] != "") {
        cell1.innerHTML += fmetadata[1] + '<span class="artistLbl" title="Contributing artists: ' + fmetadata[4] + '"> ' + fmetadata[2] + '</span>';
    } else {
        cell1.innerHTML += fmetadata[1] + '<span class="artistLbl" title="Artist"> ' + fmetadata[2] + '</span>';
    }
    cell1.title = "Title";

    cell2.innerHTML = fmetadata[3]; //Album
    cell2.title = "Album";
    if ("" + fmetadata[5] !== "NaN") /* Compare with string NaN */ {
        cell3.innerHTML = fmetadata[5]; //Year
        cell3.title = "Year";
    }
    
    var dur = Math.round(fmetadata[12]);
    var min = Math.floor(dur / 60);
    var sec = dur % 60;
    if (sec < 10) {
        sec = "0" + sec;
    }
    cell4.innerHTML = min + ":" + sec; //Length (m:ss)
    cell4.title = "Length";

    if (fmetadata[7].length != 0 || fmetadata[10].length != 0 || "" + fmetadata[6] !== "NaN") {
        //Expanded row for more metadata
        var expNewRow = table.insertRow(table.rows.length);
        var eCell1 = expNewRow.insertCell(0);
        var eCell2 = expNewRow.insertCell(1);
        var eCell3 = expNewRow.insertCell(2);

        eCell1.innerHTML = fmetadata[7].join(", "); //Genres
        eCell1.title = "Genre(s)";
        eCell2.innerHTML = fmetadata[10].join(", "); //Tags
        eCell2.title = "Tags";
        eCell3.colSpan = 2;
        if ("" + fmetadata[6] !== "NaN") {
            eCell3.innerHTML = fmetadata[6] + "BPM"; //Beats-per-minute
            eCell3.title = "Beats-per-minute";
        }

        expNewRow.style.display = "none";
        expNewRow.addEventListener("dblclick", () => { changeSongOnDblClick(url, tblList); });
        newRow.addEventListener("click", () => {
            expNewRow.style.display = expNewRow.style.display == "none" ? "table-row" : "none";
        }); //Alternate visibility of expanded row on click
    }
    if (fmetadata[9].length != 0) {
        var expNewRow2 = table.insertRow(table.rows.length);
        var e2Cell1 = expNewRow2.insertCell(0);

        e2Cell1.colSpan = 4;
        e2Cell1.innerHTML = fmetadata[9]; //Comments
        e2Cell1.title = "User Comments";

        expNewRow2.style.display = "none";
        expNewRow2.addEventListener("dblclick", () => { changeSongOnDblClick(url, tblList); });
        newRow.addEventListener("click", () => {
            expNewRow2.style.display = expNewRow2.style.display == "none" ? "table-row" : "none";
        });
    }

    newRow.addEventListener("dblclick", () => { changeSongOnDblClick(url, tblList); });
}

function removeFromTable(rowIndex, tblName = "lqueueTable") {
    var table = document.getElementById(tblName);
    if (table.rows[rowIndex]) {
        if (table.rows[rowIndex + 1] && table.rows[rowIndex + 1].className != "trBasic") {
            if (table.rows[rowIndex + 2] && table.rows[rowIndex + 2].className != "trBasic") {
                table.deleteRow(rowIndex + 2);
            }
            table.deleteRow(rowIndex + 1);
        }
        table.deleteRow(rowIndex);
    }

    if (tblName == "playHistoryTable") {
        document.getElementById("songsNum").innerHTML = "Songs: " + playHistory.length;
    }
}

function hSettingsMenu() {
    var menu = document.getElementById("settingsMenu");
    if (menu.style.display != "initial") {
        menu.style.display = "initial";
    } else {
        menu.style.display = "none";
    }
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

function popoutPlayback() {
    var newWindow = window.open("", "_blank", "width=400, height=175, top=50");
    var customControls = document.getElementById("controls").innerHTML;
    var src = document.getElementById("audioPlayback").src;
    var displaymeta = document.getElementById("displayFileData").innerHTML;
    var head = '<!DOCTYPE html><html><head><title>Music App</title><link rel = "stylesheet" type = "text/css" href = "styles.css">' +
        '<script src="script.js"></script><meta charset="UTF-8"></head><body><div id="playback">';

    //Write to new window
    newWindow.document.open();
    newWindow.document.write(head);
    newWindow.document.write('<p id="displayFileData">' + displaymeta + '</p>');
    newWindow.document.write('<div id="controls">' + customControls + '</div>');
    newWindow.document.write('<audio id="audio" controls preload="metadata"><source src = "' + src + '" id = "audioPlayback"></audio>');
    newWindow.document.write('<p id="lQueuePopout" hidden>' + listeningQueue.join("ENDOFSONG") + '</p><p id="pHistoryPopout" hidden>' + playHistory.join("ENDOFSONG") + '</p>');
    newWindow.document.write('</div></body></html>');
    newWindow.document.close();

    //Set currentTime and volume to same as before popped out, and autoplay if playing when popped out
    newWindow.addEventListener("load", () => {
        var newAudio = newWindow.document.getElementById("audio");
        var oldAudio = document.getElementById("audio");
        newAudio.currentTime = oldAudio.currentTime;
        newAudio.volume = oldAudio.volume;
        if (!oldAudio.paused) {
            //I would make newAudio autoplay for a more seamless user experience, but browsers block autoplay on new windows without user input
            oldAudio.pause();
            newWindow.document.getElementById("play-pause").value = "▶";
        }
    });

    document.getElementById("settingsMenu").style.display = "none";
    document.getElementById("playback").style.display = "none"; //hide / unhide div on original page when popped out page is active / closed

    newWindow.addEventListener("beforeunload", () => {
        document.getElementById("playback").style.display = "initial";
        var newAudio = newWindow.document.getElementById("audio");
        var oldAudio = document.getElementById("audio");
        oldAudio.currentTime = newAudio.currentTime;
        oldAudio.volume = newAudio.volume;
        if (!newAudio.paused) {
            oldAudio.play();
            document.getElementById("play-pause").value = "⏸";
            newAudio.pause();
        }
    });
}

function viewPlayHistory() {
    var lqueueTable = document.getElementById("lqueueTable");
    var playHistoryTable = document.getElementById("playHistoryTable");
    var viewHistory = document.getElementById("viewHistory");
    var playlistName = document.getElementById("playlistName");
    var songsNum = document.getElementById("songsNum");

    if (playHistoryTable.style.display == "none") {
        //Change visible table to play history
        lqueueTable.style.display = "none";
        playHistoryTable.style.display = "table";
        viewHistory.value = "View Listening Queue";
        songsNum.style.display = "initial";
        if (playHistory.length > 0) {
            playlistName.innerHTML = "Play History";
        } else {
            playlistName.innerHTML = "Start listening to begin your history!";
        }
    } else {
        //Change visible table to listening queue (default)
        lqueueTable.style.display = "table";
        playHistoryTable.style.display = "none";
        viewHistory.value = "View Play History";
        songsNum.style.display = "none";
        if (listeningQueue.length > 0) {
            playlistName.innerHTML = "Listening Queue";
        } else {
            playlistName.innerHTML = "Upload a song to start listening!";
        }
    }
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

document.addEventListener("DOMContentLoaded", () => {
    var fileInput = document.getElementById("fileInput");
    var unsupportedFileType = document.getElementById("unsupportedFileType");
    var rating = document.getElementById("rating");
    var tempAudio = document.createElement("audio");

    //Get audio duration from file upload on temp audio element metadata load
    tempAudio.onloadedmetadata = function () {
        var dur = tempAudio.duration;
        if (dur) {
            fileData[12] = Math.round(dur);
        }
    }

    var radioButtons = document.getElementsByClassName("ratingscale")[0].querySelectorAll('input[type="radio"]');
    radioButtons.forEach((radioButton) => {
        //On page reload, uncheck all radiobuttons
        radioButton.checked = false;

        //Update radiobuttons upon selection
        radioButton.addEventListener('change', () => {
            radioButtons.forEach((rb) => {
                if (rb !== radioButton) {
                    rb.checked = false;
                }
            });
            //Update rating label
            rating.textContent = radioButton.value;

            //Update rating metadata based on song playing from playhistory or listeningqueue
            var songSrc = document.getElementById("audioPlayback").src;
            listeningQueue.find((song) => { if (song[0] == songSrc) { song[8] = radioButton.value; } });
            playHistory.find((song) => { if (song[0] == songSrc) { song[8] = radioButton.value; } });
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
                //URL sent to temp audio element so that file duration can be saved
                //Without using the duration of the visible audio element, which is not guaranteed to be loaded to the correct song
                tempAudio.src = objURL;
                tempAudio.load();

                document.getElementById("metadataForm").style.display = "initial";
                document.getElementById("uploadInput").style.display = "none";
            } else {
                unsupportedFileType.style.display = "initial";
            }
        }
    }
    if (fileInput !== null) {
        fileInput.addEventListener("change", fileListener);
    }
    
    document.getElementById("audio").addEventListener("ended", endSongListener);
});

function acPrev(playlist = playHistory) {
    //Check if function was called from a popped-out window or the original window
    if (playlist.length == 0 && document.getElementById("pHistoryPopout") !== null) {
        //If from popped-out window, re-populate playHistory
        playlist = document.getElementById("pHistoryPopout").innerHTML.split("ENDOFSONG").map((s) => s.split(','));
    }

    var audio = document.getElementById("audio");
    audio.currentTime = 0;
    if (audio.paused == false) {
        audio.pause();
        document.getElementById("play-pause").value = "▶";
    }
    
    var index = 0;
    index = playlist.findIndex((song) => { song[0] == document.getElementById("audioPlayback").src; }); //Find index of current song

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
        updateRating(playlist[index][8]);
        flFlag = true;
        audio.play();
        document.getElementById("play-pause").value = "⏸";
    }
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
}

function pcFirst() {
    //TODO go back to first song
}

function pcShuffle() {
    var pcshuffle = document.getElementById("shuffle");

    if (playlistShuffle == false) {
        playlistShuffle = true;
        pcshuffle.style.color = "white";
        endSongListener();
    } else {
        playlistShuffle = false;
        pcshuffle.style.color = "lightblue";
    }
}

function pcLoop() {
    var pcloop = document.getElementById("loopList");

    if (playlistLoop == false) {
        playlistLoop = true;
        pcloop.style.color = "white";
    } else {
        playlistLoop = false;
        pcloop.style.color = "lightblue";
    }
}

function pcLast() {
    //TODO skip to last song
}

//Event listener for end of song
function endSongListener() {
    document.getElementById("play-pause").value = "▶";
    if (document.getElementById("playHistoryTable").style.display == "none") {
        nextSong();
    } else {
        nextSong(playHistory);
    }
}

function nextSong(playlist = listeningQueue) {
    //Check if function was called from a popped-out window or the original window
    if (playlist.length == 0 && document.getElementById("lQueuePopout") !== null) {
        //If from popped-out window, re-populate listeningQueue
        playlist = document.getElementById("lQueuePopout").innerHTML.split("ENDOFSONG").map((s) => s.split(','));
    }

    var audio = document.getElementById("audio");
    var index = 0;
    index = playlist.findIndex((song) => song[0] == document.getElementById("audioPlayback").src); //Find index of current song

    if (index < 0) {
        return;
    }

    if (playHistory.length == 0) {
        playHistory.push([].concat(playlist[index]));
        addToTable(playlist[index], "playHistoryTable");
    }

    //Add a listen and full listen if flag is true
    playlist[index][13]++;
    if (flFlag) {
        playlist[index][14]++;
    }

    //Get random song index for next song if shuffle option enabled
    if (playlistShuffle) {
        index = Math.floor(Math.random() * playlist.length);
        console.log(index);
    } else {
        index++;
    }

    if (playlist.length > index || playlistLoop) {
        if (playlistLoop && index >= playlist.length) {
            //Restart playlist if loop option enabled
            index = 0;
        }

        //Remove from listening queue on listen
        if (playlist == listeningQueue && playlist.length > 1) {
            listeningQueue.shift();
            removeFromTable(0);
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
        updateRating(playlist[index][8]);
        playHistory.push([].concat(playlist[index]));
        addToTable(playlist[index], "playHistoryTable");
        flFlag = true;
        audio.play();
        document.getElementById("play-pause").value = "⏸";
    }
}

function changeSongOnDblClick(url, playlist = listeningQueue) {
    //Check if audio playback is in popped-out window, if so don't update hidden audio in original page
    if (document.getElementById("playback").style.display == "none") {
        return;
    }
    var audio = document.getElementById("audio");
    var index = 0;
    index = playlist.findIndex(song => song[0] == document.getElementById("audioPlayback").src); //Find index of playlist where songs source url matches

    if (index >= 0) {
        playlist[index][13]++; //Add listen to current song
    }
    
    //Get song to change audio playback to
    var song = playlist.find((s) => s[0] == url);
    if (song !== undefined) {
        document.getElementById("audioPlayback").src = url;
        if (song[2].length > 0) {
            document.getElementById("displayFileData").innerHTML = song[2] + " - " + song[1]; //Artist - title
        } else {
            document.getElementById("displayFileData").innerHTML = song[1]; //Title
        }
        audio.load();
        updateRating(song[8]);
        playHistory.push([].concat(song));
        addToTable(song, "playHistoryTable");
        flFlag = true;
        audio.play();
        document.getElementById("play-pause").value = "⏸";
    }
}

function updateRating(val) {
    //Clear current ratingscale
    document.getElementById("rating").textContent = "";
    var ratingBtns = document.getElementsByClassName("ratingscale")[0].querySelectorAll('input[type="radio"]');
    ratingBtns.forEach((rb) => { rb.checked = false; });

    //Change rating value to rating of song selected (val)
    if (val != 0) {
        document.getElementById("rating").textContent = val;
        ratingBtns.forEach((rb) => { if (rb.value == val) { rb.checked = true; } });
    }
}