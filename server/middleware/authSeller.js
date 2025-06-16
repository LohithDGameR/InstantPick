import jwt from "jsonwebtoken";

const authSeller = async (req, res, next) => {
  const { sellerToken } = req.cookies;

  if (!sellerToken) {
    // If no token is present, the user is not authorized.
    // Sending a 401 status code is appropriate here.
    return res
      .status(401)
      .json({ success: false, message: "Not Authorized: No token provided" });
  }

  try {
    // Verify the token using your JWT_SECRET.
    // The jwt.verify function will throw an error if the token is invalid, expired, or malformed.
    const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET);

    // At this point, the token is valid.
    // The tokenDecode object contains the payload we signed (e.g., { id: seller._id, email: seller.email }).
    // We can attach this decoded information to the request object for use in subsequent controllers.
    req.seller = tokenDecode;

    // Proceed to the next middleware or route handler.
    next();
  } catch (error) {
    // If jwt.verify throws an error, it means the token is invalid or expired.
    console.error("Token verification failed:", error.message);
    return res
      .status(401)
      .json({
        success: false,
        message: "Not Authorized: Invalid or expired token",
      });
  }
};

export default authSeller;
