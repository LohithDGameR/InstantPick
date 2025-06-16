import Address from "../models/Address.js";

// Add Address : /api/address/add
export const addAddress = async (req, res) => {
  try {
    // Retrieve userId from req.userId, which is set by the authUser middleware
    const userId = req.userId; // *** CRUCIAL CHANGE ***
    const { address } = req.body; // address object comes from the frontend

    // Ensure userId is present before creating
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: User ID not found." });
    }

    // Create the address document, combining the received address object with the userId
    await Address.create({ ...address, userId });
    res.json({ success: true, message: "Address added successfully" });
  } catch (error) {
    console.error("Error adding address:", error.message); // Use console.error for errors
    res.status(500).json({ success: false, message: error.message }); // Send a 500 status for server errors
  }
};

// Get Address : /api/address/get
export const getAddress = async (req, res) => {
  try {
    // Retrieve userId from req.userId, which is set by the authUser middleware
    const userId = req.userId; // *** CRUCIAL CHANGE ***

    // Ensure userId is present before querying
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: User ID not found." });
    }

    const addresses = await Address.find({ userId });
    res.json({ success: true, addresses });
  } catch (error) {
    console.error("Error getting addresses:", error.message); // Use console.error for errors
    res.status(500).json({ success: false, message: error.message }); // Send a 500 status for server errors
  }
};
