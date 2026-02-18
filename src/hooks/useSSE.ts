import { useCallback, useEffect, useRef, useState } from 'react';

export interface SSEConfig {
  url: string;
  reconnect?: boolean;
  reconnectInterval?: number;
  reconnectAttempts?: number;
  withCredentials?: boolean;
  onOpen?: (event: Event) => void;
  onError?: (event: Event) => void;
  onMessage?: (event: MessageEvent) => void;
}

export interface SSEState {
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  reconnectCount: number;
}

export interface SSEReturn extends SSEState {
  connect: () => void;
  disconnect: () => void;
  lastMessage: MessageEvent | null;
}

export const useSSE = (config: SSEConfig): SSEReturn => {
  const {
    url,
    reconnect = true,
    reconnectInterval = 3000,
    reconnectAttempts = 10,
    withCredentials = true,
    onOpen,
    onError,
    onMessage,
  } = config;

  const [state, setState] = useState<SSEState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    reconnectCount: 0,
  });

  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldReconnectRef = useRef<boolean>(true);
  const reconnectCountRef = useRef<number>(0);

  const connect = useCallback(() => {
    if (eventSourceRef.current?.readyState === EventSource.OPEN || state.isConnecting) {
      return;
    }

    try {
      setState((prev) => ({ ...prev, isConnecting: true, error: null }));

      const eventSource = new EventSource(url, { withCredentials });

      eventSource.onopen = (event) => {
        setState({
          isConnected: true,
          isConnecting: false,
          error: null,
          reconnectCount: reconnectCountRef.current,
        });
        reconnectCountRef.current = 0;
        onOpen?.(event);
      };

      eventSource.onmessage = (event) => {
        setLastMessage(event);
        onMessage?.(event);
      };

      eventSource.onerror = (event) => {
        const error = new Error('SSE connection error');
        setState((prev) => ({
          ...prev,
          error,
          isConnected: false,
          isConnecting: false,
        }));
        onError?.(event);

        eventSourceRef.current = null;

        if (
          shouldReconnectRef.current &&
          reconnect &&
          reconnectCountRef.current < reconnectAttempts
        ) {
          reconnectCountRef.current += 1;
          setState((prev) => ({ ...prev, reconnectCount: reconnectCountRef.current }));

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      eventSourceRef.current = eventSource;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Failed to connect'),
        isConnecting: false,
      }));
    }
  }, [
    url,
    withCredentials,
    state.isConnecting,
    reconnect,
    reconnectAttempts,
    reconnectInterval,
    onOpen,
    onMessage,
    onError,
  ]);

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    setState({
      isConnected: false,
      isConnecting: false,
      error: null,
      reconnectCount: 0,
    });
  }, []);

  useEffect(() => {
    return () => {
      shouldReconnectRef.current = false;
      disconnect();
    };
  }, [disconnect]);

  return {
    ...state,
    lastMessage,
    connect,
    disconnect,
  };
};
