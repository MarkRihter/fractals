extern crate num_complex;
extern crate wasm_bindgen;
mod iterators;

use iterators::{julia::Julia, mandelbrot::Mandelbrot};
use num_complex::Complex;
use wasm_bindgen::prelude::*;

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
    zoom: f64,
    iterations_count: i32,
) {
    let mut payload = vec![0u8; mx * my * 4];
    let mut dispatched_progress: f64 = 0.0;

    for canvasY in 0..my {
        let y: f64 = canvasY as f64 - my as f64 / 2.0;

        let current_progress = (canvasY as f64 / my as f64 * 100.0).trunc() / 100.0;
        if current_progress > dispatched_progress {
            dispatched_progress = current_progress;
            postProgress(current_progress);
        }

        for canvasX in 0..mx {
            let x: f64 = canvasX as f64 - mx as f64 / 2.0;
            let divisor = if mx > my {
                mx as f64 * 0.25 * zoom
            } else {
                my as f64 * 0.25 * zoom
            };

            payload[canvasX * 4 + canvasY * mx * 4 + 3] = 255;

            let mut mandelbrot = Mandelbrot::new(Complex::new(
                x as f64 / divisor + x_center,
                y as f64 / divisor - y_center,
            ));
            let mut julia = Julia::new(
                Complex::new(c_real, c_imaginary),
                Complex::new(x as f64 / divisor + x_center, y as f64 / divisor - y_center),
            );

            for i in 0..iterations_count {
                let z = match fractal {
                    0 => mandelbrot.next().unwrap_or(Complex::from(2.0)).norm(),
                    1 => julia.next().unwrap_or(Complex::from(2.0)).norm(),
                    _ => 2.0,
                };

                if z >= 2.0 {
                    let i_f64 = i as f64;

                    payload[canvasX * 4 + canvasY * mx * 4] =
                        ((0.016 * i_f64 + 2.0).sin() * 100.0 + 155.0) as u8;
                    payload[canvasX * 4 + canvasY * mx * 4 + 1] =
                        ((0.014 * i_f64 + 3.0).sin() * 100.0 + 155.0) as u8;
                    payload[canvasX * 4 + canvasY * mx * 4 + 2] =
                        ((0.05 * i_f64 + 4.0).sin() * 100.0 + 155.0) as u8;

                    break;
                }
            }
        }
    }

    completeRender(payload, mx, my)
}
