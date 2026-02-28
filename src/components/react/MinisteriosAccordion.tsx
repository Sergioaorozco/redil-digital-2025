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


const mujeresImages = import.meta.glob('@/images/mujeres/*.webp', { eager: true, import: 'default', query: '?url' });
const unidosImages = import.meta.glob('@/images/unidos/*.webp', { eager: true, import: 'default', query: '?url' });
const bienvenida = import.meta.glob('@/images/bienvenida/*.webp', { eager: true, import: 'default', query: '?url' });
const refugio = import.meta.glob('@/images/refugio/*.webp', { eager: true, import: 'default', query: '?url' });
const jovenes = import.meta.glob('@/images/jovenes/*.webp', { eager: true, import: 'default', query: '?url' });
const hombres = import.meta.glob('@/images/hombres/*.webp', { eager: true, import: 'default', query: '?url' });
const junior = import.meta.glob('@/images/junior/*.webp', { eager: true, import: 'default', query: '?url' });

const getSortedImages = (globResult: Record<string, any>): string[] => {
  return Object.keys(globResult)
    .sort()
    .map(key => globResult[key]);
}

type Ministerio = {
  title: string;
  description: string;
  images: string[];
};

const ministeriosData: Ministerio[] = [
  {
    title: "Su Gracia en Mi",
    description: "Buscamos juntas la provisión de Cristo y un mayor entendimiento de la Verdad, y creemos que como mujeres podemos hacer la diferencia solo por Su gracia en Mí. Anhelamos con gratitud que este conocimiento nos lleve a reflejar la imagen de Cristo en nuestros diferentes entornos, en el amor, la compasión y la misericordia hacia otros.",
    images: getSortedImages(mujeresImages)
  },
  {
    title: "Compañía T",
    description: "Queremos ser una familia que vive y disfruta el Evangelio de la Gracia de Cristo mientras reflejamos su Gloria y Belleza en nuestra ciudad.",
    images: getSortedImages(hombres)
  },
  {
    title: "Contra Corriente - Jóvenes",
    description: "En este ministerio los jóvenes aprenden a vivir y a disfrutar la juventud centrada en Cristo y en el evangelio. Es un espacio diferente donde los jóvenes preguntan, abren su mente y la renuevan con el objetivo de aprender a nadar contra las corrientes que todos están siguiendo hoy.",
    images: getSortedImages(jovenes)
  },
  {
    title: "Redil Junior",
    description: "Creemos que los más pequeños serán los portavoces de la Palabra del Señor, y continuadores de su obra en la ciudad y en el mundo en general. Somos un equipo de servidores que acompañamos a niños y niñas a profundizar en el conocimiento de la Palabra de Dios, ayudándoles a entender las verdades del Evangelio de Jesucristo.",
    images: getSortedImages(junior)
  },
  {
    title: "Unidos",
    description: "Para que un matrimonio esté cimentado en la verdad deberá estar centrado en Cristo; y lo que “creemos acerca de Dios determina la calidad de nuestro matrimonio”. Buscamos desde el ministerio UNIDOS orientar a las parejas hacia un mayor entendimiento del Evangelio en su matrimonio.",
    images: getSortedImages(unidosImages)
  },
  {
    title: "Misiones",
    description: "A través de la Misión Refugio en Granizal, cumplimos la misión de la iglesia en palabra y obra. Allí, compartimos el Evangelio y apoyamos el torneo de fútbol mixto “Para que tengas vida”, un proyecto que protege a los jóvenes de riesgos sociales como el reclutamiento, la prostitución y las adicciones.",
    images: getSortedImages(refugio)
  },
  {
    title: "Bienvenida",
    description: "Bienvenidos a la comunidad de la Iglesia Redil Laureles. Somos un grupo de personas que creemos en la importancia de la Iglesia y su papel en la sociedad. Somos un equipo de servidores que acompañamos a conocer y conectar con la Iglesia Redil Laureles.",
    images: getSortedImages(bienvenida)
  },
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
            className={`px-5 text-2xl rounded-none  ${selectedValue === ministerio.title && 'bg-accent text-foreground'}`}
          >
            {ministerio.title}
          </AccordionTrigger>
          <AccordionContent className='px-5 py-7 w-full'>
            <section className='flex flex-col justify-around md:flex-row gap-5'>
              <p className='md:text-lg w-full md:w-1/2'>{ministerio.description}</p>
              <article className='relative w-full md:w-1/2'>
                {ministerio.images.length > 0 && (
                  <Carousel
                    className='relative aspect-video max-h-72 md:max-h-96 w-full rounded-lg overflow-hidden object-cover'
                    opts={{ loop: true, dragThreshold: 10 }}
                    plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
                  >
                    <CarouselContent>
                      {ministerio.images.map((image, index) => (
                        <CarouselItem key={index} className='flex justify-center items-center'>
                          <img width={738} height={384} src={image} alt={`Image for ${ministerio.title}`} className='h-full object-cover object-center' />
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
    </Accordion >
  );
}