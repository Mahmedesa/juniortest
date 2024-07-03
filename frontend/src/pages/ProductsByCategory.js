import React from "react";
import { useCategory } from "../hooks/useCategory";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ADD_ORDER_ITEM, useCart } from "../hooks/useCart";
import { useMutation } from "@apollo/client";
import "./ProductsBYCategory.css";

function ProductsByCategory() {
  const { id } = useParams();
  const { data, error, loading } = useCategory(id);
  console.log({ data, error, loading });
  const { error: cartError, loading: cartLoading } = useCart(); 
  const [addOrderItem] = useMutation(ADD_ORDER_ITEM); 
  const navigate = useNavigate()

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
        navigate("/")
      })
      .catch((error) => {
        console.error("Error adding product to cart:", error);
        alert("Failed to add product to cart.");
      });
  };

  return (
    <div key={data?.category.id}>
      <h3>{data?.category.name}</h3>
      <div className="productList">
        {data?.category.products.map((product) => {
          return (
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
                {product.inStock && (
                  <button
                    className="btn btn-success"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProductsByCategory;
