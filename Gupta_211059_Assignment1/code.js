var gl;
var mMatrix = mat4.create();
var aPositionLocation;
var uColorLoc;
var uMMatrixLocation;
var mStack = [];
var triangle2Buf;
var triangle2IndexBuf;
var mode = 's';

const vertexShaderCode = `#version 300 es
in vec2 aPosition;
uniform mat4 uMMatrix;

void main() {
  gl_Position = uMMatrix*vec4(aPosition,0.0,1.0);
  gl_PointSize = 10.0;
}`;

const fragShaderCode = `#version 300 es
precision mediump float;
out vec4 fragColor;
uniform vec4 color;

void main() {
  fragColor = color;
}`;



const pushMatrix = (stack, m) => {
  //necessary because javascript only does shallow push
  const copy = mat4.create(m);
  stack.push(copy);
}

const popMatrix = (stack) => {
  if (stack.length > 0) return stack.pop();
  else console.log("stack has no matrix to pop!");
}

function degToRad(degrees){
  return (degrees * Math.PI) / 180;
}

function vertexShaderSetup(vertexShaderCode) {
  shader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(shader, vertexShaderCode);
  gl.compileShader(shader);
  // Error check whether the shader is compiled correctly
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

function fragmentShaderSetup(fragShaderCode) {
  shader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(shader, fragShaderCode);
  gl.compileShader(shader);
  // Error check whether the shader is compiled correctly
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}
// drawing a square
function initSquareBuffer() {
  // buffer for point locations
  const sqVertices = new Float32Array([
      0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5,
  ]);
  sqVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, sqVertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, sqVertices, gl.STATIC_DRAW);
  sqVertexPositionBuffer.itemSize = 2;
  sqVertexPositionBuffer.numItems = 4;

  // buffer for point indices
  const sqIndices = new Uint16Array([0, 1, 2, 0, 2, 3]);
  sqVertexIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sqVertexIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sqIndices, gl.STATIC_DRAW);
  sqVertexIndexBuffer.itemsize = 1;
  sqVertexIndexBuffer.numItems = 6;
}

function drawSquare(color, mMatrix) {
  gl.uniformMatrix4fv(uMMatrixLocation, false, mMatrix);

  // buffer for point locations
  gl.bindBuffer(gl.ARRAY_BUFFER, sqVertexPositionBuffer);
  gl.vertexAttribPointer(aPositionLocation, sqVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  // buffer for point indices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sqVertexIndexBuffer);
  gl.uniform4fv(uColorLoc, color);

  // now draw the square
  // show the solid view
  if (mode === 's') {
      gl.drawElements(gl.TRIANGLES, sqVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
  }
  // show the wireframe view
  else if (mode === 'w') {
      gl.drawElements(gl.LINE_LOOP, sqVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
  }
  // show the point view
  else if (mode === 'p') {
      gl.drawElements(gl.POINTS, sqVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
  }    
}

function initTriangle2Buffer() {
  const triangle2Vertices = new Float32Array([
      0.0, 0.0,
      -0.5, -0.866,
      0.5, -0.866]
  );
  triangle2Buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangle2Buf);
  gl.bufferData(gl.ARRAY_BUFFER, triangle2Vertices, gl.STATIC_DRAW);
  triangle2Buf.itemSize = 2;
  triangle2Buf.numItems = 3;

  const triangle2Indices = new Uint16Array([0, 1, 2]);
  triangle2IndexBuf = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangle2IndexBuf);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangle2Indices, gl.STATIC_DRAW);
  triangle2IndexBuf.itemsize = 1;
  triangle2IndexBuf.numItems = 3;
}

function drawTriangle2(color, mMatrix) {
  gl.uniformMatrix4fv(uMMatrixLocation, false, mMatrix);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, triangle2Buf);
  gl.vertexAttribPointer(aPositionLocation, triangle2Buf.itemSize, gl.FLOAT, false, 0, 0);
  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangle2IndexBuf);
  gl.uniform4fv(uColorLoc, color);
  
  if (mode === 's') {
      gl.drawElements(gl.TRIANGLES, triangle2IndexBuf.numItems, gl.UNSIGNED_SHORT, 0);
  }
  else if (mode === 'w') {
      gl.drawElements(gl.LINE_LOOP, triangle2IndexBuf.numItems, gl.UNSIGNED_SHORT, 0);
  }
  else if (mode === 'p') {
      gl.drawElements(gl.POINTS, triangle2IndexBuf.numItems, gl.UNSIGNED_SHORT, 0);
  }
}

function initRaysBuffer() {
  const RaysVertices = new Float32Array([
      0.0, 0.0,
      -0.5, -0.866,
      0.5, -0.866]
  );
  Rays2Buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, Rays2Buf);
  gl.bufferData(gl.ARRAY_BUFFER, RaysVertices, gl.STATIC_DRAW);
  Rays2Buf.itemSize = 2;
  Rays2Buf.numItems = 3;

  const RaysIndices = new Uint16Array([0, 1, 2]);
  RaysIndexBuf = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, RaysIndexBuf);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, RaysIndices, gl.STATIC_DRAW);
  RaysIndexBuf.itemsize = 1;
  RaysIndexBuf.numItems = 3;
}

