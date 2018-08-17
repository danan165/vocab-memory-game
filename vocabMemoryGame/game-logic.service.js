(function() {
    "use strict";

    var app = angular.module("vocabMemoryGame");

    app.service('gameLogic', function() {
        var boardHeight = 0;
        var boardWidth = 0;
        var memoryGameId = 0;
        var totalCardsClicked = 0;
        var cardsClicked = [];
        var totalDisabledCards = 0;

        var initializeCards = function(data) {
            boardHeight = Number(data[0]['board_height']);
            boardWidth = Number(data[0]['board_width']);
            memoryGameId = data[0]['memory_game_id'];

            var numCards = boardWidth * boardHeight;

            var cardsFlat = new Array(numCards);
            var matchIndex = 0;
            data.forEach(function(element) {
                if (element['memory_game_word_id']) {
                    element['card_disabled'] = true;
                    element['card_face_up'] = true;
                    totalDisabledCards += 2;
                } else {
                    element['card_disabled'] = false;
                    element['card_face_up'] = false;
                }
                cardsFlat[element['word_location']] = {
                    match_index: matchIndex,
                    word: element['word'],
                    partspeech: element['partspeech'],
                    audio_url: element['audio_url'],
                    card_disabled: element['card_disabled'],
                    card_face_up: element['card_face_up'],
                    flat_index: element['word_location']
                };

                cardsFlat[element['definition_location']] = {
                    match_index: matchIndex,
                    definition: element['definition'],
                    imagename: element['imagename'],
                    imagecredit: element['imagecredit'],
                    card_disabled: element['card_disabled'],
                    card_face_up: element['card_face_up'],
                    flat_index: element['definition_location']
                };

                matchIndex += 1;
            });

            return createMatrixFromArray(cardsFlat);
        };

        var createMatrixFromArray = function(cardsFlat) {
            var flatIndex = 0;
            var tempArray = [];
            var cards = [];

            for (var row = 0; row < boardHeight; row++) {
                for (var col = 0; col < boardWidth; col++) {
                    cardsFlat[flatIndex]['row'] = row;
                    cardsFlat[flatIndex]['col'] = col;
                    tempArray.push(cardsFlat[flatIndex]);
                    flatIndex += 1;
                }
                cards.push(tempArray);
                tempArray = [];
            }

            return cards;
        };

        var flipCard = function(cardFaceUp, cardIndex) {
            if (cardFaceUp) {
                totalCardsClicked -= 1;
                cardsClicked.splice(cardsClicked.indexOf(cardIndex), 1);
            } else {
                totalCardsClicked += 1;
                cardsClicked.push(cardIndex);
            }
        };

        var getClickedCardIndices = function() {
            return cardsClicked;
        };

        var getOtherClickedCardIndex = function(cardFlatIndex) {
            return cardsClicked[0] === cardFlatIndex ? cardsClicked[1] : cardsClicked[0];
        };

        var disableClickedCards = function() {
            totalDisabledCards += 2;
        };

        var resetGameBoard = function() {
            totalDisabledCards = 0;
            totalCardsClicked = 0;
            cardsClicked = [];
        };

        var clearClickedCards = function() {
            totalCardsClicked = 0;
            cardsClicked = [];
        };

        var getBoardHeight = function() {
            return boardHeight;
        };

        var getBoardWidth = function() {
            return boardWidth;
        };

        var getMemoryGameId = function() {
            return memoryGameId;
        };

        var getTotalDisabledCards = function() {
            return totalDisabledCards;
        };

        var getTotalCardsClicked = function() {
            return totalCardsClicked;
        };

        return {
            initializeCards: initializeCards,
            getBoardHeight: getBoardHeight,
            getBoardWidth: getBoardWidth,
            getMemoryGameId: getMemoryGameId,
            getTotalDisabledCards: getTotalDisabledCards,
            getTotalCardsClicked: getTotalCardsClicked,
            flipCard: flipCard,
            getOtherClickedCardIndex: getOtherClickedCardIndex,
            disableClickedCards: disableClickedCards,
            resetGameBoard: resetGameBoard,
            clearClickedCards: clearClickedCards,
            getClickedCardIndices: getClickedCardIndices
        };
    });
}());