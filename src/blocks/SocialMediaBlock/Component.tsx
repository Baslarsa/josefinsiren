import { Media } from '@/components/Media'
import { SocialMedia } from '@/payload-types'
import Link from 'next/link'

const SocialMediaBlock: React.FC<{ socialMedia: SocialMedia[] }> = ({ socialMedia }) => {
  return (
    <div className="flex gap-4 justify-center">
      {socialMedia.map((sm) => (
        <SocialMediaIcon key={sm.id} socialMedia={sm} />
      ))}
    </div>
  )
}

const SocialMediaIcon = ({ socialMedia }: { socialMedia: SocialMedia }) => {
  return (
    <Link href={socialMedia.link} target="_blank">
      <div className="p-2 w-10 h-10 relative">
        <Media
          fill
          imgClassName="object-cover"
          resource={socialMedia.icon}
          className="w-full h-full"
          alt={socialMedia.title}
        />
      </div>
    </Link>
  )
}

export default SocialMediaBlock
