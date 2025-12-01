var screenEle = document.getElementById("expression");
var express = [];
var tempnum = "";
function addnumber(num) {
    if (screenEle) {
        screenEle.value += num;
        tempnum = tempnum.concat(num);
    }
}
function addToArray(opperation) {
    express.push(tempnum);
    console.log("adding");
    tempnum = "";
    screenEle.value += opperation;
}
// Add function
function add() {
}
// subtract function
function subtract() {
}
// multiply function
function multiply() {
}
function divide() {
}
function clearScreen() {
    screenEle.value = "";
}
function Answer() {
    //let expr: String = screenEle.value;
    var numBefore;
    var numAfter;
    if (express.indexOf('+')) {
        numBefore = parseInt(express[express.indexOf('+') - 1]);
        numAfter = parseInt(express[express.indexOf('+') + 1]);
        var answer = numBefore + numAfter;
        screenEle.value = answer.toString();
    }
}
