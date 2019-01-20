const db = require('./db');
const k = 30; // factor by which elo is changed

function playerExists(player, callback) {
    db.query('SELECT * FROM player WHERE name = ?', [player], function(err, results){
        if (err) {
            callback (err, null);
        } else if(results && results.length){
            callback(err, true);
        } else {
            callback(err, false);
        }
    });
}

function addPlayer(player) {
    db.query("INSERT INTO player (name) VALUES (?)", [player], function(err, result) {
        if (err) throw err;
    });
}

// returns the player's rating as a callback
function getPlayerRating(player, callback) {
    playerExists(player, function(err, existStatus) {
        if(err) throw err;
        console.log(player + " " + existStatus);
        if(!existStatus) {
            addPlayer(player);
        };
        db.query('SELECT elo FROM player WHERE name = ?', [player], function(err, results) {
            if (err) {
                callback (err, null);
            } else {
                console.log(results);
                callback (null, results);
            }
        });
    });
    
}

// updates the player's rating with a new rating
function updatePlayerRating(player, newRating) {
    db.query('UPDATE player SET elo = ? WHERE name = ?', [newRating, player], function(err, results) {
        if (err) throw err;
    });
}

// adds 1 to wins for the winner and adds 1 to losses for the loser
function updateWinsLosses(winner, loser) {
    db.query('UPDATE player SET wins = wins + 1 WHERE name = ?', [winner], function(err, results) {
        if (err) throw err;
    });
    db.query('UPDATE player SET losses = losses + 1 WHERE name = ?', [loser], function(err, results) {
        if (err) throw err;
    });
}

// returns the expected probability of player 1 beating player 2
function getProbability(rating1, rating2, callback) {
    callback(null, 1.0 * 1.0 / (1 + 1.0 * Math.pow(10, 1.0 * (rating1 - rating2) / 400)));
}

// updates the database with updated wins, losses, and elo for both players that participated in the match
function updateLeaderboard(winner, loser) {
    getPlayerRating(winner, function(err, winnerResults) {
        if (err) throw err;
        const winnerRating = winnerResults[0].elo;
        getPlayerRating(loser, function(err, loserResults) {
            if (err) throw err;
            const loserRating = loserResults[0].elo;
            getProbability(winnerRating, loserRating, function(err, winnerProbResult) {
                if (err) throw err;
                const winnerProbability = winnerProbResult;
                getProbability(loserRating, winnerRating, function(err, loserProbResult) {
                    if (err) throw err;
                    const loserProbability = loserProbResult;
                    const newWinnerRating = winnerRating + k * ( 1 - winnerProbability);
                    const newLoserRating = loserRating + k * (0 - loserProbability);
                    updatePlayerRating(winner, newWinnerRating);
                    updatePlayerRating(loser, newLoserRating);
                    updateWinsLosses(winner, loser);
                    console.log("Succesfully updated ladder");
                });
            });
        });

    });
    
};

module.exports = updateLeaderboard;