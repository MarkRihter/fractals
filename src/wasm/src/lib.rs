extern crate num_complex;
extern crate wasm_bindgen;

use num_complex::Complex;
use wasm_bindgen::prelude::*;

struct Mandelbrot {
    c: Complex<f64>,
    z: Complex<f64>,
}
impl Mandelbrot {
    fn new(c: Complex<f64>) -> Self {
        Mandelbrot {
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

#[wasm_bindgen(module = "webWorker/index.ts")]
extern "C" {
    fn postProgress(progress: f64);
    fn completeRender(data: Vec<u8>, mx: usize, my: usize);
}

#[wasm_bindgen]
pub fn render_fractal(
    mx: usize,
    my: usize,
    fractal: usize,
    x_center: f64,
    y_center: f64,
    c_real: f64,
    c_imaginary: f64,
) {
    let mut payload = vec![0u8; mx * my * 4];

    for canvasY in 0..my {
        let y: f64 = canvasY as f64 - my as f64 / 2.0;
        postProgress(canvasY as f64 / my as f64);

        for canvasX in 0..mx {
            let x: f64 = canvasX as f64 - mx as f64 / 2.0;
            let divisor = if (mx > my) {
                mx as f64 * 0.25
            } else {
                my as f64 * 0.25
            };

            payload[canvasX * 4 + canvasY * mx * 4 + 3] = 255;

            let mut mandelbrot = Mandelbrot::new(Complex::new(
                x as f64 / divisor + x_center,
                y as f64 / divisor - y_center,
            ));

            for i in 0..100 {
                if (mandelbrot.next().unwrap_or(Complex::from(2.0)).norm() >= 2.0) {
                    payload[canvasX * 4 + canvasY * mx * 4] = 255;
                    payload[canvasX * 4 + canvasY * mx * 4 + 1] = 255;
                    payload[canvasX * 4 + canvasY * mx * 4 + 2] = 255;
                    break;
                }
            }
        }
    }

    completeRender(payload, mx, my)
}
