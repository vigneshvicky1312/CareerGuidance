import Hero from '../components/Hero'
import EventStats from '../components/EventStats'
import AboutEvent from '../components/AboutEvent'
import ProgramHighlights from '../components/ProgramHighlights'
import ChiefGuest from '../components/ChiefGuest'
import EventSchedule from '../components/EventSchedule'
import Sponsors from '../components/Sponsors'
import EventDetails from '../components/EventDetails'
import Contact from '../components/Contact'

export default function Home() {
  return (
    <>
      <Hero />
      <EventStats />
      <AboutEvent />
      <ProgramHighlights />
      <ChiefGuest />
      <EventSchedule />
      <Sponsors compact />
      <EventDetails />
      <Contact />
    </>
  )
}


