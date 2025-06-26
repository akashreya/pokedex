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
    <div
      className={`flex gap-2 justify-center mb-6 text-gray-800 ${className}`}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`px-4 py-2 rounded-2xl font-semibold transition-all cursor-pointer capitalize ${
            selectedTab === tab.id
              ? "bg-white/30 text-blue-900"
              : "bg-white/10 text-white/70 hover:bg-white/20"
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label || tab.id.charAt(0).toUpperCase() + tab.id.slice(1)}
        </button>
      ))}
    </div>
  );
}
