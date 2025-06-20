import React, { useState, useMemo, useEffect } from 'react';
import { 
    Landmark, ShoppingCart, TrendingUp, TrendingDown, Sun, Moon, X,
    Home, Utensils, Car, ShoppingBag, BookOpen, HeartPulse, Gamepad2, Wrench, Wifi, Dog, Gift, Package, PiggyBank, Briefcase, Repeat, Scale
} from 'lucide-react';

// --- Constantes y Datos de Configuración ---

const BCV_RATE = 36.50;
const PARALLEL_RATE = 38.20;

const incomeCategories = [
    { name: 'Salario', icon: Briefcase },
    { name: 'Bonificaciones', icon: Gift },
    { name: 'Inversiones', icon: PiggyBank },
    { name: 'Regalos', icon: Gift },
    { name: 'Ventas', icon: ShoppingBag },
    { name: 'Reembolsos', icon: Repeat },
    { name: 'Otros', icon: Package },
];

const expenseCategories = [
    { name: 'Hogar', icon: Home },
    { name: 'Comida', icon: Utensils },
    { name: 'Transporte', icon: Car },
    { name: 'Compras', icon: ShoppingBag },
    { name: 'Educación', icon: BookOpen },
    { name: 'Salud', icon: HeartPulse },
    { name: 'Entretenimiento', icon: Gamepad2 },
    { name: 'Servicios', icon: Wrench },
    { name: 'Internet', icon: Wifi },
    { name: 'Mascotas', icon: Dog },
    { name: 'Regalos', icon: Gift },
    { name: 'Otros', icon: Package },
];

// --- Componentes de la UI ---

