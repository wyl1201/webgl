import './style.css'

const prefix = window.location.origin

document.querySelector('#app').innerHTML = `
  <div style="display: flex;flex-direction: column;just-content: center;">
    <a href="${prefix}/three/getting-started/" target="_blank">
     three/getting-started
    </a>
    <a href="${prefix}/three/creating-a-scene/" target="_blank">
     three/creating-a-scene
    </a>
    <a href="${prefix}/three/drawing-lines/" target="_blank">
     three/drawing-lines
    </a>
    <a href="${prefix}/three/loading-3d-models/" target="_blank">
     three/loading-3d-models
    </a>
  </div>
`
