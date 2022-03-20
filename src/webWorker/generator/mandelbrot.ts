import { ComplexNumber } from 'classes'

export default function* mandelbrotGenerator(c: ComplexNumber): IterableIterator<ComplexNumber> {
  let z = new ComplexNumber()
  while (true) {
    z = ComplexNumber.add(ComplexNumber.pow(z, 2), c)
    yield z
  }
}
