"use client";

const tabs = ["Todos os NFTs", "Novos lançamentos", "Em alta"];

export type NftTab = (typeof tabs)[number]

export default function NftTabs({ activeTab, onChange }: { activeTab: NftTab; onChange: (tab: NftTab) => void }) {

    return (
        <nav className="mb-5 flex gap-2 overflow-x-auto whitespace-nowrap">
            {tabs.map((tab) => {
                const isActive = activeTab === tab;

                return (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => onChange(tab)}
                        className={`border-b-2 pb-1 text-[11px] transition-colors ${isActive
                                ? "border-amber text-amber"
                                : "border-transparent text-foreground hover:text-amber"
                            }`}
                    >
                        {tab}
                    </button>
                );
            })}
        </nav>
    );
}