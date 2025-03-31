import fs from "fs";
import path from "path";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Failed to parse form data" });
    }

    const { reportType, username } = fields;
    const file = files.file;
    const userDir = path.join(process.cwd(), "public", "report", username);

    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    const filePath = path.join(userDir, `${reportType}.png`);

    fs.rename(file.path, filePath, (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to save file" });
      }
      res.status(200).json({ message: "File uploaded successfully" });
    });
  });
};
