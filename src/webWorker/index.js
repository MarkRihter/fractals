/* eslint-disable no-restricted-globals */

class ComplexNumber {
  real
  imaginary

  constructor(real = 0, imaginary = 0) {
    this.real = real
    this.imaginary = imaginary
  }

  static add(a, b) {
    return new ComplexNumber(a.real + b.real, a.imaginary + b.imaginary)
  }

  static module(a) {
    return Math.sqrt(Math.pow(a.real, 2) + Math.pow(a.imaginary, 2))
  }

  static multiply(a, b) {
    return new ComplexNumber(
      a.real * b.real - a.imaginary * b.imaginary,
      a.real * b.imaginary + b.real * a.imaginary
    )
  }

  static pow(base, exponent) {
    let resultNumber = { ...base }

    for (let i = 1; i < exponent; i++) {
      resultNumber = ComplexNumber.multiply(resultNumber, base)
    }

    return resultNumber
  }
}

function postProgress(i) {
  self.postMessage({ type: 'renderInProgress', payload: i })
}

function juliaSet({ myImageData, mx, my, xCenter, yCenter, cReal, cImaginary }) {
  const c = new ComplexNumber(cReal, cImaginary)
  const zoomVariable = 0.2

  for (let y = -my / 2; y < my / 2; y++) {
    postProgress((y + my / 2) / my)
    for (let x = -mx / 2; x < mx / 2; x++) {
      // x = -150

      const canvasY = y + my / 2
      const canvasX = x + mx / 2

      // canvasX = 0
      myImageData.data[canvasX * 4 + canvasY * myImageData.width * 4] = 0
      myImageData.data[canvasX * 4 + canvasY * myImageData.width * 4 + 1] = 0
      myImageData.data[canvasX * 4 + canvasY * myImageData.width * 4 + 2] = 0

      // alpha channel
      myImageData.data[canvasX * 4 + canvasY * myImageData.width * 4 + 3] = 255

      const divisor = (mx > my ? mx : my) * zoomVariable
      // mx, my = 300
      // zoomVariable = 0,3
      // divisor = 90

      //z.real = -1,6 - та точка, для которой будет просчитан первый пиксель левого верхнего угла.
      let z = new ComplexNumber(x / divisor + xCenter, y / divisor - yCenter)
      for (let i = 0; i < 100; i++) {
        z = ComplexNumber.add(ComplexNumber.pow(z, 2), c)

        if (ComplexNumber.module(z) >= 2) {
          myImageData.data[canvasX * 4 + canvasY * myImageData.width * 4] = 255
          myImageData.data[canvasX * 4 + canvasY * myImageData.width * 4 + 1] = 255
          myImageData.data[canvasX * 4 + canvasY * myImageData.width * 4 + 2] = 255
          break
        }
      }
    }
  }

  self.postMessage({ type: 'renderCompleted', payload: myImageData })
}

function mandelbrotSet({ myImageData, mx, my, xCenter, yCenter }) {
  const zoomVariable = 0.2

  for (let y = -my / 2; y < my / 2; y++) {
    postProgress((y + my / 2) / my)
    for (let x = -mx / 2; x < mx / 2; x++) {
      const canvasY = y + my / 2
      const canvasX = x + mx / 2

      myImageData.data[canvasX * 4 + canvasY * myImageData.width * 4] = 0
      myImageData.data[canvasX * 4 + canvasY * myImageData.width * 4 + 1] = 0
      myImageData.data[canvasX * 4 + canvasY * myImageData.width * 4 + 2] = 0

      // alpha channel
      myImageData.data[canvasX * 4 + canvasY * myImageData.width * 4 + 3] = 255

      const divisor = (mx > my ? mx : my) * zoomVariable

      let z = new ComplexNumber()
      const c = new ComplexNumber(x / divisor + xCenter, y / divisor - yCenter)
      for (let i = 0; i < 100; i++) {
        z = ComplexNumber.add(ComplexNumber.pow(z, 2), c)

        if (ComplexNumber.module(z) >= 2) {
          myImageData.data[canvasX * 4 + canvasY * myImageData.width * 4] = 255
          myImageData.data[canvasX * 4 + canvasY * myImageData.width * 4 + 1] = 255
          myImageData.data[canvasX * 4 + canvasY * myImageData.width * 4 + 2] = 255
          break
        }
      }
    }
  }

  self.postMessage({ type: 'renderCompleted', payload: myImageData })
}

self.onmessage = e => {
  if (e && e.data) {
    const { fractal, ...rest } = e.data
    if (fractal === 0) {
      mandelbrotSet(rest)
    } else {
      juliaSet(rest)
    }
  }
}
