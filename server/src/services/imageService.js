const supabase = require("../config/supabase");

const uploadVehicleImage = async (file, vehicleId) => {
  try {
    console.log("1️⃣ Starting image upload...");
    console.log("File:", file.originalname);
    console.log("Vehicle ID:", vehicleId);

    const fileExtension = file.originalname.split(".").pop();

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExtension}`;

    const filePath = `vehicle-${vehicleId}/${fileName}`;

    console.log("2️⃣ Uploading to Supabase...");
    console.log("File path:", filePath);

    const { error } = await supabase.storage
      .from("vehicle-images")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error("❌ Supabase error:", error);
      throw error;
    }

    console.log("3️⃣ Upload successful!");

    const { data } = supabase.storage
      .from("vehicle-images")
      .getPublicUrl(filePath);

    console.log("4️⃣ Public URL:", data.publicUrl);

    return data.publicUrl;
  } catch (error) {
    console.error("❌ Image service error:", error);
    throw error;
  }
};

module.exports = {
  uploadVehicleImage,
};