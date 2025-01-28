import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AllProducts.css";

const AllProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}all-products`)
      .then((res) => res.json())
      .then((data) => {
        const updated = data.map((product) => ({
          ...product,
          image: `${process.env.REACT_APP_BASE_URL}${product.image}`,
        }));
        setAllProducts(updated);
      })
      .catch((error) => {
        console.error("Error fetching all products:", error);
      });
  }, []);

  const filteredProducts = allProducts.filter((product) => {
    const term = searchTerm.toLowerCase();
    const productName = product.name?.toLowerCase() || "";
    const brandName = product.brand_name?.toLowerCase() || "";
    return productName.includes(term) || brandName.includes(term);
  });

  return (
    <div className="ap-container">
      <div className="ap-header">
        <div className="ap-nav-bar">
          <button className="ap-back-button" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <div className="ap-title-section">
            <h1>All Products</h1>
          </div>
        </div>

        <div className="ap-search-wrapper">
          <input
            type="text"
            placeholder="Search by name or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ap-search-input"
          />
          <span className="ap-search-icon">🔍</span>
        </div>
      </div>

      <div className="ap-products-grid">
        {filteredProducts.map((product) => (
          <Link
            to={`/product/${product.name}`}
            key={product.id}
            className="ap-product-link"
          >
            <div className="ap-product-card">
              <div className="ap-product-image-wrapper">
                <img
                  src={product.image}
                  alt={product.name}
                  className="ap-product-image"
                  onError={(e) => {
                    e.target.src = "/api/placeholder/400/400";
                  }}
                />
              </div>
              <div className="ap-product-info">
                <h3 className="ap-product-title">{product.name}</h3>
                {product.brand_name && (
                  <p className="ap-product-brand">
                    Brand: {product.brand_name}
                  </p>
                )}
                <p className="ap-product-price">{product.price}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="ap-no-results">
          <p>No products found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
