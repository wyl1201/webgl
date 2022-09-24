import './style.css'

document.querySelector('#app').innerHTML = `
  <div style="display: flex;flex-direction: column;just-content: center;">
    <a href="${window.location.origin}/three/getting-started/" target="_blank">
     three/getting-started
    </a>
    <a href="${window.location.origin}/three/creating-a-scene/" target="_blank">
     three/creating-a-scene
    </a>
  </div>
`
