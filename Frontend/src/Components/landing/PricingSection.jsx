import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for personal use and trying things out.',
    features: ['50 short links/month', 'Basic click analytics', '7-day data retention', 'Standard redirects'],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/month',
    description: 'For creators and small teams who need more power.',
    features: ['Unlimited short links', 'Advanced analytics', '1-year data retention', 'Custom aliases', 'QR code generation', 'Priority support'],
    cta: 'Get Started',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$49',
    period: '/month',
    description: 'For organizations with serious link management needs.',
    features: ['Everything in Pro', 'Team collaboration', 'API access', 'Custom domains', 'SSO & SAML', 'Dedicated support'],
    cta: 'Contact Sales',
    popular: false,
  },
]

const PricingSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="pricing" className="relative py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary-400 text-xs font-semibold tracking-widest uppercase mb-3 block">Pricing</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white font-[family-name:var(--font-display)] mb-4">
            Simple, transparent <span className="gradient-text">pricing</span>
          </h2>
          <p className="text-surface-400 max-w-xl mx-auto text-lg">No hidden fees. Upgrade or downgrade anytime.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className={`relative glass-card p-8 transition-all duration-500 hover:-translate-y-1 ${
                plan.popular ? 'border-primary-500/30 shadow-xl shadow-primary-500/10' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary-600 to-primary-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg shadow-primary-500/25">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-white text-lg font-semibold font-[family-name:var(--font-display)] mb-1">{plan.name}</h3>
                <p className="text-surface-500 text-sm">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-white font-[family-name:var(--font-display)]">{plan.price}</span>
                <span className="text-surface-500 text-sm ml-1">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8 list-none p-0 m-0">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-surface-300">
                    <Check size={16} className="text-accent-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer border-none ${
                  plan.popular
                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5'
                    : 'bg-surface-800/50 text-surface-300 border border-surface-700 hover:border-primary-500/30 hover:text-white hover:bg-primary-500/10'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PricingSection
