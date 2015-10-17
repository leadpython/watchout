// start slingin' some d3 here.
var gameParameters = {
  enemyCount: 5,
  boardWidth: 1280,
  boardHeight: 720,
  difficultyLevel: 0.5 
}

var Enemy = function(id) {
  this.id = id;
  this.x = Math.random() * gameParameters.boardWidth;
  this.y = Math.random() * gameParameters.boardHeight;
  this.collision = false;
};
Enemy.prototype.setNewPosition =  function() {
  this.x = Math.random()* gameParameters.boardWidth;
  this.y = Math.random() * gameParameters.boardHeight;
};

var gameStats = {
  score: 0,
  highscore: 0,
  collisionsCounter: 0
};

var enemiesData = [];
for (var i = 0; i < gameParameters.enemyCount; i++) {
  enemiesData.push(new Enemy(i));
}

var playerData = {
  x: 0.5 * gameParameters.boardWidth,
  y: 0.5 * gameParameters.boardHeight,
  radius: 10
}

var board = d3.select('body').selectAll('svg')
            .attr('width', gameParameters.boardWidth)
            .attr('height', gameParameters.boardHeight);

var playerAsSmiley = d3.select('.board').selectAll('svg').data([['smiley', '/Users/student/Desktop/2015-10-watchout/client/smiley.png'], ['sad', '/Users/student/Desktop/2015-10-watchout/client/smiley_sad.png']]).enter()
              .append('defs')
              .append('pattern')
              .attr('id', function(d) { return d[0]; })
              .attr('patternUnits', 'objectBoundingBox')
              .attr('x', 0)
              .attr('y', 0)
              .attr('height', 20)
              .attr('width', 20)
              .append('image')
              .attr('xlink:href', function(d) { return d[1]; })
              .attr('x', 0)
              .attr('y', 0)
              .attr('height', 20)
              .attr('width', 20)

var player = d3.select('.board').selectAll('svg').data([playerData]).enter()
             .append('svg:circle')
             .attr('class', 'player')
             .style('fill', 'url(#smiley)')
             .attr('r', function(d) { return d.radius; })
             .attr('fill', '#ff6600')
             .attr('transform', function(d) { return 'translate('+ d.x + ',' + d.y + ')'; });

var drag = d3.behavior.drag()
           .on('drag', function() {
            playerData.x = Math.min(gameParameters.boardWidth, Math.max(0, d3.event.x));
            playerData.y = Math.min(gameParameters.boardHeight, Math.max(0, d3.event.y));
            player.attr('transform', 'translate('+ playerData.x + ',' + playerData.y + ')');
})
player.call(drag);

var detectCollision = function(enemy, scoreUpdatesCB) {
  var enemyId = Number(enemy.attr('id'));
  var radiusSum = Number(enemy.attr('r')) + playerData.radius;
  var xDiff = Number(enemy.attr('cx')) - playerData.x;
  var yDiff = Number(enemy.attr('cy')) - playerData.y;
  var distance = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
  if (distance < radiusSum) {
    player.style('fill', 'url(#sad)');
    if(!enemiesData[enemyId].collision) {
      enemiesData[enemyId].collision = true;
      gameStats.collisionsCounter++;
    }
    scoreUpdatesCB();
  }
  if (distance > radiusSum) {
    if (enemiesData[enemyId].collision) {
      player.style('fill', 'url(#smiley)');
      enemiesData[enemyId].collision = false;      
    }
  }
};

var updateScoresOnCollision = function() {
  if (gameStats.score > gameStats.highscore) {
    gameStats.highscore = gameStats.score;
  }
  gameStats.score = 0;
  d3.select('.highscoreValue').text(gameStats.highscore);
  d3.select('.collisionsCounter').text(gameStats.collisionsCounter);
};

var tweenWithCollisionDetection = function() {
  var enemy = d3.select(this);
  var startPos = {
    x: Number(enemy.attr('cx')),
    y: Number(enemy.attr('cy'))
  };
  var enemyId = Number(enemy.attr('id'));
  enemiesData[enemyId].collision = false;
  var endPos = {
    x: Math.random()* gameParameters.boardWidth,
    y: Math.random() * gameParameters.boardHeight 
  };
  return function(t) {
    enemiesData[enemyId].x = startPos.x + (endPos.x - startPos.x)*t;
    enemiesData[enemyId].y = startPos.y + (endPos.y - startPos.y)*t;
    var enemyNextPos = {
      x: startPos.x + (endPos.x - startPos.x)*t, 
      y: startPos.y + (endPos.y - startPos.y)*t
    }
    enemy.attr('cx', enemyNextPos.x)
         .attr('cy', enemyNextPos.y)
    detectCollision(enemy, updateScoresOnCollision);
  }
}
var enemiesAsAsteroids = d3.select('.board').selectAll('svg').data([0]).enter()
              .append('defs')
              .append('pattern')
              .attr('id', 'image')
              .attr('patternUnits', 'objectBoundingBox')
              .attr('x', 0)
              .attr('y', 0)
              .attr('height', 20)
              .attr('width', 20)
              .append('image')
              .attr('xlink:href', '/Users/student/Desktop/2015-10-watchout/client/asteroid.png')
              .attr('x', 0)
              .attr('y', 0)
              .attr('height', 20)
              .attr('width', 20)
var enemies = d3.select('.board').selectAll('svg').data(enemiesData).enter()
              .append('svg:circle')
              .attr('class', 'enemy')
              .style('fill', 'url(#image)')
              .attr('r', 0)
              .transition()
              .duration(1000 / gameParameters.difficultyLevel)
              .attr('r', 10)
              .attr('id', function(d) { return d.id; })
              .attr('cx', function(d) { return d.x; })
              .attr('cy', function(d) { return d.y; });



setInterval(function() {
  var enemies = d3.selectAll('.enemy').data(enemiesData);
  enemies.transition()
         .duration(1000 / gameParameters.difficultyLevel)
         .tween('custom', tweenWithCollisionDetection);
}, 1000 / gameParameters.difficultyLevel);

setInterval(function() {
  gameStats.score++;
  d3.select('.currentscoreValue').text(gameStats.score);
}, 20);