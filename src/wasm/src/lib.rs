extern crate num_complex;
extern crate wasm_bindgen;
extern crate console_error_panic_hook;
mod iterators;

use std::panic;
use num_complex::Complex;
use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
use iterators::{julia::Julia, mandelbrot::Mandelbrot};

#[wasm_bindgen(module = "webWorker/index.ts")]
extern {
    fn postProgress(progress: f64);
    fn completeRender(data: Vec<u8>, mx: usize, my: usize);
}

#[wasm_bindgen]
extern {
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u32(a: f64);

    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_usize(a: usize);

    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_i32(a: i32);
}

#[derive(Serialize, Deserialize)]
struct FractalConfig {
    x_size: usize,
    y_size: usize,
    fractal_type: usize,
    x_center: f64,
    y_center: f64,
    c_real: f64,
    c_imaginary: f64,
    zoom: f64,
    iterations_count: i32,
}

#[wasm_bindgen(start)]
pub fn main() {
    panic::set_hook(Box::new(console_error_panic_hook::hook));
}

#[wasm_bindgen]
pub fn render_fractal(fractal_config: JsValue) {
    let fractal: FractalConfig = serde_wasm_bindgen::from_value(fractal_config).unwrap();

    let mut payload = vec![0u8; fractal.x_size * fractal.y_size * 4];
    let mut dispatched_progress: f64 = 0.0;

    for canvasY in 0..fractal.y_size {
        let y: f64 = canvasY as f64 - fractal.y_size as f64 / 2.0;

        let current_progress = (canvasY as f64 / fractal.y_size as f64 * 100.0).trunc() / 100.0;
        if current_progress > dispatched_progress {
            dispatched_progress = current_progress;
            postProgress(current_progress);
        }

        for canvasX in 0..fractal.x_size {
            let x: f64 = canvasX as f64 - fractal.x_size as f64 / 2.0;
            let divisor = if fractal.x_size > fractal.y_size {
                fractal.x_size as f64 * 0.25 * fractal.zoom
            } else {
                fractal.y_size as f64 * 0.25 * fractal.zoom
            };

            payload[canvasX * 4 + canvasY * fractal.x_size * 4 + 3] = 255;

            let mut mandelbrot = Mandelbrot::new(Complex::new(
                x as f64 / divisor + fractal.x_center,
                y as f64 / divisor - fractal.y_center,
            ));
            let mut julia = Julia::new(
                Complex::new(fractal.c_real, fractal.c_imaginary),
                Complex::new(x as f64 / divisor + fractal.x_center, y as f64 / divisor - fractal.y_center),
            );

            for i in 0..fractal.iterations_count {
                let z = match fractal.fractal_type {
                    0 => mandelbrot.next().unwrap_or(Complex::from(2.0)).norm(),
                    1 => julia.next().unwrap_or(Complex::from(2.0)).norm(),
                    _ => 2.0,
                };

                if z >= 2.0 {
                    let i_f64 = i as f64;

                    payload[canvasX * 4 + canvasY * fractal.x_size * 4] =
                        ((0.016 * i_f64 + 2.0).sin() * 100.0 + 155.0) as u8;
                    payload[canvasX * 4 + canvasY * fractal.x_size * 4 + 1] =
                        ((0.014 * i_f64 + 3.0).sin() * 100.0 + 155.0) as u8;
                    payload[canvasX * 4 + canvasY * fractal.x_size * 4 + 2] =
                        ((0.05 * i_f64 + 4.0).sin() * 100.0 + 155.0) as u8;

                    break;
                }
            }
        }
    }

    completeRender(payload, fractal.x_size, fractal.y_size)
}
