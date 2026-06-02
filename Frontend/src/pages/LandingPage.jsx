import { useTheme } from '../context/ThemeContext'
import Navbar from '../Components/Navbar'
import HeroSection from '../Components/landing/HeroSection'
import FeaturesSection from '../Components/landing/FeaturesSection'
import HowItWorks from '../Components/landing/HowItWorks'
import CTASection from '../Components/landing/CTASection'
import Footer from '../Components/Footer'

const LandingPage = () => {
  const { isDark } = useTheme()

  return (
    <div className={`min-h-screen ${isDark ? 'bg-surface-950' : 'bg-white'}`}>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage
