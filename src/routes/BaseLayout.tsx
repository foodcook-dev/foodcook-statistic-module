import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

export default function BaseLayout() {
  // 개발 환경에서만 padding 적용
  const isDev = import.meta.env.DEV;

  return (
    <>
      <Suspense fallback={null}>
        <section
          className="bg-background text-contrast"
          style={isDev ? { padding: '64px' } : undefined}
        >
          <Outlet />
        </section>
      </Suspense>
    </>
  );
}
