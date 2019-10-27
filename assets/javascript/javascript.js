$(document).ready(function () {
    timerFunction();
});

// Timer 

var timerSec = 0;
var timerMin = 0;
var timer = true;

function timerFunction() {
    if (timer == true) {
        setTimeout(function () {
            timerSec++;
            $('#timer-min').html(timerMin);
            $('#timer-sec').html(timerSec);
            if (timerSec == 60) {
                timerSec = 0;
                timerMin++;
            }
            timerFunction();
        }, 1000);
    }
}

// mouse maze logic

var start = false;
var alive = false;

$('.level-container').mouseenter(function () {
    alive = true;
    console.log(alive, start)
});

// the mouse has entered the game stage

$('.start').mouseenter(function () {
    start = true;
    var levelClassBackground = '.'.concat(this.id, '-background');
    var levelClassStart = '.'.concat(this.id, '-start');
    var levelRoof = '#'.concat(this.id, '-roof');
    $(levelClassStart).addClass('level-start-colour');
    $(levelClassBackground).addClass('level-background-start');
    $(levelRoof).addClass('d-none');
});

// if alive is still true the game will finish at finish,

$('.finish').mouseenter(function () {
    if (alive == true && start == true) {
        var levelClassBackground = '.'.concat(this.id, '-background');
        var levelClassStart = '.'.concat(this.id, '-start');
        var levelRoof = '#'.concat(this.id, '-roof');
        $(this).addClass('level-start-colour');
        $(levelClassBackground).addClass('level-complete');
        $(levelClassStart).addClass('start-enter');
        $(levelRoof).addClass('d-none');
        if (puzzle == 3) {
            //  Open third puzzle
            $('#puzzleModalThree').modal({
                backdrop: 'static',
                keyboard: false
            });
            createSpawners();
            spawnLoop();
        } else if (puzzle == 2) {
            //  Open second puzzle
            $('#puzzleModalTwo').modal({
                backdrop: 'static',
                keyboard: false
            });
            bracketOne();
        } else if (puzzle == 1) {
            //  Open first puzzle
            $('#exampleModal').modal({
                backdrop: 'static',
                keyboard: false
            });
            generateLetters();
        }
        console.log('puzzle' + puzzle)
    }
})

$('.level-container').mouseleave(function () {
    start = false;
    var levelClassBackground = '.'.concat(this.id, '-background');
    var levelClassStart = '.'.concat(this.id, '-start')
    var levelRoof = '#'.concat(this.id, '-roof');
    $(levelClassStart).removeClass('level-start-colour');
    $(levelClassBackground).removeClass('level-background-start');
    $(levelRoof).removeClass('d-none');
});

$('.bad-collision').mouseenter(function () {
    start = false;
    var levelClassBackground = '.'.concat(this.id, '-background');
    var levelClassStart = '.'.concat(this.id, '-start')
    var levelRoof = '#'.concat(this.id, '-roof');
    $(levelClassStart).removeClass('level-start-colour');
    $(levelClassBackground).removeClass('level-background-start');
    $(levelRoof).removeClass('d-none');
});

// puzzles 

var puzzle = 1;


// (First puzzle,) generates letters and stores them in local storage, player removes then by pressing the keys in order.

var howManyLetters = 1;

function generateLetters() {
    for (let i = 0; i < howManyLetters; i++) {
        var letterList = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        var letterPicker = Math.floor(Math.random() * 26);
        var letter = letterList[letterPicker];

        localStorage.setItem(i, letter)

        $('#puzzle-one-container').append(`<div class="letters" id="letter-${i}">${letter.toUpperCase()}</div>`);
    }
}

var letterOrder = 0;

document.addEventListener("keyup", function (event) {
    if (puzzle == 1) {
        var currentLetter = localStorage.getItem(letterOrder.toString());
        var currentLetterCap = currentLetter.toUpperCase();

        if (event.key == currentLetter || event.key == currentLetterCap) {
            findLetter = '#letter-' + letterOrder;
            $(findLetter).remove();
            letterOrder++;
        }
        if (letterOrder == howManyLetters) {
            puzzle = 2;
            console.log('puzzle keys' + puzzle)
            $('#exampleModal').modal('hide');
        }
    }
});

// (Second puzzle,) generates a math equation and the users input, if correct will generate a new equation.

var result;
var correctAnswer = 0;
var chooseAnnoyingWord = ['Hello', 'Hurry', 'Quicker', 'Persevere', '????', 'Error', 'Quick']

