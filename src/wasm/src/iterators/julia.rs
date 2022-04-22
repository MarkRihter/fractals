use num_complex::Complex;

pub struct Julia {
    c: Complex<f64>,
    z: Complex<f64>,
}
impl Julia {
    pub fn new(c: Complex<f64>, z: Complex<f64>) -> Self {
        Self { c, z }
    }
}
impl Iterator for Julia {
    type Item = Complex<f64>;

    fn next(&mut self) -> Option<Self::Item> {
        self.z = self.z * self.z + self.c;
        return Some(self.z);
    }
}
