const zod = require("zod");
const schemaOne = zod.object({
  businessName: zod.string().min(3),
  address: zod.string().min(3),
  state: zod.string().min(3),
  city: zod.string().min(3),
  pincode: zod.string().regex(/^\d{6}$/, {
    message: "Pincode must be a 6-digit number",
  }),
  landmark: zod.string().min(3),
  businessType: zod.string(),
  openingTime: zod.string(),
  closingTime: zod.string(),
  offDays: zod.string(),
  contactEmail: zod.string().email().min(1),
  contactPhone: zod
    .string()
    .length(10, "Mobile number must be exactly 10 digits")
    .regex(/^\d+$/, "Mobile number must contain only digits"),
});
function validateBusiness(req, res, next) {
  try {
    console.log(req.body);
    const {
      businessName,
      address,
      state,
      city,
      pincode,
      landmark,
      businessType,
      openingTime,
      closingTime,
      offDays,
      contactEmail,
      contactPhone,
    } = req.body;
    schemaOne.safeParse(
      businessName,
      address,
      state,
      city,
      pincode,
      landmark,
      businessType,
      openingTime,
      closingTime,
      offDays,
      contactEmail,
      contactPhone
    );
    console.log("validation successfull");
  } catch (err) {
    console.log("validation not successfull", err);
    res.json({
      msg: "Please fill correct information",
    });
  }
  next();
}
module.exports = validateBusiness;
