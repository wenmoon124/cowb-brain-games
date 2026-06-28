'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Download, Trash2, AlertTriangle } from 'lucide-react'

export function DataSection() {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [isClearGamesDialogOpen, setIsClearGamesDialogOpen] = useState(false)
  const [isClearAllDialogOpen, setIsClearAllDialogOpen] = useState(false)
  const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] = useState(false)

  const handleExportData = () => {
    // TODO: Implement API call to export user data
    setIsExportDialogOpen(false)
  }

  const handleClearGames = () => {
    // TODO: Implement API call to clear game records
    setIsClearGamesDialogOpen(false)
  }

  const handleClearAll = () => {
    // TODO: Implement API call to clear all data
    setIsClearAllDialogOpen(false)
  }

  const handleDeleteAccount = () => {
    // TODO: Implement API call to delete account
    setIsDeleteAccountDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Export Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Your Data
          </CardTitle>
          <CardDescription>
            Download a copy of all your data in JSON format
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Export Data</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Your Data</DialogTitle>
                <DialogDescription>
                  This will download a JSON file containing all your profile information,
                  game records, and achievements. This process may take a few moments.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleExportData}>Export</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Clear Game Records */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Clear Game Records
          </CardTitle>
          <CardDescription>
            Remove all your game play history and scores. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={isClearGamesDialogOpen} onOpenChange={setIsClearGamesDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="text-warning">
                Clear Game Records
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Clear Game Records</DialogTitle>
                <DialogDescription>
                  Are you sure you want to clear all your game records? This will remove
                  all your play history, scores, and statistics. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsClearGamesDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleClearGames}>
                  Clear Records
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Clear All Data */}
      <Card className="border-warning">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-warning">
            <AlertTriangle className="w-5 h-5" />
            Clear All Data
          </CardTitle>
          <CardDescription>
            Remove all your data including profile, game records, and achievements.
            This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={isClearAllDialogOpen} onOpenChange={setIsClearAllDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="text-warning border-warning hover:bg-warning hover:text-white">
                Clear All Data
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-warning">
                  <AlertTriangle className="w-5 h-5" />
                  Clear All Data
                </DialogTitle>
                <DialogDescription>
                  This will permanently delete all your data including:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Profile information</li>
                    <li>Game records and scores</li>
                    <li>Achievements and badges</li>
                    <li>All other account data</li>
                  </ul>
                  <p className="mt-2 font-semibold">This action cannot be undone.</p>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsClearAllDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleClearAll}>
                  Clear All Data
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Delete Account */}
      <Card className="border-error">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-error">
            <AlertTriangle className="w-5 h-5" />
            Delete Account
          </CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={isDeleteAccountDialogOpen} onOpenChange={setIsDeleteAccountDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                Delete Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-error">
                  <AlertTriangle className="w-5 h-5" />
                  Delete Account
                </DialogTitle>
                <DialogDescription>
                  Are you absolutely sure you want to delete your account? This will:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Permanently delete your account</li>
                    <li>Remove all your data</li>
                    <li>Cancel any active subscriptions</li>
                    <li>Remove access to all services</li>
                  </ul>
                  <p className="mt-2 font-semibold">This action is permanent and cannot be undone.</p>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteAccountDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  Delete Account Permanently
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}
