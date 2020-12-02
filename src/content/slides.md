# Creative Coding with WebGL

---

# Hi! I'm Lea Rosema

- Junior Frontend Developer at S2
- Digital artist, addicted to Codepen
- [https://lea.codes/](https://lea.codes/)
- [https://codepen/terabaud/](https://codepen.io/terabaud/)
- [https://twitter.com/terabaud](https://twitter.com/terabaud)
- [https://terabaud.github.io/slides-webgl/](https://terabaud.github.io/slides-webgl/)

---

# What is WebGL?

- it's not a 3D engine
- it's a rasterization engine
- it's about drawing points, lines, triangles
- in order to draw these, you write code for the GPU

---

# How to WebGL?

- Vanilla JS WebGL
- Libraries on top of WebGL, eg. ThreeJS
- Game engines, running in WebAssembly+WebGL
- In this talk we're doing Vanilla JS WebGL :)

---

# WebGL pipeline

## (roughly)

1. Buffers
2. Vertex shader (processes buffer data)
3. Rasterization ([see how it works](https://codepen.io/terabaud/full/VwKLqdw))
4. Fragment shader ([processes pixels, it's like tixy](https://tixy.land/))
5. Pixels on Screen :)

---

# GL Shader Language

- Vertex and fragment shader are executed on the GPU
- GPU-specific language GL Shader language (GLSL)
- C++-like language with a `void main()`
- built-in vector/matrix datatypes
- [Rough language overview](https://lea.codes/webgl/glsl-overview/)
- [In detail: book of shaders](https://thebookofshaders.com/)

---

# Vertex shader code

```glsl
attribute vec4 position;

void main() {
  gl_Position = position;
}
```

- input via the position attribute from a buffer
- the shader is run as many times as there's data
- the vertex position output via `gl_Position`

---

# Fragment shader code

```glsl
precision highp float;

void main() {
  vec2 p = gl_FragCoord.xy;
  gl_FragColor = vec4(1.0, 0.5, 0, 1.0);
}
```

- The fragment shader is run for each fragment (pixel)
- pixel coordinate from `gl_FragCoord`
- the output color is set in `gl_FragColor`

---

# Passing Data from JS

- `attribute`: the vertex shader pulls a value from a buffer and stores it in here
- `uniform`: pass variables you set in JS before you execute the shader
- `varying`: pass values from the vertex shader to the fragment shader and interpolate values

---

# JS

## Get the WebGL Context

```js
const gl = canvas.getContext('webgl');
```

...just like initializing a 2D canvas

---

# JS: Compile Shaders

```js
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentCode);
gl.compileShader(fragmentShader);
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexCode);
gl.compileShader(vertexShader);
```

Like in C++, compile your shaders first.

---

# JS: Create the program

```js
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram();
```

Like in C++, link. Together they form a `WebGLProgram`.

---

# JS: Defining attributes for the vertex shader

```js
const positionLoc = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(positionLoc);
```

Activate your attribute via `enableVertexAttribArray`

---

# Assign a buffer to the attribute

```js
// provide 2D data for a triangle
const data = [-1, -1, -1, 1, 1, -1];
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
```

Create a buffer and provide data in a `Float32Array`

---

# Set the attribute pointer

```js
gl.vertexAttribPointer(
  positionLoc, // pointer to attribute
  2, // record size
  gl.FLOAT, // type
  false, // normalized
  0,
  0
);
```

This points the attribute to your data buffer

---

# Passing uniform variables

```js
const uTime = gl.getUniformLocation(program, 'time');
gl.uniform1f(uTime, tickCount);
```

- Possible types: floats, ints, bools, vectors, matrices
- Pass variables from JavaScript to WebGL
- For example: pass the screen resolution, elapsed time, mouse position

---

# Running it in JS

## Draw

```js
gl.drawArrays(gl.TRIANGLES);
```

---

# Examples

- [A triangle](https://codepen.io/terabaud/pen/OKVpYV?editors=0010)
- [A full size shader in a Web Component](https://codepen.io/terabaud/pen/pobKqay)
- [A more advanced demo](https://codepen.io/terabaud/pen/zYBLbNX)

---

# Get pixel coordinates

```glsl
uniform vec2 resolution;
vec2 p = (gl_FragCoord.xy / resolution - .5) * 2.;

// aspect ratio correction
float aspect = resolution.x / resolution.y;
p.x *= aspect;
```

---

# Coordinates from varying

## Vertex shader

```glsl
attribute vec4 position;
varying vec4 vPosition;
vposition = position;
```

## Fragment Shader

```glsl
// contains interpolated values
varying vec4 vPosition;
```

---

# Making 2D shapes with fragment shaders

- via Signed distance fields (SDFs)
- basically a function
- takes a point and returns distance to the nearest object
- if it returns a number less than zero, the point is inside an object

---

# SDF distance functions

```glsl
float sdCircle(vec2 p, float radius) {
  return length(p) - radius;
}

float scene(vec2 p) {
  return sdCircle(p, 1.);
}
```

- See [more distance functions](https://www.iquilezles.org/www/articles/distfunctions2d/distfunctions2d.htm)

---

# Combining shapes

```glsl
float merge(float a, float b) {
  return min(a, b);
}

float substract(float a, float b) {
  return max(-a, b);
}

float symmetricDiff(float a, float b) {
  return max(min(a, b), -max(a, b));
}
```

---

# Demos

- [Symmetric diff demo](https://codepen.io/terabaud/pen/dyoXjVv)
- [Combining Shapes demo](https://codepen.io/terabaud/pen/MWwjLxX)
- [Combining Shapes in 3D](https://codepen.io/terabaud/pen/MWeYvPv)

---

# Transforming coordinates

## Rotate

```glsl
vec2 rotate(vec2 p, float a) {
  return vec2(p.x * cos(a) - p.y * sin(a),
              p.x * sin(a) + p.y * cos(a));
}
```

---

# Transforming coordinates

## Repeat

```glsl
vec2 repeat(in vec2 p, in vec2 c) {
  return mod(p, c) - 0.5 * c;
}
```

---

# Thank you 👩‍💻

## Resources

- [https://terabaud.github.io/slides-webgl/](https://terabaud.github.io/slides-webgl/)
- [https://lea.codes/](https://lea.codes/)
- [https://codepen.io/terabaud/](https://codepen.io/terabaud/)
- [https://webglfundamentals.org/](https://webglfundamentals.org/)
- [https://thebookofshaders.com/](https://thebookofshaders.com/)
- [https://www.iquilezles.org/](https://www.iquilezles.org/)
- [https://shadertoy.com/](https://shadertoy.com/)
