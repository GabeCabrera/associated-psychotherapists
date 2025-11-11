/**
 * Component Demo Page
 * 
 * Temporary page to demonstrate Phase 1.3 components
 * Remove or move to /examples after testing
 */

'use client'

import { useState } from 'react'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Modal,
  ModalBody,
  ModalFooter,
  useModal,
  Spinner,
  CardSkeleton,
  ListSkeleton,
  FormSkeleton,
} from '@/components/ui'

export default function ComponentDemoPage() {
  const { isOpen, open, close } = useModal()
  const [showLoading, setShowLoading] = useState(false)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-[#1A365D] mb-8">
        Phase 1.3 Components Demo
      </h1>

      {/* Navbar Demo - Always visible at top */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[#1A365D] mb-4">
          Navbar
        </h2>
        <Card>
          <CardContent className="p-6">
            <p className="text-[#2D3748]">
              ✅ Navbar is visible at the top of the page with:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-[#6B8EAE]">
              <li>Logo and brand name</li>
              <li>Navigation links (role-based)</li>
              <li>User menu (when logged in)</li>
              <li>Mobile responsive hamburger menu</li>
              <li>Sticky behavior with shrink animation on scroll</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Sidebar Demo */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[#1A365D] mb-4">
          Sidebar
        </h2>
        <Card>
          <CardContent className="p-6">
            <p className="text-[#2D3748] mb-4">
              ✅ Sidebar component created with:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[#6B8EAE] mb-4">
              <li>Role-based navigation (therapist/client/admin)</li>
              <li>Collapsible on desktop</li>
              <li>Mobile slide-out menu with floating button</li>
              <li>Active route highlighting</li>
            </ul>
            <p className="text-sm text-[#6B8EAE] italic">
              Note: Sidebar is used in dashboard layouts. Navigate to /therapist, /client, or /admin to see it.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Modal Demo */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[#1A365D] mb-4">
          Modal
        </h2>
        <Card>
          <CardHeader>
            <CardTitle>Modal with Focus Trap</CardTitle>
            <CardDescription>
              Accessible modal with keyboard navigation and focus management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={open} variant="primary">
              Open Modal
            </Button>
          </CardContent>
        </Card>

        <Modal
          isOpen={isOpen}
          onClose={close}
          title="Demo Modal"
          description="This modal demonstrates focus trapping and accessibility features"
          size="md"
        >
          <ModalBody>
            <p className="text-[#2D3748] mb-4">
              Try the following:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#6B8EAE]">
              <li>Press <kbd className="px-2 py-1 bg-[#E6EEF5] rounded text-xs">Tab</kbd> to cycle through focusable elements</li>
              <li>Press <kbd className="px-2 py-1 bg-[#E6EEF5] rounded text-xs">Shift + Tab</kbd> to go backwards</li>
              <li>Press <kbd className="px-2 py-1 bg-[#E6EEF5] rounded text-xs">Escape</kbd> to close</li>
              <li>Click the backdrop to close</li>
            </ul>

            <div className="mt-6 space-y-3">
              <Button variant="primary" fullWidth>
                Primary Action
              </Button>
              <Button variant="outline" fullWidth>
                Secondary Action
              </Button>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={close}>
              Cancel
            </Button>
            <Button variant="primary" onClick={close}>
              Confirm
            </Button>
          </ModalFooter>
        </Modal>
      </section>

      {/* Loading States Demo */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[#1A365D] mb-4">
          Loading States & Skeletons
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Spinner */}
          <Card>
            <CardHeader>
              <CardTitle>Spinner</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Spinner size="sm" />
                <Spinner size="md" />
                <Spinner size="lg" />
                <Spinner size="xl" />
              </div>
              <Button
                className="mt-4"
                variant="primary"
                onClick={() => {
                  setShowLoading(true)
                  setTimeout(() => setShowLoading(false), 2000)
                }}
                isLoading={showLoading}
              >
                {showLoading ? 'Loading...' : 'Test Loading Button'}
              </Button>
            </CardContent>
          </Card>

          {/* Card Skeleton */}
          <Card>
            <CardHeader>
              <CardTitle>Card Skeleton</CardTitle>
            </CardHeader>
            <CardContent>
              <CardSkeleton hasAvatar lines={3} />
            </CardContent>
          </Card>

          {/* List Skeleton */}
          <Card>
            <CardHeader>
              <CardTitle>List Skeleton</CardTitle>
            </CardHeader>
            <CardContent>
              <ListSkeleton items={3} />
            </CardContent>
          </Card>

          {/* Form Skeleton */}
          <Card>
            <CardHeader>
              <CardTitle>Form Skeleton</CardTitle>
            </CardHeader>
            <CardContent>
              <FormSkeleton fields={3} />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer Demo */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[#1A365D] mb-4">
          Footer
        </h2>
        <Card>
          <CardContent className="p-6">
            <p className="text-[#2D3748]">
              ✅ Footer is visible at the bottom of the page with:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-[#6B8EAE]">
              <li>Multi-column navigation links</li>
              <li>Contact information</li>
              <li>Social media links</li>
              <li>Copyright notice</li>
              <li>Disclaimer section</li>
              <li>Responsive design</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Scroll Test */}
      <section className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Scroll Test</CardTitle>
            <CardDescription>
              Scroll down to see navbar shrink animation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[600px] bg-gradient-to-b from-[#E6EEF5] to-[#F7FAFC] rounded-lg flex items-center justify-center">
              <p className="text-[#6B8EAE] text-lg">
                ⬇️ Keep scrolling to test navbar behavior
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Summary */}
      <section className="mb-12">
        <Card className="border-2 border-[#1A365D]">
          <CardHeader>
            <CardTitle className="text-2xl">Phase 1.3 Complete ✅</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-[#1A365D] mb-2">Components Built:</h3>
                <ul className="list-disc list-inside space-y-1 text-[#6B8EAE]">
                  <li>Navbar - Responsive with sticky behavior</li>
                  <li>Sidebar - Role-based dashboard navigation</li>
                  <li>Modal - Accessible with focus trap</li>
                  <li>Loading States - Spinner and skeleton loaders</li>
                  <li>Footer - Comprehensive site footer</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-[#1A365D] mb-2">Standards Met:</h3>
                <ul className="list-disc list-inside space-y-1 text-[#6B8EAE]">
                  <li>Constitution.md color palette (#1A365D, #6B8EAE, #E6EEF5)</li>
                  <li>Framer Motion animations (200-300ms ease-in-out)</li>
                  <li>Lucide icons throughout</li>
                  <li>WCAG 2.1 AA accessibility compliance</li>
                  <li>Keyboard navigation support</li>
                  <li>Mobile responsive design</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-[#6B8EAE]/20">
                <p className="text-sm text-[#6B8EAE]">
                  All components are exported from <code className="bg-[#E6EEF5] px-2 py-1 rounded">@/components/ui</code> and ready for use throughout the application.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-[#E6EEF5]">
            <div className="w-full text-center">
              <p className="text-sm font-medium text-[#1A365D]">
                Ready to proceed to Phase 2: User Profiles 🎯
              </p>
            </div>
          </CardFooter>
        </Card>
      </section>
    </div>
  )
}
