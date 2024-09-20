import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductPage.css";
import backIcon from "./assets/leftarrow.png"; // Adjust if needed, ensure it's the correct path
import axios from "axios";

const ProductPage = () => {
  const navigate = useNavigate();
  const { productName } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}product/${productName}`
        );
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to fetch product. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productName]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Product not found</p>;

  // Dynamically import the image from the same folder
  const imagePath = `${process.env.REACT_APP_BASE_URL}products/${product.image}`;

  return (
    <div className="product-page">
      <header>
        <button className="back-button" onClick={() => navigate(-1)}>
          <img src={backIcon} alt="Back" />
        </button>
        <h1>{product.name}</h1>
      </header>

      <div className="product-header">
        <img src={imagePath} alt={product.name} className="product-image" />
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="tagline">{product.tagline}</p>
          <p className="dosage">{product.dosage}</p>
          <p className="price">{product.price}</p>
        </div>
      </div>

      <div className="product-details">
        <h2>About {product.name}</h2>
        {/* Render the description as HTML */}
        <div dangerouslySetInnerHTML={{ __html: product.description }} />
        {/* Render the sections as HTML */}
      </div>
      <div className="product-sections">
        <div
          dangerouslySetInnerHTML={{ __html: product.sections }}
          style={{ textAlign: "left" }}
        />
      </div>
      <button className="buy-now-button">Buy Now</button>
    </div>
  );
};

export default ProductPage;
