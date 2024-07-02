import React from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useMutation } from "@apollo/client";
import { ADD_ORDER_ITEM, GET_CART, useCart } from "../hooks/useCart";
import "./ProductList.css";

function ProductList() {
  const { error, data, loading } = useProducts();
  const { error: cartError, loading: cartLoading } = useCart();
  const [addOrderItem] = useMutation(ADD_ORDER_ITEM, {
    refetchQueries: [{ query: GET_CART }]
  });

  if (error) return <p>Error: {error.message}</p>;
  if (cartError) return <p>Error loading cart: {cartError.message}</p>;
  if (loading || cartLoading) return <p>Loading...</p>;

  const handleAddToCart = (product) => {
    addOrderItem({
      variables: {
        product_id: product.id,
        quantity: 1, 
        attributes: [] 
      },
    })
      .then((response) => {
        console.log("Product added to cart:", response.data.addOrderItem);
        alert("Product added to cart successfully!");
      })
      .catch((error) => {
        console.error("Error adding product to cart:", error);
        alert("Failed to add product to cart.");
      });
  };

  return (
    <div className="productList">
      {data?.products?.map((product) => (
        <div className="card" style={{ width: "18rem" }} key={product.id}>
          <Link to={`/product/${product.id}`}>
            <img
              src={product.image}
              className="card-img-top"
              alt={product.name}
            />
          </Link>
          <div className="card-body">
            <h5 className="card-title">{product.name}</h5>
            <p className="card-text">
              {product.currency_symbol} {product.price}
            </p>
            <button
              className="btn btn-success"
              disabled={!product.inStock}
              onClick={() => handleAddToCart(product)}
            >
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
