import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../config/firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

const WalletContext = createContext();

export function useWallet() {
  return useContext(WalletContext);
}

export function WalletProvider({ children }) {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      loadWalletData();
    }
  }, [currentUser]);

  const loadWalletData = async () => {
    try {
      const walletRef = doc(db, 'wallets', currentUser.uid);
      const walletDoc = await getDoc(walletRef);

      if (walletDoc.exists()) {
        const data = walletDoc.data();
        setBalance(data.balance || 0);
        setTransactions(data.transactions || []);
      } else {
        // Initialize wallet for new user
        await setDoc(walletRef, {
          balance: 0,
          transactions: [],
          createdAt: new Date(),
          userId: currentUser.uid
        });
      }
    } catch (error) {
      console.error('Error loading wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFunds = async (amount, method) => {
    try {
      const walletRef = doc(db, 'wallets', currentUser.uid);
      const newTransaction = {
        type: 'credit',
        amount,
        method,
        timestamp: new Date(),
        description: 'Wallet Top-up',
        reference: `TOP-${Date.now()}`
      };

      await updateDoc(walletRef, {
        balance: balance + amount,
        transactions: [...transactions, newTransaction]
      });

      setBalance(prev => prev + amount);
      setTransactions(prev => [...prev, newTransaction]);
      return true;
    } catch (error) {
      console.error('Error adding funds:', error);
      return false;
    }
  };

  const deductFunds = async (amount, description, recipient) => {
    try {
      if (balance < amount) {
        throw new Error('Insufficient funds');
      }

      const walletRef = doc(db, 'wallets', currentUser.uid);
      const newTransaction = {
        type: 'debit',
        amount,
        timestamp: new Date(),
        description,
        recipient,
        reference: `TXN-${Date.now()}`
      };

      await updateDoc(walletRef, {
        balance: balance - amount,
        transactions: [...transactions, newTransaction]
      });

      setBalance(prev => prev - amount);
      setTransactions(prev => [...prev, newTransaction]);
      return true;
    } catch (error) {
      console.error('Error deducting funds:', error);
      return false;
    }
  };

  const transferFunds = async (recipientId, amount, description) => {
    try {
      // Deduct from sender
      const senderSuccess = await deductFunds(amount, description, recipientId);
      if (!senderSuccess) {
        throw new Error('Failed to deduct funds from sender');
      }

      // Add to recipient
      const recipientRef = doc(db, 'wallets', recipientId);
      const recipientDoc = await getDoc(recipientRef);
      
      if (recipientDoc.exists()) {
        const recipientData = recipientDoc.data();
        await updateDoc(recipientRef, {
          balance: (recipientData.balance || 0) + amount,
          transactions: [...(recipientData.transactions || []), {
            type: 'credit',
            amount,
            timestamp: new Date(),
            description: `Transfer from ${currentUser.email}`,
            sender: currentUser.uid,
            reference: `TRF-${Date.now()}`
          }]
        });
        return true;
      }
      throw new Error('Recipient wallet not found');
    } catch (error) {
      console.error('Error transferring funds:', error);
      return false;
    }
  };

  const value = {
    balance,
    transactions,
    loading,
    addFunds,
    deductFunds,
    transferFunds
  };

  return (
    <WalletContext.Provider value={value}>
      {!loading && children}
    </WalletContext.Provider>
  );
} 