function drawRaysBuffer(color, mMatrix) {
  gl.uniformMatrix4fv(uMMatrixLocation, false, mMatrix);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, Rays2Buf);
  gl.vertexAttribPointer(aPositionLocation, Rays2Buf.itemSize, gl.FLOAT, false, 0, 0);
  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, RaysIndexBuf);
  gl.uniform4fv(uColorLoc, color);
  
  if (mode === 's') {
      gl.drawElements(gl.TRIANGLES, RaysIndexBuf.numItems, gl.UNSIGNED_SHORT, 0);
  }
  else if (mode === 'w') {
      gl.drawElements(gl.LINE_LOOP, RaysIndexBuf.numItems, gl.UNSIGNED_SHORT, 0);
  }
  else if (mode === 'p') {
      gl.drawElements(gl.POINTS, RaysIndexBuf.numItems, gl.UNSIGNED_SHORT, 0);
  }
}
// drawing a triangle
function initTriangleBuffer() {
  // buffer for point locations
  const triangleVertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
  triangleBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuf);
  gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW);
  triangleBuf.itemSize = 2;
  triangleBuf.numItems = 3;

  // buffer for point indices
  const triangleIndices = new Uint16Array([0, 1, 2]);
  triangleIndexBuf = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleIndexBuf);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangleIndices, gl.STATIC_DRAW);
  triangleIndexBuf.itemsize = 1;
  triangleIndexBuf.numItems = 3;
}

function drawTriangle(color, mMatrix) {
  gl.uniformMatrix4fv(uMMatrixLocation, false, mMatrix);

  // buffer for point locations
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuf);
  gl.vertexAttribPointer(aPositionLocation, triangleBuf.itemSize, gl.FLOAT, false, 0, 0);

  // buffer for point indices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleIndexBuf);
  gl.uniform4fv(uColorLoc, color);

  // now draw the triangle
  if (mode === 's') {
      gl.drawElements(gl.TRIANGLES, triangleIndexBuf.numItems, gl.UNSIGNED_SHORT, 0);
  }
  else if (mode === 'w') {
      gl.drawElements(gl.LINE_LOOP, triangleIndexBuf.numItems, gl.UNSIGNED_SHORT, 0);
  }
  else if (mode === 'p') {
      gl.drawElements(gl.POINTS, triangleIndexBuf.numItems, gl.UNSIGNED_SHORT, 0);
  }
}


// drawing a circle
function initCircleBuffer() {
  // buffer for point locations
  const positions = [0, 0]; // take the center of the circle
  
  var delTheta = (Math.PI*2)/360;
  for (var i = 0; i < 360; i++) {
    const angle = delTheta * i;
    const x = Math.cos(angle);
    const y = Math.sin(angle);
    positions.push(x, y);
  }

  const circleVertices = new Float32Array(positions);
  circleBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, circleBuf);
  gl.bufferData(gl.ARRAY_BUFFER, circleVertices, gl.STATIC_DRAW);
  circleBuf.itemSize = 2;
  circleBuf.numItems = 360 + 1;

  // Create index buffer
  const indices = [0, 1, 360];
  for (var i = 0; i < 360; i++) {
    indices.push(0, i, i + 1);
  }

  // buffer for point indices
  const circleIndices = new Uint16Array(indices);
  circleIndexBuf = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, circleIndexBuf);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, circleIndices, gl.STATIC_DRAW);
  circleIndexBuf.itemsize = 1;
  circleIndexBuf.numItems = indices.length;
}

function drawCircle(color, mMatrix) {
  gl.uniformMatrix4fv(uMMatrixLocation, false, mMatrix);

  // buffer for point locations
  gl.bindBuffer(gl.ARRAY_BUFFER, circleBuf);
  gl.vertexAttribPointer(aPositionLocation, circleBuf.itemSize, gl.FLOAT, false, 0, 0);

  // buffer for point indices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, circleIndexBuf);
  gl.uniform4fv(uColorLoc, color);

  // now draw the circle
  if (mode === 's') {
      gl.drawElements(gl.TRIANGLES, circleIndexBuf.numItems, gl.UNSIGNED_SHORT, 0);
  }
  else if (mode === 'w') {
      gl.drawElements(gl.LINE_LOOP, circleIndexBuf.numItems, gl.UNSIGNED_SHORT, 0);
  }
  else if (mode === 'p') {
      gl.drawElements(gl.POINTS, circleIndexBuf.numItems, gl.UNSIGNED_SHORT, 0);
  }
}

function initShaders() {
  shaderProgram = gl.createProgram();

  var vertexShader = vertexShaderSetup(vertexShaderCode);
  var fragmentShader = fragmentShaderSetup(fragShaderCode);

  // attach the shaders
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  //link the shader program
  gl.linkProgram(shaderProgram);

  // check for compilation and linking status
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.log(gl.getShaderInfoLog(vertexShader));
    console.log(gl.getShaderInfoLog(fragmentShader));
  }

  //finally use the program.
  gl.useProgram(shaderProgram);

  return shaderProgram;
}

function initGL(canvas) {
  try {
    gl = canvas.getContext("webgl2"); // the graphics webgl2 context
    gl.viewportWidth = canvas.width; // the width of the canvas
    gl.viewportHeight = canvas.height; // the height
  } catch (e) {}
  if (!gl) {
    alert("WebGL initialization failed");
  }
}

////////////////////////////////////////////////////////////////////////
// The main drawing routine, but does nothing except clearing the canvas
//

