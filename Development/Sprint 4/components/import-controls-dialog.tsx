"use client"

import { useState, useEffect } from "react"
import { fetchUserProfile } from "@/app/actions/user"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Upload, FileText } from "lucide-react"
import { useDropzone } from "react-dropzone"
import Papa from "papaparse"
// Import the server actions
import { importControls } from "@/app/actions/import"
import { importScript } from "@/app/actions/import-scripts"
import { fetchControls } from "@/app/actions/controls"
import { useToast } from "@/hooks/use-toast"

interface ImportControlsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (data: any[], warning?: string) => void
}

interface Control {
  id: string
  name: string
  framework?: string
  category: string
}

export function ImportControlsDialog({ open, onOpenChange, onImport }: ImportControlsDialogProps) {
  // State for tabs
  const [activeTab, setActiveTab] = useState("controls")

  // State for controls tab
  const [controlFile, setControlFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<any[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // State for scripts tab
  const [scriptFile, setScriptFile] = useState<File | null>(null)
  const [selectedControlId, setSelectedControlId] = useState<string>("")
  const [scriptName, setScriptName] = useState<string>("")
  const [scriptDescription, setScriptDescription] = useState<string>("")
  const [scriptLanguage, setScriptLanguage] = useState<string>("")
  const [controls, setControls] = useState<Control[]>([])
  const [loadingControls, setLoadingControls] = useState(false)

  const { toast } = useToast()

  // Fetch controls when dialog opens
  useEffect(() => {
    if (open && activeTab === "scripts") {
      fetchControlsForDropdown()
    }
  }, [open, activeTab])

  const fetchControlsForDropdown = async () => {
    setLoadingControls(true)
    try {
      const result = await fetchControls()
      if (result.success) {
        setControls(result.data ?? [])
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch controls",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching controls:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching controls",
        variant: "destructive",
      })
    } finally {
      setLoadingControls(false)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // Reset error message when switching tabs
    setErrorMessage(null)
  }

  // Dropzone for controls
  const controlsDropzone = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      setControlFile(file)

      // Optionally, use PapaParse for a preview of the parsed CSV.
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            setErrorMessage(results.errors[0].message)
            setParsedData([])
          } else {
            setParsedData(results.data)
            setErrorMessage(null)
          }
        },
        error: (error) => {
          setErrorMessage(error.message)
          setParsedData([])
        },
      })
    },
    accept: {
      "text/csv": [".csv"],
    },
    multiple: false,
  })

  // Dropzone for scripts
  const scriptsDropzone = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      setScriptFile(file)

      // Auto-set the script name if not already set
      if (!scriptName) {
        setScriptName(file.name.split(".")[0])
      }

      // Auto-detect language based on file extension
      const extension = file.name.split(".").pop()?.toLowerCase()
      switch (extension) {
        case "py":
          setScriptLanguage("python")
          break
        case "js":
          setScriptLanguage("javascript")
          break
        case "sh":
          setScriptLanguage("bash")
          break
        case "ps1":
          setScriptLanguage("powershell")
          break
        default:
          setScriptLanguage("")
      }
    },
    accept: {
      "text/plain": [".py", ".js", ".sh", ".ps1", ".txt"],
    },
    multiple: false,
  })

  const handleImportControls = async () => {
    if (!controlFile) return

    // Read the full CSV file as text.
    const csvContent = await controlFile.text()

    // Fetch user details (placeholder values can be replaced with real data)
    const userDetails = await fetchUserProfile()
    const userId = userDetails.data?._id.toString() || ""
    const userName = userDetails.data?.name || ""

    // Call the server action.
    const result = await importControls(csvContent, userId, userName)
    if (result.success) {
      onImport(result.data ?? [], result.warning)
      if (result.warning) {
        toast({
          title: "Import Warning",
          description: result.warning,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Import Successful",
          description: "Controls imported successfully.",
        })
      }
    } else {
      console.error("Import failed:", result.error)
      toast({
        title: "Import Failed",
        description: result.error || "Failed to import controls",
        variant: "destructive",
      })
    }
    onOpenChange(false)
  }

  const handleImportScript = async () => {
    if (!scriptFile || !selectedControlId) {
      setErrorMessage("Please select a control and upload a script file")
      return
    }

    try {
      const formData = new FormData()
      formData.append("file", scriptFile)
      formData.append("controlId", selectedControlId)
      formData.append("language", scriptLanguage)
      formData.append("name", scriptName)
      formData.append("description", scriptDescription)

      const result = await importScript(formData)

      if (result.success) {
        toast({
          title: "Script Imported",
          description: result.message || "Script imported successfully",
        })
        onOpenChange(false)
      } else {
        setErrorMessage(result.error || "Failed to import script")
        toast({
          title: "Import Failed",
          description: result.error || "Failed to import script",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error importing script:", error)
      setErrorMessage("An unexpected error occurred")
      toast({
        title: "Import Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleImport = () => {
    if (activeTab === "controls") {
      handleImportControls()
    } else {
      handleImportScript()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Import</DialogTitle>
          <DialogDescription>Import controls from a CSV file or upload automation scripts.</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="controls">Controls</TabsTrigger>
            <TabsTrigger value="scripts">Scripts</TabsTrigger>
          </TabsList>

          {/* Controls Tab */}
          <TabsContent value="controls" className="space-y-4 py-4">
            <div
              {...controlsDropzone.getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                controlsDropzone.isDragActive
                  ? "border-acasa-blue bg-acasa-blue/10"
                  : "border-gray-300 hover:border-acasa-blue hover:bg-acasa-blue/5"
              }`}
            >
              <input {...controlsDropzone.getInputProps()} />
              <FileText className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-center text-muted-foreground">
                Drag and drop a CSV file here, or click to select a file
              </p>
              <p className="text-xs text-muted-foreground mt-1">CSV files only</p>
              <a
                href="/api/controls/template"
                className="text-xs text-acasa-blue hover:underline mt-2"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                Download template
              </a>
            </div>

            {controlFile && (
              <div className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-acasa-blue" />
                  <span className="text-sm font-medium">{controlFile.name}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setControlFile(null)} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {errorMessage && <div className="text-sm text-red-500 mt-2">Error: {errorMessage}</div>}

            {parsedData.length > 0 && (
              <div className="text-sm text-muted-foreground mt-2">Parsed {parsedData.length} rows.</div>
            )}
          </TabsContent>

          {/* Scripts Tab */}
          <TabsContent value="scripts" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="control-select">Select Control</Label>
                <Select value={selectedControlId} onValueChange={setSelectedControlId} disabled={loadingControls}>
                  <SelectTrigger id="control-select">
                    <SelectValue placeholder="Select a control" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingControls ? (
                      <SelectItem value="loading">Loading controls...</SelectItem>
                    ) : (
                      controls.map((control) => (
                        <SelectItem key={control.id} value={control.id}>
                          {control.id} {control.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div
                {...scriptsDropzone.getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  scriptsDropzone.isDragActive
                    ? "border-acasa-blue bg-acasa-blue/10"
                    : "border-gray-300 hover:border-acasa-blue hover:bg-acasa-blue/5"
                }`}
              >
                <input {...scriptsDropzone.getInputProps()} />
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-center text-muted-foreground">
                  Drag and drop a script file here, or click to select a file
                </p>
                <p className="text-xs text-muted-foreground mt-1">Supported file types: .py, .js, .sh, .ps1, .txt</p>
              </div>

              {scriptFile && (
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-acasa-blue" />
                    <span className="text-sm font-medium">{scriptFile.name}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setScriptFile(null)} className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="script-name">Script Name</Label>
                <Input
                  id="script-name"
                  value={scriptName}
                  onChange={(e) => setScriptName(e.target.value)}
                  placeholder="Enter script name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="script-description">Description</Label>
                <Textarea
                  id="script-description"
                  value={scriptDescription}
                  onChange={(e) => setScriptDescription(e.target.value)}
                  placeholder="Enter script description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="script-language">Language</Label>
                <Select value={scriptLanguage} onValueChange={setScriptLanguage}>
                  <SelectTrigger id="script-language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="bash">Bash</SelectItem>
                    <SelectItem value="powershell">PowerShell</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {errorMessage && <div className="text-sm text-red-500 mt-2">Error: {errorMessage}</div>}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={
              (activeTab === "controls" && (!controlFile || parsedData.length === 0)) ||
              (activeTab === "scripts" && (!scriptFile || !selectedControlId))
            }
            className="bg-acasa-blue hover:bg-acasa-darkBlue"
          >
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

