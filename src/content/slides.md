# Creative Coding with WebGL

---

# Hi! I'm Lea Rosema

- Junior Frontend Developer at S2
- Digital artist, addicted to Codepen
- [https://lea.codes/](https://lea.codes/)
- [https://codepen/terabaud/](https://codepen/terabaud/)

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
2. Vertex shader
3. Rasterization
4. Fragment shader
5. Pixels on Screen :)

---

# GL Shader Language

## How does it look like?

- GPU-specific language GL Shader language (GLSL)
- It's like C++ with a `void main()`
- ...but with built-in datatypes and functions useful for 2D/3D

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

# Let's try GLSL

## [DEMO: Draw a triangle](https://codepen.io/terabaud/pen/OKVpYV?editors=0010)

---

# GL Shader Language

## Datatypes

- primitives (`bool`, `int`, `float`)
- vectors (`vec2`, `vec3`, `vec4`)
- matrices (`mat2`, `mat3`, `mat4`)
- texture data (`sampler2D`)

---

# GL Shader Language

## Cool built-in functions

- `sin`, `cos`, `atan`
- Linear Interpolation (`mix`)
- Vector arithmetics (`+`, `-`, `*`, `/`, `dot`, `cross`, `length`)
- Matrix arithmetics (`+`, `-`, `*`)

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

# Useful GLSL functions

```glsl
//rotate
vec2 rotate(vec2 p, float a) {
  return vec2(p.x * cos(a) - p.y * sin(a),
              p.x * sin(a) + p.y * cos(a));
}

//repeat
vec2 repeat(in vec2 p, in vec2 c) {
  return mod(p, c) - 0.5 * c;
}
```

---

# Putting it all together

- [A full size shader in a Web Component]()

---

# Thank you 👩‍💻

## Resources

- [https://lea.codes](https://lea.codes/)
- [https://webglfundamentals.org](https://webglfundamentals.org)
- [https://thebookofshaders.com/](https://thebookofshaders.com/)
- [https://shadertoy.com](https://shadertoy.com)
- [https://twitter.com/terabaud](https://twitter.com/terabaud)
