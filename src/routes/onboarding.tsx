import { useState } from 'react'
import { Navigate, createFileRoute, useNavigate } from '@tanstack/react-router'
import { PiggyBank, ShoppingBasket, Sparkles } from 'lucide-react'

import { Logo } from '../components/logo'
import { useAuth } from '../lib/auth'
import { markOnboardingSeen } from '../lib/onboarding'

export const Route = createFileRoute('/onboarding')({ component: OnboardingScreen })

const slides = [
  {
    icon: Sparkles,
    title: 'This week, sorted.',
    body: 'Skarrel gathers this week\'s specials from five stores across Westville, Pinetown and the Upper Highway — branch by branch.',
  },
  {
    icon: ShoppingBasket,
    title: 'One basket, every store checked.',
    body: 'Add what you usually buy and Skarrel tells you which store wins for your whole basket — or mix and match across a couple of stores.',
  },
  {
    icon: PiggyBank,
    title: 'Watch it stack up.',
    body: 'Every saving you lock in adds to your running total. Skarrel smart, save more.',
  },
]

function OnboardingScreen() {
  const { session, loading } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)

  if (!loading && !session) return <Navigate to="/login" />

  const isLast = step === slides.length - 1
  const slide = slides[step]
  const Icon = slide.icon

  function finish() {
    markOnboardingSeen()
    navigate({ to: '/' })
  }

  return (
    <div className="flex flex-1 flex-col bg-brand px-6 pt-16 pb-10 text-center">
      <Logo className="text-2xl" />

      <div className="flex flex-1 flex-col items-center justify-center gap-5">
        <div className="flex size-20 items-center justify-center rounded-full bg-white/15">
          <Icon size={36} className="text-coral" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-white">{slide.title}</h1>
          <p className="mx-auto mt-2 max-w-[280px] text-sm leading-relaxed text-white/80">
            {slide.body}
          </p>
        </div>
      </div>

      <div className="mb-6 flex justify-center gap-1.5">
        {slides.map((_, i) => (
          <span
            key={i}
            className={
              i === step
                ? 'h-1.5 w-6 rounded-full bg-coral'
                : 'h-1.5 w-1.5 rounded-full bg-white/30'
            }
          />
        ))}
      </div>

      <div className="flex gap-3">
        {!isLast && (
          <button
            onClick={finish}
            className="flex-1 rounded-2xl py-3 text-sm font-bold text-white/70"
          >
            Skip
          </button>
        )}
        <button
          onClick={() => (isLast ? finish() : setStep((s) => s + 1))}
          className="flex-1 rounded-2xl bg-coral py-3 text-sm font-bold text-white"
        >
          {isLast ? "Let's skarrel" : 'Next'}
        </button>
      </div>
    </div>
  )
}
