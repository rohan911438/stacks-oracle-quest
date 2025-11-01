import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Landing from './Landing';

interface IndexProps {
  onConnectWallet: () => void;
}

const Index = ({ onConnectWallet }: IndexProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onConnectWallet={onConnectWallet} />
      <main className="flex-1">
        <Landing onConnectWallet={onConnectWallet} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
