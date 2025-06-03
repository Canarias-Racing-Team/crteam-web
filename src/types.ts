// Tipos globales para el proyecto

export type AvatarType = {
  src: string;
  alt: string;
  size?: number;
};

export type CarouselItemType = {
  src: string;
  alt?: string;
  name?: string;
  icon?: string;
  brief?: string;
};

export type StatType = {
  title: string;
  value: string | number;
  desc?: string;
};

export type CarComponentType = {
  name: string;
  icon?: string;
  src: string;
  brief: string;
};

export type SectionSampleLinkType = {
  href: string;
  text: string;
};

export type NotionPageType = {
  Publicado: boolean;
  Contenido: string;
  Fecha: string;
  Imagen: string;
  url: string;
  Nombre: string;
};

export type ImageEntry = {
  file: string
  alt: string
  featured: boolean
  src: () => Promise<ImageMetadata>
}