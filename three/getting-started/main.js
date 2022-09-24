import WebGL from '@/lib/WebGL'

if (WebGL.isWebGLAvailable()) {
  console.log(WebGL.isWebGLAvailable())
} else {
  const warning = WebGL.getWebGLErrorMessage()
  document.getElementById('app').appendChild(warning)
}
