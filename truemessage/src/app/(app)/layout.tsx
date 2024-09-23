import Navbar from '@/components/Navbar';
import { Footer } from '../u/[username]/page';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
    <div className='bg-gray-100 w-full h-full'>
      
      <Navbar />
      {children}
      <Footer></Footer>
    </div>

    </>
  );
}