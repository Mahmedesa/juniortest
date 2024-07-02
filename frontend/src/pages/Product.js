import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { useProduct } from "../hooks/useProduct";
import { ADD_ORDER_ITEM } from "../hooks/useCart";
import "./Product.css";

function Product() {
  const { id } = useParams();
  const { data, error, loading } = useProduct(id);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [quantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [addOrderItem] = useMutation(ADD_ORDER_ITEM);

  if (error) return <p>Error: {error.message}</p>;
  if (loading) return <p>Loading...</p>;

  const handleAttributeChange = (attributeId, attributeItemId) => {
    setSelectedAttributes((prevSelected) => {
      const prevSelectedItems = prevSelected[attributeId] || [];
      const updatedItems = prevSelectedItems.includes(attributeItemId)
        ? prevSelectedItems.filter((id) => id !== attributeItemId)
        : [...prevSelectedItems, attributeItemId];

      return {
        ...prevSelected,
        [attributeId]: updatedItems,
      };
    });
  };

  const handleAddToCart = async () => {
    try {
      const selectedAttributeIds = Object.keys(selectedAttributes);
      const allAttributesSelected = data.product.productattributes.every(
        (attribute) =>
          selectedAttributes[attribute.attribute.id]?.length > 0
      );

      if (!allAttributesSelected) {
        alert("Please select one attribute item for each attribute.");
        return;
      }

      const attributeItemIds = selectedAttributeIds.flatMap(
        (attributeId) => selectedAttributes[attributeId]
      );

      await addOrderItem({
        variables: {
          product_id: parseInt(id),
          quantity,
          attributes: attributeItemIds,
        },
      });
      alert("Product added to cart successfully!");
    } catch (err) {
      console.error("Error adding to cart", err);
      alert("Failed to add product to cart.");
    }
  };

  const handleNextImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % data.product.galleries.length
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? data.product.galleries.length - 1 : prevIndex - 1
    );
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="product">
      <div className="images">
        {data?.product.galleries.map((gallery, index) => (
          <div
            key={gallery.id}
            id="carouselExample"
            className={`carousel slide ${index === currentImageIndex ? "active" : ""}`}
            onClick={() => handleImageClick(index)}
          >
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img
                  src={gallery.path}
                  className="d-block w-100"
                  alt={data?.product.name}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ width: "20rem"}}>
        <div id="carouselExample" className="carousel slide">
          <div className="carousel-inner">
            {data?.product.galleries.map((gallery, index) => (
              <div
                key={gallery.id}
                className={`carousel-item ${index === currentImageIndex ? "active" : ""}`}
              >
                <img src={gallery.path} className="d-block w-100" alt={data?.product.name}  />
              </div>
            ))}
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="prev"
            onClick={handlePrevImage}
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="next"
            onClick={handleNextImage}
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      <div className="details">
        <h2>{data?.product.name}</h2>
        <div>
          {data?.product.productattributes.map((productattribute) => (
            <div key={productattribute.id}>
              <h5>{productattribute.attribute.name} :</h5>
              <div>
                {productattribute.attribute.pais.map((pai) => (
                  <div
                    key={pai.attributeitem.id}
                    className="btn-group"
                    role="group"
                    aria-label="Basic checkbox toggle button group"
                  >
                    <input
                      type="checkbox"
                      className="btn-check"
                      name={productattribute.attribute.id}
                      id={pai.attributeitem.id}
                      autoComplete="off"
                      checked={selectedAttributes[productattribute.attribute.id]?.includes(pai.attributeitem.id)}
                      onChange={() => handleAttributeChange(productattribute.attribute.id, pai.attributeitem.id)}
                    />
                    <label
                      className={`btn ${selectedAttributes[productattribute.attribute.id]?.includes(pai.attributeitem.id) ? "btn-dark" : "btn-outline-light"}`}
                      htmlFor={pai.attributeitem.id}
                      style={{ color: "black" }}
                    >
                      {pai.attributeitem.display_value}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <h5>Price:</h5>
        <h5>
          {data?.product.price} {data?.product.currency_symbol}
        </h5>
        <button
          className="btn btn-success"
          disabled={!data?.product.inStock}
          onClick={handleAddToCart}
        >
          {data?.product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
        <p>{data?.product.description}</p>
      </div>
    </div>
  );
}

export default Product;