const Toast = ({ message, type }) => {
    if (!message) return null;

    const toastStyles = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
    };

    return (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 transition-transform duration-300 transform animate-fade-in-down ${toastStyles[type]}`}>
            {message}
        </div>
    );
};

const SummaryCard = ({ title, amount, trend, trendPercentage, rateBcv, rateParallel }) => {
    const isPositive = amount >= 0;
    const TrendIcon = trend ? (isPositive ? TrendingUp : TrendingDown) : null;
    const trendColor = isPositive ? 'text-green-400' : 'text-red-400';

    const amountColor = useMemo(() => {
        if (title === 'Ingresos') return 'text-green-400';
        if (title === 'Gastos') return 'text-red-400';
        return isPositive ? 'text-cyan-400' : 'text-orange-400';
    }, [title, isPositive]);

    const cardStyles = useMemo(() => {
        if (title === 'Ingresos') {
            return {
                bg: 'bg-green-900/30 dark:bg-green-100',
                border: 'border-green-500/50 dark:border-green-300'
            };
        }
        if (title === 'Gastos') {
            return {
                bg: 'bg-red-900/30 dark:bg-red-100',
                border: 'border-red-500/50 dark:border-red-300'
            };
        }
        // Balance
        return {
            bg: 'bg-cyan-900/30 dark:bg-cyan-100',
            border: 'border-cyan-500/50 dark:border-cyan-300'
        };
    }, [title]);
    
    return (
        <div className={`relative rounded-2xl p-6 border-2 ${cardStyles.bg} ${cardStyles.border} flex-1 min-w-[280px] transition-all duration-300 hover:scale-[1.02]`}>
            <div className="relative z-10">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-300 dark:text-gray-600">{title}</h3>
                    {TrendIcon && (
                        <div className={`flex items-center text-sm font-bold ${trendColor}`}>
                            <TrendIcon size={20} className="mr-1" />
                            <span>{trendPercentage}%</span>
                        </div>
                    )}
                </div>
                <p className={`text-4xl font-mono font-bold mt-4 tracking-tighter ${amountColor}`}>
                    {amount.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs
                </p>
                <div className="mt-4 space-y-1 text-sm font-mono text-gray-400 dark:text-gray-500">
                    <p>BCV: <span className="font-bold text-blue-400">${(amount / rateBcv).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
                    <p>Paralelo: <span className="font-bold text-purple-400">${(amount / rateParallel).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
                </div>
            </div>
        </div>
    );
};


const TransactionModal = ({ type, onClose, onAddTransaction, showToast }) => {
    const [amount, setAmount] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);

    const title = type === 'income' ? 'Nuevo Ingreso' : 'Nuevo Gasto';
    const buttonText = type === 'income' ? 'Confirmar Ingreso' : 'Pagar';
    const categories = type === 'income' ? incomeCategories : expenseCategories;
    const buttonClass = type === 'income' 
        ? 'bg-green-500 hover:bg-green-600' 
        : 'bg-red-500 hover:bg-red-600';

    const handleAdd = () => {
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            showToast('Por favor, introduce un monto válido.', 'error');
            return;
        }
        if (!selectedCategory) {
            showToast('Por favor, selecciona una categoría.', 'error');
            return;
        }
        onAddTransaction({
            id: Date.now(),
            type,
            amount: numericAmount,
            category: selectedCategory.name,
            icon: selectedCategory.icon,
        });
        showToast(`'${selectedCategory.name}' agregado exitosamente`, 'success');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-40 animate-fade-in">
            <div className="bg-gray-950/95 dark:bg-gray-50/95 border border-white/10 dark:border-gray-900/10 rounded-3xl p-6 md:p-8 w-11/12 max-w-md m-4 shadow-2xl animate-scale-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white dark:text-gray-800">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-gray-900 transition-colors">
                        <X size={28} />
                    </button>
                </div>
                
                <div className="text-center my-8">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00 Bs"
                        className="text-5xl md:text-6xl font-mono font-bold bg-transparent border-b-2 border-gray-600 dark:border-gray-300 focus:border-purple-400 dark:focus:border-purple-500 outline-none text-center w-full text-white dark:text-gray-900 transition-colors"
                    />
                </div>

                <div className="mb-8">
                    <h3 className="text-gray-400 dark:text-gray-600 font-semibold mb-4 text-center">Selecciona una Categoría</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                        {categories.map((cat) => {
                            const Icon = cat.icon;
                            const isSelected = selectedCategory?.name === cat.name;
                            return (
                                <button
                                    key={cat.name}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 aspect-square text-white/70 dark:text-black/70 ${isSelected ? 'bg-purple-500 dark:bg-purple-600 text-white dark:text-white shadow-lg scale-105' : 'bg-gray-900 dark:bg-gray-200 hover:bg-gray-800 dark:hover:bg-gray-300'}`}
                                >
                                    <Icon size={28} className="mb-1" />
                                    <span className="text-xs text-center">{cat.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <button
                    onClick={handleAdd}
                    disabled={!amount || !selectedCategory}
                    className={`w-full py-4 rounded-xl text-white font-bold text-lg ${buttonClass} transition-all duration-300 disabled:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105`}
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

// --- Componente Principal de la Aplicación ---

export default function App() {
    const [theme, setTheme] = useState('light');
    const [transactions, setTransactions] = useState([]);
    const [modal, setModal] = useState(null);
    const [toast, setToast] = useState({ message: '', type: '', key: 0 });

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    const showToast = (message, type) => {
        setToast({ message, type, key: Date.now() });
        setTimeout(() => {
            setToast({ message: '', type: '', key: 0 });
        }, 3000);
    };

    const handleAddTransaction = (transaction) => {
        setTransactions([...transactions, transaction]);
    };

    const handleDeleteTransaction = (id) => {
        setTransactions(transactions.filter(t => t.id !== id));
        showToast('Transacción eliminada.', 'success');
    };

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const { totalIncome, totalExpenses, netBalance } = useMemo(() => {
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        return { totalIncome: income, totalExpenses: expenses, netBalance: income - expenses };
    }, [transactions]);
    
    const netPercentage = useMemo(() => {
        if (totalIncome === 0) return totalExpenses > 0 ? -100 : 0;
        return ((netBalance / totalIncome) * 100).toFixed(0);
    }, [totalIncome, netBalance, totalExpenses]);

    return (
        <div className={`min-h-screen bg-black dark:bg-gray-100 text-gray-200 dark:text-gray-800 transition-colors duration-300 font-sans`}>
            <Toast key={toast.key} message={toast.message} type={toast.type} />

            <div className="container mx-auto p-4 md:p-8 max-w-4xl">
                {/* Cabecera */}
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-extrabold text-white dark:text-black">
                        Tracker App
                    </h1>
                    <div className="flex items-center space-x-4">
                        <div className="hidden sm:flex items-center space-x-3 text-xs font-mono">
                            <div className="bg-green-900/50 dark:bg-green-100 text-green-300 dark:text-green-800 px-3 py-1 rounded-lg">
                                BCV: <span className="font-bold">{BCV_RATE.toFixed(2)}</span>
                            </div>
                             <div className="bg-green-900/50 dark:bg-green-100 text-green-300 dark:text-green-800 px-3 py-1 rounded-lg">
                                Paralelo: <span className="font-bold">{PARALLEL_RATE.toFixed(2)}</span>
                            </div>
                        </div>
                        <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-800 dark:bg-gray-200">
                            {theme === 'light' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-blue-500" />}
                        </button>
                    </div>
                </header>

                {/* Resumen Financiero */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <SummaryCard title="Ingresos" amount={totalIncome} rateBcv={BCV_RATE} rateParallel={PARALLEL_RATE} />
                    <SummaryCard title="Gastos" amount={totalExpenses} rateBcv={BCV_RATE} rateParallel={PARALLEL_RATE} />
                    <SummaryCard title="Balance" amount={netBalance} trend trendPercentage={netPercentage} rateBcv={BCV_RATE} rateParallel={PARALLEL_RATE}/>
                </section>

                {/* Botones de Acción */}
                <section className="flex flex-col sm:flex-row gap-4 mb-8">
                    <button onClick={() => setModal('income')} className="flex-1 flex items-center justify-center p-4 bg-green-500/10 dark:bg-green-500/20 text-green-300 dark:text-green-700 rounded-xl hover:bg-green-500/20 dark:hover:bg-green-500/30 transition-all duration-300 transform hover:scale-[1.02] border-2 border-green-500/30">
                        <Landmark size={24} className="mr-3" />
                        <span className="font-semibold text-lg">Agregar Ingreso</span>
                    </button>
                    <button onClick={() => setModal('expense')} className="flex-1 flex items-center justify-center p-4 bg-red-500/10 dark:bg-red-500/20 text-red-300 dark:text-red-700 rounded-xl hover:bg-red-500/20 dark:hover:bg-red-500/30 transition-all duration-300 transform hover:scale-[1.02] border-2 border-red-500/30">
                        <ShoppingCart size={24} className="mr-3" />
                        <span className="font-semibold text-lg">Agregar Gasto</span>
                    </button>
                </section>
                
                {/* Historial de Transacciones */}
                <section>
                    <h2 className="text-2xl font-bold mb-4 text-white dark:text-black">Historial</h2>
                    <div className="space-y-3">
                        {transactions.length === 0 ? (
                            <p className="text-center text-gray-400 dark:text-gray-500 py-8">No hay transacciones todavía.</p>
                        ) : (
                            [...transactions].reverse().map(t => {
                                const Icon = t.icon;
                                const isIncome = t.type === 'income';
                                return (
                                    <div key={t.id} className="flex items-center p-4 bg-gray-900/80 dark:bg-white/60 backdrop-blur-sm rounded-xl animate-fade-in-up">
                                        <div className={`p-3 rounded-full mr-4 ${isIncome ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                                            <Icon size={24} className={isIncome ? 'text-green-500' : 'text-red-500'} />
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-bold text-white dark:text-black">{t.category}</p>
                                            <div className="flex flex-col sm:flex-row sm:space-x-4 text-xs font-mono text-gray-400 dark:text-gray-500">
                                                <span>BCV: ${(t.amount / BCV_RATE).toFixed(2)}</span>
                                                <span>Paralelo: ${(t.amount / PARALLEL_RATE).toFixed(2)}</span>
                                            </div>
                                        </div>
                                        <div className="text-right font-mono mr-4">
                                            <p className={`font-bold text-lg ${isIncome ? 'text-green-500' : 'text-red-500'}`}>
                                                {isIncome ? '+' : '-'} {t.amount.toLocaleString('es-VE', { minimumFractionDigits: 2 })} Bs
                                            </p>
                                        </div>
                                        <button onClick={() => handleDeleteTransaction(t.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                            <X size={20} />
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>
            </div>
            
            {modal && <TransactionModal type={modal} onClose={() => setModal(null)} onAddTransaction={handleAddTransaction} showToast={showToast} />}
        </div>
    );
}

const style = document.createElement('style');
style.textContent = `
    @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes fade-in-down {
        from { opacity: 0; transform: translateY(-20px) translateX(-50%); }
        to { opacity: 1; transform: translateY(0) translateX(-50%); }
    }
    @keyframes scale-in {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }
    @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
    .animate-fade-in-down { animation: fade-in-down 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
    .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
    .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
`;
document.head.appendChild(style);