function drawLand(){
  mat4.identity(mMatrix);
  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.65, -0.6, 0.0]);
  mMatrix = mat4.rotate(mMatrix, degToRad(15), [0.0, 0.0, 1.0]);
  mMatrix = mat4.scale(mMatrix,[1.0,1.0,1.0]);
  mMatrix = mat4.rotate(mMatrix, degToRad(-15), [0.0, 0.0, 1.0]);
  color = [0.2, 1.0, 0.3, 0.7];
  drawSquare(color,mMatrix);
  mMatrix = popMatrix(mStack);
  
  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.2, -0.59, 0.0]);
  mMatrix = mat4.rotate(mMatrix, degToRad(18.5), [0.0, 0.0, 1.0]);
  mMatrix = mat4.scale(mMatrix,[0.8,1.0,1.0]);
  mMatrix = mat4.rotate(mMatrix, degToRad(-15), [0.0, 0.0, 1.0]);
  color = [0.467, 0.690, 0.278, 1.0];
  drawSquare(color,mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [1.8, -1.0462, 0.0]);
  mMatrix = mat4.rotate(mMatrix, degToRad(153.55), [0.0, 0.0, 1.0]);
  mMatrix = mat4.scale(mMatrix,[3.0,1.5,1.0]);
  mMatrix = mat4.rotate(mMatrix, degToRad(-45), [0.0, 0.0, 1.0]);
  color = [0.2, 1.0, 0.3, 0.7];
  drawSquare(color,mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.0, 0.18, 0.0]);
  mMatrix = mat4.scale(mMatrix,[3.0,0.07,1.0]);
  color = [0.2, 1.0, 0.3, 0.7];
  drawSquare(color,mMatrix);
  mMatrix = popMatrix(mStack);

}
function drawWater(){
  mat4.identity(mMatrix);
  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.0, 0.0, 0.0]);
  mMatrix = mat4.scale(mMatrix,[3.0,0.32,1.0]);
  color = [0.192, 0.388, 1, 1.0];
  drawSquare(color,mMatrix);
  mMatrix = popMatrix(mStack);
  
  //waves
  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.6, -0.1, 0.0]);
  mMatrix = mat4.scale(mMatrix,[0.3,0.005,1.0]);
  color = [0.8, 0.8, 0.8, 1.0];
  drawSquare(color,mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.7, 0.05, 0.0]);
  mMatrix = mat4.scale(mMatrix,[0.3,0.005,1.0]);
  color = [0.8, 0.8, 0.8, 1.0];
  drawSquare(color,mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.0, -0.05, 0.0]);
  mMatrix = mat4.scale(mMatrix,[0.3,0.005,1.0]);
  color = [0.8, 0.8, 0.8, 1.0];
  drawSquare(color,mMatrix);
  mMatrix = popMatrix(mStack);
}

function drawTrees(){
  mat4.identity(mMatrix);
  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.35, 0.3, 0.0]);
  mMatrix = mat4.scale(mMatrix,[0.03,0.25,1.0]);
  color = [0.463, 0.306, 0.298, 1.0];
  drawSquare(color,mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.55, 0.37, 0.0]);
  mMatrix = mat4.scale(mMatrix,[0.04,0.4,1.0]);
  color = [0.463, 0.306, 0.298, 1.0];
  drawSquare(color,mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.75, 0.3, 0.0]);
  mMatrix = mat4.scale(mMatrix,[0.03,0.25,1.0]);
  color = [0.463, 0.306, 0.298, 1.0];
  drawSquare(color,mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.75, 0.5, 0.0]);
  mMatrix = mat4.scale(mMatrix,[0.25,0.3,1.0]);
  color = [0.376, 0.588, 0.337, 1.0];
  drawTriangle(color,mMatrix);
  mMatrix = popMatrix(mStack);  

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.75, 0.55, 0.0]);
  mMatrix = mat4.scale(mMatrix,[0.25,0.3,1.0]);
  color = [0.408, 0.690, 0.353, 1.0];
  drawTriangle(color,mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.75, 0.6, 0.0]);
  mMatrix = mat4.scale(mMatrix,[0.25,0.3,1.0]);
  color = [0.506, 0.792, 0.380, 1.0];
  drawTriangle(color,mMatrix);
  mMatrix = popMatrix(mStack); 

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.55, 0.6, 0.0]);
  mMatrix = mat4.scale(mMatrix,[0.25,0.3,1.0]);
  color = [0.376, 0.588, 0.337, 1.0];
  drawTriangle(color,mMatrix);
  mMatrix = popMatrix(mStack);  

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.55, 0.65, 0.0]);
  mMatrix = mat4.scale(mMatrix,[0.25,0.3,1.0]);
  color = [0.408, 0.690, 0.353, 1.0];
  drawTriangle(color,mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.55, 0.7, 0.0]);
  mMatrix = mat4.scale(mMatrix,[0.25,0.3,1.0]);
  color = [0.506, 0.792, 0.380, 1.0];
  drawTriangle(color,mMatrix);
  mMatrix = popMatrix(mStack); 

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.35, 0.5, 0.0]);
  mMatrix = mat4.scale(mMatrix,[0.25,0.3,1.0]);
  color = [0.376, 0.588, 0.337, 1.0];
  drawTriangle(color,mMatrix);
  mMatrix = popMatrix(mStack);  

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.35, 0.55, 0.0]);
  mMatrix = mat4.scale(mMatrix,[0.25,0.3,1.0]);
  color = [0.408, 0.690, 0.353, 1.0];
  drawTriangle(color,mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.35, 0.6, 0.0]);
  mMatrix = mat4.scale(mMatrix,[0.25,0.3,1.0]);
  color = [0.506, 0.792, 0.380, 1.0];
  drawTriangle(color,mMatrix);
  mMatrix = popMatrix(mStack);
}

