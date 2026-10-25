"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Edit, Plus } from "lucide-react"
import { useEffect } from "react"
import { fetchUserProfile } from "@/app/actions/user"
import { fetchPoliciesByUser } from "@/app/actions/policies"

// Sample data for policy documents
// const policiesData = [
//   {
//     id: 1,
//     name: "ISMS Scope Policy",
//     status: "Draft",
//     lastUpdated: "2023-12-15",
//     createdBy: "John Doe",
//   },
//   {
//     id: 2,
//     name: "Privileged Access Management Policy",
//     status: "Published",
//     lastUpdated: "2023-11-20",
//     createdBy: "Jane Smith",
//   },
//   {
//     id: 3,
//     name: "Malware Detection Policy",
//     status: "Review",
//     lastUpdated: "2024-01-05",
//     createdBy: "John Doe",
//   },
// ]

export function PoliciesTable() {
  const [policies, setPolicies] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const result = await fetchUserProfile()
        if (result.success) {
          setUser(result.data)
          console.log(result.data)
          try {
            const result2 = await fetchPoliciesByUser(result.data._id)
            if (result2.success) {
              console.log(result2.data)
              setPolicies(result2.data)
            } else {
              console.error(result2.error)
            }
          } catch (err) {
            console.error("Failed to load policies:", err)
          }

        } else {
          console.error(result.error)
        }
      } catch (err) {
        console.error("Failed to load user profile:", err)
      }
    }

    loadUser()
  }, [])






  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input placeholder="Search policies..." className="max-w-sm" />
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-acasa-blue hover:bg-acasa-darkBlue">
              <Plus className="h-4 w-4 mr-2" />
              New Policy
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle>Create New Policy</DialogTitle>
              <DialogDescription>Select a policy template to get started</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col">
              <Button
                asChild
                variant="ghost"
                className="justify-start rounded-none h-auto p-6 hover:bg-acasa-blue/5 border-t"
              >
                <Link href="/dashboard/policies/create/isms-scope">
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium text-base">ISMS Scope Policy</span>
                    <span className="text-sm text-muted-foreground mt-1">
                      Define the scope of your Information Security Management System
                    </span>
                  </div>
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="justify-start rounded-none h-auto p-6 hover:bg-acasa-blue/5 border-t"
              >
                <Link href="/dashboard/policies/create/privileged-access">
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium text-base">Privileged Access Management Policy</span>
                    <span className="text-sm text-muted-foreground mt-1">
                      Define how privileged access is managed in your organization
                    </span>
                  </div>
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="justify-start rounded-none h-auto p-6 hover:bg-acasa-blue/5 border-t"
              >
                <Link href="/dashboard/policies/create/malware-detection">
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium text-base">Malware Detection Policy</span>
                    <span className="text-sm text-muted-foreground mt-1">
                      Define how malware is detected and managed in your organization
                    </span>
                  </div>
                </Link>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {/* <TableHead className="w-[80px]">ID</TableHead> */}
              <TableHead>Policy Name</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[150px]">Last Updated</TableHead>
              <TableHead className="w-[150px]">Created By</TableHead>
              <TableHead className="w-[150px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {policies.map((policy) => (
              <TableRow key={policy._id}>
                {/* <TableCell className="font-medium">{policy.id}</TableCell> */}
                <TableCell>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    {policy.name}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      policy.status === "Published"
                        ? "badge-success"
                        : policy.status === "Draft"
                          ? "badge-neutral"
                          : policy.status === "Review"
                            ? "badge-warning"
                            : ""
                    }
                  >
                    {policy.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(policy.lastUpdated).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={
                        policy.name === "ISMS Policy"
                          ? "/dashboard/policies/create/isms-scope"
                          : policy.name === "Priviledged Access Policy"
                            ? "/dashboard/policies/create/privileged-access"
                            : policy.name === "Malware Detection Policy"
                              ? "/dashboard/policies/create/malware-detection"
                              : "/dashboard/policies"
                      }>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    {/* <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button> */}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

