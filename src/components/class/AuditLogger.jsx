import { Component } from 'react';

const STORAGE_KEY = 'auditLogs';
const MAX_LOGS = 50;
const TOAST_MS = 3000;

/**
 * Task 3 – Class component with lifecycle methods.
 * Receives the latest inventory operation through the `event` prop
 * ({ id, type, message }) and keeps its own log list in this.state.
 */
class AuditLogger extends Component {
  constructor(props) {
    super(props);
    this.state = { logs: [], toast: null };
    this.toastTimer = null;
  }

  // Escape key dismisses the toast (global listener => must be cleaned up)
  handleKeyDown = (e) => {
    if (e.key === 'Escape' && this.state.toast) this.dismissToast();
  };

  dismissToast = () => {
    clearTimeout(this.toastTimer);
    this.toastTimer = null;
    this.setState({ toast: null });
  };

  clearLogs = () => this.setState({ logs: [] });

  componentDidMount() {
    // Retrieve initial audit logs from localStorage
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (Array.isArray(saved)) this.setState({ logs: saved });
    } catch {
      /* corrupted data – start with an empty log */
    }
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentDidUpdate(prevProps, prevState) {
    const { event } = this.props;

    // A new inventory operation arrived -> record it and show a toast
    if (event && event !== prevProps.event) {
      const entry = { ...event, time: new Date().toISOString() };
      this.setState((s) => ({
        logs: [entry, ...s.logs].slice(0, MAX_LOGS),
        toast: entry,
      }));
    }

    // Persist whenever the logs changed
    if (prevState.logs !== this.state.logs) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state.logs));
    }

    // Auto-hide the toast after a few seconds
    if (this.state.toast && this.state.toast !== prevState.toast) {
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(this.dismissToast, TOAST_MS);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.toastTimer);
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  render() {
    const { logs, toast } = this.state;
    return (
      <section className="card">
        <div className="card-head">
          <h2>Audit log ({logs.length})</h2>
          {logs.length > 0 && (
            <button className="btn small" onClick={this.clearLogs}>Clear</button>
          )}
        </div>

        {logs.length === 0 ? (
          <p className="empty">No operations recorded yet.</p>
        ) : (
          <ul className="log">
            {logs.map((l) => (
              <li key={l.id}>
                <span className={`dot ${l.type}`} />
                <span className="log-msg">{l.message}</span>
                <time className="muted">{new Date(l.time).toLocaleTimeString()}</time>
              </li>
            ))}
          </ul>
        )}

        {toast && (
          <div className={`toast ${toast.type}`} role="status" onClick={this.dismissToast}>
            {toast.message}
          </div>
        )}
      </section>
    );
  }
}

export default AuditLogger;
