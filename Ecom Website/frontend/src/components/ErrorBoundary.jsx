import React from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon, HomeIcon } from '@heroicons/react/24/outline';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback, showDetails = false } = this.props;

      if (Fallback) {
        return <Fallback error={this.state.error} retry={this.handleRetry} />;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-lg w-full">
            <div className="bg-white rounded-2xl shadow-mobile-lg p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
                <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
              </div>

              <h1 className="text-responsive-2xl font-bold text-gray-900 mb-4">
                Oops! Something went wrong
              </h1>

              <p className="text-responsive-base text-gray-600 mb-8 leading-relaxed">
                We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={this.handleRetry}
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-mobile hover:shadow-mobile-lg focus-enhanced"
                >
                  <ArrowPathIcon className="h-5 w-5 mr-2" />
                  Try Again
                </button>

                <button
                  onClick={this.handleGoHome}
                  className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-900 font-semibold rounded-xl hover:bg-gray-300 transition-all duration-200 focus-enhanced"
                >
                  <HomeIcon className="h-5 w-5 mr-2" />
                  Go Home
                </button>
              </div>

              {showDetails && process.env.NODE_ENV === 'development' && (
                <details className="mt-8 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                    Error Details (Development Only)
                  </summary>
                  <div className="mt-4 p-4 bg-gray-100 rounded-lg text-xs font-mono text-red-800 overflow-auto max-h-40">
                    <p className="font-semibold mb-2">Error:</p>
                    <pre className="whitespace-pre-wrap mb-4">{this.state.error?.toString()}</pre>
                    <p className="font-semibold mb-2">Stack Trace:</p>
                    <pre className="whitespace-pre-wrap">{this.state.errorInfo?.componentStack}</pre>
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
