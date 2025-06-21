import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
    TrendingUp, TrendingDown, Sun, Moon, X,
    Home, Utensils, Car, ShoppingBag, BookOpen, HeartPulse, Gamepad2, Wrench, Wifi, Dog, Gift, Package, PiggyBank, Briefcase, Repeat, Scale, Pencil, Wallet,
    Menu
} from 'lucide-react';

// --- Constantes y Datos de Configuración ---

const BCV_RATE = 103;
const PARALLEL_RATE = 140;

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

// --- Íconos mejorados para botones de acción ---
const CircularPlusIcon = ({ className }) => (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const CircularMinusIcon = ({ className }) => (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
         <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/>
         <path d="M8 12H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


const Toast = ({ message, type }) => {
    if (!message) return null;
    const toastStyles = { success: 'bg-green-500 text-white', error: 'bg-red-500 text-white' };
    return (<div className={`fixed top-5 right-5 px-6 py-3 rounded-lg shadow-lg z-50 transition-transform duration-300 transform animate-fade-in-down ${toastStyles[type]}`}>{message}</div>);
};

const SummaryCard = ({ title, amount, rateBcv, rateParallel, trend = null }) => {
    const isPositive = amount >= 0;
    const mainColor = useMemo(() => {
        if (title === 'Ingresos') return 'text-green-500 dark:text-green-400';
        if (title === 'Gastos') return 'text-red-500 dark:text-red-400';
        return isPositive ? 'text-cyan-500 dark:text-cyan-400' : 'text-orange-500 dark:text-orange-400';
    }, [title, isPositive]);

    const TrendIcon = trend ? (trend.direction === 'up' ? TrendingUp : TrendingDown) : null;
    const trendColor = trend ? (trend.direction === 'up' ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400') : '';

    return (
        <div className="bg-gray-50/50 dark:bg-zinc-900/70 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 backdrop-blur-sm shadow-sm flex flex-col justify-between h-full">
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-zinc-400">{title}</h3>
                    {TrendIcon && (
                        <div className={`flex items-center text-xs font-bold ${trendColor}`}>
                            <TrendIcon size={16} className="mr-1" />
                            <span>{trend.percentage}%</span>
                        </div>
                    )}
                </div>
                <p className={`text-3xl sm:text-4xl font-bold tracking-tight break-words ${mainColor}`}>
                    {amount.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs
                </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-zinc-800/80 space-y-1 text-xs font-mono text-gray-500 dark:text-zinc-500">
                <p className="flex justify-between">BCV: <span className="font-semibold text-blue-500">${(amount / rateBcv).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
                <p className="flex justify-between">PARALELO: <span className="font-semibold text-purple-500">${(amount / rateParallel).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
            </div>
        </div>
    );
};


const TransactionModal = ({ type, onClose, onSaveTransaction, showToast, transactionToEdit }) => {
    const [amount, setAmount] = useState(transactionToEdit?.amount || '');
    const [selectedCategory, setSelectedCategory] = useState(transactionToEdit ? { name: transactionToEdit.category, icon: transactionToEdit.icon } : null);
    const amountInputRef = useRef(null);
    const isEditing = !!transactionToEdit;
    const title = isEditing ? `Editar ${type === 'income' ? 'Ingreso' : 'Gasto'}` : `Nuevo ${type === 'income' ? 'Ingreso' : 'Gasto'}`;
    const buttonText = isEditing ? 'Guardar Cambios' : (type === 'income' ? 'Confirmar Ingreso' : 'Pagar');
    const categories = type === 'income' ? incomeCategories : expenseCategories;
    const buttonClass = type === 'income' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600';
    useEffect(() => { amountInputRef.current?.focus(); }, []);
    const handleSave = () => {
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) { showToast('Por favor, introduce un monto válido.', 'error'); return; }
        if (!selectedCategory) { showToast('Por favor, selecciona una categoría.', 'error'); return; }
        const transactionData = { id: isEditing ? transactionToEdit.id : Date.now(), type, amount: numericAmount, category: selectedCategory.name, icon: selectedCategory.icon, createdAt: isEditing ? transactionToEdit.createdAt : new Date().toISOString() };
        onSaveTransaction(transactionData, isEditing);
        showToast(isEditing ? 'Transacción actualizada.' : `'${selectedCategory.name}' agregado exitosamente`, 'success');
        onClose();
    };
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-40 animate-fade-in">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-3xl p-6 md:p-8 w-11/12 max-w-md m-4 shadow-2xl animate-scale-in">
                <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-200">{title}</h2><button onClick={onClose} className="text-gray-400 dark:text-zinc-500 hover:text-gray-800 dark:hover:text-zinc-200 transition-colors"><X size={28} /></button></div>
                <div className="text-center my-8"><input ref={amountInputRef} type="number" value={amount} onChange={(e) => setAmount(e.target.value.slice(0, 15))} placeholder="0.00 Bs" className="text-5xl md:text-6xl font-mono font-bold bg-transparent border-b-2 border-gray-300 dark:border-zinc-700 focus:border-purple-500 outline-none text-center w-full text-gray-900 dark:text-zinc-100 transition-colors" /></div>
                <div className="mb-8">
                    <h3 className="text-gray-600 dark:text-zinc-400 font-semibold mb-4 text-center">Selecciona una Categoría</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                        {categories.map((cat) => {
                            const Icon = cat.icon;
                            const isSelected = selectedCategory?.name === cat.name;
                            return (<button key={cat.name} onClick={() => setSelectedCategory(cat)} className={`flex flex-col items-center justify-center px-2 py-3 rounded-xl transition-all duration-200 aspect-square text-gray-800 dark:text-zinc-200/80 ${isSelected ? 'bg-purple-500 text-white shadow-lg scale-105' : 'bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700'}`}><Icon size={28} className="mb-1" /><span className="text-xs text-center">{cat.name}</span></button>);
                        })}
                    </div>
                </div>
                <button onClick={handleSave} disabled={!amount || !selectedCategory} className={`w-full py-4 rounded-xl text-white font-bold text-lg ${buttonClass} transition-all duration-300 disabled:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105`}>{buttonText}</button>
            </div>
        </div>
    );
};

// --- Componente Principal de la Aplicación ---
export default function App() {
    const [theme, setTheme] = useState('dark');
    const [transactions, setTransactions] = useState([]);
    const [modal, setModal] = useState({ isOpen: false, type: null, transactionToEdit: null });
    const [toast, setToast] = useState({ message: '', type: '', key: 0 });
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    useEffect(() => { document.title = 'Tracker App'; let favicon = document.getElementById('favicon'); if (!favicon) { favicon = document.createElement('link'); favicon.id = 'favicon'; favicon.rel = 'icon'; document.head.appendChild(favicon); } const faviconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${theme === 'dark' ? 'white' : 'black'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>`; favicon.href = `data:image/svg+xml;base64,${btoa(faviconSVG)}`; }, [theme]);
    useEffect(() => { document.documentElement.classList.remove('light', 'dark'); document.documentElement.classList.add(theme); const themeColor = theme === 'dark' ? '#18181b' : '#ffffff'; let metaThemeColor = document.querySelector('meta[name="theme-color"]'); if (!metaThemeColor) { metaThemeColor = document.createElement('meta'); metaThemeColor.name = "theme-color"; document.head.appendChild(metaThemeColor); } metaThemeColor.setAttribute('content', themeColor); }, [theme]);
    const showToast = (message, type) => { setToast({ message, type, key: Date.now() }); setTimeout(() => { setToast({ message: '', type: '', key: 0 }); }, 3000); };
    const handleSaveTransaction = (transaction, isEditing) => { if (isEditing) { setTransactions(transactions.map(t => t.id === transaction.id ? transaction : t)); } else { setTransactions([...transactions, transaction]); } };
    const handleDeleteTransaction = (id) => { setTransactions(transactions.filter(t => t.id !== id)); showToast('Transacción eliminada.', 'success'); };
    const openModal = (type, transactionToEdit = null) => { setModal({ isOpen: true, type, transactionToEdit }); };
    const closeModal = () => { setModal({ isOpen: false, type: null, transactionToEdit: null }); };
    const toggleTheme = () => { setTheme(theme === 'light' ? 'dark' : 'light'); };
    const { totalIncome, totalExpenses, netBalance } = useMemo(() => { const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0); const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0); return { totalIncome: income, totalExpenses: expenses, netBalance: income - expenses }; }, [transactions]);
    const balanceTrend = useMemo(() => { if (totalIncome === 0 && totalExpenses === 0) return null; const savingsRate = totalIncome > 0 ? (netBalance / totalIncome) * 100 : -100; return { direction: netBalance >= 0 ? 'up' : 'down', percentage: Math.abs(savingsRate).toFixed(0) }; }, [netBalance, totalIncome, totalExpenses]);

    return (
        <div className={`min-h-screen bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 transition-colors duration-300 font-sans`}>
            <Toast key={toast.key} message={toast.message} type={toast.type} />
            <div className="container mx-auto p-4 md:p-8 max-w-5xl">
                <header className="relative flex justify-between items-center mb-8 gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-black dark:text-zinc-100 flex items-center gap-2"><Wallet className="inline-block" /> <span>Tracker App</span></h1>
                    <div className="hidden md:flex items-center gap-4">
                        <div className="flex items-center gap-2 p-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
                           <div className="flex items-baseline gap-2 px-3"><span className="text-xs font-bold text-blue-500">BCV</span><span className="text-sm font-mono font-bold text-black dark:text-zinc-100">{BCV_RATE.toFixed(2)}</span></div>
                           <div className="w-px h-4 bg-gray-300 dark:bg-zinc-700"></div>
                           <div className="flex items-baseline gap-2 px-3"><span className="text-xs font-bold text-purple-500">PAR</span><span className="text-sm font-mono font-bold text-black dark:text-zinc-100">{PARALLEL_RATE.toFixed(2)}</span></div>
                        </div>
                        <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-zinc-800 transition-transform duration-300 hover:rotate-45 hover:scale-110 flex-shrink-0">{theme === 'light' ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-blue-500" />}</button>
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-full bg-gray-200 dark:bg-zinc-800" aria-label="Abrir menú">{isMenuOpen ? <X size={20}/> : <Menu size={20} />}</button>
                    </div>
                     {isMenuOpen && (
                        <div className="md:hidden absolute top-full right-0 mt-2 w-auto bg-white/70 dark:bg-zinc-900/80 backdrop-blur-lg border border-gray-200 dark:border-zinc-700 rounded-2xl shadow-lg p-4 animate-fade-in-down z-20">
                           <div className="flex flex-col gap-4 items-start">
                                <div className="flex items-baseline gap-3"><span className="text-sm font-bold text-blue-500 w-16 text-right">BCV</span><span className="text-md font-mono font-bold">{BCV_RATE.toFixed(2)}</span></div>
                                <div className="flex items-baseline gap-3"><span className="text-sm font-bold text-purple-500 w-16 text-right">PARALELO</span><span className="text-md font-mono font-bold">{PARALLEL_RATE.toFixed(2)}</span></div>
                                <div className="w-full h-px bg-gray-200 dark:bg-zinc-700 my-1"></div>
                                <button onClick={toggleTheme} className="flex items-center justify-between gap-3 w-full p-1"><span className="font-semibold">{theme === 'light' ? 'Tema Oscuro' : 'Tema Claro'}</span>{theme === 'light' ? <Moon size={20} className="text-blue-500" /> : <Sun size={20} className="text-yellow-500" />}</button>
                           </div>
                        </div>
                    )}
                </header>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <SummaryCard title="Ingresos" amount={totalIncome} rateBcv={BCV_RATE} rateParallel={PARALLEL_RATE} />
                    <SummaryCard title="Gastos" amount={totalExpenses} rateBcv={BCV_RATE} rateParallel={PARALLEL_RATE} />
                    <SummaryCard title="Balance" amount={netBalance} rateBcv={BCV_RATE} rateParallel={PARALLEL_RATE} trend={balanceTrend} />
                </section>

                <section className="flex flex-col sm:flex-row gap-4 mb-8">
                    <button onClick={() => openModal('income')} className="group flex-1 flex items-center justify-center gap-3 p-4 bg-gray-100 dark:bg-zinc-800/80 rounded-2xl border border-gray-200 dark:border-zinc-700 shadow-sm transition-all duration-300 transform hover:-translate-y-1 active:-translate-y-0.5 hover:border-green-400/80 dark:hover:border-green-500/80 active:border-green-400/80 dark:active:border-green-500/80 hover:bg-green-500/10 dark:hover:bg-green-500/10 active:bg-green-500/10 dark:active:bg-green-500/10">
                        <CircularPlusIcon className="text-gray-500 dark:text-zinc-400 group-hover:text-green-500 group-active:text-green-500 transition-colors" />
                        <span className="font-semibold text-lg text-gray-800 dark:text-zinc-200 group-hover:text-green-600 dark:group-hover:text-green-400 group-active:text-green-600 dark:group-active:text-green-400 transition-colors">Nuevo Ingreso</span>
                    </button>
                    <button onClick={() => openModal('expense')} className="group flex-1 flex items-center justify-center gap-3 p-4 bg-gray-100 dark:bg-zinc-800/80 rounded-2xl border border-gray-200 dark:border-zinc-700 shadow-sm transition-all duration-300 transform hover:-translate-y-1 active:-translate-y-0.5 hover:border-red-400/80 dark:hover:border-red-500/80 active:border-red-400/80 dark:active:border-red-500/80 hover:bg-red-500/10 dark:hover:bg-red-500/10 active:bg-red-500/10 dark:active:bg-red-500/10">
                        <CircularMinusIcon className="text-gray-500 dark:text-zinc-400 group-hover:text-red-500 group-active:text-red-500 transition-colors" />
                        <span className="font-semibold text-lg text-gray-800 dark:text-zinc-200 group-hover:text-red-600 dark:group-hover:text-red-400 group-active:text-red-600 dark:group-active:text-red-400 transition-colors">Nuevo Gasto</span>
                    </button>
                </section>
                
                <section>
                    <h2 className="text-2xl font-bold mb-4 text-black dark:text-zinc-100">Historial</h2>
                    <div className="space-y-4">
                        {transactions.length === 0 ? (<p className="text-center text-gray-500 dark:text-zinc-400 py-8">No hay transacciones todavía.</p>) : (
                            [...transactions].reverse().map(t => {
                                const Icon = t.icon;
                                const isIncome = t.type === 'income';
                                return (
                                    <div key={t.id} className="flex items-center p-4 bg-white dark:bg-zinc-800/50 rounded-2xl animate-fade-in-up border border-gray-200 dark:border-zinc-800">
                                        <div className={`flex-shrink-0 p-3 rounded-full mr-4 ${isIncome ? 'bg-green-100 dark:bg-green-500/20' : 'bg-red-100 dark:bg-red-500/20'}`}><Icon size={24} className={isIncome ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'} /></div>
                                        <div className="flex-grow min-w-0">
                                            <p className="font-bold text-black dark:text-zinc-100 truncate">{t.category}</p>
                                            <p className="text-xs text-gray-500 dark:text-zinc-400">{new Date(t.createdAt).toLocaleString('es-VE', { dateStyle: 'short', timeStyle: 'short' })}</p>
                                        </div>
                                        <div className="flex flex-col items-end ml-2 text-right">
                                            <p className={`font-bold text-lg break-all ${isIncome ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>{isIncome ? '+' : '-'} {t.amount.toLocaleString('es-VE', { minimumFractionDigits: 2 })} Bs</p>
                                            <p className="text-xs font-mono text-gray-500 dark:text-zinc-500 mt-1">
                                                <span className="font-bold text-blue-500 dark:text-blue-400">${(t.amount / BCV_RATE).toFixed(2)}</span>
                                                <span className="text-gray-400 dark:text-zinc-600 mx-1">/</span>
                                                <span className="font-bold text-purple-500 dark:text-purple-400">${(t.amount / PARALLEL_RATE).toFixed(2)}</span>
                                            </p>
                                        </div>
                                         <div className="flex items-center ml-4">
                                                <button onClick={() => openModal(t.type, t)} className="text-gray-400 dark:text-zinc-500 hover:text-blue-500 active:text-blue-500 dark:hover:text-blue-400 dark:active:text-blue-400 transition-colors p-2 rounded-full"><Pencil size={16} /></button>
                                                <button onClick={() => handleDeleteTransaction(t.id)} className="text-gray-400 dark:text-zinc-500 hover:text-red-500 active:text-red-500 dark:hover:text-red-400 dark:active:text-red-400 transition-colors p-2 rounded-full"><X size={18} /></button>
                                            </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>
            </div>
            {modal.isOpen && <TransactionModal type={modal.type} onClose={closeModal} onSaveTransaction={handleSaveTransaction} showToast={showToast} transactionToEdit={modal.transactionToEdit} />}
        </div>
    );
}

const style = document.createElement('style');
style.textContent = `body{overscroll-behavior:contain}@keyframes fade-in{from{opacity:0}to{opacity:1}}@keyframes fade-in-down{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}@keyframes scale-in{from{transform:scale(.95);opacity:0}to{opacity:1;transform:scale(1)}}@keyframes fade-in-up{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}.animate-fade-in{animation:fade-in .3s ease-out forwards}.animate-fade-in-down{animation:fade-in-down .3s ease-out forwards}.animate-scale-in{animation:scale-in .3s ease-out forwards}.animate-fade-in-up{animation:fade-in-up .5s ease-out forwards}`;
document.head.appendChild(style);
if (!document.querySelector('meta[name="viewport"]')) { const meta = document.createElement('meta'); meta.name = "viewport"; meta.content = "width=device-width, initial-scale=1.0"; document.head.appendChild(meta); }
