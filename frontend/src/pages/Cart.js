import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import {
  useCart,
  DELETE_ORDER_ITEM,
  GET_CART,
  EDIT_ORDER_ITEM,
} from "../hooks/useCart";
import { useOrderItems } from "../context/CartContext";
import "./Cart.css";

const Cart = ({ onClose }) => {
  const { orderItems, updateOrderItems } = useOrderItems();
  const { error, data, loading } = useCart();
  const [deleteOrderItem] = useMutation(DELETE_ORDER_ITEM, {
    refetchQueries: [{ query: GET_CART }],
  });
  const [editOrderItem] = useMutation(EDIT_ORDER_ITEM, {
    refetchQueries: [{ query: GET_CART }],
  });

  const [selectedAttributes, setSelectedAttributes] = useState({});

  useEffect(() => {
    if (data && data.orderitems) {
      const savedSelectedAttributes = {};
      data.orderitems.forEach((orderitem) => {
        const attributes = {};
        orderitem.product.productattributes.forEach((productattribute) => {
          const savedAttributeId = localStorage.getItem(
            `selectedAttribute_${orderitem.id}_${productattribute.attribute.id}`
          );
          if (savedAttributeId) {
            attributes[productattribute.attribute.id] = parseInt(
              savedAttributeId,
              10
            );
          }
        });
        savedSelectedAttributes[orderitem.id] = attributes;
      });
      setSelectedAttributes(savedSelectedAttributes);
      updateOrderItems(data.orderitems); // Update context with current order items
      localStorage.setItem("orderItems", JSON.stringify(data.orderitems));
    }
  }, [data, updateOrderItems]);

  const handleAttributeItemSelection = (
    orderitemId,
    attributeId,
    attributeItemId
  ) => {
    setSelectedAttributes((prevSelected) => ({
      ...prevSelected,
      [orderitemId]: {
        ...prevSelected[orderitemId],
        [attributeId]: attributeItemId,
      },
    }));

    localStorage.setItem(
      `selectedAttribute_${orderitemId}_${attributeId}`,
      attributeItemId.toString()
    );

    updateOrderItem(orderitemId, attributeId, attributeItemId);
  };

  const updateOrderItem = (orderitemId, attributeId, attributeItemId) => {
    const orderitem = data?.orderitems?.find((item) => item.id === orderitemId);
    if (!orderitem) {
      console.error(`Order item with id ${orderitemId} not found`);
      return;
    }

    const updatedAttributes = orderitem.product.productattributes.map(
      (productattribute) => {
        const selectedAttributeId =
          selectedAttributes[orderitemId]?.[productattribute.attribute.id];
        return selectedAttributeId !== undefined
          ? selectedAttributeId
          : orderitem.oiais.find(
              (oiai) =>
                oiai?.attributeitem?.pais?.attribute?.id ===
                productattribute?.attribute?.id
            )?.attributeitem_id;
      }
    );

    const validAttributes = updatedAttributes.filter((id) => id != null);

    const existingOrderItem = data.orderitems.find((item) => {
      if (item.id === orderitemId) return false;
      if (item.product.id !== orderitem.product.id) return false;
      return item.oiais.every(
        (oiai, index) => oiai.attributeitem_id === validAttributes[index]
      );
    });

    if (existingOrderItem) {
      const newQuantity = existingOrderItem.quantity + orderitem.quantity;
      editOrderItem({
        variables: {
          id: existingOrderItem.id,
          quantity: newQuantity,
          attributes: validAttributes,
        },
      })
        .then((response) => {
          console.log(
            "Order item quantity updated:",
            response.data.editorderitem
          );
          handleRemoveFromCart(orderitem.id);
        })
        .catch((error) => {
          console.error("Error updating order item quantity:", error);
          alert("Failed to update order item quantity.");
        });
    } else {
      editOrderItem({
        variables: {
          id: orderitemId,
          quantity: orderitem.quantity,
          attributes: validAttributes,
        },
      })
        .then((response) => {
          console.log(
            "Order item attribute updated:",
            response.data.editorderitem
          );
        })
        .catch((error) => {
          console.error("Error updating order item attribute:", error);
          alert("Failed to update order item attribute.");
        });
    }
  };

  const handleRemoveFromCart = (id) => {
    console.log("Attempting to remove item with id:", id);
    deleteOrderItem({
      variables: { id: parseInt(id, 10) },
    })
      .then((response) => {
        console.log("Order item removed:", response.data.deleteorderitem);
      })
      .catch((error) => {
        console.error("Error removing order item:", error);
        alert("Failed to remove order item.");
      });
  };

  const handleIncreaseQuantity = (orderitem) => {
    const newQuantity = orderitem.quantity + 1;
    editOrderItem({
      variables: {
        id: orderitem.id,
        quantity: newQuantity,
        attributes: orderitem.oiais.map((oiai) => oiai.attributeitem_id),
      },
    })
      .then((response) => {
        console.log("Order item updated:", response.data.editorderitem);
      })
      .catch((error) => {
        console.error("Error updating order item:", error);
        alert("Failed to update order item quantity.");
      });
  };

  const handleDecreaseQuantity = (orderitem) => {
    const newQuantity = orderitem.quantity - 1;
    if (newQuantity <= 0) {
      handleRemoveFromCart(orderitem.id);
      alert(
        "Order item quantity cannot be equal to 0, so Order item removed successfully!"
      );
    } else {
      editOrderItem({
        variables: {
          id: orderitem.id,
          quantity: newQuantity,
          attributes: orderitem.oiais.map((oiai) => oiai.attributeitem_id),
        },
      })
        .then((response) => {
          console.log("Order item updated:", response.data.editorderitem);
        })
        .catch((error) => {
          console.error("Error updating order item:", error);
          alert("Failed to update order item quantity.");
        });
    }
  };

  const handleCloseOverlay = (e) => {
    if (e.target.classList.contains("cart-overlay")) {
      onClose();
    }
  };

  const calculateTotalPrice = () => {
    return orderItems.reduce((total, item) => total + item.total_price, 0);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data || !data.orderitems || data.orderitems.length === 0)
    return <p>No items in cart</p>;

  return (
    <div className="cart-overlay" onClick={handleCloseOverlay}>
      <div className="cart-content">
        <button className="btn-close" onClick={onClose}>
          &times;
        </button>
        <h2>Your Cart</h2>
        {data.orderitems.map((orderitem) => (
          <div key={orderitem.id} className="card" style={{ width: "18rem" }}>
            <img
              src={orderitem.product.image}
              className="card-img-top"
              alt={orderitem.product.name}
            />
            <div className="card-body">
              <h5 className="card-title">{orderitem.product.name}</h5>
              <p className="card-text">
                {orderitem.product.price} {orderitem.product.currency_symbol} X{" "}
                {orderitem.quantity}
              </p>
            </div>
            <div>
              <button
                className="btn btn-outline-primary"
                onClick={() => handleIncreaseQuantity(orderitem)}
              >
                +
              </button>
              <p>{orderitem.quantity}</p>
              <button
                className="btn btn-outline-primary"
                onClick={() => handleDecreaseQuantity(orderitem)}
              >
                -
              </button>
            </div>
            {orderitem.product.productattributes.map((productattribute) => (
              <div key={`${orderitem.id}-${productattribute.attribute.name}`}>
                <h5>{productattribute.attribute.name} :</h5>
                <div>
                  {productattribute.attribute.pais.map((pai) => {
                    const isOiaiSelected = orderitem.oiais.some(
                      (oiai) => oiai.attributeitem_id === pai.attributeitem.id
                    );
                    return (
                      <button
                        key={pai.attributeitem.id}
                        className={`btn ${
                          isOiaiSelected ? "btn-dark" : "btn-outline-light"
                        }`}
                        onClick={() =>
                          handleAttributeItemSelection(
                            orderitem.id,
                            productattribute.attribute.id,
                            pai.attributeitem.id
                          )
                        }
                        style={
                          isOiaiSelected
                            ? { color: "white" }
                            : { color: "black" }
                        }
                      >
                        {pai.attributeitem.display_value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="card-body">
              <h5>
                {orderitem.total_price} {orderitem.product.currency_symbol}
              </h5>
            </div>
            <button
              className="btn btn-outline-danger"
              onClick={() => handleRemoveFromCart(orderitem.id)}
            >
              Remove
            </button>
          </div>
        ))}
        <div className="total-price">
          <h3>Total:</h3>
          <h4>
            {orderItems.length > 0
              ? `${
                  orderItems[0].product.currency_symbol
                }${calculateTotalPrice().toFixed(2)}`
              : "$0.00"}
          </h4>
        </div>
        <Link to="/placeorder">
          <button
            className="btn btn-outline-success"
            onClick={onClose} // Close the cart when placing the order
          >
            Place Order
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Cart;
