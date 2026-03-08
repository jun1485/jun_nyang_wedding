export type CommonDialogTone = "success" | "error" | "info";

export type CommonDialogState =
  | { status: "closed" }
  | {
      status: "open";
      tone: CommonDialogTone;
      title: string;
      message: string;
      detailText: string;
      confirmText: string;
    }
  | {
      status: "prompt";
      tone: CommonDialogTone;
      title: string;
      message: string;
      confirmText: string;
      cancelText: string;
      inputType: "password" | "text";
      inputPlaceholder: string;
      onConfirm: (value: string) => void;
      onCancel: () => void;
    };
