import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'nextra/hooks'

const CodeBlockClassName = 'nextra-code'

const escapeHtml = (text: string) =>
  text.replace(/</g, '&lt;').replace(/>/g, '&gt;')

const backtickToCodeBlock = (text: string) =>
  text.replace(/`([^`]+)`/g, `<code class="${CodeBlockClassName}">$1</code>`)

const formatCodeBlocks = (desc: string) => backtickToCodeBlock(escapeHtml(desc))

export const HomePage = ({
  description,
  buttonText,
  items,
  children,
}: {
  title: string
  description: string
  buttonText: string
  items: { title: string; desc: string }[]
  version: number
  children?: React.ReactNode
}) => {
  const router = useRouter()

  return (
    <>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-[url('/img/homepage_background.svg')] bg-cover bg-center bg-no-repeat pb-20"
      >
        <div className="flex flex-col items-center justify-center gap-8 text-center">
          <div className="flex flex-col items-center">
            <Image
              src="/img/homepage_logo.png"
              alt="Suspensive with star"
              width={360}
              height={360}
              className="-mb-4 h-52 w-52 md:h-auto md:w-auto"
            />
            <div className="flex flex-col items-center gap-4">
              <div className="break-keep px-4 text-4xl font-bold leading-tight md:text-6xl">
                <span>{description}</span>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 0.6,
                  transition: { delay: 0.1, duration: 1 },
                }}
                className="rounded-full text-xl text-white"
              >
                npm i @suspensive/react
              </motion.p>
            </div>
          </div>
          <Link href={`/${router.locale}/docs/react/motivation`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 1, duration: 1 } }}
              type="button"
              className="animate-pulse rounded-xl bg-white px-10 py-3 text-xl font-bold text-[#111111]"
            >
              {buttonText}
            </motion.button>
          </Link>
        </div>

        <div className="h-14" />
        <div className="container mx-auto flex flex-col items-start justify-between gap-8 px-4 md:flex-row">
          {items.map(({ title, desc }, index) => (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { delay: 0.2 + index * 0.05, duration: 1 },
              }}
              className="flex flex-1 flex-col items-center justify-center gap-3 text-center"
              key={title}
            >
              <div className="text-xl font-bold">{title}</div>
              <p
                className="text-lg opacity-75"
                dangerouslySetInnerHTML={{ __html: formatCodeBlocks(desc) }}
              />
            </motion.div>
          ))}
        </div>
      </motion.section>
      <motion.section
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.2 }}
        className="container mx-auto px-4"
      >
        {children}
      </motion.section>
    </>
  )
}
