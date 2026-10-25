"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, CheckCircle2, XCircle, Terminal, Clock, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { runAutomationScript, getAutomationHistory } from "../app/actions/automation"
import { fetchScripts as fetchScriptsFromDb } from "../app/actions/automation"
import { ObjectId } from "mongodb"

export type AutomationScript = {
  id: string
  name: string
  description: string
  path: string
}

export type AutomationResult = {
  _id?: string | ObjectId
  controlId: string
  scriptId: string
  scriptName: string
  status: "success" | "failure" | "error"
  compliant: boolean
  report: string
  runAt: Date
}

interface ControlAutomationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  controlId: string
  controlName: string
}

export function ControlAutomationModal({ open, onOpenChange, controlId, controlName }: ControlAutomationModalProps) {
  const [scripts, setScripts] = useState<AutomationScript[]>([])
  const [history, setHistory] = useState<AutomationResult[]>([])
  const [loading, setLoading] = useState(false)
  const [runningScriptId, setRunningScriptId] = useState<string | null>(null)
  const [currentResult, setCurrentResult] = useState<AutomationResult | null>(null)
  const { toast } = useToast()

  // Fetch scripts and history when modal opens
  useEffect(() => {
    if (open && controlId) {
      fetchScripts()
      fetchHistory()
    }
  }, [open, controlId])

  const fetchScripts = async () => {
    try {
      const result = await fetchScriptsFromDb(controlId)
      if (result.success && result.scripts) {
        setScripts(result.scripts)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch scripts",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching scripts:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching scripts",
        variant: "destructive",
      })
    }
  }

  const fetchHistory = async () => {
    try {
      const result = await getAutomationHistory(controlId)
      if (result.success && result.history) {
        // Transform each history item: ensure _id is a plain string and runAt is a Date.
        const formattedHistory = result.history.map((item) => ({
          ...item,
          _id: item._id ? item._id.toString() : undefined,
          runAt: new Date(item.runAt),
        }))
        setHistory(formattedHistory)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch automation history",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching automation history:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching history",
        variant: "destructive",
      })
    }
  }

  const runScript = async (scriptId: string) => {
    setRunningScriptId(scriptId)
    setLoading(true)
    setCurrentResult(null)

    try {
      const script = scripts.find((s) => s.id === scriptId)
      if (!script) throw new Error("Script not found")

      const result = await runAutomationScript(controlId, scriptId, script.name)

      if (result.success && result.result) {
        // Option 1: Manually construct the AutomationResult object.
        const automationResult: AutomationResult = {
          _id: result.result._id, // already converted to string on the server
          controlId: result.result.controlId,
          scriptId: result.result.scriptId,
          scriptName: result.result.scriptName,
          status: result.result.status,
          compliant: result.result.compliant,
          report: result.result.report,
          runAt: new Date(result.result.runAt), // convert ISO string back to Date
        }
        setCurrentResult(automationResult)
        toast({
          title: "Automation complete",
          description: automationResult.compliant ? "Control is compliant" : "Control is non-compliant",
          variant: automationResult.compliant ? "default" : "destructive",
        })

        // Refresh history after running a script
        fetchHistory()
      } else {
        toast({
          title: "Automation failed",
          description: result.error || "Failed to run automation script",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error running automation script:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while running the script",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setRunningScriptId(null)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col ">
        <DialogHeader>
          <DialogTitle className="text-xl">Automation for {controlName}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="scripts" className="flex-1 overflow-hidden flex flex-col">
          <TabsList>
            <TabsTrigger value="scripts">
              <Terminal className="h-4 w-4 mr-2" />
              Scripts
            </TabsTrigger>
            <TabsTrigger value="history">
              <Clock className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scripts" className="flex-1 flex flex-col overflow-y-auto">
            <div className="flex-1 max-h-[60vh] overflow-y-auto">
              <ScrollArea className="h-full p-2 w-full rounded-md border p-4">
                <div className="space-y-4 p-2">
                  {scripts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                      <Terminal className="h-12 w-12 mb-4" />
                      <p>No automation scripts available for this control</p>
                    </div>
                  ) : (
                    <>
                      {scripts.map((script) => (
                        <Card key={script.id}>
                          <CardHeader>
                            <CardTitle>{script.name}</CardTitle>
                            <CardDescription>{script.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">Script path: {script.path}</p>
                          </CardContent>
                          <CardFooter>
                            <Button
                              onClick={() => runScript(script.id)}
                              disabled={loading}
                              className="bg-acasa-blue hover:bg-acasa-darkBlue"
                            >
                              {loading && runningScriptId === script.id ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Running...
                                </>
                              ) : (
                                "Run Automation"
                              )}
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                      {currentResult && (
                        <div className="mt-6 space-y-4">
                          <h3 className="text-lg font-medium">Latest Result</h3>
                          <Alert variant={currentResult.compliant ? "default" : "destructive"}>
                            <div className="flex items-center">
                              {currentResult.compliant ? (
                                <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                              ) : (
                                <XCircle className="h-5 w-5 mr-2 text-red-500" />
                              )}
                              <AlertTitle>{currentResult.compliant ? "Compliant" : "Non-Compliant"}</AlertTitle>
                            </div>
                            <AlertDescription className="mt-2">
                              Script: {currentResult.scriptName}
                              <br />
                              Run at: {formatDate(currentResult.runAt)}
                            </AlertDescription>
                          </Alert>
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">Detailed Report</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                                <pre className="text-sm whitespace-pre-wrap font-mono">{currentResult.report}</pre>
                              </ScrollArea>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="history" className="flex-1 flex flex-col overflow-y-auto">
            <div className="flex-1 max-h-[60vh] overflow-y-auto">
              <ScrollArea className="h-full p-2 w-full rounded-md border p-4">
                <div className="space-y-4 p-2">
                  {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                      <FileText className="h-12 w-12 mb-4" />
                      <p>No automation history available for this control</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {history.map((result, index) => (
                        <Card key={result._id ? result._id.toString() : index.toString()}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-base">{result.scriptName}</CardTitle>
                              <Badge
                                className={
                                  result.compliant
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                }
                              >
                                {result.compliant ? "Compliant" : "Non-Compliant"}
                              </Badge>
                            </div>
                            <CardDescription>Run at: {formatDate(result.runAt)}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <ScrollArea className="h-[150px] w-full rounded-md border p-4">
                              <pre className="text-sm whitespace-pre-wrap font-mono">{result.report}</pre>
                            </ScrollArea>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
