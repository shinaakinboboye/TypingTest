// DATA CONTROLLER

var DataController = function() {
    var random, randomText, sampleTexts, counter, timeString, myVar;

    sampleTexts = [

        "Learning to type is a hard challenge. This is some random texts that you can use to practice. Ok, thank you for typing this!",

        "I have a dream that my four little children will one day live in a nation where they will not be judged by the color of their skin but by the content of their character.",

        "Optimism is the faith that leads to achievement. Nothing can be done without hope and confidence."
    ];

    counter = {
        sec:    0,
        min:    0,
    };

    timeString = {
        sec:    "00",
        min:    "00",
    };


    function timer() {

        /*
            for every second the timer function gets called, this happens
        */

        //1. increase second count by 1
        counter.sec += 1;

        //2.  if seconds count is 60
        if (counter.sec > 59) {

            //a. increase minutes count by 1
            counter.min += 1;

            //b. reset seconds count to zero
            counter.sec = 0;
        }


        //3. update timeString
        
        /* 
            if the second or minute or hour count is less than 10, a leading zero is added ti it

            e.g if second count is 9, the string becomes 09
        */
        timeString.sec = counter.sec < 10 ? "0" + counter.sec.toString() : counter.sec.toString();
        timeString.min = counter.min < 10 ? "0" + counter.min.toString() : counter.min.toString();
    }

    return {

        startTimer: function(){

            // call the timer function every 1s
            if(!myVar) {

                //call setInterval only once to avoid mutliple timers overlap
                myVar = setInterval(timer, 1000);
            }
        },

        stopTimer: function(){

            // stop the interval call to the timer function
            clearInterval(myVar);
        },

        generateRandomText: function(){
           
            // genrate a sample text at random
            random = Math.floor(Math.random() * sampleTexts.length);
            randomText = sampleTexts[random];
        },

        getRandomText: function() {

            //1. return a random text
            return randomText;
        },

        getTimeString: function(){
            return timeString;
        },

        calculateWordCount: function (text){
            
            var textArray, count = 0;
            textArray =  text.split(" ");

            for(var i = 0; i < textArray.length; i++) {

                // skip spaces
                if( textArray[i] === "") {
                    continue;
                } 
                
                // update count by 1
                count += 1
            }

            // return count
            return count;
        },

        calculateWordsPerMinute: function(count) {
            var totalTime, wordsPerminute;

            //1. calcualte the total time in minutes

            totalTime = counter.min + (counter.sec / 60);

            //2. calculate wordsPerminute

            wordsPerminute = Math.round(count / totalTime);

            return wordsPerminute;
        },

        calculateErrorPercentage: function(typed, sample) {
            var errorCount = 0, percentageError

            //1. calculate the error count
            for(var i = 0; i < sample.length; i++) {
                //compare each character in the typed text with the sample sampel text

                //if the characters don't match, increase the error count by 1
                if(sample.charAt(i) !== typed.charAt(i)) {

                    // update error count by 1
                    errorCount += 1;
                }
            }
            // calculate the perecentage error
            percentageError = ((errorCount / sample.length) * 100);

            // return the percentage error
            return percentageError;
        }
    }

}();




