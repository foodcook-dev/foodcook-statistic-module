import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

export default function BaseLayout() {
  return (
    <>
      <Suspense fallback={null}>
        <section className="flex flex-col">
          <Outlet />
        </section>
      </Suspense>
    </>
  );
}
