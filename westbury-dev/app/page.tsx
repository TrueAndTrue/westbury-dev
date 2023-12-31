import Image from "next/image";
import { StackedLayout } from "./components/StackedLayout";
import { Testimonial } from "./jobs/components/Testimonial";
import { Lewis, Nameless } from "./jobs/constants/people";
import JobCard from "./components/JobCard";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col 100vh w-3/4 mx-auto items-center">
      <StackedLayout />
      <div className="flex flex-col items-center content-start h-100">
        <div className="w-100 flex justify-around items-center mb-16">
          <Image className="rounded-full" src={'/slack_pfp.jpg'} quality={90} width={250} height={250} alt="Picture of me (very cool guy)" />
          <div className="w-2/4">
            <p className="font-medium text-2xl">{"Hey there! My name is Austin Westbury and I'm a \n software engineer based in Kingston, Ontario."}</p>
          </div>
        </div>
        <JobCard technologies={['React, AWS, Postgres']} company="Live Summer" title="Software Engineer" description="Did work on product stuff and worked really hard with some cool people" startDate="2022" endDate="Present" location="New York, NY" logoURI="123.png" />
        <JobCard technologies={['React, AWS, Postgres']} company="Live Summer" title="Software Engineer" description="Did work on product stuff and worked really hard with some cool people" startDate="2022" endDate="Present" location="New York, NY" logoURI="123.png" />
        <JobCard technologies={['React, AWS, Postgres']} company="Live Summer" title="Software Engineer" description="Did work on product stuff and worked really hard with some cool people yep they were cool so cool i couldnt handle it i donteven know waht to do abotu it" startDate="2022" endDate="Present" location="New York, NY" logoURI="123.png" />
        <h1 className="font-semibold text-4xl">Testimonials</h1>
        <section className="flex min-h-full items-center p-12 mt-12 pt-0">
          <Testimonial
            quote={Lewis.quote}
            name="Lewis Rodiguez"
            title="Senior Software Engineer"
            companyURI="/machattle.png"
            personURI="/lewis.jpg"
          />
          <Testimonial
            quote={Lewis.quote}
            name="Lewis Rodiguez"
            title="Senior Software Engineer"
            companyURI="/machattle.png"
            personURI="/lewis.jpg"
          />
          <Testimonial
            quote={Nameless.quote}
            name="You (after working with me)"
            title="CCG (Chief Cool Guy)"
            companyURI="/machattle.png"
            personURI="/pfp.jpg"
          />
        </section>
      </div>
    </main>
  );
}
