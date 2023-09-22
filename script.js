var supportedExtensions = ["mp3", "wav", "ogg"];
var fileData = ["", "", "", ""]; //URL, Title, Artist, Album

function addMetadata() {
  fileData[1] = document.getElementById("title").value;
  fileData[2] = document.getElementById("artist").value;
  fileData[3] = document.getElementById("album").value;
  document.getElementById("displayFileData").innerHTML = fileData[2] + " - " + fileData[1];
  document.getElementById("metadataForm").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
  var fileInput = document.getElementById("fileInput");
  var audioPlayback = document.getElementById("audioPlayback");
  var audio = document.getElementById("audio");
  var unsupportedFileType = document.getElementById("unsupportedFileType");
  var metadataForm = document.getElementById("metadataForm");
  
  unsupportedFileType.style.display = "none";
  metadataForm.style.display = "none";
  
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