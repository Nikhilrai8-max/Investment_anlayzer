import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="card p-6 max-w-2xl text-center">
            <h2 className="text-xl font-semibold">UI Error</h2>
            <pre className="mt-3 text-sm text-slate-300">{String(this.state.error)}</pre>
            <p className="mt-3 text-slate-400">Open the browser console for full stack trace.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
