// Determines whether point is in the polygon or not
// Source: http://stackoverflow.com/a/2922778/1906108
// Thank you nirg!
function isInPoly(vertices, point) {
  var nvert = vertices.length;
  var i, j, c = 0;
  for (i = 0, j = nvert-1; i < nvert; j = i++) {
    if ( ((vertices[i].y>point.y) != (vertices[j].y>point.y)) &&
    (point.x < (vertices[j].x-vertices[i].x) * (point.y-vertices[i].y) / (vertices[j].y-vertices[i].y) + vertices[i].x) )
      c = !c;
  }
  return c;
}

function triangleCenter(vertices) {
  // Calculate the sum x and y of the vertices
  var sum = vertices.reduce((acc, val) => ({x: acc.x + val.x, y: acc.y + val.y}), {x: 0, y: 0});

  return new Point2D(sum.x / 3, sum.y / 3);
}

function drawPolygon(ctx, vertices) {
  ctx.beginPath();
  vertices.forEach((v) => ctx.lineTo(v.x, v.y))
  ctx.closePath();
}

function strokePolygon(ctx, vertices) {
  drawPolygon(ctx, vertices);
  ctx.stroke();
}

function fillPolygon(ctx, vertices) {
  drawPolygon(ctx, vertices);
  ctx.fill();
}