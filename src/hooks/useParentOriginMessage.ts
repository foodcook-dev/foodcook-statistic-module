import { useEffect, useRef } from 'react';
import { useTheme } from '@/components/modules/theme-provider';

/**
 * theme 변경 메시지를 부모 창에서 수신하여 적용하는 훅입니다.
 */
export function useParentOriginMessage() {
  const { setTheme } = useTheme();
  const lockedOriginRef = useRef<string | null>(null);

  useEffect(() => {
    const safeGetOrigin = (value?: string | null) => {
      try {
        return value ? new URL(value).origin : '';
      } catch {
        return '';
      }
    };

    lockedOriginRef.current =
      sessionStorage.getItem('parent_origin_locked') || lockedOriginRef.current;

    const expected = safeGetOrigin(
      new URLSearchParams(window.location.search).get('parent_origin'),
    );

    const handleMessage = (event: MessageEvent) => {
      if (event.source !== window.parent) return;
      const { type, theme: newTheme } = (event.data ?? {}) as any;

      let allow = false;
      if (expected) {
        allow = event.origin === expected;
      } else if (!lockedOriginRef.current) {
        if (type === 'THEME_CHANGE') {
          lockedOriginRef.current = event.origin;
          sessionStorage.setItem('parent_origin_locked', event.origin);
          allow = true;
        }
      } else {
        allow = event.origin === lockedOriginRef.current;
      }

      if (!allow) return;
      if (type === 'THEME_CHANGE') setTheme(newTheme);
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [setTheme]);
}
