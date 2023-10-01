import { StackedLayout } from "./components/StackedLayout";
import { Testimonial } from "./jobs/components/Testimonial";
import { Lewis } from "./jobs/constants/lewis";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col ">
      <StackedLayout />
      <section className="flex min-h-screen items-center p-24">
        <Testimonial
          quote={Lewis.quote}
          name="Lewis Rodiguez"
          title="Senior Software Engineer"
          companyURI="/Machattle.png"
          personURI="/lewis.jpg"
        />
        <Testimonial
          quote={Lewis.quote}
          name="Lewis Rodiguez"
          title="Senior Software Engineer"
          companyURI="/Machattle.png"
          personURI="/lewis.jpg"
        />
        <Testimonial
          quote={Lewis.quote}
          name="Lewis Rodiguez"
          title="Senior Software Engineer"
          companyURI="/Machattle.png"
          personURI="/lewis.jpg"
        />
      </section>
    </main>
  );
}
