(function() {
    'use strict';

    var app = angular.module('memoryGameManager');

    app.service('GameWords', function ($http) {
        var originalGameWords;
        var memoryGameId;
        var addWords = [];

        var initializeGameWords = function (gameWords, memoryGameIdVal) {
            originalGameWords = angular.copy(gameWords);
            memoryGameId = memoryGameIdVal;
        };

        var sendGameEdits = function (kidsBookId, boardHeight, boardWidth, gameWords) {
            var postInfo = {
                board_height: boardHeight,
                game_words: gameWords,
                board_width: boardWidth,
                id: Number(kidsBookId)
            };

            return $http({
                method: 'post',
                url: "/kids-cms/api/resource/save_game_edits",
                data: {
                    game_data: postInfo
                }
            }).then(function (response) {
                alert("Game Edits Successfully Saved!");
                return  response['data'];
            });
        };

        var saveGameEdits = function (kidsBookId, boardHeight, boardWidth, gameWords) {
            var boardSize = boardHeight * boardWidth;

            for (var randomIndices = [], i = 0; i < boardSize; ++i) randomIndices[i] = i;

            var temp, current, top = randomIndices.length;

            if(top) while(--top) {
                current = Math.floor(Math.random() * (top + 1));
                temp = randomIndices[current];
                randomIndices[current] = randomIndices[top];
                randomIndices[top] = temp;
            }

            var randomIndicesIndex = 0;
            var gameWordsIndex = 0;
            gameWords.forEach(function (element) {
                if (element['game_word']) {
                    element['word_location'] = randomIndices[randomIndicesIndex];
                    randomIndicesIndex += 1;
                    element['definition_location'] = randomIndices[randomIndicesIndex];

                    if (element['game_word'] === true && originalGameWords[gameWordsIndex]['game_word'] === false) {
                        addWords.push({
                            book_word_info_id: Number(element['book_word_info_id']),
                            word_location: Number(element['word_location']),
                            definition_location: Number(element['definition_location'])
                        });
                    }

                    randomIndicesIndex += 1;
                }
                gameWordsIndex += 1;
            });

            sendGameEdits(kidsBookId, boardHeight, boardWidth, addWords);
        };

        var activateGame = function (kidsBookId) {
            var postInfo = {
                id: Number(kidsBookId),
                memory_game_id: memoryGameId
            };

            return $http({
                method: 'post',
                url: "/kids-cms/api/resource/activate_game",
                data: {
                    game_data: postInfo
                }
            }).then(function (response) {
                alert("Game Successfully Activated!");
                return  response['data'];
            });
        };

        var removeGameDraft = function (kidsBookId) {
            var postInfo = {
                id: Number(kidsBookId),
                memory_game_id: memoryGameId
            };

            return $http({
                method: 'post',
                url: "/kids-cms/api/resource/remove_game_draft",
                data: {
                    game_data: postInfo
                }
            }).then(function (response) {
                alert("Game Draft Successfully Removed!");
                return  response['data'];
            });
        };

        var archiveGame = function (kidsBookId) {
            var postInfo = {
                id: Number(kidsBookId),
                memory_game_id: memoryGameId
            };

            return $http({
                method: 'post',
                url: "/kids-cms/api/resource/archive_game",
                data: {
                    game_data: postInfo
                }
            }).then(function (response) {
                alert("Game Successfully Archived!");
                return  response['data'];
            });
        };

        return {
            initializeGameWords: initializeGameWords,
            saveGameEdits: saveGameEdits,
            activateGame: activateGame,
            removeGameDraft: removeGameDraft,
            archiveGame: archiveGame
        };
    });
}());