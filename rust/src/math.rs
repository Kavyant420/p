//! Shared numeric helpers used by both native and wasm builds.

/// Clamp without branching surprises on NaN (NaN -> lo).
#[inline(always)]
pub fn clamp(v: f64, lo: f64, hi: f64) -> f64 {
    if v.is_nan() { lo } else if v < lo { lo } else if v > hi { hi } else { v }
}

/// Frame-rate independent exponential smoothing coefficient.
/// `half_life` in seconds, `dt` in seconds.
#[inline(always)]
pub fn smooth_coef(half_life: f64, dt: f64) -> f64 {
    1.0 - (-2.0f64.ln() * dt / half_life.max(f64::EPSILON)).exp()
}

/// Map value from one range to another with clamping.
#[inline(always)]
pub fn remap(v: f64, a: f64, b: f64, c: f64, d: f64) -> f64 {
    let t = clamp((v - a) / (b - a), 0.0, 1.0);
    c + (d - c) * t
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test] fn clamp_nan_safe() { assert_eq!(clamp(f64::NAN, 0.0, 1.0), 0.0); }
    #[test] fn remap_works() { assert!((remap(0.5, 0.0, 1.0, 10.0, 20.0) - 15.0).abs() < 1e-9); }
    #[test] fn coef_sane() { let c = smooth_coef(0.1, 1.0/60.0); assert!(c > 0.0 && c < 1.0); }
}
