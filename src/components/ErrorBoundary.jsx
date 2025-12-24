import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
                    <div className="max-w-md w-full space-y-6 text-center">
                        <div className="text-6xl">😔</div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Something went wrong
                        </h1>
                        <p className="text-gray-600">
                            We're sorry for the inconvenience. The page encountered an error.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="text-left bg-red-50 p-4 rounded-lg border border-red-200">
                                <summary className="cursor-pointer font-medium text-red-700 mb-2">
                                    Error Details (Dev Only)
                                </summary>
                                <pre className="text-xs text-red-600 overflow-auto">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                Return to Home
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Reload Page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
