

export const Logo = ({ className = "w-12 h-12", textSize = "text-2xl" }: { className?: string; textSize?: string }) => {
    return (
        <div className="flex items-center gap-3">
            <div className={`relative ${className}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-purple-500 rounded-lg transform rotate-45 shadow-lg shadow-purple-500/20">
                    <div className="absolute inset-0.5 bg-gray-900 rounded">
                        <div className="h-full w-full flex items-center justify-center">
                            <span className={`${textSize} font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-500 select-none`}>$</span>
                        </div>
                    </div>
                </div>
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-teal-400 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-purple-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
                <div className="flex items-center">
                    <span className="h-px w-3 bg-white/50 mr-2"></span>
                    <h1 className={`${textSize} font-bold tracking-wider text-white`}>FGC</h1>
                    <span className="h-px w-3 bg-white/50 ml-2"></span>
                </div>
                <div className="flex text-xs tracking-widest justify-between">
                    <span className="text-teal-400 font-bold">MONEY</span>
                    <span className="text-purple-500 font-bold ml-1">MATCH</span>
                </div>
            </div>
        </div>
    );
};
