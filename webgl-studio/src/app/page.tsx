import Nav from '@/components/nav/Nav';
import Experience3D from '@/components/scene/Experience3D';
import Manifesto from '@/components/sections/Manifesto';
import Gallery from '@/components/sections/Gallery';
import Process from '@/components/sections/Process';
import Testimonial from '@/components/sections/Testimonial';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/sections/Footer';

export default function Home() {
  return (
    <main>
      <Nav />
      <div id="tour">
        <Experience3D />
      </div>
      <Manifesto />
      <Gallery />
      <Process />
      <Testimonial />
      <Contact />
      <Footer />
    </main>
  );
}
