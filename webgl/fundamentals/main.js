import * as webglUtils from '../utils/webgl-utils'
// 创建 webgl 上下文
const canvas = document.querySelector('#c')
const gl = canvas.getContext('webgl2')

const vertexShaderSource = `#version 300 es

in vec2 a_position;
uniform vec2 u_resolution;

void main() {
  vec2 zeroToOne = a_position / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}
`

const fragmentShaderSource = `#version 300 es

precision highp float;

uniform vec4 u_color;

out vec4 outColor;

void main() {
  outColor = u_color;
}
`

// 创建着色器
function createShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (success) {
    return shader
  }

  console.log(gl.getShaderInfoLog(shader))
  gl.deleteShader(shader)
}

// 创建顶点, 片段着色器
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
const fragmentShader = createShader(
  gl,
  gl.FRAGMENT_SHADER,
  fragmentShaderSource
)

// 创建 webgl 应用程序
function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  const success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (success) {
    return program
  }
    console.log(gl.getProgramInfoLog(program)) // eslint-disable-line
  gl.deleteProgram(program)
  return undefined
}

const program = createProgram(gl, vertexShader, fragmentShader)
// 启用webgl应用程序
gl.useProgram(program)

// 将数据写入缓冲区
const bufferId = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, bufferId)
// const positions = [0, 0, 0, 0.5, 0.7, 0]
// const positions = [10, 20, 80, 20, 10, 30, 10, 30, 80, 20, 80, 30]
// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

// 获取顶点着色器中的position变量的地址
const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')

const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution')
gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)
// 缓存区取数据
const size = 2
const type = gl.FLOAT
const normalize = false
const stride = 0
const offset = 0
// 给变量设置长度和类型
gl.vertexAttribPointer(
  positionAttributeLocation,
  size,
  type,
  normalize,
  stride,
  offset
)
// 激活变量
gl.enableVertexAttribArray(positionAttributeLocation)

webglUtils.resizeCanvasToDisplaySize(gl.canvas)

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
gl.clearColor(0, 0, 0, 0)
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

// 执行着色器程序完成绘制
// const primitiveType = gl.TRIANGLES
// const count = 6
// gl.drawArrays(primitiveType, offset, 6)

const colorLocation = gl.getUniformLocation(program, 'u_color')

for (let ii = 0; ii < 50; ii++) {
  // 设置一个随机的矩形数据
  setRectangle(
    gl,
    randomInt(300),
    randomInt(300),
    randomInt(300),
    randomInt(300)
  )
  // 设置随机颜色
  gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1)
  // 画一个矩形
  const primitiveType = gl.TRIANGLES
  const offset = 0
  const count = 6
  gl.drawArrays(primitiveType, offset, count)
}

function randomInt(range) {
  return Math.floor(Math.random() * range)
}

function setRectangle(gl, x, y, width, height) {
  const x1 = x
  const x2 = x + width
  const y1 = y
  const y2 = y + height
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
    gl.STATIC_DRAW
  )
}