function drawHouse(){
  mat4.identity(mMatrix);
  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.705, -0.45, 0.0]);
  mMatrix = mat4.scale(mMatrix,[0.35,0.35,1.0]);
  color = [0.898, 0.898, 0.898, 1.0];
  drawSquare(color,mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.8, -0.43, 0.0]);
  mMatrix = mat4.scale(mMatrix,[0.06,0.1,1.0]);
  color = [0.871, 0.710, 0.239, 1.0];
  drawSquare(color,mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.61, -0.43, 0.0]);
  mMatrix = mat4.scale(mMatrix,[0.06,0.1,1.0]);
  color = [0.871, 0.710, 0.239, 1.0];
  drawSquare(color,mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.705, -0.53, 0.0]);
  mMatrix = mat4.scale(mMatrix,[0.05,0.2,1.0]);
  color = [0.871, 0.710, 0.239, 1.0];
  drawSquare(color,mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.83, -0.2, 0.0]);
  mMatrix = mat4.scale(mMatrix,[0.2,0.25,1.0]);
  color = [0.929, 0.357, 0.165, 1.0];
  drawTriangle(color,mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.705, -0.2, 0.0]);
  mMatrix = mat4.scale(mMatrix,[0.25,0.25,1.0]);
  color = [0.929, 0.357, 0.165, 1.0];
  drawSquare(color,mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.579, -0.2, 0.0]);
  mMatrix = mat4.scale(mMatrix,[0.2,0.25,1.0]);
  color = [0.929, 0.357, 0.165, 1.0];
  drawTriangle(color,mMatrix);
  mMatrix = popMatrix(mStack);
}

function drawSky(){
  mat4.identity(mMatrix);
  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.0, 0.5, 0.0]);
  mMatrix = mat4.scale(mMatrix,[3.0,1.0,1.0]);
  color = [0.0, 0.0, 0.0, 1.0];
  drawSquare(color,mMatrix);
  mMatrix = popMatrix(mStack);
}

function drawStars(scale){
  pushMatrix(mStack,mMatrix);
  //star1
  mMatrix = mat4.translate(mMatrix, [0.5, 0.95, 0.0]);
  mMatrix = mat4.scale(mMatrix,[0.007,0.015,1.0]);
  color = [1.0, 1.0, 1.0, 1.0];
  drawSquare(color,mMatrix);
  mMatrix = popMatrix(mStack);  

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.5, 0.97, 0.0]);
  mMatrix = mat4.scale(mMatrix,[0.008+scale,0.03+scale,1.0]);
  color = [1.0, 1.0, 1.0, 1.0];
  drawTriangle(color,mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.515, 0.95, 0.0]);
  mMatrix = mat4.rotate(mMatrix,degToRad(-90),[0.0,0.0,1.0]);
  mMatrix = mat4.scale(mMatrix,[0.015+scale,0.028+scale,1.0]);
  color = [1.0, 1.0, 1.0, 1.0];
  drawTriangle(color,mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.486, 0.95, 0.0]);
  mMatrix = mat4.rotate(mMatrix,degToRad(90),[0.0,0.0,1.0]);
  mMatrix = mat4.scale(mMatrix,[0.015+scale,0.03+scale,1.0]);
  color = [1.0, 1.0, 1.0, 1.0];
  drawTriangle(color,mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.5, 0.93, 0.0]);
  mMatrix = mat4.rotate(mMatrix,degToRad(180),[0.0,0.0,1.0]);
  mMatrix = mat4.scale(mMatrix,[0.01+scale,0.03+scale,1.0]);
  color = [1.0, 1.0, 1.0, 1.0];
  drawTriangle(color,mMatrix);
  mMatrix = popMatrix(mStack);

  //star2
  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.4, 0.8, 0.0]);
  mMatrix = mat4.scale(mMatrix,[0.008,0.02,1.0]);
  color = [1.0, 1.0, 1.0, 1.0];
  drawSquare(color,mMatrix);
  mMatrix = popMatrix(mStack);  

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.4, 0.835, 0.0]);
  mMatrix = mat4.scale(mMatrix,[0.012+scale,0.053+scale,1.0]);
  color = [1.0, 1.0, 1.0, 1.0];
  drawTriangle(color,mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.42, 0.8, 0.0]);
  mMatrix = mat4.rotate(mMatrix,degToRad(-90),[0.0,0.0,1.0]);
  mMatrix = mat4.scale(mMatrix,[0.018+scale,0.04+scale,1.0]);
  color = [1.0, 1.0, 1.0, 1.0];
  drawTriangle(color,mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.38, 0.8, 0.0]);
  mMatrix = mat4.rotate(mMatrix,degToRad(90),[0.0,0.0,1.0]);
  mMatrix = mat4.scale(mMatrix,[0.018+scale,0.04+scale,1.0]);
  color = [1.0, 1.0, 1.0, 1.0];
  drawTriangle(color,mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.4, 0.77, 0.0]);
  mMatrix = mat4.rotate(mMatrix,degToRad(180),[0.0,0.0,1.0]);
  mMatrix = mat4.scale(mMatrix,[0.012+scale,0.053+scale,1.0]);
  color = [1.0, 1.0, 1.0, 1.0];
  drawTriangle(color,mMatrix);
  mMatrix = popMatrix(mStack);

  //star3
  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.0, 0.9, 0.0]);
  mMatrix = mat4.scale(mMatrix,[0.007,0.015,1.0]);
  color = [1.0, 1.0, 1.0, 1.0];
  drawSquare(color,mMatrix);
  mMatrix = popMatrix(mStack);  

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.0, 0.92, 0.0]);
  mMatrix = mat4.scale(mMatrix,[0.008+scale,0.03+scale,1.0]);
  color = [1.0, 1.0, 1.0, 1.0];
  drawTriangle(color,mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.015, 0.9, 0.0]);
  mMatrix = mat4.rotate(mMatrix,degToRad(-90),[0.0,0.0,1.0]);
  mMatrix = mat4.scale(mMatrix,[0.015+scale,0.028+scale,1.0]);
  color = [1.0, 1.0, 1.0, 1.0];
  drawTriangle(color,mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.014, 0.9, 0.0]);
  mMatrix = mat4.rotate(mMatrix,degToRad(90),[0.0,0.0,1.0]);
  mMatrix = mat4.scale(mMatrix,[0.015+scale,0.03+scale,1.0]);
  color = [1.0, 1.0, 1.0, 1.0];
  drawTriangle(color,mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.0, 0.88, 0.0]);
  mMatrix = mat4.rotate(mMatrix,degToRad(180),[0.0,0.0,1.0]);
  mMatrix = mat4.scale(mMatrix,[0.01+scale,0.03+scale,1.0]);
  color = [1.0, 1.0, 1.0, 1.0];
  drawTriangle(color,mMatrix);
  mMatrix = popMatrix(mStack);

  //star4
  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.06, 0.8, 0.0]);
  mMatrix = mat4.scale(mMatrix,[0.0065,0.0075,1.0]);
  color = [1.0, 1.0, 1.0, 1.0];
  drawSquare(color,mMatrix);
  mMatrix = popMatrix(mStack);  

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.06, 0.81, 0.0]);
  mMatrix = mat4.scale(mMatrix,[0.007+scale,0.035+scale,1.0]);
  color = [1.0, 1.0, 1.0, 1.0];
  drawTriangle(color,mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.05, 0.8, 0.0]);
  mMatrix = mat4.rotate(mMatrix,degToRad(-90),[0.0,0.0,1.0]);
  mMatrix = mat4.scale(mMatrix,[0.012+scale,0.015+scale,1.0]);
  color = [1.0, 1.0, 1.0, 1.0];
  drawTriangle(color,mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.07, 0.8, 0.0]);
  mMatrix = mat4.rotate(mMatrix,degToRad(90),[0.0,0.0,1.0]);
  mMatrix = mat4.scale(mMatrix,[0.012+scale,0.018+scale,1.0]);
  color = [1.0, 1.0, 1.0, 1.0];
  drawTriangle(color,mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.06, 0.785, 0.0]);
  mMatrix = mat4.rotate(mMatrix,degToRad(180),[0.0,0.0,1.0]);
  mMatrix = mat4.scale(mMatrix,[0.007+scale,0.025+scale,1.0]);
  color = [1.0, 1.0, 1.0, 1.0];
  drawTriangle(color,mMatrix);
  mMatrix = popMatrix(mStack);

   //star5
   pushMatrix(mStack,mMatrix);
   mMatrix = mat4.translate(mMatrix, [-0.13, 0.7, 0.0]);
   mMatrix = mat4.scale(mMatrix,[0.006,0.007,1.0]);
   color = [1.0, 1.0, 1.0, 1.0];
   drawSquare(color,mMatrix);
   mMatrix = popMatrix(mStack);  
 
   pushMatrix(mStack,mMatrix);
   mMatrix = mat4.translate(mMatrix, [-0.13, 0.714, 0.0]);
   mMatrix = mat4.scale(mMatrix,[0.006+scale,0.02+scale,1.0]);
   color = [1.0, 1.0, 1.0, 1.0];
   drawTriangle(color,mMatrix);
   mMatrix = popMatrix(mStack);
 
   pushMatrix(mStack,mMatrix);
   mMatrix = mat4.translate(mMatrix, [-0.12, 0.7, 0.0]);
   mMatrix = mat4.rotate(mMatrix,degToRad(-90),[0.0,0.0,1.0]);
   mMatrix = mat4.scale(mMatrix,[0.008+scale,0.0135+scale,1.0]);
   color = [1.0, 1.0, 1.0, 1.0];
   drawTriangle(color,mMatrix);
   mMatrix = popMatrix(mStack);
 
   pushMatrix(mStack,mMatrix);
   mMatrix = mat4.translate(mMatrix, [-0.14, 0.7, 0.0]);
   mMatrix = mat4.rotate(mMatrix,degToRad(90),[0.0,0.0,1.0]);
   mMatrix = mat4.scale(mMatrix,[0.01+scale,0.015+scale,1.0]);
   color = [1.0, 1.0, 1.0, 1.0];
   drawTriangle(color,mMatrix);
   mMatrix = popMatrix(mStack);
 
   pushMatrix(mStack,mMatrix);
   mMatrix = mat4.translate(mMatrix, [-0.13, 0.685, 0.0]);
   mMatrix = mat4.rotate(mMatrix,degToRad(180),[0.0,0.0,1.0]);
   mMatrix = mat4.scale(mMatrix,[0.007+scale,0.025+scale,1.0]);
   color = [1.0, 1.0, 1.0, 1.0];
   drawTriangle(color,mMatrix);
   mMatrix = popMatrix(mStack);
}

