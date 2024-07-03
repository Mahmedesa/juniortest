import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCategories } from "../hooks/useCategories";
import { useCart } from "../hooks/useCart";
import Cart from '../pages/Cart'; // Import Cart component
import './Header.css'; // Add CSS for Header if needed

function Header() {
  const { error, data, loading } = useCategories();
  const { data: cartData } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const cartItemCount = cartData?.orderitems?.length || 0;

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">
                  All
                </Link>
              </li>
              {data?.categories?.map((category) => (
                <li className="nav-item" key={category.id}>
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    to={`category/${category.id}`}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
            <button
              className="d-flex btn btn-light position-relative"
              onClick={toggleCart}
            >
              Cart
              {cartItemCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark"
                  style={{ color: "white" }}
                >
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>
      {isCartOpen && <Cart onClose={closeCart} />}
    </div>
  );
}

export default Header;
