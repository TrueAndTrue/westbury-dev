import { StackedLayout } from "./components/StackedLayout";
import { Testimonial } from "./jobs/components/Testimonial";
import { Lewis, Nameless } from "./jobs/constants/people";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col ">
      <StackedLayout />
      <div className="flex flex-col items-center content-start">
        <h1 className="font-semibold text-4xl">Testimonials</h1>
        <section className="flex min-h-full items-center p-12 mt-12 pt-0">
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
            quote={Nameless.quote}
            name="You (after working with me)"
            title="CCG (Chief Cool Guy)"
            companyURI="/Machattle.png"
            personURI="/pfp.jpg"
          />
        </section>
      </div>
    </main>
  );
}
