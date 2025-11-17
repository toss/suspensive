import Image from 'next/image'
import Link from 'next/link'
import type { ComponentType } from 'react'
import { FadeIn } from './app/[lang]/[[...mdxPath]]/FadeIn'
import { BubbleChart } from '@/components/BubbleChart'
import { Callout } from '@/components/Callout'
import { HomePage } from '@/components/HomePage'
import { LogoImage } from '@/components/Logo'
import {
  Card,
  Cards,
  Code,
  Pre,
  Steps,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Wrapper,
} from '@/components/mdx'
import { NpmInstallCopyButton } from '@/components/NpmInstallCopyButton'
import { Sandpack } from '@/components/Sandpack'
import { Scrollycoding } from '@/components/Scrollycoding'
import { SectionDescription, SectionTitle } from '@/components/SectionText'
import { TrustedBy } from '@/components/TrustedBy'

export type MDXComponents = {
  [key: string]: ComponentType<any>
}

export function useMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    pre: Pre,
    code: Code,
    table: Table,
    Table: Table,
    thead: Thead,
    tbody: Tbody,
    tr: Tr,
    th: Th,
    td: Td,
    wrapper: Wrapper,
    Image,
    Link,
    BubbleChart,
    Callout,
    HomePage,
    LogoImage,
    Sandpack,
    Scrollycoding,
    SectionTitle,
    SectionDescription,
    TrustedBy,
    NpmInstallCopyButton,
    Steps,
    FadeIn,
    ...components,
  }
}
