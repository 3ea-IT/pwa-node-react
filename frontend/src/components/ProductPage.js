import React from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import './ProductPage.css';
import productsData from './productsData';
import backIcon from './assets/leftarrow.png';


const ProductPage = () => {
    const navigate = useNavigate();
  const { productName } = useParams();
  const product = productsData.find(p => p.name === productName);

  if (!product) return <p>Product not found</p>;

  return (
    <div className="product-page">
        <header>
            <button className="back-button" onClick={() => navigate(-1)}><img src={backIcon} alt="Back" /></button>
            <h1>{product.name}</h1>
        </header>
      {/* <button className="back-button" onClick={() => window.history.back()}>←</button> */}
      <div className="product-header">
        <img src={product.image} alt={product.name} className="product-image"/>
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="tagline">{product.tagline}</p>
          <p className="dosage">{product.dosage}</p>
          <p className="price">{product.price}</p>
        </div>
      </div>
      <div className="product-details">
        <h2>About {product.name}</h2>
        <p>{product.description}</p>
        {product.sections.map((section, index) => (
          <div key={index} className="product-section">
            <h3>{section.title}</h3>
            {Array.isArray(section.content) ? (
              <ul>
                {section.content.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>{section.content}</p>
            )}
          </div>
        ))}
      </div>
      <button className="buy-now-button">Buy Now</button>
    </div>
  );
};

export default ProductPage;