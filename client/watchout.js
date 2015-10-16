// start slingin' some d3 here.
var gameParameters = {
  enemyCount: 30,
  boardWidth: 700,
  boardHeight: 450,
  difficultyLevel: 1  
}

var Enemy = function(id) {
  this.id = id;
  this.x = Math.random();
  this.y = Math.random();
};
Enemy.prototype.setNewPosition =  function() {
  this.x = Math.random();
  this.y = Math.random();
};

var gameStats = {
  score: 0,
  bestScore: 0
};
var enemiesData = [];
for (var i = 0; i < gameParameters.enemyCount; i++) {
  enemiesData.push(new Enemy(i));
}

var board = d3.select('body').selectAll('svg')
            .attr('width', gameParameters.boardWidth)
            .attr('height', gameParameters.boardHeight);

var enemies = d3.select('.board').selectAll('svg').data(enemiesData).enter()
      .append('svg:circle')
      .attr('class', 'enemy')
      .attr('r', 10);

var setEnemiesPosition = function(enemies) {
  enemies.transition()
         .duration(1000 / gameParameters.difficultyLevel)
         .attr('cx', function(d) { return d.x * gameParameters.boardWidth; })
         .attr('cy', function(d) { return d.y * gameParameters.boardHeight; });  
};

setEnemiesPosition(enemies);

setInterval(function() {
  enemiesData.forEach(function(enemy) { enemy.setNewPosition(); });
  enemies.data(enemiesData);
  setEnemiesPosition(enemies);
}, 1000 / gameParameters.difficultyLevel);

var updateScore = function(newScore) {
  gameStats.score = newScore;
};

