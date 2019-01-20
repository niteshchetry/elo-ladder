const express = require('express');
const app = express();
//const db = require('./db');
const updateLeaderboard = require('./updateLeaderboard.js');

app.set('views', __dirname + '/views')
app.set('view engine', 'pug');

app.get('/', function(req, res) {
    res.json([{name: "Devlove", elo: 1000, wins: 2, losses: 0}, 
        {name: "Fjhkim", elo: 1000, wins: 0, losses: 2}]);
    /*
    db.query("SELECT * FROM player ORDER BY elo DESC", function(err, result){
        if (err) throw err;
        res.json(result);
        res.render('index', {ladder: result});
            const winner = req.query.winner;
            const loser = req.query.loser;
            if(winner != null && loser != null) {
                updateLeaderboard(winner, loser);
            }    
    });
    */
});

app.listen(3003, () => {
    console.log("Server is up and listening on 3003...")
})
