document.addEventListener("DOMContentLoaded", function(){

    // Initialize instances:
    var socket = io.connect();
    var siofu = new SocketIOFileUpload(socket);


    siofu.listenOnSubmit(document.getElementById("btn"),
    document.getElementById("upload_input"));


    // Do something on upload progress:
    siofu.addEventListener("progress", function(event){
        var percent = Math.floor(event.bytesLoaded / event.file.size * 100);
        //console.log("File is", percent.toFixed(2), "percent loaded");
        $("#toFill").width(percent+"%");
        $("#percentage").text(percent+"%");
        $("#upl").text("Upload ("+percent+"%)");
    });

    // Do something when a file is uploaded:
    siofu.addEventListener("complete", function(event){
        console.log(event.file);
        socket.emit("complete", event.file.name);
    });

}, false);
