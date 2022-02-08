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

self.onmessage = async e => {
  if (e && e.data) {
    const c = new ComplexNumber(-1.395, 0.005)
    const { myImageData, mx, my } = e.data
    const zoomVariable = 1

    console.log(mx, my)

    for (let y = -my / 2; y < my / 2; y++) {
      for (let x = -mx / 2; x < mx / 2; x++) {
        // x = -150

        const canvasY = y + my / 2
        const canvasX = x + mx / 2

        // canvasX = 0
        myImageData.data[canvasX * 4 + canvasY * myImageData.width * 4] = 255
        myImageData.data[canvasX * 4 + canvasY * myImageData.width * 4 + 3] = 255

        const divisor = (mx > my ? mx : my) * zoomVariable
        // mx, my = 300
        // zoomVariable = 0,3
        // divisor = 90

        //z.real = -1,6 - та точка, для которой будет просчитан первый пиксель левого верхнего угла.
        let z = new ComplexNumber(x / divisor, y / divisor)
        for (let i = 0; i < 100; i++) {
          z = ComplexNumber.add(ComplexNumber.pow(z, 2), c)

          if (ComplexNumber.module(z) >= 2) {
            myImageData.data[canvasX * 4 + canvasY * myImageData.width * 4] = 0
            break
          }
        }
      }
    }

    self.postMessage(myImageData)
  }
}
