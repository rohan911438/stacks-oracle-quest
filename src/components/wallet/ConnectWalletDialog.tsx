import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

interface ConnectWalletDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: (wallet: 'leather' | 'xverse') => void;
}

const ConnectWalletDialog = ({ open, onOpenChange, onConnect }: ConnectWalletDialogProps) => {
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectWalletDialog;
