import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: "2rem", backgroundColor: "#1a1a1a", color: "white", height: "100vh", fontFamily: "monospace" }}>
                    <h1 style={{ color: "#ef4444" }}>Something went wrong.</h1>
                    <h2 style={{ color: "#fca5a5" }}>{this.state.error?.message}</h2>
                    <pre style={{ backgroundColor: "#000", padding: "1rem", borderRadius: "0.5rem", overflow: "auto" }}>
                        {this.state.error?.stack}
                    </pre>
                    <button
                        onClick={() => window.location.reload()}
                        style={{ marginTop: "1rem", padding: "0.5rem 1rem", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "0.25rem", cursor: "pointer" }}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
