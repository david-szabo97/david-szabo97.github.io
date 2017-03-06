// Initialize canvas
var canvas = document.getElementById("canvas");
var ctx    = canvas.getContext("2d");

canvas.width = canvas.style.width = document.body.offsetWidth;
canvas.height = canvas.style.height = document.body.offsetHeight;

// Constants
const DRAW_OFFSET  = {x: canvas.width / 2, y: canvas.height / 2};

const POLYGON_SIZE = canvas.height / 3;
const FILL_SIZE    = POLYGON_SIZE  / 3;

const TEXTS        = ["STR", "VIT", "LUK", "INT", "DEX", "AGI"];
const NODE_COUNT   = TEXTS.length;

const ARROW_WIDTH  = 25;
const ARROW_HEIGHT = 50;

// State
var START_STAT = 5;
var STATS      = new Array(NODE_COUNT).fill(START_STAT);
var MAX_STAT   = START_STAT * 2 - 1;

// Stores the arrows
var ARROWS = [];

// Stores the vertices of the graph
var POLYGON_VERTICES = [];
var FILLING_VERTICES = [];

// Mouse position
var MOUSE_X = 0;
var MOUSE_Y = 0;

// Precalculate graph vertices
/** 
 * Explanation of stepOffset
 * 
 *    ^
 *    |
 *    |
 * ---+----> cos(0°) goes this way
 *    |
 *  
 * Because of this we need to rotate it by 90° anti-clockwise
 */
function calculatePolygonVertices() {
  POLYGON_VERTICES = [];

  let step = (Math.PI * 2) / NODE_COUNT;
  let stepOffset = -Math.PI / 2;
  for (let i = 0; i < NODE_COUNT; i++) {
    let cos = Math.cos(step * i + stepOffset);
    let sin = Math.sin(step * i + stepOffset);
    let x = cos * POLYGON_SIZE;
    let y = sin * POLYGON_SIZE; 
    POLYGON_VERTICES.push(new Point2D(x, y));
  }
}
calculatePolygonVertices();

// Precalculate arrows' vertices
function calculateArrowsVertices() {
  ARROWS = [];

  let step = (Math.PI * 2) / NODE_COUNT;
  for (let i = 0; i < NODE_COUNT; i++) {
    let center = POLYGON_VERTICES[i].multiply(new Point2D(1.1, 1.1));
    let rotation = step * i;

    // Create an arrow =)
    let vertices = [
      new Point2D( 0          , -ARROW_HEIGHT / 2), // Top    center
      new Point2D(-ARROW_WIDTH,  ARROW_HEIGHT / 2), // Bottom left
      new Point2D( ARROW_WIDTH,  ARROW_HEIGHT / 2)  // Bottom right
    ];

    // Let's rotate it then translate it to its center
    vertices = vertices.map((v) => v.rotate(rotation).add(center));

    ARROWS.push(vertices);
  }
}
calculateArrowsVertices();

function calculateFillingVertices() {
  // Calculate the remaining space between the two points
  let fullGap = POLYGON_SIZE - FILL_SIZE;

  FILLING_VERTICES = POLYGON_VERTICES.map((v, i) => {
    let ratio = (fullGap * STATS[i] / MAX_STAT) / fullGap;
    return v.multiply(new Point2D(ratio, ratio));
  });
}
calculateFillingVertices();

function render() {
  ctx.fillStyle = ctx.strokeStyle = "#bbc2c5";
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Add some offset so we can see the polygon clearly
  ctx.translate(DRAW_OFFSET.x, DRAW_OFFSET.y);
  
  /* Draw polygon */
  strokePolygon(ctx, POLYGON_VERTICES);

  /* Draw dividers */
  POLYGON_VERTICES.forEach((v) => {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(v.x, v.y);
    ctx.stroke();
  });

  /* Draw arrows + text */
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.font = "bold 14px Helvetica";
  
  ARROWS.forEach((vertices, i) => {
    // Arrow
    ctx.fillStyle = "#c5d1f1";
    ctx.save();

    // Add shadow
    ctx.shadowColor = '#555';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = ctx.shadowOffsetY = 2;

    // Draw the arrow polygon (triangle)
    fillPolygon(ctx, vertices);
    ctx.restore();
    
    // Text
    let center = triangleCenter(vertices); // Calculate the centroid of the arrow
    ctx.fillStyle = "#304065";
    ctx.fillText(TEXTS[i] + " " + STATS[i], center.x, center.y);
  });

  /* Filling */
  ctx.fillStyle = "#7b96cd";

  // Draw the filling!
  fillPolygon(ctx, FILLING_VERTICES);

  // Let's go back to the start point
  ctx.restore();

  // Let's render again!
  window.requestAnimationFrame(render);
}

// Mouse movement tracking
function mousemove(e) {
  MOUSE_X = e.pageX - DRAW_OFFSET.x;
  MOUSE_Y = e.pageY - DRAW_OFFSET.y;
}
canvas.addEventListener("mousemove", mousemove);

// Stat logic
function mouseclick(e) {
  let statsLength = STATS.length;

  ARROWS.forEach((vertices, i) => {
    if (isInPoly(vertices, new Point2D(MOUSE_X, MOUSE_Y))) {
      if (STATS[i] < MAX_STAT) {
        // Increase clicked stat
        STATS[i]++;

        // Decrease opposite stat
        STATS[(i+3)%statsLength]--;

        calculateFillingVertices();
      }
    }
  });
}
canvas.addEventListener("click", mouseclick);

render();