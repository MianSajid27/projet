import { useRouter } from 'next/router';
import Logo from '@/components/ui/logo';
import React from 'react';
import immmmm from '../../../public/image/bg-50.jpg';
import Image from 'next/image';
export default function AuthPageLayout({
  children,
}: React.PropsWithChildren<{}>) {
  // const { locale } = useRouter();
  // const dir = locale === 'ar' || locale === 'he' ? 'rtl' : 'ltr';

  return (
    // <div
    //   className="flex h-screen items-center justify-center "
    //   // dir={dir}
    // >
    //   <Image src={immmmm} />

    //   <div className="m-auto  w-full max-w-[420px] rounded px-5 py-2 sm:px-8 sm:py-3 sm:shadow">
    //     <div className="mb-1 flex justify-center">
    //       <Logo />
    //     </div>
    //     {children}
    //   </div>
    // </div>
    <div
      style={{
        position: 'relative',
        height: '100vh',
      }}
    >
      <Image
        src={immmmm}
        layout="fill"
        objectFit="cover"
        objectPosition="center"
        priority={true}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
        }}
      >
        <div className="m-auto  w-full max-w-[420px] bg-white rounded px-5 py-2 sm:px-8 sm:py-3 sm:shadow">
         <div className="mb-1 flex justify-center">
           <Logo />
         </div>
         {children}
       </div>
      </div>
    </div>
  );
}
