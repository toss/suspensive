import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'nextra/hooks'
import { Link } from 'nextra-theme-docs'

export const HomePage = ({
  title,
  description,
  buttonText,
  items,
  version,
}: {
  title: string
  description: string
  buttonText: string
  items: { title: string; desc: string }[]
  version: number
}) => {
  const router = useRouter()

  return (
    <div className="pb-20">
      <div className="flex flex-col items-center justify-center gap-8 pt-11 text-center">
        <Image
          src="/img/logo_background_star.png"
          alt="Suspensive with star"
          width={400}
          height={241}
        />
        <div className="flex flex-col items-center gap-4">
          <div className="relative text-5xl font-bold">
            <span>{title}</span>{' '}
            <span className="absolute text-sm">v{version}</span>
          </div>
          <p className="text-3xl">{description}</p>
        </div>
        <Link href={`/${router.locale}/docs/react/motivation`}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            className="animate-pulse rounded-xl bg-gray-800 px-10 py-3 text-xl font-bold"
          >
            {buttonText}
          </motion.button>
        </Link>
      </div>

      <div className="h-14"></div>
      <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
        {items.map(({ title, desc }) => (
          <div
            className="flex flex-1 flex-col items-center justify-center gap-3 text-center"
            key={title}
          >
            <div className="text-xl font-bold">{title}</div>
            <p className="text-lg">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