function drawMountains(){
  mat4.identity(mMatrix);
  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.8,0.35,0]);
  mMatrix = mat4.scale(mMatrix, [0.85, 0.3, 1.0]);
  color = [0.569, 0.475, 0.341, 1.0];
  drawTriangle(color, mMatrix);
  mMatrix = popMatrix(mStack);
  
  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.995,0.3,0]);
  mMatrix = mat4.scale(mMatrix, [0.85,0.5,1]);
  mMatrix = mat4.rotate(mMatrix, degToRad(-30),[0,0,1]);
  mMatrix = mat4.scale(mMatrix, [0.3, 0.95, 1.0]);
  color = [0.463, 0.372, 0.282, 1.0];
  drawTriangle(color, mMatrix);
  mMatrix = popMatrix(mStack);

  mat4.identity(mMatrix);
  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.0,0.35,0]);
  mMatrix = mat4.scale(mMatrix, [1.6, 0.65, 1.0]);
  color = [0.569, 0.475, 0.341, 1.0];
  drawTriangle(color, mMatrix);
  mMatrix = popMatrix(mStack);
  
  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.335,0.3,0]);
  mMatrix = mat4.scale(mMatrix, [1.45,0.93,1]);
  mMatrix = mat4.rotate(mMatrix, degToRad(-30),[0,0,1]);
  mMatrix = mat4.scale(mMatrix, [0.3, 0.95, 1.0]);
  color = [0.463, 0.372, 0.282, 1.0];
  drawTriangle(color, mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.75,0.33,0]);
  mMatrix = mat4.scale(mMatrix, [0.65, 0.3, 1.0]);
  color = [0.569, 0.475, 0.341, 1.0];
  drawTriangle(color, mMatrix);
  mMatrix = popMatrix(mStack);
}

