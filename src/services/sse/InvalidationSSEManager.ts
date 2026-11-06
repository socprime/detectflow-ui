import type { SSEConfig } from './SSEManager';

export interface InvalidationSSECallbacks {
  onInvalidation: () => void;
  onConnected?: (connected: boolean) => void;
  onError: (error: string) => void;
}

export interface InvalidationSSEManagerConfig extends SSEConfig {
  invalidationEventName: string;
  connectionEventName?: string;
}

export class InvalidationSSEManager {
  private eventSource: EventSource | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private isDisconnecting = false;

  constructor(
    private config: InvalidationSSEManagerConfig,
    private callbacks: InvalidationSSECallbacks,
  ) {}

  connect() {
    if (this.eventSource?.readyState === EventSource.OPEN) {
      return;
    }

    this.isDisconnecting = false;
    this.clearEventSource();

    try {
      this.eventSource = new EventSource(this.config.streamUrl, { withCredentials: true });

      const connectionEventName = this.config.connectionEventName ?? 'connection_established';

      this.eventSource.addEventListener(connectionEventName, () => {
        this.reconnectAttempts = 0;
        this.callbacks.onConnected?.(true);
      });

      this.eventSource.addEventListener(this.config.invalidationEventName, () => {
        this.callbacks.onInvalidation();
      });

      this.eventSource.onopen = () => {
        this.reconnectAttempts = 0;
        this.callbacks.onConnected?.(true);
      };

      this.eventSource.onmessage = (event) => {
        try {
          const parsed: unknown = JSON.parse(event.data);
          if (!parsed || typeof parsed !== 'object') {
            return;
          }

          const message = parsed as { type?: string; error?: string };
          if (message.type === this.config.invalidationEventName) {
            this.callbacks.onInvalidation();
          } else if (message.type === 'error' && message.error) {
            this.callbacks.onError(message.error);
          }
        } catch {
          // Heartbeat or non-JSON payloads are ignored.
        }
      };

      this.eventSource.onerror = (error) => {
        console.error('[InvalidationSSEManager] Error:', error);
        this.callbacks.onConnected?.(false);
        this.clearEventSource();

        if (!this.isDisconnecting) {
          this.attemptReconnect();
        }
      };
    } catch (err) {
      console.error('[InvalidationSSEManager] Connection failed:', err);
      this.callbacks.onError('SSE connection failed');
    }
  }

  private attemptReconnect() {
    if (!this.config.reconnect || this.reconnectAttempts >= (this.config.reconnectAttempts || 10)) {
      console.error('[InvalidationSSEManager] Max reconnect attempts reached');
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
