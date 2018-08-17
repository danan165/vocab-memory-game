(function(){
    "use strict";

    var app = angular.module("vocabMemoryGame", []);

    app.component('vocabMemoryGame', {
        templateUrl: '/js/angular/vocabMemoryGame/vocab-memory-game.html',
        controller: 'vocabMemoryGameCtrl'
    });

    app.controller("vocabMemoryGameCtrl", ["$scope", "vocabData", "resourceDeploymentId", "studentAssignmentId", "gameLogic", "title",
        function($scope, vocabData, resourceDeploymentId, studentAssignmentId, gameLogic, title) {

        var initCardMatrix = function (data) {
            $scope.cards = gameLogic.initializeCards(data);

            if (gameLogic.getTotalDisabledCards() > 0) {
                $scope.starsEarned = gameLogic.getTotalDisabledCards() * 2.5;
            }
        };

        $scope.title = title;
        $scope.cards = [];
        vocabData.getVocabData(resourceDeploymentId).then(initCardMatrix);
        $scope.starsEarned = 0;
        $scope.gameOver = false;

        $scope.clickCard = function(card) {
            var cardsFlatIndex = card.flat_index;
            var row = card.row;
            var col = card.col;

            if (isCardDisabled(row, col)) return;

            if (isCardFaceUp(row, col)) {


                if (gameLogic.getTotalCardsClicked() === 2) {
                    var otherClickedCardFlatIndex = gameLogic.getOtherClickedCardIndex(cardsFlatIndex);
                    var otherClickedCardRow = Math.floor(otherClickedCardFlatIndex / gameLogic.getBoardWidth());
                    var otherClickedCardCol = otherClickedCardFlatIndex % gameLogic.getBoardWidth();
                    flipCard(otherClickedCardRow, otherClickedCardCol, otherClickedCardFlatIndex);
                }

                flipCard(row, col, cardsFlatIndex);
            }
            else {
                if (gameLogic.getTotalCardsClicked() === 2) return;

                flipCard(row, col, cardsFlatIndex);

                if (gameLogic.getTotalCardsClicked() !== 2) return;

                if (!areTheClickedCardsAMatch()) return;

                rewardFoundMatch();
            }
        };

        var getFoundWordLocation = function() {
            var clickedCardIndices = gameLogic.getClickedCardIndices();
            var cardOneRow = Math.floor(clickedCardIndices[0] / gameLogic.getBoardWidth());
            var cardOneCol = clickedCardIndices[0] % gameLogic.getBoardWidth();

            if ($scope.cards[cardOneRow][cardOneCol]['word']) {
                return clickedCardIndices[0];
            }
            return clickedCardIndices[1];
        };

        var areTheClickedCardsAMatch = function() {
            var clickedCardIndices = gameLogic.getClickedCardIndices();
            var cardOneRow = Math.floor(clickedCardIndices[0] / gameLogic.getBoardWidth());
            var cardOneCol = clickedCardIndices[0] % gameLogic.getBoardWidth();
            var cardTwoRow = Math.floor(clickedCardIndices[1] / gameLogic.getBoardWidth());
            var cardTwoCol = clickedCardIndices[1] % gameLogic.getBoardWidth();

            return $scope.cards[cardOneRow][cardOneCol]['match_index'] === $scope.cards[cardTwoRow][cardTwoCol]['match_index'];
        };

        var disableClickedCards = function() {
            var clickedCardIndices = gameLogic.getClickedCardIndices();
            var cardOneRow = Math.floor(clickedCardIndices[0] / gameLogic.getBoardWidth());
            var cardOneCol = clickedCardIndices[0] % gameLogic.getBoardWidth();
            var cardTwoRow = Math.floor(clickedCardIndices[1] / gameLogic.getBoardWidth());
            var cardTwoCol = clickedCardIndices[1] % gameLogic.getBoardWidth();

            $scope.cards[cardOneRow][cardOneCol]['card_disabled'] = true;
            $scope.cards[cardTwoRow][cardTwoCol]['card_disabled'] = true;

            gameLogic.disableClickedCards();
        };

        var flipCard = function(row, col, cardIndex) {
            gameLogic.flipCard($scope.cards[row][col]['card_face_up'], cardIndex);
            $scope.cards[row][col]['card_face_up'] = !$scope.cards[row][col]['card_face_up'];
        };

        var isCardDisabled = function(row, col) {
            return $scope.cards[row][col]['card_disabled'];
        };

        var isCardFaceUp = function(row, col) {
            return $scope.cards[row][col]['card_face_up'];
        };

        var rewardFoundMatch = function() {
            $scope.starsEarned += 5;
            disableClickedCards();
            determineEndOfGame();
            if (!$scope.gameOver) {
                var foundWordLocation = getFoundWordLocation();
                vocabData.saveFoundMatch(gameLogic.getMemoryGameId(), foundWordLocation);
            }
            gameLogic.clearClickedCards();
        };

        var determineEndOfGame = function () {
            var numCards = gameLogic.getBoardHeight() * gameLogic.getBoardWidth();
            if (gameLogic.getTotalDisabledCards() === numCards) {
                $scope.gameOver = true;
                vocabData.completeActivity(numCards, resourceDeploymentId, studentAssignmentId, gameLogic.getMemoryGameId());
            }
        };

        $scope.restartGame = function () {
            if ($scope.gameOver) return;

            vocabData.disableCurrentGameOnRestart(gameLogic.getMemoryGameId()).then(resetGame);
        };

        var resetGame = function () {
            gameLogic.resetGameBoard();

            $scope.cards = [];
            $scope.starsEarned = 0;
            vocabData.getVocabData(resourceDeploymentId).then(initCardMatrix);
        };

        $scope.displayActivityReward = function () {
            window.location.replace("/main/ActivityReward/id/" + resourceDeploymentId);
        };

        $scope.quitToReadingRoom = function () {
            window.location.replace("/main/ReadingBookRoom");
        };

    }]);
}());