function drawBoatback(x_animate){
  mat4.identity(mMatrix);
  //backBoat
  //slantPole
  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.03+x_animate,0.155,0.0]);
  mMatrix = mat4.rotate(mMatrix, degToRad(-22.5),[0,0,1]);
  mMatrix = mat4.scale(mMatrix, [0.004, 0.15, 1.0]);
  color = [0.0, 0.0, 0.0, 1.0];
  drawSquare(color, mMatrix);
  mMatrix = popMatrix(mStack);

  //pole straight
  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.0+x_animate,0.15,0.0]);
  mMatrix = mat4.scale(mMatrix, [0.007, 0.19, 1.0]);
  color = [0.0, 0.0, 0.0, 1.0];
  drawSquare(color, mMatrix);
  mMatrix = popMatrix(mStack);
 
  //triangle
  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.0225+x_animate,0.19,0]);
  mMatrix = mat4.scale(mMatrix, [0.7, 0.8, 1.0]);
  mMatrix = mat4.rotate(mMatrix, degToRad(27),[0,0,1]);
  mMatrix = mat4.scale(mMatrix, [0.12, 0.12, 1.0]);
  color = [0.922, 0.204, 0.137, 1.0];
  drawTriangle(color, mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.0+x_animate,0.08,0.0]);
  mMatrix = mat4.scale(mMatrix, [0.1, 0.05, 1.0]);
  color = [0.8, 0.8, 0.8, 1.0];
  drawSquare(color, mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.05 + x_animate,0.08,0]);
  mMatrix = mat4.scale(mMatrix, [0.05, 0.05, 1.0]);
  mMatrix = mat4.rotate(mMatrix, degToRad(-180),[0,0,1]);
  color = [0.8, 0.8, 0.8, 1.0];
  drawTriangle(color, mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.05+x_animate,0.08,0]);
  mMatrix = mat4.scale(mMatrix, [0.05, 0.05, 1.0]);
  mMatrix = mat4.rotate(mMatrix, degToRad(-180),[0,0,1]);
  color = [0.8, 0.8, 0.8, 1.0];
  drawTriangle(color, mMatrix);
  mMatrix = popMatrix(mStack);
}

function drawFrontBoat(x_animate){
  //frontBoat
  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.64+x_animate,0.155,0.0]);
  mMatrix = mat4.rotate(mMatrix, degToRad(-22.5),[0,0,1]);
  mMatrix = mat4.scale(mMatrix, [0.004, 0.30, 1.0]);
  color = [0.0, 0.0, 0.0, 1.0];
  drawSquare(color, mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.7+x_animate,0.15,0.0]);
  mMatrix = mat4.scale(mMatrix, [0.01, 0.35, 1.0]);
  color = [0.0, 0.0, 0.0, 1.0];
  drawSquare(color, mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.741+x_animate,0.22,0]);
  mMatrix = mat4.scale(mMatrix, [0.7, 0.8, 1.0]);
  mMatrix = mat4.rotate(mMatrix, degToRad(27),[0,0,1]);
  mMatrix = mat4.scale(mMatrix, [0.23, 0.23, 1.0]);
  color = [0.922, 0.204, 0.137, 1.0];
  drawTriangle(color, mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.7+x_animate,0.0,0.0]);
  mMatrix = mat4.scale(mMatrix, [0.2, 0.1, 1.0]);
  color = [0.8, 0.8, 0.8, 1.0];
  drawSquare(color, mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.8+x_animate,0.0,0]);
  mMatrix = mat4.scale(mMatrix, [0.05, 0.1, 1.0]);
  mMatrix = mat4.rotate(mMatrix, degToRad(-180),[0,0,1]);
  color = [0.8, 0.8, 0.8, 1.0];
  drawTriangle(color, mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.6+x_animate,0.0,0]);
  mMatrix = mat4.scale(mMatrix, [0.055, 0.1, 1.0]);
  mMatrix = mat4.rotate(mMatrix, degToRad(-180),[0,0,1]);
  color = [0.8, 0.8, 0.8, 1.0];
  drawTriangle(color, mMatrix);
  mMatrix = popMatrix(mStack);
}

function drawClouds(){
  mat4.identity(mMatrix);
  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.9,0.75,0.0]);
  mMatrix = mat4.scale(mMatrix, [0.15, 0.15, 1.0]);
  color = [0.698, 0.698, 0.698, 1.0];
  drawCircle(color, mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.72,0.71,0.0]);
  mMatrix = mat4.scale(mMatrix, [0.12, 0.12, 1.0]);
  color = [1.0, 1.0, 1.0, 1.0];
  drawCircle(color, mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.55,0.71,0.0]);
  mMatrix = mat4.scale(mMatrix, [0.09, 0.09, 1.0]);
  color = [0.8, 0.8, 0.8, 1.0];
  drawCircle(color, mMatrix);
  mMatrix = popMatrix(mStack);
}

function drawMoon(angle){
  mat4.identity(mMatrix);
  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.3,0.8,0.0]);
  mMatrix = mat4.scale(mMatrix, [0.1, 0.1, 1.0]);
  color = [1.0, 1.0, 1.0, 1.0];
  drawCircle(color, mMatrix);
  mMatrix = popMatrix(mStack);

  for(let deg = 0 ; deg < 360 ; deg+=60){
    pushMatrix(mStack,mMatrix);
    mMatrix = mat4.translate(mMatrix, [-0.3,0.8,0.0]);
    mMatrix = mat4.rotate(mMatrix,degToRad(angle+deg),[0,0,1]);
    mMatrix = mat4.scale(mMatrix, [0.007, 0.2, 1.0]);
    color = [1.0, 1.0, 1.0, 1.0];
    drawRaysBuffer(color, mMatrix);
    mMatrix = popMatrix(mStack);
  }
}

