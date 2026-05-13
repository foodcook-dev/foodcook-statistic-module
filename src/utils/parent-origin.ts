export function resolveParentOrigin(): string {
  const tryParse = (v?: string | null): string => {
    try {
      return v ? new URL(v).origin : '';
    } catch {
      return '';
    }
  };

  const locked = (window as any).__PARENT_ORIGIN || sessionStorage.getItem('parent_origin_locked');

  return tryParse(locked) || '*';
}
