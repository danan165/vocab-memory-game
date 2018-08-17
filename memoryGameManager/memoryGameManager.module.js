(function () {
    'use strict';

    var app = angular.module('memoryGameManager');

    app.component('memoryGameManager', {
        templateUrl: 'content/js/memoryGameManager/memory-game-manager.html',
        controller: 'memoryGameManagerCtrl'
    });

    app.controller("memoryGameManagerCtrl", ["$scope", "gameWordsVal", "memoryGameIdVal", "kidsBookId", "GameWords", "boardDimensions", "gameState", "bookTitle",
        function ($scope, gameWordsVal, memoryGameIdVal, kidsBookId, GameWords, boardDimensions, gameState, bookTitle) {

        var gameWordsArr = angular.copy(gameWordsVal);
        var newGame = true;
        $scope.showFactors = false;
        $scope.saveButtonDisabled = false;
        $scope.activateButtonDisabled = false;
        $scope.removeButtonDisabled = false;
        $scope.archiveButtonDisabled = false;
        $scope.selectedDims = {
            boardHeight : null
        };
        $scope.gameState = gameState;
        $scope.bookTitle = bookTitle;

        gameWordsArr.forEach(function (element) {
            var kids_prefix = "https://www.kidsa-z.com";
            if (element['audio_url']) {
                element['audio_url'] = kids_prefix.concat(element['audio_url']);
            }
            if (element['imagename']) {
                element['imagename'] = kids_prefix.concat(element['imagename']);
            }
            if (element['memory_game_id']) {
                newGame = false;
            }

            element['game_word'] = element['memory_game_word_id'] ? true : false;
        });

        $scope.gameWords = gameWordsArr;

        GameWords.initializeGameWords(gameWordsArr, memoryGameIdVal);

        $scope.factors = [];

        var calculateFactors = function (num) {
            var half = Math.floor(num / 2), // Ensures a whole number <= num.
                i, j;
            $scope.factors.push(1);

            // Determine out increment value for the loop and starting point.
            num % 2 === 0 ? (i = 2, j = 1) : (i = 3, j = 2);

            for (i; i <= half; i += j) {
                (num % i === 0 && i !== 0) ? $scope.factors.push(i) : false;
            }

            $scope.factors.push(num);
        };

        $scope.generateDimensions = function () {
            $scope.factors = [];
            $scope.boardSize = 0;
            $scope.gameWords.forEach(function (element) {
                if (element['game_word'] === true) {
                    $scope.boardSize += 2;
                }
            });

            if ($scope.boardSize === 0) {
                return;
            }

            calculateFactors($scope.boardSize);

            if (boardDimensions) {
                //find index of this board height in factors. assign this index below
                $scope.factors.forEach(function (element) {
                    if (element == boardDimensions['board_height']) {
                        $scope.selectedDims = {
                            boardHeight : element
                        };
                    }
                });
            }
            else {
                $scope.selectedDims = {
                    boardHeight : $scope.factors[0]
                };
            }
            $scope.showFactors = true;
        };

        $scope.saveGameEdits = function (gameWords) {
            if (!$scope.selectedDims.boardHeight) {
                alert("Please select game board dimensions.");
                return;
            }
            var boardHeight = $scope.selectedDims.boardHeight;
            var boardWidth = $scope.boardSize / boardHeight;
            GameWords.saveGameEdits(kidsBookId, boardHeight, boardWidth, gameWords);
            $scope.saveButtonDisabled = true;
        };

        $scope.activateGame = function () {
            GameWords.activateGame(kidsBookId);
            $scope.activateButtonDisabled = true;
        };

        $scope.removeGameDraft = function () {
            GameWords.removeGameDraft(kidsBookId);
            $scope.removeButtonDisabled = true;
        };

        $scope.archiveGame = function () {
            GameWords.archiveGame(kidsBookId);
            $scope.archiveButtonDisabled = true;
        };

    }]);
}());