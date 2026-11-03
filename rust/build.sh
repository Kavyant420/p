#!/usr/bin/env bash
# Compile the Rust scroll-performance kernel to WASM and wire it into the site.
set -euo pipefail
cd "$(dirname "$0")"
export PATH="$HOME/.cargo/bin:$PATH"
rustup target add wasm32-unknown-unknown >/dev/null 2>&1 || true
echo "[1/3] cargo build --release (wasm32, features=wasm)"
cargo build --release --target wasm32-unknown-unknown --features wasm
echo "[2/3] wasm-bindgen CLI"
if ! command -v wasm-bindgen >/dev/null; then cargo install wasm-bindgen-cli --locked -q; fi
mkdir -p ../js/wasm
wasm-bindgen target/wasm32-unknown-unknown/release/lc_perf.wasm --out-dir ../js/wasm --target web
echo "[3/3] native unit tests (fast sanity)"
cargo test -q
echo "done → js/wasm/lc_perf.js (auto-loaded by js/codebloom.js)"
