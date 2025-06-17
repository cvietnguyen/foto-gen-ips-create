
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

interface LimitationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LimitationDialog = ({ open, onOpenChange }: LimitationDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <AlertDialogTitle>Generation Limit Reached</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left">
            You've reached your photo generation limit of 2 images. Please try again later or upgrade your plan to generate more images.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction 
            onClick={() => onOpenChange(false)}
            className="text-white font-semibold"
            style={{ background: `linear-gradient(to right, #17428c, #125597)` }}
          >
            Understood
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
