import Hero from '../components/Hero'
import EventStats from '../components/EventStats'
import AboutEvent from '../components/AboutEvent'
import ProgramHighlights from '../components/ProgramHighlights'
import ChiefGuest from '../components/ChiefGuest'
import Sponsors from '../components/Sponsors'
import EventSchedule from '../components/EventSchedule'
import Contact from '../components/Contact'

export default function Home() {
  return (
    <>
      <Hero />
      <EventStats />
      <AboutEvent />
      <ProgramHighlights />
      <ChiefGuest />
      <Sponsors compact />
      <EventSchedule />
      <Contact />
    </>
  )
}


