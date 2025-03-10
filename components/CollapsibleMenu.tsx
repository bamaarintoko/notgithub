interface CollapsibleMenuProps {
    id: string;
    title: string;
    isOpen: boolean;
    onClick: (id: string) => void;
    children: React.ReactNode;
}
export default function CollapsibleMenu({ id, title, isOpen, onClick, children }: CollapsibleMenuProps) {
    return (
        <div className="w-full space-y-1">
            <div onClick={() => onClick(id)} className="cursor-pointer bg-gray-200 py-2 px-3 flex">
                <p className={`flex text-black font-bold text-lg flex-col min-w-0 break-words`}>{title}</p>

                <div className="ml-auto">
                    <svg className={`w-6 h-6 text-gray-800 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m8 10 4 4 4-4" />
                    </svg>
                </div>
            </div>

            <div
                className={`space-y-2 pl-4 overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 overflow-y-auto" : "max-h-0"
                    }`}
            >
                {children}
            </div>
        </div>
    )
}