function bracketOne() {
    var oprandOne = Math.floor(Math.random() * 10);
    var oprandTwo = Math.floor(Math.random() * 10);
    var operators = ['+', '-', 'X']
    var numberoperator = Math.floor(Math.random() * 3);
    var operator = operators[numberoperator];
    $('#math-generator').append(`<div>${oprandOne} ${operator} ${oprandTwo}</div>`);
    if (operator == '+') {
        result = oprandOne + oprandTwo;
    } else if (operator == '-') {
        result = oprandOne - oprandTwo;
    } else if (operator == 'X') {
        result = oprandOne * oprandTwo;
    }
    console.log(result)
}

function correctMath() {
    if (puzzle == 2) {
        var playersAnswer = $('#playersAnswer').val();
        if (playersAnswer == result) {
            bracketOne()
            var randomNum = Math.floor(Math.random() * 7)
            var selectedAnnoyingWord = chooseAnnoyingWord[randomNum]
            document.getElementById('playersAnswer').value = selectedAnnoyingWord;
            correctAnswer++;
        }
        if (correctAnswer > 3) {
            puzzle = 3;
            console.log('puzzle math' + puzzle)
            $('#puzzleModalTwo').modal('hide');
        }
    }
}

// (Third puzzle,) generates 63 spawners and 20 targets for the user to shoot.

var targetCount = 0;

// This will create a location where the targets can spawn

function createSpawners() {
    for (let i = 0; i < 63; i++) {
        $('#puzzle-third-container').append(`<div class="spawner" id="spawner-${i}"></div>`);
    }
};

// Will create five targets

function spawnTarget() {
    for (let i = 0; i < 5; i++) {
        var randomNum = Math.floor(Math.random() * 63);
        var randomSpawner = '#spawner-' + randomNum;
        $(randomSpawner).append(`<div class="shooter-target">1</div>`)
    }
};

var spawnAmount = 0;

// change for the amount of spawns 
var callSpawnTarget = 5;
var targetsToFinish = (callSpawnTarget + 1) * 5;

// loop calling the targets

function spawnLoop() {
    if (spawnAmount < callSpawnTarget) {
        setTimeout(function () {
            spawnTarget();
            spawnLoop();
            checkTargetDuplicates();
            spawnAmount++;
        }, 1500);
    }
};

// increments targetCount when a target is clicked

$('body').on('click', '.shooter-target', function () {
    $(this).text(1);
    var blue = 'rgb(158, 218, 240)';
    var yellow = 'rgb(247, 234, 142)';
    var orange = 'rgb(255, 181, 84)';
    var red = 'rgb(241, 143, 126)';

    if ($(this).css('background-color') == blue) {
        $(this).remove();
        targetCount++;

    } else if ($(this).css('background-color') == yellow) {
        $(this).css('background-color', blue)
        $(this).html(1)

    } else if ($(this).css('background-color') == orange) {
        $(this).css('background-color', yellow)
        $(this).html(2)

    } else if ($(this).css('background-color') == red) {
        $(this).css('background-color', orange)
        $(this).html(3)

    }


    if (targetCount >= targetsToFinish) {
        $('#puzzleModalThree').modal('hide');
        puzzle = 4;
        console.log('puzzle' + puzzle)
    }
});

// if targets at the same area

function checkTargetDuplicates() {
    for (let i = 0; i < 63; i++) {
        var checkSpawner = '#spawner-' + i
        var childrenLength = $(checkSpawner).children().length;

        if (childrenLength >= 4) {
            $(checkSpawner).children().removeClass('shooter-target');
            $(checkSpawner).children().html('');
            $(checkSpawner).children().first('div').addClass('shooter-target');
            $(checkSpawner).children().first('div').css('background-color', 'rgb(241, 143, 126)');
            $(checkSpawner).children().first('div').html(4);
            console.log('working 4');
        } else if (childrenLength >= 3) {
            $(checkSpawner).children().removeClass('shooter-target');
            $(checkSpawner).children().html('');
            $(checkSpawner).children().first('div').addClass('shooter-target');
            $(checkSpawner).children().first('div').css('background-color', 'rgb(255, 181, 84)');
            $(checkSpawner).children().first('div').html(3);
            console.log('working 3');
        } else if (childrenLength >= 2) {
            $(checkSpawner).children().removeClass('shooter-target');
            $(checkSpawner).children().html('');
            $(checkSpawner).children().first('div').addClass('shooter-target');
            $(checkSpawner).children().first('div').css('background-color', 'rgb(247, 234, 142)');
            $(checkSpawner).children().first('div').html(2);
            console.log('working 2');
        }
    }
}