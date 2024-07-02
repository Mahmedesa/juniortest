import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_ORDER } from '../hooks/useOrder';
import { GET_CART, DELETE_ORDER_ITEM } from '../hooks/useCart'; 

function PlaceOrder() {
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const { data, loading, error } = useQuery(GET_CART);
  const [addOrder] = useMutation(ADD_ORDER);
  const [deleteOrderItem] = useMutation(DELETE_ORDER_ITEM, {
    refetchQueries: [{ query: GET_CART }], 
  });
  const [orderPlaced, setOrderPlaced] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data || !data.orderitems) {
      console.error('No items in cart');
      return;
    }

    const items = data.orderitems.map(item => item.id);

    try {
      const { data: orderData } = await addOrder({
        variables: {
          address,
          payment_method: paymentMethod,
          items,
        },
      });
      console.log('Order created successfully:', orderData.addorder);
      setAddress('');
      setPaymentMethod('');
      await Promise.all(
        data.orderitems.map(item =>
          deleteOrderItem({ variables: { id: item.id } })
        )
      );
      console.log('Cart cleared successfully');
      setOrderPlaced(true);
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (orderPlaced) {
    window.location.href = '/'; 
    return null; 
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="floatingInput"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <label htmlFor="floatingInput">Address</label>
        </div>
        <div className="input-group mb-3">
          <select
            className="form-select"
            id="inputGroupSelect02"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">Choose...</option>
            <option value="Cash">Cash</option>
            <option value="PayPal">PayPal</option>
            <option value="Visa or MASTERCARD">Visa or MASTERCARD</option>
          </select>
          <label className="input-group-text" htmlFor="inputGroupSelect02">
            Payment Method
          </label>
        </div>
        <button type="submit" className="btn btn-success">
          SUBMIT
        </button>
      </form>
    </div>
  );
}

export default PlaceOrder;
