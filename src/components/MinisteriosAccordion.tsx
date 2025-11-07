'use client'
import * as React from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

type Ministerio = {
  title: string;
  description: string;
};

const ministeriosData: Ministerio[] = [
  {
    title: "Su Gracia en Mi",
    description: "Buscamos juntas la provisión de Cristo y un mayor entendimiento de la Verdad, y creemos que –como mujeres– podemos hacer la diferencia solo por Su gracia en Mí. Anhelamos con gratitud que este conocimiento nos lleve a reflejar la imagen de Cristo en nuestros diferentes entornos, en el amor, la compasión y la misericordia hacia otros."
  },
  {
    title: "Compañía T",
    description: "Queremos ser una familia que vive y disfruta el Evangelio de la Gracia de Cristo mientras reflejamos su Gloria y Belleza en nuestra ciudad."
  },
  {
    title: "Redil Junior",
    description: "Creemos que los más pequeños serán los portavoces de la Palabra del Señor, y continuadores de su obra en la ciudad y en el mundo en general. Somos un equipo de servidores que acompañamos a niños y niñas a profundizar en el conocimiento de la Palabra de Dios, ayudándoles a entender las verdades del Evangelio de Jesucristo."
  },
  {
    title: "Contra Corriente",
    description: "En este ministerio los jóvenes aprenden a vivir y a disfrutar la juventud centrada en Cristo y en el evangelio. Es un espacio diferente donde los jóvenes preguntan, abren su mente y la renuevan con el objetivo de aprender a nadar contra las corrientes que todos están siguiendo hoy."
  },
  {
    title: "Unidos",
    description: "Para que un matrimonio esté cimentado en la verdad deberá estar centrado en Cristo; y lo que “creemos acerca de Dios determina la calidad de nuestro matrimonio”. Buscamos desde el ministerio UNIDOS orientar a las parejas hacia un mayor entendimiento del Evangelio en su matrimonio."
  },
  {
    title: "Misiones",
    description: "A través de la Misión Refugio en Granizal, cumplimos la misión de la iglesia en palabra y obra. Allí, compartimos el Evangelio y apoyamos el torneo femenino “Con el maltrato no trato”, un proyecto que protege a las niñas de riesgos sociales como el reclutamiento, la prostitución y las adicciones."
  }
];

export default function MinisteriosAccordion() {
  const [selectedValue, setSelectedValue] = React.useState<string | undefined>(undefined);

  return (
    <Accordion 
      type="single" 
      collapsible 
      className="w-full"
      value={selectedValue}
      onValueChange={setSelectedValue}
    >
      {ministeriosData.map((ministerio) => (
        <AccordionItem key={ministerio.title} value={ministerio.title}>
          <AccordionTrigger 
            className={`px-5 text-2xl rounded-none  ${
              selectedValue === ministerio.title ? 'bg-blue-100 hover:bg-blue-200' : 'bg-neutral-100 hover:bg-neutral-200'
            }`}
          >
            {ministerio.title}
          </AccordionTrigger>
          <AccordionContent className='px-5 py-7'>{ministerio.description}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}