import { useEffect, useState, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";

const ProductDetails = () => {
  const { allProducts, navigate, currency, addToCart } = useAppContext();
  const { id } = useParams();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);

  const containerRef = useRef(null);

  const product = allProducts.find((item) => item._id === id);

  useEffect(() => {
    if (product && allProducts.length > 0) {
      const filtered = allProducts.filter(
        (item) => item.category === product.category && item._id !== product._id
      );
      setRelatedProducts(filtered.slice(0, 5));
    } else {
      setRelatedProducts([]);
    }
  }, [product, allProducts]);

  useEffect(() => {
    setThumbnail(product?.image?.[0] ?? null);
  }, [product]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.classList.add("fade-in-up");
    }
  }, [id]);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-xl font-medium text-gray-500">
        Loading product details or product not found...
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mt-8 md:mt-12 max-w-6xl mx-auto px-4 md:px-2 opacity-0 translate-y-5 transition-all duration-700 ease-out">
      <p className="text-sm text-gray-600 mb-6">
        <Link to="/" className="text-green-700 hover:underline">
          Home
        </Link>{" "}
        /
        <Link to="/products" className="text-green-700 hover:underline">
          {" "}
          Products
        </Link>{" "}
        /
        <Link
          to={`/products/${product.category.toLowerCase()}`}
          className="text-green-700 hover:underline">
          {" "}
          {product.category}
        </Link>{" "}
        /<span className="text-green-700 font-medium"> {product.name}</span>
      </p>

      <div className="flex flex-col md:flex-row gap-8 md:gap-16 mt-4 bg-white p-6 md:p-8 rounded-lg shadow-md">
        <div className="flex gap-3">
          <div className="flex flex-col gap-3">
            {product.image.map((image, index) => (
              <div
                key={index}
                onClick={() => setThumbnail(image)}
                className={`border rounded-md overflow-hidden cursor-pointer w-20 h-20 md:w-24 md:h-24 flex-shrink-0 ${
                  thumbnail === image
                    ? "border-green-700 shadow-sm"
                    : "border-green-200"
                }`}>
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          <div className="border border-green-200 rounded-md overflow-hidden flex-1 shadow-sm max-w-[400px] md:max-w-[500px]">
            <img
              src={thumbnail}
              alt="Selected product"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="text-gray-800 ml-2 relative text-base w-full md:w-1/2">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {product.name}
          </h1>

          <div className="flex items-center gap-0.5 mt-1">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                  alt=""
                  className="w-3.5 md:w-4"
                />
              ))}
            <p className="text-sm md:text-base ml-2 text-gray-600">
              (4 Reviews)
            </p>
          </div>

          <div className="mt-6">
            <p className="text-gray-500 line-through">
              MRP: {currency}
              {product.price}
            </p>
            <p className="text-2xl md:text-3xl font-bold text-green-700">
              MRP: {currency}
              {product.offerPrice}
            </p>
            <span className="text-gray-600">(inclusive of all taxes)</span>
          </div>

          <p className="text-lg font-semibold mt-8 mb-3">About Product</p>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            {product.description.map((desc, index) => (
              <li key={index}>{desc}</li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row items-center mt-10 gap-4 text-base">
            <button
              onClick={() => addToCart(product._id)}
              className="w-full py-3.5 px-6 cursor-pointer font-medium bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition whitespace-nowrap shadow-sm">
              Add to Cart
            </button>
            <button
              onClick={() => {
                addToCart(product._id);
                navigate("/cart");
              }}
              className="w-full py-3.5 px-6 cursor-pointer font-medium bg-green-700 text-white rounded-md hover:bg-green-800 transition whitespace-nowrap shadow-sm">
              Buy now
            </button>
          </div>
        </div>
      </div>

      {/* ---------- related products -------------- */}
      <div className="mt-16 flex flex-col">
        <div className="flex flex-col items-end w-max">
          <p className="text-3xl md:text-4xl font-semibold text-green-600 ml-2 relative">
            Related Products
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full mt-2" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mt-6">
          {relatedProducts
            .filter((p) => p.inStock)
            .map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
        </div>

        <button
          onClick={() => {
            navigate("/products");
            window.scrollTo(0, 0);
          }}
          className="mx-auto cursor-pointer px-12 py-3 my-16 border border-green-700 rounded-md text-green-700 hover:bg-green-700/10 transition font-medium shadow-sm">
          See more
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
