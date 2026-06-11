//! andromeda-core — Foundational engine primitives (Rust).
//!
//! Phase 0 stub crate.

/// Returns the crate name. Placeholder until the corresponding MVP milestone.
pub fn andromeda_core_name() -> &'static str {
    "andromeda-core"
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn returns_name() {
        assert_eq!(andromeda_core_name(), "andromeda-core");
    }
}
