const zod = require("zod");

const genderSchema = zod
  .string()
  .refine(
    (value) =>
      ["male", "female", "other"].includes(value.toLowerCase()),
    {
      message: "Invalid gender value",
    }
  );


const schemaOne = zod.object({
  name: zod.string().min(1, "Name is required"),
  email: zod
    .string()
    .email("Invalid email address")
    .min(1, "Email is required"),
  mobile_number: zod
    .string()
    .length(10, "Mobile number must be exactly 10 digits")
    .regex(/^\d+$/, "Mobile number must contain only digits"),
  password: zod.string().min(6, "Password must be at least 6 characters long"),
  gender: genderSchema,
  address: zod.string().min(2, "Address must be at least 5 characters long"),
});

function validateSignup(req, res, next) {
  try {
    console.log("Received data:", req.body); // Log received data
    const result = schemaOne.safeParse(req.body);

    if (!result.success) {
      console.log("Validation failed:", result.error.errors);
      return res.status(400).json({
        msg: "Validation failed",
        errors: result.error.errors,
      });
    }

    console.log("Validation successful");
    next();
  } catch (err) {
    console.log("Unexpected error during validation:", err);
    res.status(500).json({
      msg: "An unexpected error occurred during validation",
    });
  }
}
module.exports = validateSignup;
