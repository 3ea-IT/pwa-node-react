import React, { useEffect, useState } from "react";
import "../components/AllProducts.css";

const AllProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch all products on component mount
    fetch(`${process.env.REACT_APP_API_URL}all-products`)
      .then((res) => res.json())
      .then((data) => {
        // If you need to prepend a base URL:
        const updated = data.map((product) => ({
          ...product,
          // Example: If your base URL is needed for images
          image: `${process.env.REACT_APP_BASE_URL}${product.image}`,
        }));
        setAllProducts(updated);
      })
      .catch((error) => {
        console.error("Error fetching all products:", error);
      });
  }, []);

  // Filter products by name or brand name
  const filteredProducts = allProducts.filter((product) => {
    const term = searchTerm.toLowerCase();
    const productName = product.name?.toLowerCase() || "";
    const brandName = product.brand_name?.toLowerCase() || "";
    return productName.includes(term) || brandName.includes(term);
  });

  return (
    <div className="all-products-container">
      <header className="all-products-header">
        <h1>All Products</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image-wrapper">
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
              />
            </div>
            <h3 className="product-title">{product.name}</h3>
            {product.brand_name && (
              <p className="product-brand">Brand: {product.brand_name}</p>
            )}
            {product.price && (
              <p className="product-price">Price: {product.price}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
