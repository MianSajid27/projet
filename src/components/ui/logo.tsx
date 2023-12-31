import Image from 'next/image';
import Link from '@/components/ui/link';
import cn from 'classnames';
import { siteSettings } from '@/settings/site.settings';
import { useSettings } from '@/contexts/settings.context';
import  site_url  from '../../../public/image/Ign.png';

const Logo: React.FC<React.AnchorHTMLAttributes<{}>> = ({
  className,
  ...props
}) => {
  const { logo, siteTitle } = useSettings();
  
  return (
    <Link
      href={siteSettings.logo.href}
      className={cn('inline-flex', className)}
      {...props}
    >
      <span
        className="relative overflow-hidden"
        style={{
          width: siteSettings.logo.width,
          height: siteSettings.logo.height,
        }}
      >
        <Image alt='img' src={site_url}/> 
        {/* <Image
          src={logo?.original ?? siteSettings.logo.url}
          alt={siteTitle ?? siteSettings.logo.alt}
          layout="fill"
          objectFit="contain"
          loading="eager"
        /> */}
      </span>
    </Link>
  );
};

export default Logo;
