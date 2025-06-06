'use client';
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "next-themes";
import ShowModal from "./Modal/ShowModal";
import ShowCapitalManagementModal from "./Modal/ShowCapitalManagementModal";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, setDoc, updateDoc, deleteDoc, getDocs, writeBatch } from 'firebase/firestore';
import { db } from "../lib/firebaseClient";
import SectionPage from "./SectionPage";
import { endOfWeek, formatYYYYMMDD, getDaysInMonth, startOfWeek } from "../utils/dateManipulation";
import ShowDailyProfitExpectationModal from "./Modal/ShowDailyProfitExpectationModal";
import ShowWeeklyProfitExpectationModal from "./Modal/ShowWeeklyProfitExpectationModal";
import ShowAddJournalModal from "./Modal/ShowAddJournalModal";

export default function Main() {
    const { logOut } = useAuth();
    const { user } = useAuth();
    const { theme, setTheme } = useTheme();
    const [showModal, setShowModal] = useState(false);
    // const [showCapitalManagementModal, setShowCapitalManagementModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalConfirmAction, setModalConfirmAction] = useState<(() => void) | undefined>(undefined);
    const [showDailyProfitExpectationModal, setShowDailyProfitExpectationModal] = useState(false);
    const [showWeeklyProfitExpectationModal, setShowWeeklyProfitExpectationModal] = useState(false);
    
    const [currentPage, setCurrentPage] = useState('Dashboard');
    const [newJournalName, setNewJournalName] = useState('');
    const [journals, setJournals] = useState([]);
    const [currentJournalId, setCurrentJournalId] = useState<string | null>(null);
    const [currentJournalName, setCurrentJournalName] = useState('');
    const [showAddJournalModal, setShowAddJournalModal] = useState(false);

    type Trade = {
        id: string;
        asset: string;
        direction: string;
        entryPrice: number;
        expiryPrice: number;
        openTime: string;
        expirationTime: string;
        outcome: string;
        amount: number;
        profit: number;
        notes: string;
        [key: string]: any; // for any additional fields
    };
    const [trades, setTrades] = useState<Trade[]>([]);
    const [asset, setAsset] = useState('');
    const [entryPrice, setEntryPrice] = useState('');
    const [expiryPrice, setExpiryPrice] = useState('');
    const [amount, setAmount] = useState('');
    const [profit, setProfit] = useState('');
    const [openTime, setOpenTime] = useState('');
    const [expirationTime, setExpirationTime] = useState('');
    const [direction, setDirection] = useState('Buy');
    const [outcome, setOutcome] = useState('Win');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(true);

    const [currentBalance, setCurrentBalance] = useState(0);
    const [depositAmount, setDepositAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [editingTransactionId, setEditingTransactionId] = useState(null);
    const [editTransactionAmount, setEditTransactionAmount] = useState('');
    const [editTransactionNote, setEditTransactionNote] = useState('');


    const [dailyProfitExpectation, setDailyProfitExpectation] = useState(0);
    const [newDailyProfitExpectation, setNewDailyProfitExpectation] = useState('');
    const [weeklyProfitExpectation, setWeeklyProfitExpectation] = useState(0);
    const [newWeeklyProfitExpectation, setNewWeeklyProfitExpectation] = useState('');


    const [editingTradeId, setEditingTradeId] = useState(null);
    const [editTradeData, setEditTradeData] = useState({
        asset: '', direction: '', entryPrice: '', expiryPrice: '',
        openTime: '', expirationTime: '', outcome: '', amount: '', profit: '', notes: ''
    });

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [goalHistory, setGoalHistory] = useState([]);
    const [editingJournalId, setEditingJournalId] = useState(null);
    const [editJournalName, setEditJournalName] = useState('');


    const userId = user?.uid;
    const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'defaultAppId';

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const isDarkMode = theme === 'dark';

    const showMessageBox = (message: string) => {
        setModalMessage(message);
        setModalConfirmAction(undefined);
        setShowModal(true);
    };

    const showConfirmationModal = (message: string, onConfirm: () => void) => {
        setModalMessage(message);
        setModalConfirmAction(() => onConfirm);
        setShowModal(true);
    };

    // Journal Management Functions (wrapped in useCallback for stability)
    const handleCreateJournal = useCallback(async (name = newJournalName) => {
        if (!db || !userId) { showMessageBox("Database not ready."); return; }
        if (!name.trim()) { showMessageBox("Journal name cannot be empty."); return; }

        try {
            const journalsCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/journals`);
            const newJournalRef = await addDoc(journalsCollectionRef, {
                name: name.trim(),
                createdAt: serverTimestamp(),
                lastAccessedAt: serverTimestamp()
            });
            if (!newJournalRef.id) {
                showMessageBox("Failed to create journal. Please try again.");
                return;
            }
            setCurrentJournalId(newJournalRef.id);
            setCurrentJournalName(name.trim());
            setNewJournalName('');
            setShowAddJournalModal(false);
            showMessageBox(`Journal "${name.trim()}" created successfully!`);
        } catch (error) {
            console.error("Error creating journal:", error);
            showMessageBox("Failed to create journal. Please try again.");
        }
    }, [ userId, appId, newJournalName, showMessageBox]);

    const handleSelectJournal = useCallback(async (journalId: string, journalName: string) => {
        if (!db || !userId) return;
        setCurrentJournalId(journalId);
        setCurrentJournalName(journalName);
        // Update lastAccessedAt for the selected journal
        await updateDoc(doc(db, `artifacts/${appId}/users/${userId}/journals`, journalId), {
            lastAccessedAt: serverTimestamp()
        });
        showMessageBox(`Switched to journal: "${journalName}"`);
        setCurrentPage('Dashboard'); // Go to dashboard after selecting a journal
    }, [ userId, appId, showMessageBox]);

    // Handle Trade Management
    const handleAddTrade = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!db || !userId || !currentJournalId) { showMessageBox("Please select a journal first."); return; }
        if (!asset || !entryPrice || !expiryPrice || !amount || !profit || !openTime || !expirationTime) {
            showMessageBox("Please fill in all required fields (Asset, Entry Price, Expiry Price, Amount, Profit/Loss, Open Time, Expiration Time).");
            return;
        }

        const tradeProfit = parseFloat(profit);
        const tradeAmount = parseFloat(amount);
        const tradeExpiryPrice = parseFloat(expiryPrice);

        if (isNaN(tradeProfit) || isNaN(tradeAmount) || isNaN(tradeExpiryPrice)) {
            showMessageBox("Amount Invested, Profit/Loss, and Expiry Price must be valid numbers.");
            return;
        }

        try {
            const tradeData = {
                asset,
                direction,
                entryPrice: parseFloat(entryPrice),
                expiryPrice: tradeExpiryPrice,
                openTime,
                expirationTime,
                outcome,
                amount: tradeAmount,
                profit: tradeProfit,
                notes,
                timestamp: serverTimestamp()
            };
            const tradesCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/journals/${currentJournalId}/trades`);
            await addDoc(tradesCollectionRef, tradeData);

            const balanceDocRef = doc(db, `artifacts/${appId}/users/${userId}/journals/${currentJournalId}/userProfile/balance`);
            await setDoc(balanceDocRef, { currentBalance: currentBalance + tradeProfit, lastUpdated: serverTimestamp() }, { merge: true });

            setAsset(''); setDirection('Buy'); setEntryPrice('');
            setExpiryPrice('');
            setOpenTime(''); setExpirationTime('');
            setOutcome('Win'); setAmount(''); setProfit(''); setNotes('');
            showMessageBox("Trade added successfully and balance updated!");
        } catch (error) {
            console.error("Error adding trade:", error);
            showMessageBox("Failed to add trade. Please try again.");
        }
    };
    
    const handleDeleteTrade = (tradeId: string) => {
        if (!db || !userId || !currentJournalId) { showMessageBox("Database not ready or no journal selected."); return; }
        showConfirmationModal("Are you sure you want to delete this trade? This will also reverse its impact on your balance.", async () => {
            try {
                const tradeToDelete = trades.find(trade => trade.id === tradeId);
                if (!tradeToDelete) { showMessageBox("Trade not found."); return; }

                const tradeDocRef = doc(db, `artifacts/${appId}/users/${userId}/journals/${currentJournalId}/trades`, tradeId);
                await deleteDoc(tradeDocRef);

                const balanceDocRef = doc(db, `artifacts/${appId}/users/${userId}/journals/${currentJournalId}/userProfile/balance`);
                await setDoc(balanceDocRef, { currentBalance: currentBalance - tradeToDelete.profit, lastUpdated: serverTimestamp() }, { merge: true });
                showMessageBox("Trade deleted successfully and balance updated!");
            } catch (error) {
                console.error("Error deleting trade:", error);
                showMessageBox("Failed to delete trade. Please try again.");
            } finally { setShowModal(false); }
        });
    };
    
    const startEditingTrade = (trade) => {
        setEditingTradeId(trade.id);
        setEditTradeData({
            asset: trade.asset,
            direction: trade.direction,
            entryPrice: trade.entryPrice,
            expiryPrice: trade.expiryPrice,
            openTime: trade.openTime,
            expirationTime: trade.expirationTime,
            outcome: trade.outcome,
            amount: trade.amount,
            profit: trade.profit,
            notes: trade.notes
        });
    };
    
    const cancelEditingTrade = () => {
        setEditingTradeId(null);
        setEditTradeData({
            asset: '', direction: '', entryPrice: '', expiryPrice: '',
            openTime: '', expirationTime: '', outcome: '', amount: '', profit: '', notes: ''
        });
    };
    
    const saveEditingTrade = async (tradeId) => {
        if (!db || !userId || !currentJournalId) { showMessageBox("Database not ready or no journal selected."); return; }
        const originalTrade = trades.find(trade => trade.id === tradeId);
        if (!originalTrade) { showMessageBox("Original trade not found."); return; }

        const updatedProfit = parseFloat(editTradeData.profit);
        const updatedAmount = parseFloat(editTradeData.amount);
        const updatedEntryPrice = parseFloat(editTradeData.entryPrice);
        const updatedExpiryPrice = parseFloat(editTradeData.expiryPrice);

        if (isNaN(updatedProfit) || isNaN(updatedAmount) || isNaN(updatedEntryPrice) || isNaN(updatedExpiryPrice)) {
            showMessageBox("Amount Invested, Profit/Loss, Entry Price, and Expiry Price must be valid numbers.");
            return;
        }

        showConfirmationModal("Are you sure you want to save changes to this trade? This will adjust your balance.", async () => {
            try {
                const profitDifference = updatedProfit - originalTrade.profit;

                const tradeDocRef = doc(db, `artifacts/${appId}/users/${userId}/journals/${currentJournalId}/trades`, tradeId);
                await updateDoc(tradeDocRef, {
                    asset: editTradeData.asset,
                    direction: editTradeData.direction,
                    entryPrice: updatedEntryPrice,
                    expiryPrice: updatedExpiryPrice,
                    openTime: editTradeData.openTime,
                    expirationTime: editTradeData.expirationTime,
                    outcome: editTradeData.outcome,
                    amount: updatedAmount,
                    profit: updatedProfit,
                    notes: editTradeData.notes,
                    timestamp: serverTimestamp()
                });

                const balanceDocRef = doc(db, `artifacts/${appId}/users/${userId}/journals/${currentJournalId}/userProfile/balance`);
                await setDoc(balanceDocRef, { currentBalance: currentBalance + profitDifference, lastUpdated: serverTimestamp() }, { merge: true });

                showMessageBox("Trade updated successfully and balance adjusted!");
                cancelEditingTrade();
            } catch (error) {
                console.error("Error saving trade:", error);
                showMessageBox("Failed to save trade. Please try again.");
            } finally { setShowModal(false); }
        });
    };

    // Transactions 
    const handleDeposit = async () => {
        if (!db || !userId || !currentJournalId) { showMessageBox("Please select a journal first."); return; }
        const depositVal = parseFloat(depositAmount);
        if (isNaN(depositVal) || depositVal <= 0) { showMessageBox("Please enter a valid positive deposit amount."); return; }

        showConfirmationModal(`Are you sure you want to deposit $${depositVal.toFixed(2)}?`, async () => {
            try {
                const balanceDocRef = doc(db, `artifacts/${appId}/users/${userId}/journals/${currentJournalId}/userProfile/balance`);
                await setDoc(balanceDocRef, { currentBalance: currentBalance + depositVal, lastUpdated: serverTimestamp() }, { merge: true });

                const transactionsCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/journals/${currentJournalId}/transactions`);
                await addDoc(transactionsCollectionRef, { type: 'deposit', amount: depositVal, timestamp: serverTimestamp(), note: 'Manual deposit' });

                setDepositAmount('');
                showMessageBox("Deposit successful!");
            } catch (error) {
                console.error("Error depositing funds:", error);
                showMessageBox("Failed to deposit funds. Please try again.");
            } finally { setShowModal(false); }
        });
    };
    
    const handleWithdraw = async () => {
        if (!db || !userId || !currentJournalId) { showMessageBox("Please select a journal first."); return; }
        const withdrawVal = parseFloat(withdrawAmount);
        if (isNaN(withdrawVal) || withdrawVal <= 0) { showMessageBox("Please enter a valid positive withdrawal amount."); return; }
        if (withdrawVal > currentBalance) { showMessageBox("Withdrawal amount cannot exceed current balance."); return; }

        showConfirmationModal(`Are you sure you want to withdraw $${withdrawVal.toFixed(2)}?`, async () => {
            try {
                const balanceDocRef = doc(db, `artifacts/${appId}/users/${userId}/journals/${currentJournalId}/userProfile/balance`);
                await setDoc(balanceDocRef, { currentBalance: currentBalance - withdrawVal, lastUpdated: serverTimestamp() }, { merge: true });

                const transactionsCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/journals/${currentJournalId}/transactions`);
                await addDoc(transactionsCollectionRef, { type: 'withdrawal', amount: withdrawVal, timestamp: serverTimestamp(), note: 'Manual withdrawal' });

                setWithdrawAmount('');
                showMessageBox("Withdrawal successful!");
            } catch (error) {
                console.error("Error withdrawing funds:", error);
                showMessageBox("Failed to withdraw funds. Please try again.");
            } finally { setShowModal(false); }
        });
    };
    
    const handleResetJournal = async () => {
        if (!db || !userId || !currentJournalId) { showMessageBox("Please select a journal first."); return; }
        showConfirmationModal("Are you sure you want to reset the CURRENT journal? This will delete all trades, transactions, and reset its balance to zero. This action cannot be undone.", async () => {
            try {
                const batch = writeBatch(db);

                const journalPath = `artifacts/${appId}/users/${userId}/journals/${currentJournalId}`;

                // Delete trades
                const tradesSnapshot = await getDocs(collection(db, `${journalPath}/trades`));
                tradesSnapshot.docs.forEach(d => batch.delete(d.ref));

                // Delete transactions
                const transactionsSnapshot = await getDocs(collection(db, `${journalPath}/transactions`));
                transactionsSnapshot.docs.forEach(d => batch.delete(d.ref));

                // Delete goals
                const goalsSnapshot = await getDocs(collection(db, `${journalPath}/goals`));
                goalsSnapshot.docs.forEach(d => batch.delete(d.ref));

                // Reset balance
                const balanceDocRef = doc(db, `${journalPath}/userProfile/balance`);
                batch.set(balanceDocRef, { currentBalance: 0, lastUpdated: serverTimestamp() }, { merge: true });

                // Commit the batch
                await batch.commit();

                showMessageBox("Current journal reset successfully!");
            } catch (error) {
                console.error("Error resetting journal:", error);
                showMessageBox("Failed to reset journal. Please try again.");
            } finally { setShowModal(false); }
        });
    };
    
    const startEditingTransaction = (transaction) => {
        setEditingTransactionId(transaction.id);
        setEditTransactionAmount(transaction.amount.toString());
        setEditTransactionNote(transaction.note || '');
    };

    const cancelEditingTransaction = () => {
        setEditingTransactionId(null);
        setEditTransactionAmount('');
        setEditTransactionNote('');
    };
    
    const saveEditingTransaction = async (transactionId) => {
        if (!db || !userId || !currentJournalId) { showMessageBox("Database not ready or no journal selected."); return; }
        const newAmount = parseFloat(editTransactionAmount);
        if (isNaN(newAmount) || newAmount <= 0) {
            showMessageBox("Please enter a valid positive amount for the transaction.");
            return;
        }

        showConfirmationModal("Are you sure you want to save changes to this transaction? This will adjust your balance.", async () => {
            try {
                const originalTransaction = transactions.find(t => t.id === transactionId);
                if (!originalTransaction) {
                    showMessageBox("Original transaction not found.");
                    return;
                }

                const oldAmount = originalTransaction.amount;
                const type = originalTransaction.type;
                let balanceChange = 0;

                if (type === 'deposit') {
                    balanceChange = newAmount - oldAmount;
                } else if (type === 'withdrawal') {
                    balanceChange = oldAmount - newAmount;
                }

                const transactionDocRef = doc(db, `artifacts/${appId}/users/${userId}/journals/${currentJournalId}/transactions`, transactionId);
                await updateDoc(transactionDocRef, {
                    amount: newAmount,
                    note: editTransactionNote,
                    timestamp: serverTimestamp()
                });

                const balanceDocRef = doc(db, `artifacts/${appId}/users/${userId}/journals/${currentJournalId}/userProfile/balance`);
                await setDoc(balanceDocRef, { currentBalance: currentBalance + balanceChange, lastUpdated: serverTimestamp() }, { merge: true });

                showMessageBox("Transaction updated and balance adjusted!");
                cancelEditingTransaction();
            } catch (error) {
                console.error("Error saving transaction:", error);
                showMessageBox("Failed to save transaction. Please try again.");
            } finally { setShowModal(false); }
        });
    };

    const deleteTransaction = (transactionId) => {
        if (!db || !userId || !currentJournalId) { showMessageBox("Database not ready or no journal selected."); return; }
        showConfirmationModal("Are you sure you want to delete this transaction? This will reverse its impact on your balance.", async () => {
            try {
                const transactionToDelete = transactions.find(t => t.id === transactionId);
                if (!transactionToDelete) {
                    showMessageBox("Transaction not found.");
                    return;
                }

                const transactionDocRef = doc(db, `artifacts/${appId}/users/${userId}/journals/${currentJournalId}/transactions`, transactionId);
                await deleteDoc(transactionDocRef);

                const balanceDocRef = doc(db, `artifacts/${appId}/users/${userId}/journals/${currentJournalId}/userProfile/balance`);
                const amountToReverse = transactionToDelete.type === 'deposit' ? -transactionToDelete.amount : transactionToDelete.amount;
                await setDoc(balanceDocRef, { currentBalance: currentBalance + amountToReverse, lastUpdated: serverTimestamp() }, { merge: true });

                showMessageBox("Transaction deleted and balance adjusted!");
            } catch (error) {
                console.error("Error deleting transaction:", error);
                showMessageBox("Failed to delete transaction. Please try again.");
            } finally { setShowModal(false); }
        });
    };
    
    const handleSaveDailyProfitExpectation = async () => {
        if (!db || !userId || !currentJournalId) { showMessageBox("Please select a journal first."); return; }
        const expectation = parseFloat(newDailyProfitExpectation);
        if (isNaN(expectation)) {
            showMessageBox("Please enter a valid number for daily profit expectation.");
            return;
        }

        try {
            const dailyProfitExpectationDocRef = doc(db, `artifacts/${appId}/users/${userId}/journals/${currentJournalId}/userProfile/dailyProfitExpectation`);
            await setDoc(dailyProfitExpectationDocRef, { amount: expectation, lastUpdated: serverTimestamp() }, { merge: true });
            setDailyProfitExpectation(expectation);
            setNewDailyProfitExpectation('');
            showMessageBox("Daily profit expectation saved successfully!");
            setShowDailyProfitExpectationModal(false);
        } catch (error) {
            console.error("Error saving daily profit expectation:", error);
            showMessageBox("Failed to save daily profit expectation. Please try again.");
        }
    };
    
    const handleSaveWeeklyProfitExpectation = async () => {
        if (!db || !userId || !currentJournalId) { showMessageBox("Please select a journal first."); return; }
        const expectation = parseFloat(newWeeklyProfitExpectation);
        if (isNaN(expectation)) {
            showMessageBox("Please enter a valid number for weekly profit expectation.");
            return;
        }

        try {
            const weeklyProfitExpectationDocRef = doc(db, `artifacts/${appId}/users/${userId}/journals/${currentJournalId}/userProfile/weeklyProfitExpectation`);
            await setDoc(weeklyProfitExpectationDocRef, { amount: expectation, lastUpdated: serverTimestamp() }, { merge: true });
            setWeeklyProfitExpectation(expectation);
            setNewWeeklyProfitExpectation('');
            showMessageBox("Weekly profit expectation saved successfully!");
            setShowWeeklyProfitExpectationModal(false);
        } catch (error) {
            console.error("Error saving weekly profit expectation:", error);
            showMessageBox("Failed to save weekly profit expectation. Please try again.");
        }
    };

    const calculateStats = useCallback(() => {
        let totalAmount = 0;
        let totalProfitLoss = 0;
        let winCount = 0;
        let lossCount = 0;
        let totalWinProfit = 0;
        let totalLossAmount = 0;

        trades.forEach(trade => {
            totalAmount += trade.amount;
            totalProfitLoss += trade.profit;
            if (trade.outcome === 'Win') {
                winCount++;
                totalWinProfit += trade.profit;
            } else if (trade.outcome === 'Loss') {
                lossCount++;
                totalLossAmount += Math.abs(trade.profit);
            }
        });

        const totalTrades = trades.length;
        const winRate = totalTrades > 0 ? (winCount / totalTrades) * 100 : 0;
        const averageProfitPerWin = winCount > 0 ? (totalWinProfit / winCount) : 0;
        const averageLossPerLoss = lossCount > 0 ? (totalLossAmount / lossCount) : 0;
        const profitFactor = totalLossAmount > 0 ? (totalWinProfit / totalLossAmount) : (totalWinProfit > 0 ? Infinity : 0);

        return {
            totalAmount: totalAmount.toFixed(2),
            totalProfitLoss: totalProfitLoss.toFixed(2),
            winRate: winRate.toFixed(2),
            totalTrades,
            winCount,
            lossCount,
            averageProfitPerWin: averageProfitPerWin.toFixed(2),
            averageLossPerLoss: averageLossPerLoss.toFixed(2),
            profitFactor: profitFactor === Infinity ? 'N/A' : profitFactor.toFixed(2)
        };
    }, [trades]);
    
    const stats = calculateStats();

    const currentDayProfit = useMemo(() => {
        const today = formatYYYYMMDD(new Date());
        return trades.reduce((sum, trade) => {
            const tradeDate = trade.timestamp?.toDate ? trade.timestamp.toDate() : new Date(trade.timestamp);
            if (formatYYYYMMDD(tradeDate) === today) {
                return sum + trade.profit;
            }
            return sum;
        }, 0);
    }, [trades]);
    
    const currentWeekProfit = useMemo(() => {
        const now = new Date();
        const startOfCurrentWeek = startOfWeek(now);
        const endOfCurrentWeek = endOfWeek(now);

        return trades.reduce((sum, trade) => {
            const tradeDate = trade.timestamp?.toDate ? trade.timestamp.toDate() : new Date(trade.timestamp);
            if (tradeDate >= startOfCurrentWeek && tradeDate <= endOfCurrentWeek) {
                return sum + trade.profit;
            }
            return sum;
        }, 0);
    }, [trades]);

    const handlePrevMonth = () => { setCurrentMonth(prevMonth => new Date(prevMonth.getFullYear(), prevMonth.getMonth() - 1, 1)); };
    const handleNextMonth = () => { setCurrentMonth(prevMonth => new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 1)); };
    
        
    const daysInMonth = getDaysInMonth(currentMonth);
    
    const cumulativeProfitLossChartData = useMemo(() => {
        const dailyProfits = {};
        trades.forEach(trade => {
            const tradeDate = trade.timestamp?.toDate ? trade.timestamp.toDate() : new Date(trade.timestamp);
            const dateKey = formatYYYYMMDD(tradeDate);
            if (!dailyProfits[dateKey]) { dailyProfits[dateKey] = 0; }
            dailyProfits[dateKey] += trade.profit;
        });

        const sortedDates = Object.keys(dailyProfits).sort();
        let cumulativeProfit = 0;
        const data = [];

        sortedDates.forEach(date => {
            cumulativeProfit += dailyProfits[date];
            data.push({ date: date, 'Cumulative Profit': parseFloat(cumulativeProfit.toFixed(2)) });
        });
        return data;
    }, [trades]);
    
    const dailyProfitLossBarChartData = useMemo(() => {
        const dailyData = {};
        trades.forEach(trade => {
            const tradeDate = trade.timestamp?.toDate ? trade.timestamp.toDate() : new Date(trade.timestamp);
            const dateKey = formatYYYYMMDD(tradeDate);
            if (!dailyData[dateKey]) { dailyData[dateKey] = { date: dateKey, profit: 0 }; }
            dailyData[dateKey].profit += trade.profit;
        });
        return Object.values(dailyData).sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [trades]);
    
    const winRateByAssetData = useMemo(() => {
        const assetStats = {};
        trades.forEach(trade => {
            const assetName = trade.asset || 'Unknown';
            if (!assetStats[assetName]) { assetStats[assetName] = { wins: 0, losses: 0, draws: 0, total: 0 }; }
            assetStats[assetName].total++;
            if (trade.outcome === 'Win') { assetStats[assetName].wins++; } else if (trade.outcome === 'Loss') { assetStats[assetName].losses++; } else { assetStats[assetName].draws++; }
        });

        return Object.keys(assetStats).map(assetName => ({
            name: assetName,
            wins: assetStats[assetName].wins,
            losses: assetStats[assetName].losses,
            draws: assetStats[assetName].draws,
            total: assetStats[assetName].total,
            winRate: assetStats[assetName].total > 0 ? (assetStats[assetName].wins / assetStats[assetName].total * 100).toFixed(2) : 0
        }));
    }, [trades]);
    
    const winRateByDirectionData = useMemo(() => {
        const directionStats = { 'Buy': { wins: 0, losses: 0, draws: 0, total: 0 }, 'Sell': { wins: 0, losses: 0, draws: 0, total: 0 } };
        trades.forEach(trade => {
            const directionName = trade.direction || 'Unknown';
            if (directionStats[directionName]) {
                directionStats[directionName].total++;
                if (trade.outcome === 'Win') { directionStats[directionName].wins++; } else if (directionStats[directionName].losses) { directionStats[directionName].losses++; } else { directionStats[directionName].draws++; }
            }
        });

        return Object.keys(directionStats).map(directionName => ({
            name: directionName,
            wins: directionStats[directionName].wins,
            losses: directionStats[directionName].losses,
            draws: directionStats[directionName].draws,
            total: directionStats[directionName].total,
            winRate: directionStats[directionName].total > 0 ? (directionStats[directionName].wins / directionStats[directionName].total * 100).toFixed(2) : 0
        })).filter(d => d.total > 0);
    }, [trades]);

    const profitLossDistributionData = useMemo(() => {
        const bins = {
            '<-$100': 0, '-$100 to -$50': 0, '-$50 to $0': 0, '$0 to $50': 0, '$50 to $100': 0, '>$100': 0,
        };
        trades.forEach(trade => {
            const profitVal = trade.profit;
            if (profitVal < -100) { bins['<-$100']++; } else if (profitVal >= -100 && profitVal < -50) { bins['-$100 to -$50']++; } else if (profitVal >= -50 && profitVal < 0) { bins['-$50 to $0']++; } else if (profitVal >= 0 && profitVal < 50) { bins['$0 to $50']++; } else if (profitVal >= 50 && profitVal < 100) { bins['$50 to $100']++; } else if (profitVal >= 100) { bins['>$100']++; }
        });
        return Object.keys(bins).map(range => ({ range: range, count: bins[range] })).filter(b => b.count > 0);
    }, [trades]);
    
    const tradeCountByDayOfWeekData = useMemo(() => {
        const dayCounts = [{ name: 'Sun', count: 0 }, { name: 'Mon', count: 0 }, { name: 'Tue', count: 0 }, { name: 'Wed', count: 0 }, { name: 'Thu', count: 0 }, { name: 'Fri', count: 0 }, { name: 'Sat', count: 0 },];
        trades.forEach(trade => {
            const tradeDate = trade.timestamp?.toDate ? trade.timestamp.toDate() : new Date(trade.timestamp);
            const dayIndex = tradeDate.getDay();
            dayCounts[dayIndex].count++;
        });
        return dayCounts.filter(d => d.count > 0);
    }, [trades]);

    const tradeCountByHourOfDayData = useMemo(() => {
        const hourCounts = Array.from({ length: 24 }, (_, i) => ({ name: `${String(i).padStart(2, '0')}:00`, count: 0 }));
        trades.forEach(trade => {
            const tradeDate = trade.timestamp?.toDate ? trade.timestamp.toDate() : new Date(trade.timestamp);
            const hour = tradeDate.getHours();
            hourCounts[hour].count++;
        });
        return hourCounts.filter(h => h.count > 0);
    }, [trades]);

    const averageProfitLossData = useMemo(() => {
        let totalWinProfit = 0; let winTradeCount = 0; let totalLossProfit = 0; let lossTradeCount = 0;
        trades.forEach(trade => {
            if (trade.outcome === 'Win') { totalWinProfit += trade.profit; winTradeCount++; } else if (trade.outcome === 'Loss') { totalLossProfit += trade.profit; lossTradeCount++; }
        });
        const avgWin = winTradeCount > 0 ? (totalWinProfit / winTradeCount) : 0;
        const avgLoss = lossTradeCount > 0 ? (totalLossProfit / lossTradeCount) : 0;
        return [{ name: 'Average Win', value: parseFloat(avgWin.toFixed(2)) }, { name: 'Average Loss', value: parseFloat(avgLoss.toFixed(2)) }].filter(d => d.value !== 0);
    }, [trades]);

    
    const exportToCsv = (data, filename) => {
        if (!data || data.length === 0) {
            showMessageBox(`No data to export for ${filename}.`);
            return;
        }

        const headers = Object.keys(data[0]);
        const csvRows = [];
        csvRows.push(headers.join(','));

        for (const row of data) {
            const values = headers.map(header => {
                let value = row[header];
                if (typeof value === 'object' && value !== null) {
                    if (value.toDate && typeof value.toDate === 'function') {
                        value = value.toDate().toLocaleString();
                    } else {
                        value = JSON.stringify(value);
                    }
                }
                value = String(value).replace(/"/g, '""');
                if (value.includes(',') || value.includes('\n')) {
                    value = `"${value}"`;
                }
                return value;
            });
            csvRows.push(values.join(','));
        }

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportTradeHistory = () => {
        const formattedTrades = trades.map(trade => ({
            Date: trade.timestamp?.toDate ? trade.timestamp.toDate().toLocaleDateString() : '',
            Asset: trade.asset,
            Direction: trade.direction,
            EntryPrice: trade.entryPrice,
            ExpiryPrice: trade.expiryPrice,
            OpenTime: trade.openTime,
            ExpirationTime: trade.expirationTime,
            AmountInvested: trade.amount,
            Outcome: trade.outcome,
            ProfitLoss: trade.profit,
            Notes: trade.notes
        }));
        exportToCsv(formattedTrades, 'trade_history.csv');
    };

    const exportTransactions = () => {
        const formattedTransactions = transactions.map(transaction => ({
            Date: transaction.timestamp?.toDate ? transaction.timestamp.toDate().toLocaleDateString() : '',
            Type: transaction.type,
            Amount: transaction.amount,
            Notes: transaction.note
        }));
        exportToCsv(formattedTransactions, 'transactions.csv');
    };

    const exportOverallStats = () => {
        const overallStatsData = [{
            'Total Trades': stats.totalTrades,
            'Win Rate (%)': stats.winRate,
            'Net Profit/Loss ($)': stats.totalProfitLoss,
            'Average Profit per Win ($)': stats.averageProfitPerWin,
            'Average Loss per Loss ($)': stats.averageLossPerLoss,
            'Profit Factor': stats.profitFactor
        }];
        exportToCsv(overallStatsData, 'overall_trading_statistics.csv');
    };

    const exportWinRateByAsset = () => {
        exportToCsv(winRateByAssetData, 'win_rate_by_asset.csv');
    };

    const exportWinRateByDirection = () => {
        exportToCsv(winRateByDirectionData, 'win_rate_by_direction.csv');
    };

    const exportProfitLossDistribution = () => {
        exportToCsv(profitLossDistributionData, 'profit_loss_distribution.csv');
    };

    const exportTradeCountByDayOfWeek = () => {
        exportToCsv(tradeCountByDayOfWeekData, 'trade_count_by_day_of_week.csv');
    };

    const exportTradeCountByHourOfDay = () => {
        exportToCsv(tradeCountByHourOfDayData, 'trade_count_by_hour_of_day.csv');
    };

    const exportAverageProfitLoss = () => {
        exportToCsv(averageProfitLossData, 'average_profit_loss_per_trade.csv');
    };

    const exportDailyCalendarData = () => {
        const formattedDailyStats = Object.keys(dailyStats).map(date => ({
            Date: date,
            TotalTrades: dailyStats[date].totalTrades,
            TotalProfitLoss: dailyStats[date].totalProfitLoss
        }));
        exportToCsv(formattedDailyStats, 'calendar_daily_performance.csv');
    };

    const exportWeeklyCalendarData = () => {
        exportToCsv(weeklySummaries, 'calendar_weekly_summaries.csv');
    };

    const exportMonthlyCalendarData = () => {
        const formattedMonthlySummary = [{
            Month: currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' }),
            TotalTrades: monthlySummary.totalTrades,
            TotalProfitLoss: monthlySummary.totalProfitLoss
        }];
        exportToCsv(formattedMonthlySummary, 'calendar_monthly_summary.csv');
    };

    const exportGoalHistory = () => {
        const formattedGoals = goalHistory.map(goal => ({
            Type: goal.type.charAt(0).toUpperCase() + goal.type.slice(1),
            Period: `${goal.periodStart?.toDate().toLocaleDateString()} - ${goal.periodEnd?.toDate().toLocaleDateString()}`,
            GoalAmount: goal.goalAmount,
            ActualProfit: goal.actualProfit,
            Achieved: goal.achieved ? 'Yes' : 'No'
        }));
        exportToCsv(formattedGoals, 'goal_history.csv');
    };
    
    
    const startEditingJournal = (journal) => {
        setEditingJournalId(journal.id);
        setEditJournalName(journal.name);
    };

    const cancelEditingJournal = () => {
        setEditingJournalId(null);
        setEditJournalName('');
    };
    
    const saveEditingJournal = async (journalId) => {
        if (!db || !userId) { showMessageBox("Database not ready."); return; }
        if (!editJournalName.trim()) {
            showMessageBox("Journal name cannot be empty.");
            return;
        }

        showConfirmationModal(`Are you sure you want to rename this journal to "${editJournalName.trim()}"?`, async () => {
            try {
                const journalDocRef = doc(db, `artifacts/${appId}/users/${userId}/journals`, journalId);
                await updateDoc(journalDocRef, { name: editJournalName.trim() });
                if (currentJournalId === journalId) {
                    setCurrentJournalName(editJournalName.trim());
                }
                showMessageBox("Journal renamed successfully!");
                cancelEditingJournal();
            } catch (error) {
                console.error("Error renaming journal:", error);
                showMessageBox("Failed to rename journal. Please try again.");
            } finally { setShowModal(false); }
        });
    };

    const handleDeleteJournal = (journalId, journalName) => {
        if (!db || !userId) { showMessageBox("Database not ready."); return; }
        if (journals.length === 1) {
            showMessageBox("You cannot delete your last journal. Create a new one first if you wish to replace it.");
            return;
        }

        showConfirmationModal(`Are you sure you want to delete the journal "${journalName}" and ALL its associated data (trades, transactions, goals, balance)? This action cannot be undone.`, async () => {
            try {
                const batch = writeBatch(db);
                const journalDocRef = doc(db, `artifacts/${appId}/users/${userId}/journals`, journalId);

                // Delete subcollections (Firestore doesn't delete subcollections automatically)
                const subcollectionsToDelete = ['trades', 'transactions', 'goals'];
                for (const subColName of subcollectionsToDelete) {
                    const subCollectionRef = collection(journalDocRef, subColName);
                    const snapshot = await getDocs(subCollectionRef);
                    snapshot.docs.forEach(d => batch.delete(d.ref));
                }
                // Delete userProfile sub-documents
                const userProfileSubColRef = collection(journalDocRef, 'userProfile');
                const userProfileSnapshot = await getDocs(userProfileSubColRef);
                userProfileSnapshot.docs.forEach(d => batch.delete(d.ref));

                // Delete the journal document itself
                batch.delete(journalDocRef);
                await batch.commit();

                // After deletion, select another journal if the deleted one was current
                if (currentJournalId === journalId) {
                    const remainingJournals = journals.filter(j => j.id !== journalId);
                    if (remainingJournals.length > 0) {
                        const newCurrent = remainingJournals[0];
                        setCurrentJournalId(newCurrent.id);
                        setCurrentJournalName(newCurrent.name);
                        await updateDoc(doc(db, `artifacts/${appId}/users/${userId}/journals`, newCurrent.id), {
                            lastAccessedAt: serverTimestamp()
                        });
                    } else {
                        setCurrentJournalId(null);
                        setCurrentJournalName('');
                    }
                }
                showMessageBox(`Journal "${journalName}" and all its data deleted successfully.`);
            } catch (error) {
                console.error("Error deleting journal:", error);
                showMessageBox("Failed to delete journal. Please try again.");
            } finally { setShowModal(false); }
        });
    };
    
    // Calculate 20% of current balance for risk amount
    const amountToRisk = useMemo(() => {
        return (currentBalance * 0.20).toFixed(2);
    }, [currentBalance]);

    const dailyProgress = dailyProfitExpectation > 0 ? (currentDayProfit / dailyProfitExpectation) * 100 : 0;
    const weeklyProgress = weeklyProfitExpectation > 0 ? (currentWeekProfit / weeklyProfitExpectation) * 100 : 0;
    

    // If data is still loading, show a loading spinner
    if (loading) {
        return (
            <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-800'} font-inter`}>
                <div className="text-lg font-semibold">Loading journal data...</div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-800'} p-4 font-inter`}>
            <button onClick={toggleTheme} className="mb-4">
                {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </button>
            <button onClick={logOut}>Sign out</button>
            <button onClick={() => showMessageBox('This is a message')}>Show Message</button>
            <button onClick={() => showConfirmationModal('Are you sure?', () => alert('Confirmed!'))}>Show Confirmation</button>
            {/* Custom Modal */}
            {showModal && (
                <ShowModal
                    isDarkMode={isDarkMode}
                    modalMessage={modalMessage}
                    modalConfirmAction={modalConfirmAction}
                    setShowModal={setShowModal}
                />
            )}
            {/* Capital Management Modal */}
            {showCapitalManagementModal && (
                <ShowCapitalManagementModal
                    isDarkMode={isDarkMode}
                    setShowCapitalManagementModal={setShowCapitalManagementModal}
                    depositAmount={depositAmount}
                    setDepositAmount={setDepositAmount}
                    withdrawAmount={withdrawAmount}
                    setWithdrawAmount={setWithdrawAmount}
                    handleDeposit={handleDeposit}
                    handleWithdraw={handleWithdraw}
                    handleResetJournal={handleResetJournal}
                />
            )}
            {/* Daily Profit Expectation Modal */}
            {showDailyProfitExpectationModal && (
                <ShowDailyProfitExpectationModal
                    isDarkMode={isDarkMode}
                    setShowDailyProfitExpectationModal={setShowDailyProfitExpectationModal}
                    newDailyProfitExpectation={newDailyProfitExpectation}
                    setNewDailyProfitExpectation={setNewDailyProfitExpectation}
                    handleSaveDailyProfitExpectation={handleSaveDailyProfitExpectation}
                    dailyProfitExpectation={dailyProfitExpectation}
                />
            )}
            {/* Weekly Profit Expectation Modal */}
            {showWeeklyProfitExpectationModal && (
                <ShowWeeklyProfitExpectationModal
                    isDarkMode={isDarkMode}
                    setShowWeeklyProfitExpectationModal={setShowWeeklyProfitExpectationModal}
                    newWeeklyProfitExpectation={newWeeklyProfitExpectation}
                    setNewWeeklyProfitExpectation={setNewWeeklyProfitExpectation}
                    handleSaveWeeklyProfitExpectation={handleSaveWeeklyProfitExpectation}
                    weeklyProfitExpectation={weeklyProfitExpectation}
                />
            )}
            {/* Add New Journal Modal */}
            {showAddJournalModal && (
                <ShowAddJournalModal
                    isDarkMode={isDarkMode}
                    setShowAddJournalModal={setShowAddJournalModal}
                    newJournalName={newJournalName}
                    handleCreateJournal={handleCreateJournal}
                    setNewJournalName={setNewJournalName}
                />
            )}

            {/* Main displayed plage */}
            <SectionPage
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
             />
        </div>
    )
}
