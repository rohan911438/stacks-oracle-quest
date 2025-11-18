import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wallet, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ConnectWalletDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: (wallet: 'leather' | 'xverse') => void;
}

const ConnectWalletDialog = ({ open, onOpenChange, onConnect }: ConnectWalletDialogProps) => {
  const [hasLeather, setHasLeather] = useState(false);
  const [hasXverse, setHasXverse] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let timer: any;
    let tries = 0;
    const detect = () => {
      const provider: any = (globalThis as any)?.StacksProvider;
      const leather = !!(provider?.isHiroWallet || provider?.isLeather);
      const xverse = !!(provider?.isXverse || provider?.name === 'Xverse');
      setHasLeather(leather);
      setHasXverse(xverse);
      tries++;
      if ((!leather || !xverse) && tries < 10) {
        timer = setTimeout(detect, 300);
      }
    };
    detect();
    const ua = navigator.userAgent || navigator.vendor || (window as any)?.opera;
    setIsMobile(/android|iphone|ipad|ipod/i.test(ua));
    return () => clearTimeout(timer);
  }, [open]);

  const openLeatherSite = () => window.open('https://leather.io/', '_blank', 'noopener');
  const openXverseSite = () => window.open('https://www.xverse.app/download', '_blank', 'noopener');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription>
            Choose your preferred Stacks wallet to connect and start trading.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          <Button
            onClick={() => onConnect('leather')}
            variant="outline"
            className="w-full justify-start gap-3 h-14"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <div className="font-semibold">Leather Wallet</div>
              <div className="text-xs text-muted-foreground">Connect with Leather</div>
            </div>
          </Button>
          {!hasLeather && (
            <div className="-mt-2 text-xs text-muted-foreground flex items-center justify-between">
              <span>Leather not detected. After installing, refresh the page.</span>
              <button onClick={openLeatherSite} className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                Get Leather <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          )}
          <Button
            onClick={() => onConnect('xverse')}
            variant="outline"
            className="w-full justify-start gap-3 h-14"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <div className="font-semibold">Xverse Wallet</div>
              <div className="text-xs text-muted-foreground">Connect with Xverse</div>
            </div>
          </Button>
          {!hasXverse && (
            <div className="-mt-2 text-xs text-muted-foreground flex items-center justify-between">
              <span>Xverse not detected. After installing, refresh the page.</span>
              <button onClick={openXverseSite} className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                Get Xverse <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          )}

          {isMobile && (
            <div className="mt-4 rounded-md border p-3 text-xs text-muted-foreground">
              On mobile, use the Xverse app and open this site in the in-app browser to connect. If you don't have it yet,{' '}
              <button onClick={openXverseSite} className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                get Xverse <ExternalLink className="h-3 w-3" />
              </button>.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectWalletDialog;
