'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Define the type for list items
export interface ListItem {
  id: string | number;
  title: string;
  description: string;
  thumbnail_url: string;
  release_year: number;
  type: 'movie' | 'tv' | string;
  genres?: string[];
}

// Define the context type
interface MyListContextType {
  myList: ListItem[];
  addToList: (item: ListItem) => void;
  removeFromList: (id: string | number) => void;
  isInList: (id: string | number) => boolean;
}

// Create the context with default values
const MyListContext = createContext<MyListContextType>({
  myList: [],
  addToList: () => {},
  removeFromList: () => {},
  isInList: () => false,
});

// Create a provider component
export function MyListProvider({ children }: { children: ReactNode }) {
  const [myList, setMyList] = useState<ListItem[]>([]);

  // Load saved list from localStorage on component mount
  useEffect(() => {
    const savedList = localStorage.getItem('myList');
    if (savedList) {
      try {
        setMyList(JSON.parse(savedList));
      } catch (error) {
        console.error('Error parsing saved list:', error);
      }
    }
  }, []);

  // Save list to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('myList', JSON.stringify(myList));
  }, [myList]);

  // Add an item to the list
  const addToList = (item: ListItem) => {
    setMyList(prevList => {
      // Check if item already exists in the list
      if (prevList.some(listItem => listItem.id === item.id)) {
        return prevList;
      }
      return [...prevList, item];
    });
  };

  // Remove an item from the list
  const removeFromList = (id: string | number) => {
    setMyList(prevList => prevList.filter(item => item.id !== id));
  };

  // Check if an item is in the list
  const isInList = (id: string | number) => {
    return myList.some(item => item.id === id);
  };

  return (
    <MyListContext.Provider value={{ myList, addToList, removeFromList, isInList }}>
      {children}
    </MyListContext.Provider>
  );
}

// Custom hook to use the MyList context
export function useMyList() {
  const context = useContext(MyListContext);
  if (context === undefined) {
    throw new Error('useMyList must be used within a MyListProvider');
  }
  return context;
} 
