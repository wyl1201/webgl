const topWindow = window

const defaultShaderType = ['VERTEX_SHADER', 'FRAGMENT_SHADER']

export function resizeCanvasToDisplaySize(canvas) {
  // 获取浏览器显示的画布的CSS像素值
  const displayWidth = canvas.clientWidth
  const displayHeight = canvas.clientHeight

  // 检查画布大小是否相同。
  const needResize =
    canvas.width !== displayWidth || canvas.height !== displayHeight

  if (needResize) {
    // 使画布大小相同
    canvas.width = displayWidth
    canvas.height = displayHeight
  }

  return needResize
}

/**
 * Wrapped logging function.
 * @param {string} msg The message to log.
 */
function error(msg) {
  if (topWindow.console) {
    if (topWindow.console.error) {
      topWindow.console.error(msg)
    } else if (topWindow.console.log) {
      topWindow.console.log(msg)
    }
  }
}

const errorRE = /ERROR:\s*\d+:(\d+)/gi
function addLineNumbersWithError(src, log = '') {
  // Note: Error message formats are not defined by any spec so this may or may not work.
  const matches = [...log.matchAll(errorRE)]
  const lineNoToErrorMap = new Map(
    matches.map((m, ndx) => {
      const lineNo = parseInt(m[1])
      const next = matches[ndx + 1]
      const end = next ? next.index : log.length
      const msg = log.substring(m.index, end)
      return [lineNo - 1, msg]
    })
  )
  return src
    .split('\n')
    .map((line, lineNo) => {
      const err = lineNoToErrorMap.get(lineNo)
      return `${lineNo + 1}: ${line}${err ? `\n\n^^^ ${err}` : ''}`
    })
    .join('\n')
}

/**
 * Loads a shader.
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext to use.
 * @param {string} shaderSource The shader source.
 * @param {number} shaderType The type of shader.
 * @param {module:webgl-utils.ErrorCallback} opt_errorCallback callback for errors.
 * @return {WebGLShader} The created shader.
 */
function loadShader(gl, shaderSource, shaderType, opt_errorCallback) {
  const errFn = opt_errorCallback || error
  // Create the shader object
  const shader = gl.createShader(shaderType)

  // Load the shader source
  gl.shaderSource(shader, shaderSource)

  // Compile the shader
  gl.compileShader(shader)

  // Check the compile status
  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (!compiled) {
    // Something went wrong during compilation; get the error
    const lastError = gl.getShaderInfoLog(shader)
    errFn(
      `Error compiling shader: ${lastError}\n${addLineNumbersWithError(
        shaderSource,
        lastError
      )}`
    )
    gl.deleteShader(shader)
    return null
  }

  return shader
}

/**
 * Creates a program, attaches shaders, binds attrib locations, links the
 * program and calls useProgram.
 * @param {WebGLShader[]} shaders The shaders to attach
 * @param {string[]} [opt_attribs] An array of attribs names. Locations will be assigned by index if not passed in
 * @param {number[]} [opt_locations] The locations for the. A parallel array to opt_attribs letting you assign locations.
 * @param {module:webgl-utils.ErrorCallback} opt_errorCallback callback for errors. By default it just prints an error to the console
 *        on error. If you want something else pass an callback. It's passed an error message.
 * @memberOf module:webgl-utils
 */
function createProgram(
  gl,
  shaders,
  opt_attribs,
  opt_locations,
  opt_errorCallback
) {
  const errFn = opt_errorCallback || error
  const program = gl.createProgram()
  shaders.forEach(function (shader) {
    gl.attachShader(program, shader)
  })
  if (opt_attribs) {
    opt_attribs.forEach(function (attrib, ndx) {
      gl.bindAttribLocation(
        program,
        opt_locations ? opt_locations[ndx] : ndx,
        attrib
      )
    })
  }
  gl.linkProgram(program)

  // Check the link status
  const linked = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (!linked) {
    // something went wrong with the link
    const lastError = gl.getProgramInfoLog(program)
    errFn(
      `Error in program linking: ${lastError}\n${shaders
        .map((shader) => {
          const src = addLineNumbersWithError(gl.getShaderSource(shader))
          const type = gl.getShaderParameter(shader, gl.SHADER_TYPE)
          return `${gl}, ${type}:\n${src}`
        })
        .join('\n')}`
    )

    gl.deleteProgram(program)
    return null
  }
  return program
}

export function createProgramFromSources(
  gl,
  shaderSources,
  opt_attribs,
  opt_locations,
  opt_errorCallback
) {
  const shaders = []
  for (let ii = 0; ii < shaderSources.length; ++ii) {
    shaders.push(
      loadShader(
        gl,
        shaderSources[ii],
        gl[defaultShaderType[ii]],
        opt_errorCallback
      )
    )
  }
  return createProgram(
    gl,
    shaders,
    opt_attribs,
    opt_locations,
    opt_errorCallback
  )
}
