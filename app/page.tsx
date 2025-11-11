import Link from 'next/link'
import { Button } from '@/components/ui'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E6EEF5]">
      <div className="text-center space-y-8 p-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-semibold text-[#1A365D]">
            Associated Psych
          </h1>
          <p className="text-xl text-[#6B8EAE]">
            Your journey to mental wellness starts here
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/login">
            <Button variant="primary" size="lg">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="secondary" size="lg">
              Create Account
            </Button>
          </Link>
        </div>

        <div className="text-sm text-[#2D3748]/60 space-y-1">
          <div>Phase 1.1: Auth Infrastructure ✓</div>
          <div>Phase 1.2: Auth UI Components ✓</div>
        </div>
      </div>
    </div>
  );
}
