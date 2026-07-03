import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-black/90 group-[.toaster]:text-white group-[.toaster]:border-white/10 group-[.toaster]:shadow-[0_8px_30px_rgba(0,229,255,0.05)] group-[.toaster]:backdrop-blur-2xl group-[.toaster]:font-mono group-[.toaster]:text-xs",
          description: "group-[.toast]:text-white/50",
          actionButton: "group-[.toast]:bg-[#00E5FF]/10 group-[.toast]:text-[#00E5FF] group-[.toast]:border group-[.toast]:border-[#00E5FF]/20",
          cancelButton: "group-[.toast]:bg-white/5 group-[.toast]:text-white/40",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