function drawBushes(){
  mat4.identity(mMatrix);
  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-1,-0.53,0.0]);
  mMatrix = mat4.scale(mMatrix, [0.07, 0.07, 1.0]);
  color = [0.310, 0.686, 0.196, 1.0];
  drawCircle(color, mMatrix);
  mMatrix = popMatrix(mStack); 

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.56,-0.5,0.0]);
  mMatrix = mat4.scale(mMatrix, [0.1, 0.1, 1.0]);
  color = [0.310, 0.686, 0.196, 1.0];
  drawCircle(color, mMatrix);
  mMatrix = popMatrix(mStack); 

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.75,-0.56,0.0]);
  mMatrix = mat4.scale(mMatrix, [0.1, 0.12, 1.0]);
  color = [0.310, 0.686, 0.196, 1.0];
  drawCircle(color, mMatrix);
  mMatrix = popMatrix(mStack); 

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.45,-1,0.0]);
  mMatrix = mat4.scale(mMatrix, [0.09, 0.09, 1.0]);
  color = [0.310, 0.686, 0.196, 1.0];
  drawCircle(color, mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.33,-0.485,0.0]);
  mMatrix = mat4.scale(mMatrix, [0.057, 0.08, 1.0]);
  color = [0.169, 0.388, 0.094, 1.0];
  drawCircle(color, mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.12,-1.05,0.0]);
  mMatrix = mat4.scale(mMatrix, [0.09, 0.1, 1.0]);
  color = [0.169, 0.388, 0.094, 1.0];
  drawCircle(color, mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.9,-0.5,0.0]);
  mMatrix = mat4.scale(mMatrix, [0.15, 0.2, 1.0]);
  color = [0.263, 0.588, 0.165, 1.0];
  drawCircle(color, mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.44,-0.47,0.0]);
  mMatrix = mat4.scale(mMatrix, [0.1, 0.1, 1.0]);
  color = [0.263, 0.588, 0.165, 1.0];
  drawCircle(color, mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.9,-0.5,0.0]);
  mMatrix = mat4.scale(mMatrix, [0.09, 0.1, 1.0]);
  color = [0.263, 0.588, 0.165, 1.0];
  drawCircle(color, mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.28,-1,0.0]);
  mMatrix = mat4.scale(mMatrix, [0.15, 0.2, 1.0]);
  color = [0.263, 0.588, 0.165, 1.0];
  drawCircle(color, mMatrix);
  mMatrix = popMatrix(mStack);
}

function drawCar(){
  mat4.identity(mMatrix);
  //Wheels
  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.76,-0.95,0.0]);
  mMatrix = mat4.scale(mMatrix, [0.03, 0.045, 1.0]);
  color = [0.0, 0.0, 0.0, 1.0];
  drawCircle(color, mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.76,-0.95,0.0]);
  mMatrix = mat4.scale(mMatrix, [0.025, 0.035, 1.0]);
  color = [0.498, 0.494, 0.498, 1.0];
  drawCircle(color, mMatrix);
  mMatrix = popMatrix(mStack);
  
  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.64,-0.95,0.0]);
  mMatrix = mat4.scale(mMatrix, [0.03, 0.045, 1.0]);
  color = [0.0, 0.0, 0.0, 1.0];
  drawCircle(color, mMatrix);
  mMatrix = popMatrix(mStack); 

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.64,-0.95,0.0]);
  mMatrix = mat4.scale(mMatrix, [0.025, 0.035, 1.0]);
  color = [0.498, 0.494, 0.498, 1.0];
  drawCircle(color, mMatrix);
  mMatrix = popMatrix(mStack);

  //Trunk
  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.7,-0.77,0.0]);
  mMatrix = mat4.scale(mMatrix, [0.1, 0.15, 1.0]);
  color = [0.118, 0.298, 0.675, 1.0];
  drawCircle(color, mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.7,-0.74,0.0]);
  mMatrix = mat4.scale(mMatrix, [0.12, 0.09, 1.0]);
  color = [0.796, 0.8, 0.89, 1.0];
  drawSquare(color, mMatrix);
  mMatrix = popMatrix(mStack);

  //body
  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.811,-0.85,0]);
  mMatrix = mat4.scale(mMatrix, [0.07, 0.15, 1.0]);
  color = [0.220, 0.494, 0.871, 1.0];
  drawTriangle(color, mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.59,-0.85,0]);
  mMatrix = mat4.scale(mMatrix, [0.07, 0.15, 1.0]);
  color = [0.220, 0.494, 0.871, 1.0];
  drawTriangle(color, mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [-0.7,-0.85,0.0]);
  mMatrix = mat4.scale(mMatrix, [0.22, 0.15, 1.0]);
  color = [0.220, 0.494, 0.871, 1.0];
  drawSquare(color, mMatrix);
  mMatrix = popMatrix(mStack);
}

