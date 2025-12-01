var screenEle:HTMLElement|null  = document.getElementById("expression");
var express: any = []
var tempnum: string = "";

function addnumber(num: string): void {
    if (screenEle){
        screenEle.value += num;
        tempnum = tempnum.concat(num);
    }
}

function addToArray(opperation: string): void{
    express.push(tempnum);
    console.log("adding")
    tempnum = "";
    screenEle.value += opperation;
}

// Add function

function add(): void{

}

// subtract function

function subtract(): void{

}

// multiply function

function multiply(): void{

}

function divide(): void{

}

function clearScreen (){
    screenEle.value = "";
}

function Answer(): void{

    //let expr: String = screenEle.value;
    let numBefore:number;
    let numAfter:number;

    if (express.indexOf('+')){
        numBefore = parseInt(express[express.indexOf('+') - 1]);
        numAfter = parseInt(express[express.indexOf('+') + 1]);
        let answer:number =  numBefore + numAfter;
        screenEle.value = answer.toString();
    }
}


