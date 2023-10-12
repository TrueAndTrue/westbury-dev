import Image from "next/image";

interface JobCardProps {
  company: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  logoURI: string;
  technologies: string[];
}


export default function JobCard ({technologies, company, title, description, startDate, endDate, location, logoURI}: JobCardProps) {
  return(
    <div className="flex my-5 flex-col items-center w-3/4 max-h-max border-2 rounded-lg">
      <div className="min-w-full h-fill flex">
        <div className="min-h-32 min-w-32 max-w-40 m-10 ">
          <Image src={'/summer_logo.png'} height={100} width={100} quality={100} alt="Company logo"/>
        </div>
        <div className="flex flex-col ml-5">
          <div className="font-bold text-3xl mt-5">
            {company}
          </div>
          <div className="font-medium text-md italic">
            {title}
          </div>
          <div className="font-bold text-xl mt-5">
            {startDate} - {endDate}
          </div>
          <div className="font-bold text-xl mt-5">
            {location}
          </div>
          <h1 className="font-semibold text-2xl mt-5">Description</h1>
          <p className="font-medium text-lg mt-5">
            {description}
          </p>
          <div>
            <h1 className="font-semibold text-2xl mt-5">Technologies</h1>
            {technologies.map((technology: string, index) => {
              return(
                <div className="font-medium text-lg mt-5" key={index}>
                  {technology}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}