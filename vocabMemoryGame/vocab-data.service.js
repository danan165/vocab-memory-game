(function () {
    "use strict";

    var app = angular.module("vocabMemoryGame");

    app.service('vocabData', function ($http) {
        this.getVocabData = function (resourceDeploymentId) {
            return $http({
                method: 'GET',
                url: "/api/vocab-memory-game/resource-deployment-id/" + resourceDeploymentId
            }).then(function (response) {
                return  response['data'];
            });
        };

        this.completeActivity = function (numCards, resourceDeploymentId, studentAssignmentId, memoryGameId) {
            var correctMatches = numCards / 2;
            var RecordStudentVocabMemoryGameCompletionUrl = "/main/RecordStudentVocabMemoryGameCompletion/correct_matches/" + correctMatches + "/resource_deployment_id/" + resourceDeploymentId + "/student-assignment-id/" + studentAssignmentId + "/memory_game_id/" + memoryGameId;

            return $http({
                method: 'GET',
                url: RecordStudentVocabMemoryGameCompletionUrl
            }).then(function (response) {
                return  response['data'];
            });
        };

        this.saveFoundMatch = function (memoryGameId, foundWordLocation) {
            return $http({
                method: 'POST',
                url: "/api/vocab-memory-game/matches/id/" + memoryGameId + "/location/" + foundWordLocation
            }).then(function (response) {
                return  response['data'];
            });
        };

        this.disableCurrentGameOnRestart = function (memoryGameId) {
            return $http({
                method: 'PUT',
                url: "/api/vocab-memory-game/memory-game-id/" + memoryGameId
            }).then(function (response) {
                return  response['data'];
            });
        };

    });
}());