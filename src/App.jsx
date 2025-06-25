import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
    Sun, Moon, X, Home as HomeIcon, BarChart2, Calculator,
    Home, Utensils, Car, ShoppingBag, BookOpen, HeartPulse, Gamepad2, Wrench, Wifi, Dog, Gift, Package, PiggyBank, Briefcase, Repeat, Scale, Pencil, Wallet,
    Menu, RefreshCw
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
const CircularPlusIcon = ({ className }) => (<svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const CircularMinusIcon = ({ className }) => (<svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const Toast = ({ message, type }) => { if (!message) return null; const toastStyles = { success: 'bg-green-500 text-white', error: 'bg-red-500 text-white' }; return (<div className={`fixed top-5 right-5 px-6 py-3 rounded-lg shadow-lg z-50 transition-transform duration-300 transform animate-fade-in-down ${toastStyles[type]}`}>{message}</div>);};

const DollarSignIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 1v22"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
);


const BalanceDashboard = ({ balance, rateBcv, rateParallel, onIncomeClick, onExpenseClick }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const balanceColor = balance >= 0 ? 'text-gray-800 dark:text-zinc-100' : 'text-red-500 dark:text-red-400';

    const CurrencyIcon = () => (
        <button onClick={() => setIsFlipped(!isFlipped)} className="absolute top-4 right-4 h-9 w-9 flex items-center justify-center bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400 rounded-full transition-transform duration-300 hover:scale-110 hover:rotate-12 active:scale-95" aria-label="Cambiar vista de moneda">
            <div className={`transition-transform duration-500 absolute ${isFlipped ? 'rotate-y-180 opacity-0' : 'opacity-100'}`}><DollarSignIcon size={18} /></div>
            <div className={`transition-transform duration-500 absolute ${isFlipped ? 'opacity-100' : '-rotate-y-180 opacity-0'}`}><RefreshCw size={18} /></div>
        </button>
    );
    
    const ActionButtons = () => (
        <div className="flex border-t border-gray-200 dark:border-zinc-800">
            <button onClick={onIncomeClick} className="group flex-1 flex items-center justify-center gap-2 text-green-600 dark:text-green-400 hover:bg-green-500 hover:text-white dark:hover:text-white active:bg-green-600 rounded-none py-4 transition-all duration-200"><CircularPlusIcon className="w-6 h-6" /> <span className="font-bold">Ingreso</span></button>
            <div className="w-px bg-gray-200 dark:bg-zinc-800"></div>
            <button onClick={onExpenseClick} className="group flex-1 flex items-center justify-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:text-white active:bg-red-600 rounded-none py-4 transition-all duration-200"><CircularMinusIcon className="w-6 h-6" /> <span className="font-bold">Gasto</span></button>
        </div>
    );

    return (
        <div className="relative [perspective:1000px] h-72 sm:h-80 mb-8">
            <div className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
                <div className="absolute w-full h-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-md [backface-visibility:hidden] overflow-hidden">
                    <div className="flex flex-col justify-between h-full">
                        <div className="p-6 pb-0"><CurrencyIcon /></div>
                        <div className="flex-grow flex items-center justify-center p-6"><p className={`text-5xl sm:text-6xl font-bold tracking-tighter ${balanceColor}`}>{balance.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-3xl sm:text-4xl text-gray-500 dark:text-zinc-500 font-medium">Bs</span></p></div>
                        <ActionButtons />
                    </div>
                </div>
                <div className="absolute w-full h-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-md [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden">
                     <div className="flex flex-col justify-between h-full">
                         <div className="p-6 pb-0"><CurrencyIcon /></div>
                        <div className="flex-grow flex items-center justify-around p-6">
                            <div className="text-center">
                                <span className="inline-block bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-bold px-4 py-1.5 rounded-full mb-3">BCV</span>
                                <p className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-zinc-100">{(balance / rateBcv).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p><span className="text-lg text-gray-500 dark:text-zinc-500 font-medium">USD</span>
                            </div>
                            <div className="text-center">
                                <span className="inline-block bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-sm font-bold px-4 py-1.5 rounded-full mb-3">PAR</span>
                                <p className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-zinc-100">{(balance / rateParallel).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p><span className="text-lg text-gray-500 dark:text-zinc-500 font-medium">USD</span>
                            </div>
                        </div>
                        <ActionButtons />
                    </div>
                </div>
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
                <div className="mb-8"><h3 className="text-gray-600 dark:text-zinc-400 font-semibold mb-4 text-center">Selecciona una Categoría</h3><div className="grid grid-cols-3 sm:grid-cols-4 gap-4">{categories.map((cat) => { const Icon = cat.icon; const isSelected = selectedCategory?.name === cat.name; return (<button key={cat.name} onClick={() => setSelectedCategory(cat)} className={`flex flex-col items-center justify-center px-2 py-3 rounded-xl transition-all duration-200 aspect-square text-gray-800 dark:text-zinc-200/80 ${isSelected ? 'bg-purple-500 text-white shadow-lg scale-105' : 'bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700'}`}><Icon size={28} className="mb-1" /><span className="text-xs text-center">{cat.name}</span></button>);})}</div></div>
                <button onClick={handleSave} disabled={!amount || !selectedCategory} className={`w-full py-4 rounded-xl text-white font-bold text-lg ${buttonClass} transition-all duration-300 disabled:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105`}>{buttonText}</button>
            </div>
        </div>
    );
};

const HomePage = ({ balance, onIncomeClick, onExpenseClick, transactions, openModal, handleDelete }) => (
    <>
      <BalanceDashboard 
          balance={balance}
          rateBcv={BCV_RATE}
          rateParallel={PARALLEL_RATE}
          onIncomeClick={onIncomeClick}
          onExpenseClick={onExpenseClick}
      />
      <section>
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-zinc-100">Historial de Transacciones</h2>
          <div className="space-y-4">
              {transactions.length === 0 ? (<p className="text-center text-gray-500 dark:text-zinc-400 py-8">No hay transacciones todavía.</p>) : (
                  [...transactions].reverse().map(t => {
                      const Icon = t.icon;
                      const isIncome = t.type === 'income';
                      return (
                          <div key={t.id} className="flex flex-wrap sm:flex-nowrap items-center gap-4 p-4 bg-white dark:bg-zinc-800/50 rounded-2xl border border-gray-200 dark:border-zinc-800">
                              <div className="flex-shrink-0"><div className={`flex items-center justify-center h-12 w-12 rounded-full ${isIncome ? 'bg-green-100 dark:bg-green-500/20' : 'bg-red-100 dark:bg-red-500/20'}`}><Icon size={24} className={isIncome ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'} /></div></div>
                              <div className="flex-grow min-w-0"><p className="font-bold text-black dark:text-zinc-100 truncate">{t.category}</p><p className="text-xs text-gray-500 dark:text-zinc-400">{new Date(t.createdAt).toLocaleString('es-VE', { dateStyle: 'short', timeStyle: 'short' })}</p></div>
                              <div className="flex-grow flex flex-col items-end min-w-0 ml-auto"><p className={`font-bold text-xl break-all mb-2 ${isIncome ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>{isIncome ? '+' : '-'} {t.amount.toLocaleString('es-VE', { minimumFractionDigits: 2 })} Bs</p><div className="flex items-center justify-end flex-wrap gap-2"><div className="flex items-center gap-1.5 rounded-lg bg-gray-100 dark:bg-zinc-700/50 backdrop-blur-sm border border-gray-200 dark:border-zinc-700 px-2.5 py-1"><span className="text-xs font-bold text-blue-500 dark:text-blue-400">BCV</span><span className="text-xs font-mono font-semibold text-gray-600 dark:text-zinc-300">${(t.amount / BCV_RATE).toFixed(2)}</span></div><div className="flex items-center gap-1.5 rounded-lg bg-gray-100 dark:bg-zinc-700/50 backdrop-blur-sm border border-gray-200 dark:border-zinc-700 px-2.5 py-1"><span className="text-xs font-semibold text-purple-500 dark:text-purple-400">PAR</span><span className="text-xs font-mono font-semibold text-gray-600 dark:text-zinc-300">${(t.amount / PARALLEL_RATE).toFixed(2)}</span></div></div></div>
                               <div className="flex items-center ml-2 flex-shrink-0"><button onClick={() => openModal(t.type, t)} className="text-gray-400 dark:text-zinc-500 hover:text-blue-500 active:text-blue-500 dark:hover:text-blue-400 dark:active:text-blue-400 transition-colors p-2 rounded-full"><Pencil size={16} /></button><button onClick={() => handleDelete(t.id)} className="text-gray-400 dark:text-zinc-500 hover:text-red-500 active:text-red-500 dark:hover:text-red-400 dark:active:text-red-400 transition-colors p-2 rounded-full"><X size={18} /></button></div>
                          </div>
                      );
                  })
              )}
          </div>
      </section>
    </>
);

const ReportsPage = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <BarChart2 size={48} className="text-gray-400 dark:text-zinc-500 mb-4" />
        <h2 className="text-2xl font-bold text-black dark:text-zinc-100">Reportes y Análisis</h2>
        <p className="text-gray-500 dark:text-zinc-400 mt-2">Próximamente: visualiza tus finanzas con gráficos detallados.</p>
    </div>
);

const CalculatorPage = () => {
    const [amount, setAmount] = useState('');
    const [activeRate, setActiveRate] = useState('bcv');
    const [isInputActive, setIsInputActive] = useState(false);

    const handleAmountChange = (e) => {
        const value = e.target.value.replace(/,/g, '');
        if (/^\d{0,8}(\.\d{0,2})?$/.test(value)) {
            setAmount(value);
        }
    };
    
    const displayAmount = useMemo(() => {
        if (!amount) return '';
        const parts = amount.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    }, [amount]);

    const resultToShow = useMemo(() => {
        const numericAmount = parseFloat(amount);
        if (!amount || isNaN(numericAmount)) return 0;
        const rate = activeRate === 'bcv' ? BCV_RATE : PARALLEL_RATE;
        return numericAmount / rate;
    }, [amount, activeRate]);

    return (
        <div className="flex flex-col items-center h-full pt-8">
            <h2 className="text-3xl font-bold text-black dark:text-zinc-100 mb-6">Calculadora de Divisas</h2>
             <div className="w-full max-w-sm p-6 bg-gray-50 dark:bg-zinc-900/70 border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-md">
                <div className="text-center mb-6">
                    <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">Monto a Convertir</label>
                    <div className="relative flex items-baseline justify-center h-20" onClick={() => setIsInputActive(true)}>
                        {(!amount && !isInputActive) && (
                             <span className="font-['DM_Sans'] text-7xl font-bold text-gray-300 dark:text-zinc-600 absolute">0<span className="text-5xl">.00</span> <span className="text-3xl">Bs</span></span>
                        )}
                        <div className={`flex items-baseline justify-center transition-opacity duration-200 w-full ${(!amount && !isInputActive) ? 'opacity-0' : 'opacity-100'}`}>
                             <input
                                onFocus={() => setIsInputActive(true)}
                                onBlur={() => setIsInputActive(false)}
                                type="text"
                                inputMode="decimal"
                                value={displayAmount}
                                onChange={handleAmountChange}
                                className="font-['DM_Sans'] text-7xl font-bold bg-transparent outline-none text-center text-black dark:text-white p-0 m-0 border-none [appearance:textfield] w-full"
                            />
                            <span className="font-['DM_Sans'] text-3xl font-medium text-gray-400 dark:text-zinc-500 ml-1">Bs</span>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-zinc-700/50 my-6"></div>

                <div className="flex justify-center mb-6">
                    <div className="inline-flex gap-2 p-1 bg-gray-200/70 dark:bg-zinc-800 rounded-full">
                        <button onClick={() => setActiveRate('bcv')} className={`px-4 sm:px-6 py-2 text-sm font-bold rounded-full transition-all ${activeRate === 'bcv' ? 'bg-blue-500 text-white shadow' : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-300/50 dark:hover:bg-zinc-700/50'}`}>BCV</button>
                        <button onClick={() => setActiveRate('parallel')} className={`px-4 sm:px-6 py-2 text-sm font-bold rounded-full transition-all ${activeRate === 'parallel' ? 'bg-purple-500 text-white shadow' : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-300/50 dark:hover:bg-zinc-700/50'}`}>PARALELO</button>
                    </div>
                </div>
                
                <div className={`p-6 rounded-2xl text-center transition-colors duration-300 bg-green-400/10 dark:bg-green-500/10`}>
                    <p className="font-['DM_Sans'] text-5xl font-bold text-green-600 dark:text-green-400 break-all" key={activeRate}>
                        $ {resultToShow.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
            </div>
        </div>
    );
};


// --- Dock de Navegación Flotante con UI Mejorada ---
const AppNavigation = ({ activeView, setActiveView }) => {
    const navItems = [
        { id: 'home', icon: HomeIcon, label: 'Inicio' },
        { id: 'reports', icon: BarChart2, label: 'Reportes' },
        { id: 'calculator', icon: Calculator, label: 'Calcular' },
    ];
    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30">
            <div className="flex items-center gap-1.5 bg-white/70 dark:bg-zinc-800/80 backdrop-blur-lg border border-gray-200 dark:border-zinc-700 rounded-2xl shadow-lg p-1.5">
                 {navItems.map(item => (
                    <button 
                        key={item.id} 
                        onClick={() => setActiveView(item.id)} 
                        className={`flex flex-col items-center justify-center w-[85px] h-[60px] transition-all duration-300 rounded-xl group ${
                            activeView === item.id 
                            ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-md' 
                            : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-200/60 dark:hover:bg-zinc-700/60'
                        }`}
                    >
                        <item.icon size={22} strokeWidth={activeView === item.id ? 2.5 : 2} />
                        <span className={`text-xs font-bold`}>{item.label}</span>
                    </button>
                ))}
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
    const [activeView, setActiveView] = useState('home');

    useEffect(() => { document.title = 'Tracker App'; let favicon = document.getElementById('favicon'); if (!favicon) { favicon = document.createElement('link'); favicon.id = 'favicon'; favicon.rel = 'icon'; document.head.appendChild(favicon); } const faviconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${theme === 'dark' ? 'white' : 'black'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>`; favicon.href = `data:image/svg+xml;base64,${btoa(faviconSVG)}`; }, [theme]);
    useEffect(() => { 
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme); 
        const themeColor = theme === 'dark' ? '#18181b' : '#ffffff'; 
        let metaThemeColor = document.querySelector('meta[name="theme-color"]'); 
        if (!metaThemeColor) { metaThemeColor = document.createElement('meta'); metaThemeColor.name = "theme-color"; document.head.appendChild(metaThemeColor); } 
        metaThemeColor.setAttribute('content', themeColor);
        
        // Cargar la fuente DM Sans
        let fontLink = document.getElementById('dm-sans-font');
        if (!fontLink) {
            fontLink = document.createElement('link');
            fontLink.id = 'dm-sans-font';
            fontLink.href = "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap";
            fontLink.rel = "stylesheet";
            document.head.appendChild(fontLink);
        }
    }, [theme]);
    const showToast = (message, type) => { setToast({ message, type, key: Date.now() }); setTimeout(() => { setToast({ message: '', type: '', key: 0 }); }, 3000); };
    const handleSaveTransaction = (transaction, isEditing) => { if (isEditing) { setTransactions(transactions.map(t => t.id === transaction.id ? transaction : t)); } else { setTransactions([...transactions, transaction]); } };
    const handleDeleteTransaction = (id) => { setTransactions(transactions.filter(t => t.id !== id)); showToast('Transacción eliminada.', 'success'); };
    const openModal = (type, transactionToEdit = null) => { setModal({ isOpen: true, type, transactionToEdit }); };
    const closeModal = () => { setModal({ isOpen: false, type: null, transactionToEdit: null }); };
    const toggleTheme = () => { setTheme(theme === 'light' ? 'dark' : 'light'); };
    const { totalIncome, totalExpenses, netBalance } = useMemo(() => { const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0); const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0); return { totalIncome: income, totalExpenses: expenses, netBalance: income - expenses }; }, [transactions]);
    
    const renderContent = () => {
        switch(activeView) {
            case 'home':
                return <HomePage 
                          balance={netBalance}
                          onIncomeClick={() => openModal('income')}
                          onExpenseClick={() => openModal('expense')}
                          transactions={transactions}
                          openModal={openModal}
                          handleDelete={handleDeleteTransaction}
                       />
            case 'reports':
                return <ReportsPage />;
            case 'calculator':
                return <CalculatorPage />;
            default:
                return <HomePage 
                          balance={netBalance}
                          onIncomeClick={() => openModal('income')}
                          onExpenseClick={() => openModal('expense')}
                          transactions={transactions}
                          openModal={openModal}
                          handleDelete={handleDeleteTransaction}
                       />;
        }
    }

    return (
        <div className={`min-h-screen bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 transition-colors duration-300 font-sans`}>
            <Toast key={toast.key} message={toast.message} type={toast.type} />
            <div className="container mx-auto p-4 md:p-8 max-w-5xl pb-28">
                <header className="relative flex justify-between items-center mb-8 gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-black dark:text-zinc-100 flex items-center gap-2"><Wallet className="inline-block" /> <span>Tracker App</span></h1>
                    <div className="flex items-center gap-4">
                        <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-zinc-800 transition-transform duration-300 hover:rotate-45 hover:scale-110 flex-shrink-0">{theme === 'light' ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-blue-500" />}</button>
                    </div>
                </header>

                {renderContent()}

            </div>
            <AppNavigation activeView={activeView} setActiveView={setActiveView} />
            {modal.isOpen && <TransactionModal type={modal.type} onClose={closeModal} onSaveTransaction={handleSaveTransaction} showToast={showToast} transactionToEdit={modal.transactionToEdit} />}
        </div>
    );
}

const style = document.createElement('style');
style.textContent = `
    body{overscroll-behavior:contain}
    @keyframes fade-in{from{opacity:0}to{opacity:1}}
    @keyframes fade-in-down{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
    @keyframes scale-in{from{transform:scale(.95);opacity:0}to{opacity:1;transform:scale(1)}}
    @keyframes fade-in-up{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    .animate-fade-in{animation:fade-in .3s ease-out forwards}
    .animate-fade-in-down{animation:fade-in-down .3s ease-out forwards}
    .animate-scale-in{animation:scale-in .3s ease-out forwards}
    .animate-fade-in-up{animation:fade-in-up .5s ease-out forwards}
    
    /* Hide spinners from number inputs */
    input[type=number]::-webkit-outer-spin-button,
    input[type=number]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    input[type=number] {
      -moz-appearance: textfield;
    }
`;
document.head.appendChild(style);
if (!document.querySelector('meta[name="viewport"]')) { const meta = document.createElement('meta'); meta.name = "viewport"; meta.content = "width=device-width, initial-scale=1.0"; document.head.appendChild(meta); }
