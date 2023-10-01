import { Testimonial } from "./components/testimonial"
import { Lewis } from "./constants/lewis"

export default function Jobs() {
  return (
    <main>
      <section className="flex flex-col min-h-screen items-center p-24">
        <Testimonial quote={Lewis.quote} name="Lewis Rodiguez" title="Senior Software Engineer" companyURI="/machattle.png" personURI="/lewis.jpg"/>
        <Testimonial quote={Lewis.quote} name="Lewis Rodiguez" title="Senior Software Engineer" companyURI="/machattle.png" personURI="/lewis.jpg"/>
        <Testimonial quote={Lewis.quote} name="Lewis Rodiguez" title="Senior Software Engineer" companyURI="/machattle.png" personURI="/lewis.jpg"/>
      </section>
    </main>
  )
}
