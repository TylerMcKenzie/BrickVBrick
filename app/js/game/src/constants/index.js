export const COLORS = {
  BLACK: '#060304',
  DARKBLUE: '#001440',
  TEAL: '#427a8b',
  GREEN: '#39bb8f',
  YELLOWGREEN: '#e2fda7'
}

let calculateScaleRatio = () => {
  let aspectRatio = window.innerWidth / window.innerHeight
  let scaleRatio
  if(aspectRatio > 1) {
    return scaleRatio = (window.innerHeight * window.devicePixelRatio) / 2048
  } else {
    return scaleRatio = (window.innerWidth * window.devicePixelRatio) / 2048
  }
}

export const SIZES = {
  SCREENWIDTH: window.innerWidth,
  SCREENHEIGHT: window.innerHeight,
  SCALERATIO: window.devicePixelRatio/3,
  BRICKSIZE: 60
}
