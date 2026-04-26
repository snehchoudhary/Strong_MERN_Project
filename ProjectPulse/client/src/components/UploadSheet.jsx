import { useState } from "react";
import * as XLSX from "xlsx";
import api from "../services/api";
import { useParams } from "react-router-dom";

function UploadSheet() {

  const { id } = useParams(); // projectId

  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle file selection + preview

  const handleFileUpload = (e) => {

    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setFileName(selectedFile.name);

    const reader = new FileReader();

    reader.onload = (evt) => {

      const binaryStr = evt.target.result;

      const workbook =
        XLSX.read(binaryStr, {
          type: "binary"
        });

      const sheetName =
        workbook.SheetNames[0];

      const worksheet =
        workbook.Sheets[sheetName];

      const jsonData =
        XLSX.utils.sheet_to_json(
          worksheet,
          { header: 1 }
        );

      setData(jsonData);
    };

    reader.readAsBinaryString(selectedFile);
  };

  // Send file to backend

  const handleUploadToServer = async () => {

    if (!file) {

      setMessage("Please select file first");
      return;

    }

    try {

      setUploading(true);

      const formData = new FormData();

      formData.append(
        "file",
        file
      );

      const res = await api.post(

        `/projects/${id}/upload`,

        formData,

        {
          headers: {
            "Content-Type":
              "multipart/form-data"
          }
        }

      );

      setMessage(
        res.data.message ||
        "Upload successful"
      );

    }

    catch (error) {

      console.error(error);

      setMessage(
        "Upload failed"
      );

    }

    finally {

      setUploading(false);

    }

  };

  //add downlaod function
  const handleDownload = async () => {

  try {

    const res = await api.get(

      `/projects/${id}/download`,

      {
        responseType: "blob"
      }

    );

    // Create file URL

    const url =
      window.URL.createObjectURL(
        new Blob([res.data])
      );

    const link =
      document.createElement("a");

    link.href = url;

    link.setAttribute(
      "download",
      "project_file.xlsx"
    );

    document.body.appendChild(link);

    link.click();

  }

  catch (error) {

    console.error(error);

    alert("Download failed");

  }

};

// parse button function
const handleParseExcel = async () => {

  try {

    const res = await api.post(

      `/projects/${id}/parse`

    );

    alert(
      res.data.message +
      " (" +
      res.data.count +
      " tasks created)"
    );

  }

  catch (error) {

    console.error(error);

    alert("Parsing failed");

  }

};

  return (

    <div className="p-6">

      <h2 className="text-2xl font-bold mb-4">

        Upload Excel Sheet

      </h2>

      {/* File Input */}

      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        className="mb-4"
      />

      {fileName && (

        <p className="mb-4 text-gray-600">

          File: {fileName}

        </p>

      )}

      {/* Upload Button */}

      {file && (

        <button
          onClick={handleUploadToServer}
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
        >

          {uploading
            ? "Uploading..."
            : "Upload to Server"}

        </button>

      )}

      {/* {Download Button} */}

      <button
  onClick={handleDownload}
  className="bg-green-600 text-white px-4 py-2 rounded ml-2"
>

  Download File

</button>

      {/* Message */}

      {message && (

        <p className="mb-4 text-green-600">

          {message}

        </p>

      )}

      {/* Parse button UI */}
      <button
  onClick={handleParseExcel}
  className="bg-purple-600 text-white px-4 py-2 rounded ml-2"
>

  Generate Tasks from Excel

</button>

      {/* Preview Table */}

      {data.length > 0 && (

        <div className="overflow-x-auto border">

          <table className="min-w-full border-collapse border">

            <tbody>

              {data.map((row, rowIndex) => (

                <tr key={rowIndex}>

                  {row.map(
                    (cell, colIndex) => (

                      <td
                        key={colIndex}
                        className="border px-3 py-2 text-sm"
                      >

                        {cell}

                      </td>

                    )
                  )}

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );
}

export default UploadSheet;