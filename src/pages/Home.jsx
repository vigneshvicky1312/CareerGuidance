import Hero from '../components/Hero'
import AboutEvent from '../components/AboutEvent'
import ProgramHighlights from '../components/ProgramHighlights'
import ChiefGuest from '../components/ChiefGuest'
import EventDetails from '../components/EventDetails'
import EventStats from '../components/EventStats'
import Sponsors from '../components/Sponsors'
import Contact from '../components/Contact'

export default function Home() {
  return (
    <>
      <Hero />
      <AboutEvent />
      <ProgramHighlights />
      <ChiefGuest />
      <Sponsors compact />
      <EventDetails />
      <EventStats />
      <Contact />
    </>
  )
}
