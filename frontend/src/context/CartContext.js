import React, { createContext, useContext, useState } from 'react';

const OrderItemsContext = createContext();

export const useOrderItems = () => useContext(OrderItemsContext);

export const OrderItemsProvider = ({ children }) => {
  const [orderItems, setOrderItems] = useState([]);

  const updateOrderItems = (items) => {
    setOrderItems(items);
  };

  return (
    <OrderItemsContext.Provider value={{ orderItems, updateOrderItems }}>
      {children}
    </OrderItemsContext.Provider>
  );
};
