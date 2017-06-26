// bflower - Test Technique

const nodes = require('./datas/nodes.js');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('views', './views');
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({
    extended: true
}));

// Routes
app.get('/', function (req, res) {
	res.render("index");
});

app.post('/', function (req, res) {

	const postParams = req.body;

	const startNode = postParams.start;
	const endNode = postParams.end;
	var isArrived = false;

	var currentNode  = startNode;

	var visitedNodes = [startNode];
	var distance = 0;

	try{
		while (!isArrived){
			var nextNodeInfos = getNextNodeInfos(currentNode);
			var nextNode = nextNodeInfos[0];
			var nextNodeDistance = nextNodeInfos[1];

			if(nextNode === undefined){
				isArrived = true;
				visitedNodes.push("ERROR");
			} else if(nextNode == endNode){
				visitedNodes.push(endNode);
				distance += nextNodeDistance;
				isArrived = true;
			}else{
				visitedNodes.push(nextNode);
				distance += nextNodeDistance;
			}
			currentNode = nextNode;
		}
	}catch(e){
		console.log(e.message);
	}

	/* getNextNodeInfos tests every possible way for a specified node.
	* For each possible next node, we test if it has already been visited.
	* If not, we test if its distance is shorter than the shortest already found.
	* If so, it's our next node
	*
	* currentNode (integer)
	* return (array) : the nearest next node and its distance
	*/
	function getNextNodeInfos(currentNode){
		var nearestNode;
		var shortestDistance = 999999999;

		Object.keys(nodes[currentNode]).forEach(function(node){
			var nodeAlreadyVisited = false;
			for(i = 0; i < visitedNodes.length; i++){
				if(visitedNodes[i] == node){
					nodeAlreadyVisited = true;
				}
			}

			if(!nodeAlreadyVisited && nodes[currentNode][node] <= shortestDistance){
				shortestDistance = nodes[currentNode][node];
				nearestNode = node;
			}
		});

		return [nearestNode, shortestDistance];
	}

	res.render("result", {start : startNode, end : endNode, visitedNodes : visitedNodes, distance : distance});
});

app.listen(3000, function () {
	console.log('bflower test app is launched on port 3000');
});

