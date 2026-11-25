#!/usr/bin/env bash
#
# Builds the Linux release binary plus the Windows (MSVC) binary cross-compiled via
# cargo-xwin, then assembles both into a server/vhdl_ls/<version>/ layout.
#
# Requirements:
#   - git, rustup, a native C toolchain (cc/gcc)
#   - clang + lld for cargo-xwin cross-linking on Linux, e.g.:
#       sudo apt-get install clang lld llvm
#
REPO_URL="https://github.com/fransschreuder/rust_hdl.git"
REPO_REF="feat/411-enhanced-unused-detection"
SRC_DIR="rust_hdl"
TOOLCHAIN="1.95"
WIN_TARGET="x86_64-pc-windows-msvc"

# --- Checkout rust_hdl ---------------------------------------------------------
if [ -d "${SRC_DIR}/.git" ]; then
  echo ">> Updating existing '${SRC_DIR}' checkout"
  git -C "${SRC_DIR}" fetch origin
  git -C "${SRC_DIR}" checkout "${REPO_REF}"
  git -C "${SRC_DIR}" reset --hard "origin/${REPO_REF}"
else
  echo ">> Cloning ${REPO_URL} (branch: ${REPO_REF})"
  git clone --depth 1 --branch "${REPO_REF}" "${REPO_URL}" "${SRC_DIR}"
fi

# --- Setup Rust toolchain (dtolnay/rust-toolchain equivalent) ------------------
rustup toolchain install "${TOOLCHAIN}" --profile minimal
export RUSTUP_TOOLCHAIN="${TOOLCHAIN}"   # scoped to this script; does not change your default

# --- Add Windows MSVC target ----------------------------------------------------
rustup target add "${WIN_TARGET}"

# Note: the CI job caches ~/.cargo/registry, ~/.cargo/git and rust_hdl/target.
# Locally those are simply reused between runs, so no caching logic is needed.

# --- Install cargo-xwin ---------------------------------------------------------
cargo install cargo-xwin

# --- Build vhdl_ls (Linux) ---------------------------------------------------------
cargo build --release --manifest-path "${SRC_DIR}/vhdl_ls/Cargo.toml"

# --- Build vhdl_ls (Windows, cross-compiled) ---------------------------------------
cargo xwin build --release --target "${WIN_TARGET}" --manifest-path "${SRC_DIR}/vhdl_ls/Cargo.toml"

# --- Assemble vhdl_ls binaries ------------------------------------------------------
VERSION=$(sed -n 's/^version = "\(.*\)"$/\1/p' "${SRC_DIR}/Cargo.toml" | head -n 1)
echo ">> Assembling vhdl_ls v${VERSION}"

# Linux (directory name kept as musl to match the CI layout exactly)
mkdir -p "server/vhdl_ls/${VERSION}/vhdl_ls-x86_64-unknown-linux-musl/bin"
cp -R "${SRC_DIR}/vhdl_libraries" "server/vhdl_ls/${VERSION}/vhdl_ls-x86_64-unknown-linux-musl/"
cp "${SRC_DIR}/target/release/vhdl_ls" "server/vhdl_ls/${VERSION}/vhdl_ls-x86_64-unknown-linux-musl/bin/"

# Windows
mkdir -p "server/vhdl_ls/${VERSION}/vhdl_ls-${WIN_TARGET}/bin"
cp -R "${SRC_DIR}/vhdl_libraries" "server/vhdl_ls/${VERSION}/vhdl_ls-${WIN_TARGET}/"
cp "${SRC_DIR}/target/${WIN_TARGET}/release/vhdl_ls.exe" "server/vhdl_ls/${VERSION}/vhdl_ls-${WIN_TARGET}/bin/"

echo ">> Done. Output in server/vhdl_ls/${VERSION}/"
