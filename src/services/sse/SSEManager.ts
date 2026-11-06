export interface SSEConfig {
  streamUrl: string;
  enabled?: boolean;
  reconnect?: boolean;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

export interface SSECallbacks<T> {
  onDataUpdate: (data: T) => void;
  onConnected?: (connected: boolean) => void;
  onError: (error: string) => void;
}

export class SSEManager<T> {
  private eventSource: EventSource | null = null;

  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  private reconnectAttempts = 0;

  private isDisconnecting = false;

  constructor(
    private config: SSEConfig,
    private callbacks: SSECallbacks<T>,
    private dataEventName: string = 'dashboard_update',
  ) {}

  connect() {
    if (this.eventSource?.readyState === EventSource.OPEN) {
      return;
    }

    this.isDisconnecting = false;
    this.clearEventSource();

    try {
      this.eventSource = new EventSource(this.config.streamUrl, { withCredentials: true });
      this.eventSource.onopen = () => {
        this.reconnectAttempts = 0;
        this.callbacks.onConnected?.(true);
      };
      this.eventSource.addEventListener(this.dataEventName, (event: MessageEvent<string>) => {
        this.handlePayload(event.data, true);
      });
      this.eventSource.onmessage = (event) => {
        this.handlePayload(event.data, false);
      };
      this.eventSource.onerror = (error) => {
        console.error('[SSEManager] Error:', error);
        this.callbacks.onConnected?.(false);
        this.clearEventSource();

        if (!this.isDisconnecting) {
          this.attemptReconnect();
        }
      };
    } catch (err) {
      console.error('[SSEManager] Connection failed:', err);
      this.callbacks.onError('SSE connection failed');
    }
  }

  private handlePayload(raw: string, treatAsData: boolean) {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') {
        return;
      }

      const message = parsed as { type?: string; data?: T; error?: string };

      if (message.type === this.dataEventName && message.data) {
        this.callbacks.onDataUpdate(message.data);
        return;
      }

      if (message.type === 'error' && message.error) {
        this.callbacks.onError(message.error);
        return;
      }

      if (treatAsData || message.type == null) {
        this.callbacks.onDataUpdate(parsed as T);
      }
    } catch (err) {
      console.error('[SSEManager] Parse error:', err);
    }
  }

  private attemptReconnect() {
    if (!this.config.reconnect || this.reconnectAttempts >= (this.config.reconnectAttempts || 10)) {
      console.error('[SSEManager] Max reconnect attempts reached');
      return;
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, this.config.reconnectInterval || 3000);
  }

  private clearEventSource() {
    this.eventSource?.close();
    this.eventSource = null;
  }

  disconnect() {
    this.isDisconnecting = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.clearEventSource();
    this.reconnectTimer = null;
  }
}
