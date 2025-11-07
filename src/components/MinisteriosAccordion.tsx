'use client'
import * as React from 'react';
import Autoplay from "embla-carousel-autoplay"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

type Ministerio = {
  title: string;
  description: string;
  images: string[];
};

const ministeriosData: Ministerio[] = [
  {
    title: "Su Gracia en Mi",
    description: "Buscamos juntas la provisión de Cristo y un mayor entendimiento de la Verdad, y creemos que –como mujeres– podemos hacer la diferencia solo por Su gracia en Mí. Anhelamos con gratitud que este conocimiento nos lleve a reflejar la imagen de Cristo en nuestros diferentes entornos, en el amor, la compasión y la misericordia hacia otros.",
    images: [
      '/koinonia-iglesia.webp',
      '/miembros-2024.webp',
      '/nav-redil-donacion.jpg',
    ]
  },
  {
    title: "Compañía T",
    description: "Queremos ser una familia que vive y disfruta el Evangelio de la Gracia de Cristo mientras reflejamos su Gloria y Belleza en nuestra ciudad.",
    images: [
      'http://googleusercontent.com/image_collection/image_retrieval/8491175655334606213_0',
      'http://googleusercontent.com/image_collection/image_retrieval/8491175655334606213_1',
      'http://googleusercontent.com/image_collection/image_retrieval/8491175655334606213_2',
    ]
  },
  {
    title: "Redil Junior",
    description: "Creemos que los más pequeños serán los portavoces de la Palabra del Señor, y continuadores de su obra en la ciudad y en el mundo en general. Somos un equipo de servidores que acompañamos a niños y niñas a profundizar en el conocimiento de la Palabra de Dios, ayudándoles a entender las verdades del Evangelio de Jesucristo.",
    images: [
      'http://googleusercontent.com/image_collection/image_retrieval/12475490646886201213_0',
      'http://googleusercontent.com/image_collection/image_retrieval/12475490646886201213_1',
      'http://googleusercontent.com/image_collection/image_retrieval/12475490646886201213_2',
    ]
  },
  {
    title: "Contra Corriente",
    description: "En este ministerio los jóvenes aprenden a vivir y a disfrutar la juventud centrada en Cristo y en el evangelio. Es un espacio diferente donde los jóvenes preguntan, abren su mente y la renuevan con el objetivo de aprender a nadar contra las corrientes que todos están siguiendo hoy.",
    images: [
      'http://googleusercontent.com/image_collection/image_retrieval/327954381563606384_0',
      'http://googleusercontent.com/image_collection/image_retrieval/327954381563606384_1',
      'http://googleusercontent.com/image_collection/image_retrieval/327954381563606384_2',
    ]
  },
  {
    title: "Unidos",
    description: "Para que un matrimonio esté cimentado en la verdad deberá estar centrado en Cristo; y lo que “creemos acerca de Dios determina la calidad de nuestro matrimonio”. Buscamos desde el ministerio UNIDOS orientar a las parejas hacia un mayor entendimiento del Evangelio en su matrimonio.",
    images: [
      'http://googleusercontent.com/image_collection/image_retrieval/17643770841961750369_0',
      'http://googleusercontent.com/image_collection/image_retrieval/17643770841961750369_1',
      'http://googleusercontent.com/image_retrieval/17643770841961750369_2',
    ]
  },
  {
    title: "Misiones",
    description: "A través de la Misión Refugio en Granizal, cumplimos la misión de la iglesia en palabra y obra. Allí, compartimos el Evangelio y apoyamos el torneo femenino “Con el maltrato no trato”, un proyecto que protege a las niñas de riesgos sociales como el reclutamiento, la prostitución y las adicciones.",
    images: [
      'http://googleusercontent.com/image_collection/image_retrieval/15269895368612490927_0',
      'http://googleusercontent.com/image_collection/image_retrieval/15269895368612490927_1',
      'http://googleusercontent.com/image_collection/image_retrieval/15269895368612490927_2',
    ]
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
              selectedValue === ministerio.title ? 'bg-blue-100 hover:bg-blue-200 dark:bg-amber-200 dark:hover:bg-amber-300 text-responsive' : 'hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            {ministerio.title}
          </AccordionTrigger>
          <AccordionContent className='px-5 py-7 w-full'>
            <section className='flex flex-col justify-around md:flex-row gap-5'>
              <p className='w-full md:w-1/2'>{ministerio.description}</p>
              <article className='relative w-full md:w-1/2'>
              {ministerio.images.length > 0 && (
                <Carousel
                  className='relative aspect-video max-h-72 md:max-h-96 w-full rounded-lg overflow-hidden object-cover'
                  opts={{ loop: true, dragThreshold: 10 }}
                  plugins={[Autoplay({ delay: 5000 })]}
                >
                  <CarouselContent>
                    {ministerio.images.map((image, index) => (
                      <CarouselItem key={index}>
                        <img src={image} alt="image for testing" className='h-full object-bottom object-cover' />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute left-2 bg-neutral-950/55 text-white" />
                  <CarouselNext className="absolute right-2 bg-neutral-950/55 text-white" />
                </Carousel>
              )}
              </article>
            </section>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}