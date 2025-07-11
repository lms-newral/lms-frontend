"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

type ConfirmDialogProps = {
  trigger: React.ReactNode;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
};

const ConfirmDialog = ({
  trigger,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Yes, Delete",
  cancelText = "Cancel",
  onConfirm,
}: ConfirmDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="w-full max-w-xs sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-red-600 sm:text-lg">
            {title}
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground mt-2">{description}</p>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4">
          <DialogClose asChild>
            <button className="w-full sm:w-auto  text-gray-700 px-4 py-2 rounded-lg">
              {cancelText}
            </button>
          </DialogClose>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            {confirmText}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
