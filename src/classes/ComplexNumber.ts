export default class ComplexNumber {
  real
  imaginary

  constructor(real = 0, imaginary = 0) {
    this.real = real
    this.imaginary = imaginary
  }

  static add(a: ComplexNumber, b: ComplexNumber) {
    return new ComplexNumber(a.real + b.real, a.imaginary + b.imaginary)
  }

  static module(a: ComplexNumber) {
    return Math.sqrt(Math.pow(a.real, 2) + Math.pow(a.imaginary, 2))
  }

  static multiply(a: ComplexNumber, b: ComplexNumber) {
    return new ComplexNumber(
      a.real * b.real - a.imaginary * b.imaginary,
      a.real * b.imaginary + b.real * a.imaginary
    )
  }

  static pow(base: ComplexNumber, exponent: number) {
    let resultNumber = { ...base }

    for (let i = 1; i < exponent; i++) {
      resultNumber = ComplexNumber.multiply(resultNumber, base)
    }

    return resultNumber
  }
}
