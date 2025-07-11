interface TabItem {
  id: string;
  label?: string;
}

interface TabListProps {
  tabs: TabItem[];
  selectedTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export default function TabList({
  tabs,
  selectedTab,
  onTabChange,
  className = "",
}: TabListProps) {
  return (
    <div className={`tab-list-panel ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${
            selectedTab === tab.id
              ? "bg-black/30 text-blue-900"
              : "bg-white/30 text-white/70 hover:bg-white/20"
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label || tab.id.charAt(0).toUpperCase() + tab.id.slice(1)}
        </button>
      ))}
    </div>
  );
}
