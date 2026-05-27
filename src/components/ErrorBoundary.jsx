import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error("[ErrorBoundary]", error, info);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="error-boundary-fallback">
          <div className="error-boundary-inner">
            <span className="error-boundary-eyebrow">[ AGENT // OFFLINE ]</span>
            <h1 className="error-boundary-title">Coś poszło nie tak.</h1>
            <p className="error-boundary-desc">
              System się wywrócił. Odśwież stronę albo napisz brief na{" "}
              <a href="mailto:biuro@vernex.pl">biuro@vernex.pl</a> — wracamy z
              propozycją architektury w 24h.
            </p>
            <button type="button" className="error-boundary-btn" onClick={this.handleReload}>
              Odśwież stronę
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
