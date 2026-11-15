interface Props {
    selectedInjury: string;
    onSelect: (injury: string) => void;
}

export default function InjurySelector({ selectedInjury, onSelect }: Props) {
    const injuries = ["Laceration", "Burn", "Sprain"];

    return (
        <div className="p-6 bg-blue-700 rounded-lg border border-blue-950">
            <h2 className="text-xl font-bold mb-4 text-white">Select Injury Type</h2>
            <div className="flex flex-wrap gap-2">
                {injuries.map((injury) => (
                    <button
                    key={injury}
                    onClick={() => onSelect(injury)}
                    className={`px-4 py-2 rounded-lg border border-blue-950${
                        selectedInjury === injury
                        ? 'bg-blue-500'
                            : 'bg-blue-600'
                    }`}
                    >
                        {injury}
                    </button>
                ))}
            </div>
        </div>
    );
}