// src/components/ui/tabs.tsx
import * as React from 'react';

interface TabsContextValue {
  active: string;
  setActive: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue>({
  active: '',
  setActive: () => {},
});

function Tabs({
  defaultValue,
  children,
  className,
}: {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [active, setActive] = React.useState(defaultValue);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`border-border flex items-center border-b ${className ?? ''}`}>{children}</div>
  );
}

function TabsTrigger({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { active, setActive } = React.useContext(TabsContext);
  const isActive = active === value;

  return (
    <button
      onClick={() => setActive(value)}
      className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
        isActive
          ? "text-primary after:bg-primary after:absolute after:bottom-[-1px] after:left-0 after:h-[2px] after:w-full after:content-['']"
          : 'text-contrast/50 hover:text-contrast/80'
      } ${className ?? ''}`}
    >
      {children}
    </button>
  );
}

function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { active } = React.useContext(TabsContext);
  if (active !== value) return null;
  return <div className={`pt-4 ${className ?? ''}`}>{children}</div>;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
