export function getTokenFromUrl(): string | null {
  const hash = window.location.hash;
  const params = new URLSearchParams(hash.split('?')[1] || '');
  return params.get('token');
}

export function getTokenFromStorage(): string | null {
  return localStorage.getItem('iframe_token');
}

export function setTokenToStorage(token: string): void {
  localStorage.setItem('iframe_token', token);
}

export function clearTokenFromStorage(): void {
  localStorage.removeItem('iframe_token');
}

export function getCurrentToken(): string | null {
  // URL에서 토큰을 먼저 확인하고, 없으면 localStorage에서 가져옴
  const urlToken = getTokenFromUrl();
  if (urlToken) {
    setTokenToStorage(urlToken);
    return urlToken;
  }
  return getTokenFromStorage();
}