// UI CONTROLLER
var UIController = (function () {
    var displayedTimer;

    //select DOM Strings
    var DOMStrings = {

        textField:          "#text-field",
        outputDiv :         "#output-text",
        sampleTextDiv:      "#sample-text",
        timerDiv:           "#timer div",
        messageDiv:         "#message",
        wordCountDiv:       "#word-count div",
        wpmDiv:             "#wpm div",
        errorDiv:           "#error div"
    };

    return {
        getDOMStrings: function (){
            return DOMStrings;
        },

        displaySampleText: function(text){
            var el;

            //1. select the h4 elment
            el = document.querySelector(DOMStrings.sampleTextDiv);

            //2. diplay text
            el.textContent = text;
        },

        displayTimer: function(obj) {

            var timeString;

            
            // check if the function has already been called by setInterval
            if(!displayedTimer) {

                //call the function to display timer every 0.5s, this ensures the diplay and the timer are in sync
                displayedTimer = setInterval(
                    function () {
                        timeString = obj.getTimeString();
                        document.querySelector(DOMStrings.timerDiv).textContent = timeString.min + ": " + timeString.sec;
                    },
                    500
                );
            }
           
        },

        freezeTimerDisplay: function(){

            //clear the update of the timer display
            clearInterval(displayedTimer);
        },

        getTypedText: function() {
            var typedText;

            //1. read the typed text and store it in the variable typedText
            typedText = document.querySelector(DOMStrings.textField).value;
            
            //2. return typedText
            return typedText;
        },

        displayTypedText: function(text) {

            // display the typed text
            document.querySelector(DOMStrings.outputDiv).textContent = text;
        },

        displayWordCount: function(count){
            //Select word count div and display word count
            document.querySelector(DOMStrings.wordCountDiv).textContent = count;
        },

        hideMessageDiv: function(){
            //set display property of message div to none
            document.querySelector(DOMStrings.messageDiv).style.display = "none";
        },

        displayWordsPerMinute: function (wpm) {

            //Select wpm div and display wpm
            document.querySelector(DOMStrings.wpmDiv).textContent = wpm;
        },

        disableTextField: function() {
            var el = document.querySelector(DOMStrings.textField);

            // make the textfield readonly
            el.setAttribute("readonly", true);
            el.style.background = "#ffdad3";

        },

        displayErrorPercentage: function(errorPercentage) {
            document.querySelector(DOMStrings.errorDiv).textContent = errorPercentage.toFixed(1) + "%";
        },

        highlightErrors: function(typed, sample) {
            var sampleTextArray, typedTextArray, str = "";

            //1. change the typedText and sample text into an array of words
            sampleTextArray = sample.split(" ");
            typedTextArray = typed.split(" ");

            //2. compare the sample text and typed text on word by word basis
            for( var i = 0; i < sampleTextArray.length; i++ ) {
                

                //a if the words won't match and the word isn't in the sample text
                if(sampleTextArray[i] !== typedTextArray[i] && sampleTextArray.indexOf(typedTextArray[i]) === -1 && typedTextArray[i] !== undefined) {

                    // wrap the word around a span element and add the class error to it
                    str += '<span class = "error" >' + typedTextArray[i] + '</span>' + " ";
                }
                //b. if the words match
                else if (typedTextArray[i] !== undefined) {
                    // only wrap the word around a span element
                    str += '<span>' + typedTextArray[i] + ' </span>';
                }
            }

            //3. cheeck if the user typed more words than the sample text
            if(typedTextArray.length > sampleTextArray.length) {

                for(var j = sampleTextArray.length; j < typedTextArray.length; j++) {
                    // wrap the word around a span element and add the class error to it
                    str += '<span class = "error" >' + typedTextArray[j] + ' </span>';
                }
            }

            //4. update the display with highlighted errors
            document.querySelector(DOMStrings.outputDiv).innerHTML = str;

        },

        setFocus: function(){
            document.querySelector(DOMStrings.textField).focus();
        },

        showErrorWpmDivs: function () {
            
            //make the error and word-per-minute divs to show
            document.querySelector("#error").style.display = "block";
            document.querySelector("#wpm").style.display = "block";
        }
    };

})();




// GLOBAL APP CONTROLLER
var Appcontroller = function (DataCtrl, UICtrl) {

   
    var DOM = UICtrl.getDOMStrings(),
        timeString,
        typedText = "",
        wordCount,
        sampleText,
        errorPercentage;


   function updateTextWordCount() {

       //1. get typed text
       typedText = UICtrl.getTypedText();

       //2. display the typed text
       UICtrl.displayTypedText(typedText);


       //3. calculate word count
       wordCount = DataCtrl.calculateWordCount(typedText);

       //4. display word count
       UICtrl.displayWordCount(wordCount);
   }

    function setupEventListeners() {

       document.querySelector(DOM.textField).addEventListener("input", function () {

           if (sampleText.length > UICtrl.getTypedText().length) {
                
                //1. start timer
                DataCtrl.startTimer();

                //2. display the timer
                UICtrl.displayTimer(DataCtrl);

                //3. get and update typed text, get and update word count
                updateTextWordCount();

                //4. hide start message
                UICtrl.hideMessageDiv();
            } 
            /* 
                else 

                when the user types in the same number of characters asin the sample text
            */
           else if (sampleText.length  === UICtrl.getTypedText().length) {

                //1. stop the timer
                DataCtrl.stopTimer();
                UICtrl.freezeTimerDisplay();

                //2. calculate Words-Per-Minute
                wordsPerMinute = DataCtrl.calculateWordsPerMinute(wordCount)

                //3 display Words-Per-Minute
                UICtrl.displayWordsPerMinute(wordsPerMinute);

                //4 disable typing, make  the textfield read only
                UICtrl.disableTextField();

                //5. get and update typed text, get and update word count
                updateTextWordCount();

                //6. calculate the error percentage
                errorPercentage = DataCtrl.calculateErrorPercentage(typedText, sampleText);

                //7. display the error percentage
                UICtrl.displayErrorPercentage(errorPercentage);

                //8. highlight errors in red.
                UICtrl.highlightErrors(typedText, sampleText);

                //9. display the wpm and error divs
                UICtrl.showErrorWpmDivs();
            }
       });
   }

   return {
       init : function (){

            //1. generate random sample text
            DataCtrl.generateRandomText();

            //2. get  the generated random text
            sampleText = DataCtrl.getRandomText();

            //3. Display the random text
            UICtrl.displaySampleText(sampleText);

            //4. call the function setupEventListeners
            setupEventListeners();

            //5. give focus to the textarea
            UICtrl.setFocus();
       }
   }   
} (DataController, UIController);




/* initialize the app */
Appcontroller.init();