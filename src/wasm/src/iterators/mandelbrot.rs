use num_complex::Complex;

pub struct Mandelbrot {
    c: Complex<f64>,
    z: Complex<f64>,
}
impl Mandelbrot {
    pub fn new(c: Complex<f64>) -> Self {
        Self {
            c,
            z: Complex::new(0.0, 0.0),
        }
    }
}
impl Iterator for Mandelbrot {
    type Item = Complex<f64>;

    fn next(&mut self) -> Option<Self::Item> {
        self.z = self.z * self.z + self.c;
        return Some(self.z);
    }
}