function drawWindmill(angle){
  mat4.identity(mMatrix);
  //pole
  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.6,-0.15,0.0]);
  mMatrix = mat4.scale(mMatrix, [0.02, 0.7, 1.0]);
  color = [0.200, 0.184, 0.192, 1.0];
  drawSquare(color, mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.43,-0.0,0.0]);
  mMatrix = mat4.scale(mMatrix, [0.015, 0.43, 1.0]);
  color = [0.200, 0.184, 0.192, 1.0];
  drawSquare(color, mMatrix);
  mMatrix = popMatrix(mStack);


  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.6,0.2,0.0]);
  mMatrix = mat4.rotate(mMatrix,degToRad(angle), [0,0,1]);
  mMatrix = mat4.scale(mMatrix, [0.06, 0.3, 1.0]);
  color = [0.686, 0.710, 0.196, 1.0];
  drawTriangle2(color, mMatrix);
  mMatrix = popMatrix(mStack); 

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.6,0.2,0.0]);
  mMatrix = mat4.rotate(mMatrix,degToRad(angle+90), [0,0,1]);
  mMatrix = mat4.scale(mMatrix, [0.06, 0.3, 1.0]);
  color = [0.686, 0.710, 0.196, 1.0];
  drawTriangle2(color, mMatrix);
  mMatrix = popMatrix(mStack); 

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.6,0.2,0.0]);
  mMatrix = mat4.rotate(mMatrix,degToRad(angle+180), [0,0,1]);
  mMatrix = mat4.scale(mMatrix, [0.06, 0.3, 1.0]);
  color = [0.686, 0.710, 0.196, 1.0];
  drawTriangle2(color, mMatrix);
  mMatrix = popMatrix(mStack); 

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.6,0.2,0.0]);
  mMatrix = mat4.rotate(mMatrix,degToRad(angle+270), [0,0,1]);
  mMatrix = mat4.scale(mMatrix, [0.06, 0.3, 1.0]);
  color = [0.686, 0.710, 0.196, 1.0];
  drawTriangle2(color, mMatrix);
  mMatrix = popMatrix(mStack); 

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.43,0.2,0.0]);

  mMatrix = mat4.rotate(mMatrix,degToRad(angle), [0,0,1]);
  mMatrix = mat4.scale(mMatrix, [0.06, 0.3, 1.0]);
  color = [0.686, 0.710, 0.196, 1.0];
  drawTriangle2(color, mMatrix);
  mMatrix = popMatrix(mStack); 

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.43,0.2,0.0]);
  mMatrix = mat4.rotate(mMatrix,degToRad(angle+90), [0,0,1]);
  mMatrix = mat4.scale(mMatrix, [0.06, 0.3, 1.0]);
  color = [0.686, 0.710, 0.196, 1.0];
  drawTriangle2(color, mMatrix);
  mMatrix = popMatrix(mStack); 

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.43,0.2,0.0]);
  mMatrix = mat4.rotate(mMatrix,degToRad(angle+180), [0,0,1]);
  mMatrix = mat4.scale(mMatrix, [0.06, 0.3, 1.0]);
  color = [0.686, 0.710, 0.196, 1.0];
  drawTriangle2(color, mMatrix);
  mMatrix = popMatrix(mStack); 

  pushMatrix(mStack,mMatrix);

  mMatrix = mat4.translate(mMatrix, [0.43,0.2,0.0]);
  mMatrix = mat4.rotate(mMatrix,degToRad(angle+270), [0,0,1]);
  mMatrix = mat4.scale(mMatrix, [0.06, 0.3, 1.0]);
  color = [0.686, 0.710, 0.196, 1.0];
  drawTriangle2(color, mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.6,0.2,0.0]);
  mMatrix = mat4.scale(mMatrix, [0.02, 0.035, 1.0]);
  color = [0.0, 0.0, 0.0, 1.0];
  drawCircle(color, mMatrix);
  mMatrix = popMatrix(mStack);

  pushMatrix(mStack,mMatrix);
  mMatrix = mat4.translate(mMatrix, [0.43,0.2,0.0]);
  mMatrix = mat4.scale(mMatrix, [0.015, 0.025, 1.0]);
  color = [0.0, 0.0, 0.0, 1.0];
  drawCircle(color, mMatrix);
  mMatrix = popMatrix(mStack);
}

function drawScene(){
  var x_front = 0;
  var x_back = 0;
  var speed_front = 0.004;
  var speed_back = 0.002;
  var dir_back = 1;
  var dir_front = -1;
  var angle = 0;
  var speed = 1;
  var scale = 0;
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

  function animate(){
    scale = scale + 0.004;
    angle = angle + 1;
    if(scale > 0.02) scale = 0;
    if (x_back > 0.75) {
      dir_back = -1;
    } 
    if (x_back < -0.92) {
      dir_back = 1;
    }

    if (x_front > 0.12) {
      dir_front = -1;
    } 
    if (x_front < -1.55) {
      dir_front = 1;
    }
    angle += speed;
    x_front += dir_front*speed_front;
    x_back  += dir_back*speed_back;
    gl.clearColor(0.9, 0.9, 0.9, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    drawSky();
    drawMountains();
    drawLand();
    drawWater();
    drawTrees();
    drawBushes();
    drawHouse();
    drawBoatback(x_back);
    drawFrontBoat(x_front);
    drawClouds();
    drawMoon(angle);
    drawCar();
    drawWindmill(angle);
    drawStars(scale);
    animation = window.requestAnimationFrame(animate);
  }
  animate();
}

// This is the entry point from the html
function webGLStart() {
  var canvas = document.getElementById("viewport");
  initGL(canvas); // intialize webgl
  shaderProgram = initShaders(); // initialize shader code, load, and compile
  aPositionLocation = gl.getAttribLocation(shaderProgram, "aPosition");
  gl.enableVertexAttribArray(aPositionLocation);
  uColorLoc = gl.getUniformLocation(shaderProgram, "color");
  uMMatrixLocation = gl.getUniformLocation(shaderProgram, "uMMatrix");
  initSquareBuffer();
  initTriangleBuffer();
  initCircleBuffer();
  initTriangle2Buffer();
  initRaysBuffer();
  drawScene(); // start drawing now
}

function changeView(m){
  mode = m;
  drawScene();
}
