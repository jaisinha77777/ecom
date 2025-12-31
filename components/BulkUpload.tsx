"use client"

import { useState } from "react"
import Papa from "papaparse"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { uploadBulkProducts } from "@/actions/uploadProduct"

export function BulkUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleUpload = async () => {
    if (!file) return alert("Upload a CSV file first")

    setLoading(true)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async function (results) {
        try {
          const res = await uploadBulkProducts(results.data as any[])
          setResult(res?.message ?? "Done")
        } catch (e) {
          console.error(e)
          setResult("Failed to upload")
        } finally {
          setLoading(false)
        }
      },
    })
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Bulk Upload Products</h1>

      <Input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />

      <Button disabled={!file || loading} onClick={handleUpload}>
        {loading ? "Uploading..." : "Upload CSV"}
      </Button>

      {result && <p>{result}</p>}
    </div>
  )
}
