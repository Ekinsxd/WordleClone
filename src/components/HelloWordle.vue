<script setup lang="ts">
import { ref, Ref } from "vue";
import { words } from "./words";
import { toast } from "vue3-toastify";

const gameName = ref("Wordle Clone");
const currWord: Ref<string> = ref("");
var currPosition: number = 0;
var actualWord: string =
    words[Math.floor(Math.random() * words.length)].toUpperCase();
var gameOver: boolean = false;
var userWords: string[] = [];

const VALID_CHARS: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const WORD_LENGTH: number = 5;
const NUM_ATTEMPTS: number = 6;
var color = "white";
if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
) {
    color = "#242424";
}

window.addEventListener("keyup", function (ev) {
    keyPress(ev); // declared in your component methods
});

function print(e: any) {
    console.log(e);
}

function validateWord() {
    for (var word of userWords) {
        print(word);
        print(currWord.value);
        if (word.toLowerCase() == currWord.value.toLowerCase()) {
            return false;
        }
    }
    if (words.includes(currWord.value.toLowerCase())) {
        return true;
    }
    return false;
}

function keyPress(ev: KeyboardEvent) {
    if (gameOver) {
        return;
    }
    print(actualWord);
    if (ev.key === "Enter" && currWord.value.length == WORD_LENGTH) {
        if (!validateWord()) {
            toast("Invalid Word!");
            jiggleRow();
            return;
        }
        updateColors();
        if (checkGameOver()) {
            gameOver = true;
            toast("You win!", { autoClose: 5000, hideProgressBar: false });
            return;
        }
        addOneWord();
    } else if (ev.key == "Backspace") {
        currWord.value = currWord.value.slice(0, -1);
    } else if (VALID_CHARS.includes(ev.key.toUpperCase())) {
        if (currWord.value.length <= 4) {
            currWord.value += ev.key.toUpperCase();
        }
    }
    updateWord();
    updateBorder();
}

function jiggleRow() {
    const rowID: string = "row" + currPosition.toString();
    var row = document.getElementById(rowID);
    if (row) {
        row.classList.toggle("invalidWord");
        setTimeout(() => {
            row!.classList.toggle("invalidWord");
        }, 100);
    }
}

function checkGameOver() {
    for (var index: number = 0; index < WORD_LENGTH; index++) {
        var cell = document.getElementById(
            (currPosition * WORD_LENGTH + index).toString()
        );
        if (cell) {
            if (cell.style.backgroundColor !== "green") {
                return false;
            }
        }
    }
    return true;
}

function updateBorder() {
    for (var index: number = 0; index < WORD_LENGTH; index++) {
        var cell = document.getElementById(
            (currPosition * WORD_LENGTH + index).toString()
        );
        if (cell) {
            if (cell.innerHTML !== "") {
                if (cell.style.border == "1px solid lightgrey") {
                    cell.classList.toggle("newLetter");
                }
                cell.style.border = "1px solid black";
            } else {
                cell.classList.remove("newLetter");
                cell.style.border = "1px solid lightgrey";
            }
        }
    }
}

function updateColors() {
    var charMap = new Map<string, number>();
    for (var char of actualWord) {
        charMap.set(char, (charMap.get(char) || 0) + 1);
    }

    for (var index: number = 0; index < WORD_LENGTH; index++) {
        var cell = document.getElementById(
            (currPosition * WORD_LENGTH + index).toString()
        );

        if (cell) {
            if (currWord.value[index] == actualWord[index]) {
                cell.style.backgroundColor = "green";
                charMap.set(
                    currWord.value[index],
                    charMap.get(currWord.value[index])! - 1
                );
            }
        }
    }

    for (var index: number = 0; index < WORD_LENGTH; index++) {
        var cell = document.getElementById(
            (currPosition * WORD_LENGTH + index).toString()
        );

        if (cell) {
            if (
                cell.style.backgroundColor !== "green" &&
                actualWord.includes(currWord.value[index]) &&
                charMap.get(currWord.value[index])! > 0
            ) {
                cell.style.backgroundColor = "yellow";
                charMap.set(
                    currWord.value[index],
                    charMap.get(currWord.value[index])! - 1
                );
            } else if (cell.style.backgroundColor !== "green") {
                cell.style.backgroundColor = "grey";
            }
        }
    }
}

function updateWord() {
    for (var index: number = 0; index < WORD_LENGTH; index++) {
        var cell = document.getElementById(
            (currPosition * WORD_LENGTH + index).toString()
        );
        if (cell) {
            if (currWord.value[index]) {
                cell.innerHTML = currWord.value[index];
            } else {
                cell.innerHTML = "";
            }
        }
    }
}

function addOneWord() {
    userWords.push(currWord.value);
    currPosition++;
    currWord.value = "";
    clearAll();
    if (currPosition > 5) {
        toast("You lose!", { autoClose: 5000, hideProgressBar: false });
        gameOver = true;
    }
    //IF currPosition > 5, game over screen.
}

function reset() {
    document.getElementById("title")!.focus();
    gameOver = false;
    currPosition = 0;
    currWord.value = "";
    userWords = [];
    actualWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
    for (var r: number = 0; r < NUM_ATTEMPTS; r++) {
        for (var c: number = 0; c < WORD_LENGTH; c++) {
            var cell = document.getElementById(
                (r * WORD_LENGTH + c).toString()
            );
            cell!.innerHTML = "";
            cell!.style.backgroundColor = color;
            cell!.style.border = "1px solid lightgrey";
        }
    }
    clearAll();
    updateBorder();
}

function clearAll() {
    userWords = [];
}
</script>

<template>
    <Toast />
    <h1 id="title">{{ gameName }}</h1>
    <div class="gridHolder">
        <div
            class="cell row"
            v-for="(w, i) in [...Array(NUM_ATTEMPTS).keys()]"
            :id="`row` + i.toString()"
        >
            <div
                class="cell col"
                v-for="(w, j) in [...Array(WORD_LENGTH).keys()]"
                :id="(i * 5 + j).toString()"
            ></div>
        </div>
    </div>

    <button @click="reset">New Game</button>

    <div class="keyboard">
        <div class="keyrow key" v-for="(w, i) in [...Array(3).keys()]"></div>
        <div class="keycol key" v-for="(w, i) in [...Array(3).keys()]"></div>
    </div>
</template>

<style scoped></style>
