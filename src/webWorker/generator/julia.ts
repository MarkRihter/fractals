import { ComplexNumber } from 'classes'

export default function* juliaGenerator(
  c: ComplexNumber,
  z: ComplexNumber
): IterableIterator<ComplexNumber> {
  while (true) {
    z = ComplexNumber.add(ComplexNumber.pow(z, 2), c)
    yield z
  }
}
