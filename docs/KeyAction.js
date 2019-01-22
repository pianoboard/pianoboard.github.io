var x = null;
var note = null;
var dcolor = null;
var ucolor = null;
/*
volFader() is a function called when a pianokey is being released.
It would sound awfully shitty if the piano sound was immediately cut off, so we need to fade
the volume out. Of course this fading needs to be faster than the natural fade of the piano note,
so it only takes a second to be faded out. The volume does not fade all the way to zero because
for some reason the setInterval function bugs out if I try to do it, but 3% volume is good enough.
*/
function volFader() {
    var fadePoint = note.currentTime + 1;
    var first = false;
    var fadeAudio = setInterval(function () {
        if(note.volume == 1.0 && first == true){
            return false;
        }
        if ((note.currentTime <= fadePoint) && (note.volume >= 0.03)) {
            note.volume -= 0.01;
        }
        first = true;
        if (note.volume < 0.03) {
            clearInterval(fadeAudio);
        }
    }, 10);
    return false;
}
/*
The action() function is used to play and release the piano keys. An input event is sent in as the
parameters (either keyup, keydown, mouseup, or mousedown). A connection is made between the input
source and a key on the virtual piano, and a sound is put out through the speakers as a result.
*/
function action(event) {
    // When a key is held down, it continually pushes input, so we check the last key and event type
    // to ensure that the sound of the note doesn't continue reloading and spaz out.
    var lastkey = document.getElementById("lastKey");
    if(lastkey.value == event.key && lastkey.val2 == event.type && event.key != "hellYeah"){
        return false;
    }
    else if(event.key != "hellYeah"){
        lastkey.value = event.key;
        lastkey.val2 = event.type;
    }
    //If the mouse is clicked on a note, play that note
    if(event.type == "mousedown") {
        var K;
        if(event.key == "hellYeah"){ //This is added for the sweeping function of the mouse
            K = event.srcElement;
        }
        else {
            K = event.srcElement.id;
        }
        if(K.includes("#")){
            document.getElementById(K).style.background = "#333333";
        }
        else {
            document.getElementById(K).style.background = "#CCCCCC";
        }
        document.getElementById(K).style.boxShadow = "0 2px 5px black";
        note = document.getElementById(K + ".mp3");
        note.volume = 1.0;
        note.load();
        note.play();
    }
    //If the mouse is unclicked, reset the keys back to their original colors and fade out the sounds
    else if(event.type == "mouseup") {
        var K;
        if(event.key == "hellYeah"){
            K = event.srcElement;
        }
        else {
            K = event.srcElement.id;
        }
        if(K.includes("#")){
            document.getElementById(K).style.background = "#000000";
        }
        else {
            document.getElementById(K).style.background = "#FFFFFF";
        }
        document.getElementById(K).style.boxShadow = "0px 5px 5px black";
        note = document.getElementById(K + ".mp3");
        if(event.key != "hellYeah"){ //If we are sweeping the notes, a little sustain sounds nicers
            volFader();
        }
    }
    else if(event.type.includes("key")){
         //if the event is a keystroke, take note of which key was used
        var evkey = event.key.toUpperCase();
        switch(evkey) {
            case "TAB": getNote("C2"); break;
            case "1" || "!": getSharpNote("C#2"); break;
            case "Q": getNote("D2"); break;
            case "2" || "@": getSharpNote("D#2"); break;
            case "W": getNote("E2"); break;
            case "E": getNote("F2"); break;
            case "4" || "$": getSharpNote("F#2"); break;
            case "R": getNote("G2"); break;
            case "5" || "%": getSharpNote("G#2"); break;
            case "T": getNote("A2"); break;
            case "6" || "^": getSharpNote("A#2"); break;
            case "Y": getNote("B2"); break;
            case "U": getNote("C3"); break;
            case "8" || "*": getSharpNote("C#3"); break;
            case "I": getNote("D3"); break;
            case "9" || "(": getSharpNote("D#3"); break;
            case "O": getNote("E3"); break;
            case "P": getNote("F3"); break;
            case "-" || "_": getSharpNote("F#3"); break;
            case "[": getNote("G3"); break;
            case "=" || "+": getSharpNote("G#3"); break;
            case "]": getNote("A3"); break;
            case "BACKSPACE" || "^": getSharpNote("A#3"); break;
            case "\\": getNote("B3"); break;
            case "Z": getNote("C4"); break;
            case "S": getSharpNote("C#4"); break;
            case "X": getNote("D4"); break;
            case "D": getSharpNote("D#4"); break;
            case "C": getNote("E4"); break;
            case "V": getNote("F4"); break;
            case "G": getSharpNote("F#4"); break;
            case "B": getNote("G4"); break;
            case "H": getSharpNote("G#4"); break;
            case "N": getNote("A4"); break;
            case "J": getSharpNote("A#4"); break;
            case "M": getNote("B4"); break;
            case ",": getNote("C5"); break;
        }
        //If it was a keydown event, change the color, turn up the volume, load the soundfile, and jam out!
        if(event.type == "keydown") {
            x.style.background = dcolor;
            x.style.boxShadow = "0 2px 5px black";
            note.volume = 1.0;
            note.load();
            note.play();
        }
        //If it was a keyup event, change the color back, and fade the soundfile out
        if(event.type == "keyup") {
            x.style.background = ucolor;
            x.style.boxShadow = "0px 5px 5px black";
            volFader();
        }                        
    }
    return false;
}

//Set all of the important variables to the correct values based on whether the note is sharp or not
function getNote(N) {
    x = document.getElementById(N);
    note = document.getElementById(N + ".mp3");
    dcolor = "#CCCCCC";
    ucolor = "#FFFFFF";
}
function getSharpNote(N) {
    x = document.getElementById(N);
    note = document.getElementById(N + ".mp3");
    dcolor = "#333333";
    ucolor = "#000000";
}
/*  
    These functions are used for when the user clicks on a key and sweeps the mouse across the piano.
    These functions give the piano the ability to ring out all of the notes that the mouse runs over
    between the time the mouse is clicked and unclicked. 
*/
function sweep(identifier) {
    if(document.getElementById("lastKey").val2 == "mousedown") {
        var EV = {key:"hellYeah", type:"mousedown", srcElement:identifier};
        action(EV);
    }
}
function sweepout(identifier) {
    if(document.getElementById("lastKey").val2 == "mousedown") {
        var EV = {key:"hellYeah", type:"mouseup", srcElement:identifier};
        action(EV);
    }
}

// To be used later: This is how to get the selected option from the dropbox
var y = document.getElementById("instrument");
var selection = y.options[y.selectedIndex].value;