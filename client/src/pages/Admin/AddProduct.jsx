import { useState } from "react";
import { assets, categories } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddProduct = () => {
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");

  // Destructure fetchSellerProducts and fetchAllProducts from context
  const { axios, fetchSellerProducts, fetchAllProducts } = useAppContext();

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const productData = {
        name,
        description: description.split("\n"),
        category,
        price,
        offerPrice,
      };
      const formData = new FormData();
      formData.append("productData", JSON.stringify(productData));
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }

      const { data } = await axios.post("/api/product/add", formData);

      if (data.success) {
        toast.success(data.message);
        // Clear form fields
        setName("");
        setDescription("");
        setCategory("");
        setPrice("");
        setOfferPrice("");
        setFiles([]);

        // --- CRUCIAL FIX: Re-fetch seller products AND ALL products after successful addition ---
        fetchSellerProducts(); // Update admin's product list
        fetchAllProducts(); // Update public product list so new product appears immediately
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll text-green-700">
      <form
        onSubmit={onSubmitHandler}
        className="md:p-10 p-4 space-y-6 max-w-3xl mx-auto bg-white rounded-xl shadow-md border border-green-100 mt-6">
        <h2 className="text-2xl font-semibold text-center text-green-600 ml-2 relative mb-4">
          🌱 Add New Product
        </h2>

        {/* Image Upload */}
        <div>
          <p className="text-base font-medium">Product Images</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {Array(4)
              .fill("")
              .map((_, index) => (
                <label key={index} htmlFor={`image${index}`}>
                  <input
                    onChange={(e) => {
                      const updatedFiles = [...files];
                      updatedFiles[index] = e.target.files[0];
                      setFiles(updatedFiles);
                    }}
                    accept="image/*"
                    type="file"
                    id={`image${index}`}
                    hidden
                  />
                  <img
                    className="w-24 h-24 object-cover border border-green-200 rounded-lg cursor-pointer hover:scale-105 transition"
                    src={
                      files[index]
                        ? URL.createObjectURL(files[index])
                        : assets.upload_area
                    }
                    alt="upload"
                  />
                </label>
              ))}
          </div>
        </div>

        {/* Product Name */}
        <div className="flex flex-col gap-1">
          <label htmlFor="product-name" className="text-base font-medium">
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Organic Kale"
            className="bg-green-50 border border-green-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="product-description"
            className="text-base font-medium">
            Product Description
          </label>
          <textarea
            id="product-description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Freshly harvested kale, rich in vitamins..."
            className="bg-green-50 border border-green-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-green-400 resize-none"></textarea>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1">
          <label htmlFor="category" className="text-base font-medium">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-green-50 border border-green-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-green-400"
            required>
            <option value="">Select Category</option>
            {categories.map((item, index) => (
              <option key={index} value={item.path}>
                {item.path}
              </option>
            ))}
          </select>
        </div>

        {/* Pricing */}
        <div className="flex flex-wrap gap-5">
          <div className="flex-1 flex flex-col gap-1 min-w-[120px]">
            <label htmlFor="product-price" className="text-base font-medium">
              Product Price
            </label>
            <input
              id="product-price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              className="bg-green-50 border border-green-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>
          <div className="flex-1 flex flex-col gap-1 min-w-[120px]">
            <label htmlFor="offer-price" className="text-base font-medium">
              Offer Price
            </label>
            <input
              id="offer-price"
              type="number"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              placeholder="0"
              className="bg-green-50 border border-green-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-2 rounded-md transition duration-200 shadow-md cursor-pointer">
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
