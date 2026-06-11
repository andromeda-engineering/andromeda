//! andromeda-graph — Generic graph primitives (Rust).
//!
//! Phase 0 stub crate.

/// Returns the crate name. Placeholder until the corresponding MVP milestone.
pub fn andromeda_graph_name() -> &'static str {
    "andromeda-graph"
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn returns_name() {
        assert_eq!(andromeda_graph_name(), "andromeda-graph");
    }
}
